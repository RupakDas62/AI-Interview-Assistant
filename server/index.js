require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 8081; // can change if needed

app.post('/api/speak', async (req, res) => {
  const { text, elevenKey } = req.body;
  const voiceId = "pqHfZKP75CvOlQylNhV4";

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': elevenKey,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg'
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.4,
          similarity_boost: 0.75
        }
      })
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("TTS API error:", errorBody);
      return res.status(401).json({ error: 'Unauthorized or bad request to ElevenLabs' });
    }

    const audioBuffer = await response.buffer();
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length
    });
    res.send(audioBuffer);

  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`🔊 ElevenLabs proxy server running on http://localhost:${PORT}`);
});
