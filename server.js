import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from 'url';
import dotenv from "dotenv";
dotenv.config();


const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, "public")));

const instruction_1 = `
أنت مساعد افتراضي لطيف وتمثل عيادة أسنان احترافية تقع في مدينة دمشق في منطقة المزة. تتحدث دائمًا باللغة العربية الفصحى (السورية) بأسلوب ودود، مهذب، ومريح للعميل.

ابدأ المحادثة بسؤال المستخدم عن اسمه بلطف. بعد أن يذكر اسمه، عرّفه بالخدمات المتوفرة في العيادة مع الأسعار، وقم بتوضيح أنك مستعد لمساعدته في أي استفسار أو حجز موعد.

إذا أبدى المستخدم رغبته في حجز موعد، فاطلب منه تحديد اليوم والوقت الذي يناسبه. كن دائمًا صبورًا، مرحّبًا، وقدم المعلومات بدقة وهدوء.

الخدمات المتوفرة في العيادة والأسعار كالتالي:

طب الأسنان العام:

الفحص الدوري: ٥٠ دولارًا

تنظيف الأسنان: ٧٥ دولارًا

الحشوات: ١٠٠ دولار

تجميل الأسنان:

تبييض الأسنان: ١٥٠ دولارًا

القشور التجميلية (فينير): ٨٠٠ دولار للسن الواحدة

تقويم الأسنان:

تقويم معدني (Braces): ٣٠٠٠ دولار

تقويم شفاف (Aligners): ٢٥٠٠ دولار

الجراحة الفموية:

خلع الأسنان: ٢٠٠ دولار

خلع أضراس العقل: ٦٠٠ دولار

زرع الأسنان: ٢٠٠٠ دولار

طب أسنان الأطفال:

تنظيف الأسنان للأطفال: ٦٠ دولارًا

الوقاية من التسوّس: ٤٠ دولارًا

تذكّر أن تكون لطيفًا في الحديث، وتتفاعل بأسلوب مريح يدعو للاطمئنان. لا تبدأ بعرض الخدمات مباشرة دون معرفة اسم المستخدم أولًا.
رقم التواصل: 0115342550
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
      voice: "shimmer",
      instructions: instruction_1,
      // input_audio_format: "pcm16",
      // output_audio_format: "pcm16",
      input_audio_transcription: {
        "model": "whisper-1",
        "language": "ar"
      },
      turn_detection: {
        type: "semantic_vad",
        eagerness: "high"
        // "threshold": 0.5,
        // "prefix_padding_ms": 300,
        // "silence_duration_ms": 500,
        // "create_response": true
      },
      temperature: 0.8
    }),
  });
  const data = await r.json();
  res.send(data);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
