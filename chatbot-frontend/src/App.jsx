// src/App.jsx
import { useEffect, useRef, useState } from 'react';
import { API_HOST, askQuestion } from './api';
import Header from './components/Header';
import EmptyState from './components/EmptyState';
import Message, { TypingIndicator } from './components/Message';
import Composer from './components/Composer';
import './App.css';

const STORAGE_KEY = 'chatbot.messages';

// crypto.randomUUID() needs a secure context, which a plain http:// LAN address is not.
let counter = 0;
const makeId = () => `${Date.now().toString(36)}-${(counter++).toString(36)}`;

function loadMessages() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function App() {
  const [messages, setMessages] = useState(loadMessages);
  const [pending, setPending] = useState(false);
  const [connection, setConnection] = useState('idle');
  const chatRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // Storage unavailable (private mode, quota); the chat still works.
    }
  }, [messages]);

  useEffect(() => {
    const chat = chatRef.current;
    chat.scrollTop = chat.scrollHeight;
  }, [messages, pending]);

  const addMessage = (message) =>
    setMessages((prev) => [...prev, { id: makeId(), time: Date.now(), ...message }]);

  const request = async (question) => {
    setPending(true);
    try {
      const { answer, latency } = await askQuestion(question);
      addMessage({ role: 'bot', text: answer, latency });
      setConnection('online');
    } catch (error) {
      addMessage({ role: 'error', text: error.message, question });
      setConnection(error.kind ?? 'offline');
    } finally {
      setPending(false);
    }
  };

  // Returns whether the question was accepted, so the composer knows to clear.
  const send = (text) => {
    const question = text.trim();
    if (!question || pending) return false;
    addMessage({ role: 'user', text: question });
    request(question);
    return true;
  };

  const retry = (errorMessage) => {
    if (pending) return;
    setMessages((prev) => prev.filter((m) => m.id !== errorMessage.id));
    request(errorMessage.question);
  };

  const clear = () => {
    if (window.confirm('Clear the whole conversation?')) setMessages([]);
  };

  const isEmpty = messages.length === 0 && !pending;

  return (
    <div className="app">
      <Header connection={connection} canClear={messages.length > 0 && !pending} onClear={clear} />

      <main className="chat" ref={chatRef}>
        <div className="container chat-inner" role="log" aria-label="Conversation">
          {isEmpty ? (
            <EmptyState apiHost={API_HOST} onPick={send} />
          ) : (
            messages.map((message) => (
              <Message key={message.id} message={message} onRetry={retry} retryDisabled={pending} />
            ))
          )}
          {pending && <TypingIndicator />}
        </div>
      </main>

      <Composer onSend={send} pending={pending} />
    </div>
  );
}

export default App;
