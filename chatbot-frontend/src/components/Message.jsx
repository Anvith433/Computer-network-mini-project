// src/components/Message.jsx
import { useEffect, useState } from 'react';
import { AlertIcon, BotIcon, CheckIcon, CopyIcon, RetryIcon, UserIcon } from './icons';

const SENDERS = {
  user: { name: 'You', Avatar: UserIcon },
  bot: { name: 'Chatbot', Avatar: BotIcon },
  error: { name: 'Error', Avatar: AlertIcon },
};

const formatTime = (time) =>
  new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);

  // The Clipboard API only exists on https:// or localhost, not on plain LAN IPs.
  if (!navigator.clipboard) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      // Permission denied; nothing useful to show.
    }
  };

  return (
    <button type="button" className="meta-button" onClick={copy}>
      {copied ? <CheckIcon size={13} /> : <CopyIcon size={13} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function Message({ message, onRetry, retryDisabled }) {
  const { role, text, time, latency } = message;
  const { name, Avatar } = SENDERS[role];

  return (
    <article className={`message message--${role}`}>
      <div className="avatar" aria-hidden="true">
        <Avatar size={16} />
      </div>
      <div className="message-body">
        <div className="bubble">{text}</div>
        <div className="message-meta">
          <span className="sender">{name}</span>
          <time dateTime={new Date(time).toISOString()}>{formatTime(time)}</time>
          {latency != null && (
            <span className="latency" title="Round trip: browser → Flask → socket server → back">
              {latency} ms
            </span>
          )}
          {role === 'bot' && <CopyButton text={text} />}
          {role === 'error' && (
            <button
              type="button"
              className="meta-button"
              onClick={() => onRetry(message)}
              disabled={retryDisabled}
            >
              <RetryIcon size={13} />
              Retry
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export function TypingIndicator() {
  return (
    <div className="message message--bot" role="status">
      <div className="avatar" aria-hidden="true">
        <BotIcon size={16} />
      </div>
      <div className="message-body">
        <div className="bubble typing" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <span className="visually-hidden">Waiting for a reply…</span>
      </div>
    </div>
  );
}

export default Message;
