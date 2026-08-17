// // src/App.jsx
// import { useState } from 'react';
// import axios from 'axios';
// import './App.css';

// function App() {
//   const [question, setQuestion] = useState('');
//   const [messages, setMessages] = useState([]);

//   const sendQuestion = async () => {
//     if (!question.trim()) {
//       alert('Please enter a question!');
//       return;
//     }

//     // Add user's question to the chat
//     setMessages(prev => [...prev, { sender: 'You', text: question }]);

//     try {
//       // Send question to the Flask backend
//       const response = await axios.post('http://localhost:5000/ask', { question });
//       const answer = response.data.answer;
//       // Add server's response to the chat
//       setMessages(prev => [...prev, { sender: 'Server', text: answer }]);
//     } catch (error) {
//       setMessages(prev => [...prev, { sender: 'Error', text: error.message }]);
//     }

//     // Clear the input field
//     setQuestion('');
//   };

//   return (
//     <div className="app">
//       <h1>AI Chatbot</h1>
//       <div className="chat-area">
//         {messages.map((msg, index) => (
//           <p key={index} className={msg.sender.toLowerCase()}>
//             {msg.sender}: {msg.text}
//           </p>
//         ))}
//       </div>
//       <div className="input-area">
//         <input
//           type="text"
//           value={question}
//           onChange={(e) => setQuestion(e.target.value)}
//           onKeyUp={(e) => e.key === 'Enter' && sendQuestion()}
//           placeholder="Enter your question"
//         />
//         <button onClick={sendQuestion}>Send</button>
//       </div>
//     </div>
//   );
// }

// export default App;

// src/App.jsx
import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);

  const sendQuestion = async () => {
    if (!question.trim()) {
      alert('Please enter a question!');
      return;
    }
    setMessages(prev => [...prev, { sender: 'You', text: question }]);
    try {
      const response = await axios.post('http://localhost:5000/ask', { question });
      setMessages(prev => [...prev, { sender: 'Server', text: response.data.answer }]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'Error', text: error.message }]);
    }
    setQuestion('');
  };

  return (
    <div className="app">
      <header>
        <h1>AI Chatbot</h1>
      </header>
      <main className="chat-area">
        {messages.map((msg, index) => (
          <p key={index} className={msg.sender.toLowerCase()}>
            <span className="sender">{msg.sender}:</span> {msg.text}
          </p>
        ))}
      </main>
      <footer className="input-area">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyUp={(e) => e.key === 'Enter' && sendQuestion()}
          placeholder="Type your question here..."
        />
        <button onClick={sendQuestion}>Send</button>
      </footer>
    </div>
  );
}

export default App;