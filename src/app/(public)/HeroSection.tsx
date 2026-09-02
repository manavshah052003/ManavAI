'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './home.module.css';
import { Button } from '@/components/ui/Button';
import { Profile } from '@/types/portfolio';

export function HeroSection({ profile }: { profile: Profile }) {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = ((e.clientX - innerWidth / 2) / innerWidth) * 10;
      const y = ((e.clientY - innerHeight / 2) / innerHeight) * 6;
      setMouseOffset({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight - 80,
      behavior: 'smooth'
    });
  };

  return (
    <section className={styles.hero} aria-label="Hero">
      {/* Ambient background glows */}
      <div className={styles.hero__bg}>
        <div className={`${styles.hero__gradient} ${styles['hero__gradient--1']}`} />
        <div className={`${styles.hero__gradient} ${styles['hero__gradient--2']}`} />
      </div>

      <div className={styles.hero__inner}>
        {/* Left Column: Bold Headline & Actions */}
        <div className={styles.hero__left}>
          <div className={styles.hero__status}>
            <span className={styles['hero__status-dot']} />
            <span>{profile.status}</span>
          </div>

          <div style={{ marginTop: 'var(--space-2)' }}>
            <p className={styles.hero__greeting}>Hello, I&apos;m</p>
            <h1 className={styles.hero__name}>
              Manav <br />
              <span className={styles['hero__name--highlight']}>Shah</span>
            </h1>
            <p className={styles.hero__role}>AI Engineer &amp; Software Builder</p>
          </div>

          <p className={styles.hero__description}>
            {profile.tagline || 'Building intelligent software, automation systems, and production AI architectures that solve complex real-world problems.'}
          </p>

          <div className={styles.hero__cta}>
            <Button href="/projects" variant="primary" size="lg">
              View Projects
            </Button>
            <Button href="/resume" variant="secondary" size="lg">
              Download Resume
            </Button>
          </div>

          <div className={styles.hero__bottomRow}>
            <button
              onClick={handleScrollDown}
              className={styles.hero__scrollBtn}
              aria-label="Scroll down to explore"
              title="Explore Portfolio"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            <div className={styles.hero__expertise}>
              <span className={styles['hero__expertise-chip']}>LLMs &amp; RAG</span>
              <span className={styles['hero__expertise-chip']}>AI Automation</span>
              <span className={styles['hero__expertise-chip']}>Deep Learning</span>
              <span className={styles['hero__expertise-chip']}>Full Stack</span>
            </div>
          </div>
        </div>

        {/* Center Column: Big Vertically Extended Transparent Cutout Portrait */}
        <div className={styles['hero__portrait-wrap']}>
          <div
            className={styles.hero__portrait}
            style={{
              transform: `translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0)`,
              transition: 'transform 0.15s ease-out'
            }}
          >
            {/* Ambient halo glow behind head */}
            <div className={styles['hero__portrait-glow']} />

            <Image
              src="/images/manav-cutout.png"
              alt="Manav Shah — AI Engineer"
              width={800}
              height={1000}
              priority
              quality={95}
              className={styles['hero__portrait-img']}
            />
          </div>
        </div>

        {/* Right Column: Editorial Meta & Socials (Inspiration Style) */}
        <div className={styles.hero__right}>
          <div className={styles['hero__editorial-block']}>
            <span className={styles['hero__editorial-label']}>About Me</span>
            <p className={styles['hero__editorial-text']}>
              AI Developer with enterprise experience at Analytix Solutions &amp; Schbang. Specialized in agentic pipelines, RAG, and document AI.
            </p>
            <Link href="/about" className={styles['hero__editorial-link']}>
              Learn More &rarr;
            </Link>
          </div>

          <div className={styles['hero__editorial-block']}>
            <span className={styles['hero__editorial-label']}>Current Work</span>
            <p className={styles['hero__editorial-text']}>
              Architected TaxProGenie (28+ IRS tax forms, 1.5L taxpayers, 98% accuracy) &amp; published 2 IEEE research papers.
            </p>
            <Link href="/projects" className={styles['hero__editorial-link']}>
              Browse Portfolio &rarr;
            </Link>
          </div>

          <div className={styles['hero__editorial-block']}>
            <span className={styles['hero__editorial-label']}>Follow Me</span>
            <div className={styles.hero__social}>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className={styles['hero__social-link']}
                aria-label="GitHub Profile"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={styles['hero__social-link']}
                aria-label="LinkedIn Profile"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href={`mailto:${profile.email}`}
                className={styles['hero__social-link']}
                aria-label="Send Email"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
