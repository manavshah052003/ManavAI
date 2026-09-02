export function SkillIcon({ name }: { name: string }) {
  const normalized = name.toLowerCase().trim();

  // Python
  if (normalized.includes('python')) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M11.9 2C6.7 2 7 4.3 7 4.3l.01 2.4h5V7.5H4.2S2 7.2 2 12.3c0 5.1 1.9 5 1.9 5h1.1v-2.4s-.1-2.4 2.4-2.4h5.2v-.8s.3-2.4-2.4-2.4H8.4V7.5h3.5s2.4-.1 2.4-2.4V4.4S14.6 2 11.9 2z" fill="#387EB8"/>
        <path d="M12.1 22c5.2 0 4.9-2.3 4.9-2.3l-.01-2.4h-5v-.8h7.8s2.2.3 2.2-4.8c0-5.1-1.9-5-1.9-5h-1.1v2.4s.1 2.4-2.4 2.4h-5.2v.8s-.3 2.4 2.4 2.4h6.8v1.7h-3.5s-2.4.1-2.4 2.4v.7s-.3 2.4 2.4 2.4z" fill="#FFE052"/>
        <circle cx="9.2" cy="4.5" r=".7" fill="#fff"/>
        <circle cx="14.8" cy="19.5" r=".7" fill="#fff"/>
      </svg>
    );
  }

  // PyTorch
  if (normalized.includes('pytorch') || normalized.includes('torch')) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" color="#EE4C2C">
        <path d="M13.5 2.1l-.8 1.4c2.8 1.6 4.7 4.6 4.7 8.1 0 5.2-4.2 9.4-9.4 9.4-3.5 0-6.5-1.9-8.1-4.7l-1.4.8C.4 20.4 3.9 22.5 8 22.5c6 0 10.9-4.9 10.9-10.9 0-4.1-2.1-7.6-5.4-9.5z"/>
        <circle cx="14.5" cy="5.5" r="1.8" fill="#EE4C2C"/>
      </svg>
    );
  }

  // OpenAI / LLMs
  if (normalized.includes('openai') || normalized.includes('gpt') || normalized.includes('llm')) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" color="#10A37F">
        <path d="M22.28 9.37a5.95 5.95 0 0 0-.52-4.94 6.07 6.07 0 0 0-6.5-2.83 5.97 5.97 0 0 0-4.52-2 6.07 6.07 0 0 0-5.8 4.21A5.95 5.95 0 0 0 1.2 6.77a6.07 6.07 0 0 0 .97 7.08 5.95 5.95 0 0 0 .52 4.94 6.07 6.07 0 0 0 6.5 2.83 5.97 5.97 0 0 0 4.52 2 6.07 6.07 0 0 0 5.8-4.21 5.95 5.95 0 0 0 3.74-2.96 6.07 6.07 0 0 0-.97-7.08zM12 18.2a4.2 4.2 0 1 1 4.2-4.2 4.2 4.2 0 0 1-4.2 4.2z"/>
      </svg>
    );
  }

  // LangChain / LangGraph
  if (normalized.includes('langchain') || normalized.includes('langgraph')) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" color="#1C3C3C">
        <path d="M6 3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3zm6 4a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>
      </svg>
    );
  }

  // FastAPI
  if (normalized.includes('fastapi')) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" color="#009688">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
      </svg>
    );
  }

  // Docker
  if (normalized.includes('docker')) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" color="#2496ED">
        <path d="M13.983 11.078h2.119a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.119a.185.185 0 0 0-.185.185v1.888c0 .102.083.185.185.185zm-2.954-5.43h2.118a.186.186 0 0 0 .186-.186V3.574a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185zm0 2.716h2.118a.187.187 0 0 0 .186-.186V6.29a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.887c0 .102.082.186.185.186zm-2.93 0h2.12a.186.186 0 0 0 .184-.186V6.29a.185.185 0 0 0-.185-.185H8.1a.185.185 0 0 0-.185.185v1.887c0 .102.083.186.185.186zm-2.964 0h2.119a.186.186 0 0 0 .185-.186V6.29a.185.185 0 0 0-.185-.185H5.136a.186.186 0 0 0-.186.185v1.887c0 .102.084.186.186.186z"/>
      </svg>
    );
  }

  // TypeScript / JavaScript
  if (normalized.includes('typescript') || normalized.includes('ts')) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" color="#3178C6">
        <path d="M1.5 0h21A1.5 1.5 0 0 1 24 1.5v21a1.5 1.5 0 0 1-1.5 1.5h-21A1.5 1.5 0 0 1 0 22.5v-21A1.5 1.5 0 0 1 1.5 0zm10.74 13.43h-2.9v7.19H6.9v-7.19H4v-2.38h8.24v2.38zm8.68 1.83c-.34-.97-1.1-1.63-2.52-2.18l-.75-.29c-.77-.3-1.12-.6-1.12-1.04 0-.5.44-.86 1.15-.86.75 0 1.2.33 1.47.95l2.25-1.13c-.62-1.28-1.85-1.92-3.72-1.92-2.28 0-3.83 1.25-3.83 3.14 0 1.34.8 2.27 2.37 2.87l.86.33c.87.33 1.2.66 1.2 1.16 0 .58-.56.97-1.44.97-.98 0-1.59-.44-1.94-1.29l-2.3 1.18c.67 1.57 2.05 2.29 4.24 2.29 2.53 0 4.14-1.24 4.14-3.22z"/>
      </svg>
    );
  }

  // React / Next.js
  if (normalized.includes('react') || normalized.includes('next')) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" color="#61DAFB">
        <path d="M12 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 1.5c4.694 0 8.5 3.806 8.5 8.5 0 4.694-3.806 8.5-8.5 8.5-4.694 0-8.5-3.806-8.5-8.5 0-4.694 3.806-8.5 8.5-8.5z"/>
      </svg>
    );
  }

  // PostgreSQL / Database
  if (normalized.includes('postgres') || normalized.includes('sql') || normalized.includes('db')) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" color="#336791">
        <path d="M12 2C6.48 2 2 4.02 2 6.5v11C2 19.98 6.48 22 12 22s10-2.02 10-4.5v-11C22 4.02 17.52 2 12 2zm0 2.2c4.42 0 8 1.48 8 2.3s-3.58 2.3-8 2.3-8-1.48-8-2.3 3.58-2.3 8-2.3zm8 7.3c0 .82-3.58 2.3-8 2.3s-8-1.48-8-2.3V8.83c1.98 1.15 4.86 1.87 8 1.87s6.02-.72 8-1.87v2.67zm0 5c0 .82-3.58 2.3-8 2.3s-8-1.48-8-2.3v-2.67c1.98 1.15 4.86 1.87 8 1.87s6.02-.72 8-1.87v2.67z"/>
      </svg>
    );
  }

  // Azure / Cloud
  if (normalized.includes('azure') || normalized.includes('cloud') || normalized.includes('aws')) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" color="#0078D4">
        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
      </svg>
    );
  }

  // Hugging Face
  if (normalized.includes('hugging') || normalized.includes('transformers')) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" color="#FFD21E">
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm-3 6.5a1.5 1.5 0 1 1-1.5 1.5A1.5 1.5 0 0 1 9 8.5zm6 0a1.5 1.5 0 1 1-1.5 1.5 1.5 1.5 0 0 1 1.5-1.5zM12 17.5c-2.33 0-4.32-1.45-5.12-3.5h10.24c-.8 2.05-2.79 3.5-5.12 3.5z"/>
      </svg>
    );
  }

  // Git / CI/CD
  if (normalized.includes('git')) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" color="#F05032">
        <path d="M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L8.708 2.627l2.76 2.76c.645-.215 1.379-.07 1.889.441.516.515.658 1.258.438 1.9l2.657 2.66c.645-.223 1.387-.078 1.9.435.721.72 1.037 1.768.618 2.768l2.585 2.585c.605.604.605 1.583 0 2.188L23.546 10.93zM2.627 8.707l8.25 8.25c.604.604 1.583.604 2.187 0l2.176-2.177-2.76-2.76c-.645.216-1.379.07-1.89-.441-.515-.515-.658-1.258-.438-1.9L7.495 7.02c-.645.222-1.387.078-1.9-.436a2.036 2.036 0 0 1-.617-2.768L2.393 1.232c-.604-.604-.604-1.583 0-2.188L2.627 8.707z"/>
      </svg>
    );
  }

  // Default clean micro-badge icon
  return (
    <div
      style={{
        width: '24px',
        height: '24px',
        borderRadius: '6px',
        background: 'var(--color-accent-subtle)',
        color: 'var(--color-accent-text)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '11px',
        fontWeight: 700
      }}
    >
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}
