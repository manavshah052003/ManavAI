'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import styles from './ChatWidget.module.css';
import { AssistantResponse } from '@/lib/assistant/searchEngine';
import { FormattedMarkdown } from '@/components/ui/FormattedMarkdown';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  sources?: AssistantResponse['sources'];
  suggestedFollowUps?: string[];
}

const CATEGORIES = [
  { icon: '👤', label: 'Me', query: 'Who is Manav Shah?' },
  { icon: '🚀', label: 'Projects', query: 'What AI projects has Manav built?' },
  { icon: '⚡', label: 'Skills', query: 'What are his core technical skills?' },
  { icon: '💼', label: 'Work', query: "What is Manav's work experience?" },
  { icon: '📬', label: 'Contact', query: 'How can I contact Manav?' }
];

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Hi! 👋 I'm Manav's portfolio assistant.\n\nAsk me anything about his AI projects, work experience, skills, education, or research — I run 100% locally with zero external APIs.",
      suggestedFollowUps: [
        'Tell me about TaxProGenie',
        "What's his BTech college?",
        'Show me his skills',
        'How can I hire him?'
      ]
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsgId = `user-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id: userMsgId, sender: 'user', text: textToSend }
    ]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: textToSend })
      });
      const data: AssistantResponse = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          sender: 'assistant',
          text: data.answer,
          sources: data.sources,
          suggestedFollowUps: data.suggestedFollowUps
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: 'Sorry, I encountered an issue accessing the local portfolio records.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        className={styles.widgetButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle portfolio assistant"
        title="Ask Manav's Portfolio Assistant"
      >
        <span className={styles.widgetBadge} />
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className={styles.chatPanel} role="dialog" aria-label="Portfolio Assistant Window">
          <div className={styles.chatHeader}>
            <div className={styles.headerInfo}>
              <div className={styles.assistantAvatar}>AI</div>
              <div>
                <div className={styles.headerTitle}>Manav&apos;s Assistant</div>
                <div className={styles.headerSubtitle}>Online • Local AI</div>
              </div>
            </div>
            <button
              className={styles.closeButton}
              onClick={() => setIsOpen(false)}
              aria-label="Close Assistant"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Category Quick Access */}
          <div className={styles.categoryGrid}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                className={styles.categoryBtn}
                onClick={() => handleSend(cat.query)}
                disabled={loading}
              >
                <span className={styles.categoryIcon}>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          <div className={styles.messagesList}>
            {messages.map((m) => (
              <div
                key={m.id}
                className={`${styles.message} ${
                  m.sender === 'user' ? styles.messageUser : styles.messageAssistant
                }`}
              >
                <div
                  className={
                    m.sender === 'user' ? styles.bubbleUser : styles.bubbleAssistant
                  }
                >
                  <FormattedMarkdown text={m.text} />

                  {m.sources && m.sources.length > 0 && (
                    <div className={styles.sourcesBox}>
                      <div className={styles.sourcesTitle}>Verified Sources:</div>
                      {m.sources.map((s, idx) => (
                        <div key={idx}>
                          {s.url ? (
                            <Link href={s.url} className={styles.sourceBadge}>
                              {s.category}: {s.title} →
                            </Link>
                          ) : (
                            <span className={styles.sourceBadge}>
                              {s.category}: {s.title}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {m.suggestedFollowUps && m.suggestedFollowUps.length > 0 && (
                    <div className={styles.suggestionsWrapper}>
                      {m.suggestedFollowUps.map((chip, idx) => (
                        <button
                          key={idx}
                          className={styles.suggestionChip}
                          onClick={() => handleSend(chip)}
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className={`${styles.message} ${styles.messageAssistant}`}>
                <div className={styles.bubbleAssistant}>
                  <div className={styles.typingIndicator}>
                    <span className={styles.typingDot} />
                    <span className={styles.typingDot} />
                    <span className={styles.typingDot} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            className={styles.inputArea}
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              type="text"
              className={styles.inputField}
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
            />
            <button
              type="submit"
              className={styles.sendButton}
              disabled={!input.trim() || loading}
              aria-label="Send query"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
