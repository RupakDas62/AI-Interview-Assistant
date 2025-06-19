import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { speak } from "./speech/speak";
import { listen } from "./speech/listen";
import { askGemini } from "./api/gemini";

const App = () => {
  const [apiKey, setApiKey] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleAsk = async () => {
    const text = await listen();
    setQuestion(text);
    const response = await askGemini(text, apiKey);
    setAnswer(response);
    speak(response);
  };

  return (
    <div style={{ padding: 20, width: 300 }}>
      <h2>🎤 AI Interviewer</h2>
      <input
        type="text"
        placeholder="Enter Gemini API Key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />
      <button onClick={handleAsk} style={{ width: "100%", padding: 10 }}>
        Start Interview
      </button>
      <p><strong>You:</strong> {question}</p>
      <p><strong>AI:</strong> {answer}</p>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
