// src/components/Header.jsx
import { useEffect, useState } from 'react';
import { BotIcon, MoonIcon, SunIcon, TrashIcon } from './icons';

const THEME_KEY = 'chatbot.theme';

const STATUS = {
  idle: { label: 'Ready', tone: 'idle', hint: 'No request sent yet' },
  online: { label: 'Connected', tone: 'ok', hint: 'Last request reached the socket server' },
  degraded: { label: 'Socket error', tone: 'warn', hint: 'Flask answered, but the socket server failed' },
  timeout: { label: 'Timed out', tone: 'warn', hint: 'Last request got no reply in time' },
  offline: { label: 'Backend offline', tone: 'error', hint: 'Could not reach the Flask backend' },
};

function Header({ connection, canClear, onClear }) {
  // index.html sets data-theme before React loads, so there is no flash.
  const [theme, setTheme] = useState(() =>
    document.documentElement.dataset.theme === 'light' ? 'light' : 'dark',
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Preference just won't persist.
    }
  };

  const status = STATUS[connection] ?? STATUS.idle;

  return (
    <header className="header">
      <div className="container header-inner">
        <div className="brand">
          <div className="brand-logo">
            <BotIcon size={20} />
          </div>
          <div className="brand-text">
            <h1>AI Chatbot</h1>
            <p>React · Flask · TCP socket</p>
          </div>
        </div>

        <div className={`status status--${status.tone}`} title={status.hint} role="status">
          <span className="status-dot" />
          <span className="status-label">{status.label}</span>
        </div>

        <button
          type="button"
          className="icon-button"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          title="Toggle theme"
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
        <button
          type="button"
          className="icon-button"
          onClick={onClear}
          disabled={!canClear}
          aria-label="Clear conversation"
          title="Clear conversation"
        >
          <TrashIcon />
        </button>
      </div>
    </header>
  );
}

export default Header;
