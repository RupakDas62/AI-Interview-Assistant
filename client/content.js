// API KEY ELEVENLABS = sk_00135b1bf021b7c2a50003d55f7cfff6f30e34266ff18373
// GEMINI API_KEY  =   AIzaSyCby104jwGT67rtNjxRzmZ_IaLQyFzAAao

console.log("🚀 AI Interviewer Loaded");

// Store user interaction state
let userInteracted = false;

// Dummy audio to unlock autoplay
const dummyAudio = new Audio();

// Extract LeetCode problem once on load
extractLeetCodeProblem();

// Prompt for ElevenLabs and Gemini API keys
let elevenKey = localStorage.getItem("elevenKey");
let geminiKey = localStorage.getItem("geminiKey");
console.log("🔑 ElevenLabs Key:", elevenKey);
console.log("🔑 Gemini Key:", geminiKey);

if (!elevenKey) {
  elevenKey = prompt("Enter your ElevenLabs API Key:");
  localStorage.setItem("elevenKey", elevenKey);
}

if (!geminiKey) {
  geminiKey = prompt("Enter your Gemini API Key:");
  localStorage.setItem("geminiKey", geminiKey);
}

// UI for interaction messages
const responseBox = document.createElement("div");
responseBox.style.position = "fixed";
responseBox.style.bottom = "20px";
responseBox.style.right = "20px";
responseBox.style.padding = "12px";
responseBox.style.background = "#1f2937";
responseBox.style.color = "white";
responseBox.style.zIndex = 9999;
responseBox.style.maxWidth = "300px";
responseBox.style.borderRadius = "8px";
responseBox.style.fontFamily = "sans-serif";
responseBox.style.fontSize = "14px";
responseBox.innerText = "🎤 Say something to start...";
document.body.appendChild(responseBox);

// Track user interaction to allow audio playback
document.addEventListener("click", () => {
  userInteracted = true;
  console.log("✅ User interaction received. Audio allowed.");

  dummyAudio.src = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEA...";
  dummyAudio.play().catch(() => {});
});

// Start voice recognition
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "en-US";
recognition.continuous = true;
recognition.interimResults = false;

recognition.onresult = async (event) => {
  recognition.stop(); // prevent overlapping calls

  const transcript = event.results[event.results.length - 1][0].transcript.trim();
  console.log("👤 You said:", transcript);
  responseBox.innerText = `👤 You: ${transcript}`;

  const aiReply = await fetchAIResponse(transcript);
  responseBox.innerText = `🤖 AI: ${aiReply}`;

  const sanitizedReply = aiReply.replace(/\*/g, '');

  await speakWithElevenLabs(sanitizedReply);

  recognition.start(); // restart after response
};

recognition.onerror = (event) => {
  console.error("❌ Speech recognition error:", event.error);
  responseBox.innerText = "❌ Speech recognition error!";
};

recognition.start();

// Gemini AI API
async function fetchAIResponse(prompt) {
  const { title, content, language } = extractLeetCodeProblem();
  console.log("📘 Title:", title);
  console.log("📄 Content:", content);
  console.log("📄 Language:", language);

  const fullPrompt = `You are an AI interviewer. The user is currently solving this LeetCode problem:

**Title**: ${title}

**Problem Description**:
${content}

**Programming Language**: ${language}

Now the user asked:
"${prompt}"

Respond like an interviewer guiding them through this problem. Also answer in concise very short`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }]
        })
      }
    );

    const data = await res.json();
    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    } else {
      return "❌ No response from Gemini.";
    }
  } catch (err) {
    console.error("🔥 Gemini API error:", err);
    return "❌ Error fetching AI response.";
  }
}

// ElevenLabs TTS (via proxy)
async function speakWithElevenLabs(text) {
  try {
    const res = await fetch("http://localhost:8081/api/speak", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    if (!res.ok) {
      responseBox.innerText = "❌ Proxy server error.";
      return;
    }

    const blob = await res.blob();
    const audioUrl = URL.createObjectURL(blob);
    const audio = new Audio(audioUrl);

    if (userInteracted) {
      await audio.play().catch((err) => {
        console.error("🔇 Audio play failed:", err);
        responseBox.innerText = "⚠️ Could not play the audio.";
      });
    } else {
      console.warn("🔇 User interaction required to play audio.");
      responseBox.innerText = "⚠️ Click anywhere on the page to enable voice.";
    }

  } catch (err) {
    console.error("🎧 Proxy TTS Error:", err);
    responseBox.innerText = "❌ Error fetching audio.";
  }
}

// Extract problem from LeetCode
function extractLeetCodeProblem() {
  const titleEl = document.querySelector('a[href^="/problems/"][class*="no-underline"]');
  const contentEl = document.querySelector('[data-track-load="description_content"]');
  const buttons = document.querySelectorAll('button[aria-haspopup="dialog"]');

  let language = "";

  for (const btn of buttons) {
    const text = btn.innerText.trim();
    // Check if it's a programming language (adjust this list if needed)
    if (["Java", "Python", "C++", "JavaScript", "C#", "Go", "Swift", "Ruby"].includes(text)) {
      console.log("📝 Detected language:", text);
      language = text;
    }
  }

  // console.log(langButton)

  const title = titleEl ? titleEl.innerText.trim() : "Untitled Problem";
  const content = contentEl ? contentEl.innerText.trim() : "No problem content found.";

  return { title, content, language };
}
