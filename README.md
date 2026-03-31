# 🚀 AI Interview Assistant

An AI-powered Chrome Extension that simulates a real-time coding interviewer while solving problems on platforms like LeetCode.

It listens to your voice, processes your query using AI, and responds with realistic interviewer-style feedback using speech synthesis.

---

# 🧠 Features

* 🎤 Voice Input (Speech Recognition)
* 🤖 AI Interviewer (Gemini API)
* 🔊 Text-to-Speech (ElevenLabs)
* 🧩 Automatic LeetCode Problem Detection
* 🌐 Chrome Extension Integration
* ⚡ Real-time interaction loop

---

# 🏗️ Project Structure

```
ai-interview-assistant/
│
├── client/                 # Chrome Extension (Frontend)
│   ├── content.js          # Core logic (speech + AI + DOM extraction)
│   ├── popup.jsx           # Extension popup UI
│   ├── background.js       # Extension lifecycle events
│   ├── manifest.json       # Chrome extension config
│   ├── api/
│   │   ├── gemini.js       # Gemini API integration
│   │   └── elevenlabs.js   # ElevenLabs API integration
│   ├── speech/
│   │   ├── listen.js       # Speech recognition
│   │   └── speak.js        # Audio playback
│   └── src/                # React app
│
├── server/                 # Backend (Node.js)
│   ├── index.js            # Express server (TTS proxy)
│   └── package.json
```

---

# ⚙️ Tech Stack

## Frontend (Extension)

* React (Vite)
* Chrome Extension APIs
* Web Speech API

## Backend

* Node.js
* Express

## APIs

* Google Gemini API
* ElevenLabs Text-to-Speech API

---

# 🔑 Setup Instructions

## 1. Backend Setup

```
cd server
npm install
```

Create `.env` file:

```
PORT=8081
```

Run server:

```
npm start
```

Server runs at:

```
http://localhost:8081
```

---

## 2. Frontend Setup (Chrome Extension)

```
cd client
npm install
npm run build
```

---

## 🧩 Load Chrome Extension

1. Open Chrome
2. Go to: `chrome://extensions/`
3. Enable **Developer Mode**
4. Click **Load Unpacked**
5. Select `client/dist`

---

# 🔐 API Keys

On first run, extension will prompt for:

* ElevenLabs API Key
* Gemini API Key

These are stored in browser localStorage.

---

# 🔄 Complete Workflow

## Step-by-Step Flow

1. User opens a LeetCode problem
2. Extension extracts:

   * Problem title
   * Description
   * Selected programming language
3. User speaks a query
4. Speech is converted to text using Web Speech API
5. Prompt is constructed with problem context
6. Request sent to Gemini API
7. Gemini returns AI-generated response
8. Response is sent to backend `/api/speak`
9. Backend calls ElevenLabs API
10. Audio stream is returned
11. Audio is played in browser

---

# 📡 API Documentation

## POST `/api/speak`

### Description

Converts text into speech using ElevenLabs API.

### Request Body

```
{
  "text": "Explain binary search",
  "elevenKey": "your_api_key"
}
```

### Response

* Content-Type: `audio/mpeg`
* Returns audio buffer stream

### Error Responses

* `401`: Invalid API key or request
* `500`: Internal server error

---

# 🧠 Core Functional Modules

## 1. Speech Recognition

* Continuous listening mode
* Uses browser Web Speech API
* Automatically restarts after response

## 2. AI Prompt Generation

* Includes:

  * Problem title
  * Problem description
  * Programming language
  * User query

## 3. Gemini Integration

* Endpoint: Google Generative Language API
* Model: `gemini-2.0-flash`
* Returns concise interviewer-style answers

## 4. Text-to-Speech (TTS)

* Uses ElevenLabs API
* Voice model with configurable parameters
* Processed via backend proxy

## 5. Chrome Extension Logic

* Injected into LeetCode pages
* Extracts DOM elements dynamically
* Displays floating UI response box

---

# ⚠️ Limitations

* Requires manual API key input
* Works primarily on LeetCode
* Audio playback requires user interaction
* Backend must run locally
* No authentication system

---

# 🚧 Future Enhancements

* Add authentication (JWT / OAuth)
* Store conversation history
* Deploy backend (AWS / Render)
* Improve UI/UX
* Add multi-language support
* Add coding hints difficulty levels

---

# 📌 Use Cases

* Coding interview practice
* Real-time problem solving guidance
* Improving communication during interviews

---

# 🧑‍💻 Author

Rupak Das

---

# ⭐ Conclusion

This project simulates a real interview environment by combining voice interaction, AI guidance, and real-time coding context, making interview preparation more interactive and realistic.
