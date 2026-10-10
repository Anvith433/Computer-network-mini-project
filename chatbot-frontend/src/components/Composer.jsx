// src/components/Composer.jsx
import { useLayoutEffect, useRef, useState } from 'react';
import { SendIcon } from './icons';

function Composer({ onSend, pending }) {
  const [value, setValue] = useState('');
  const inputRef = useRef(null);

  // Grow the textarea with its content; CSS max-height caps it.
  useLayoutEffect(() => {
    const input = inputRef.current;
    input.style.height = 'auto';
    input.style.height = `${input.scrollHeight}px`;
  }, [value]);

  const submit = () => {
    if (onSend(value)) setValue('');
    inputRef.current.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit();
    }
  };

  const canSend = value.trim() !== '' && !pending;

  return (
    <footer className="composer">
      <form
        className="container"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <div className="composer-box">
          <label htmlFor="question" className="visually-hidden">
            Your question
          </label>
          <textarea
            id="question"
            ref={inputRef}
            rows={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question…"
            autoFocus
          />
          <button type="submit" className="send-button" disabled={!canSend} aria-label="Send message">
            <SendIcon />
          </button>
        </div>
        <p className="composer-hint">
          <kbd>Enter</kbd> to send · <kbd>Shift</kbd> + <kbd>Enter</kbd> for a new line
        </p>
      </form>
    </footer>
  );
}

export default Composer;
