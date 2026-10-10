// src/components/EmptyState.jsx
import { BotIcon } from './icons';

const SUGGESTIONS = [
  'What is the OSI model?',
  'Explain TCP vs UDP',
  'How does the TCP three-way handshake work?',
  'What is a subnet mask?',
];

function EmptyState({ apiHost, onPick }) {
  return (
    <section className="empty">
      <div className="empty-icon">
        <BotIcon size={28} />
      </div>
      <h2>How can I help you today?</h2>
      <p>
        Your question travels from this page to the Flask backend over HTTP, which relays it to the
        chatbot server over a TCP socket.
      </p>

      <div className="pipeline" aria-label="Request path">
        <span className="pipeline-node">Browser</span>
        <span className="pipeline-arrow" aria-hidden="true">→</span>
        <span className="pipeline-node">Flask · {apiHost}</span>
        <span className="pipeline-arrow" aria-hidden="true">→</span>
        <span className="pipeline-node">TCP socket server</span>
      </div>

      <div className="suggestions">
        {SUGGESTIONS.map((text) => (
          <button key={text} type="button" className="chip" onClick={() => onPick(text)}>
            {text}
          </button>
        ))}
      </div>
    </section>
  );
}

export default EmptyState;
