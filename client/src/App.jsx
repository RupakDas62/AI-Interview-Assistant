import { useState } from 'react';
import { startListening } from './SpeechService';
import { callGemini } from './GeminiService';
import { callEleven } from './ElevenService';

export default function App() {
  const [userInput, setUserInput] = useState('');
  const [response, setResponse] = useState('');

  const handleInterview = async () => {
    const spoken = await startListening();
    setUserInput(spoken);
    const aiReply = await callGemini(spoken);
    setResponse(aiReply);
    await callEleven(aiReply);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>AI Interviewer 🎙️</h2>
      <button onClick={handleInterview}>Start Interview</button>
      <p><strong>You:</strong> {userInput}</p>
      <p><strong>AI:</strong> {response}</p>
    </div>
  );
}
