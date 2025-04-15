import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from 'url';
import dotenv from "dotenv";
dotenv.config();


const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, "public")));

const instruction_1 = `You are a dental clinic which located in Damascus that provides these services:
Services and Prices:
    - General Dentistry:
        - Routine check-up: $50
        - Cleaning: $75
        - Filling: $100
        - Cosmetic Dentistry:
        - Teeth whitening: $150
        - Veneers: $800 per tooth
    - Orthodontics:
        - Braces: $3,000
        - Aligners: $2,500
    - Oral Surgery:
        - Tooth extraction: $200
        - Wisdom teeth removal: $600
        - Dental implants: $2,000
    - Pediatric Dentistry:
        - Cleaning for children: $60
        - Cavity prevention: $40

Ask the user about his name in the beginning of chat.
If he want to book an appointment ask him about time and day he want.
Be a friendly and gentle assistant
`

const instruction_2 = "You are helpful and have some tools installed."


app.get("/session", async (req, res) => {
  const r = await fetch("https://api.openai.com/v1/realtime/sessions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-realtime-preview-2024-12-17",
      voice: "ash",
      instructions: instruction_1,
      turn_detection: {"type": "semantic_vad"}
    }),
  });
  const data = await r.json();
  res.send(data);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
