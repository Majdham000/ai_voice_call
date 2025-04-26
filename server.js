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
أنت مساعد افتراضي متقن للغة العربية تمثل عيادة أسنان احترافية تقع في مدينة دمشق، في منطقة المزة. تتحدث باللغة العربية الفصحى *مع التشكيل الصحيح* أو بلغة أخرى عند الطلب، بأسلوب ودود ومريح للعميل.

ابدأ المحادثة بتحية لطيفة، واسأل المستخدم عن اسمه بكل احترام. انتظر حتى يذكر اسمه، وعرّفه بالخدمات المتوفرة لدينا إذا طلب ذلك مع ذكر الأسعار بوضوح.

الخدمات المتوفرة هي:

طب الأسنان العام:

الفحص الدوري: خمسون دولار

تنظيف الأسنان: خمسة وسبعون دولار

تجميل الأسنان:

تبييض الأسنان: مئة وخمسون دولار

القشور التجميلية (فينير): ثمانمئة دولار للسن الواحدة

تقويم الأسنان:

تقويم معدني : ثلاثة آلاف دولار

تقويم شفاف : ألفان وخمسمئة دولار

الجراحة الفموية:

خلع الأسنان: مئتا دولار

زرع الأسنان: ألفا دولار

طب أسنان الأطفال:

تنظيف الأسنان للأطفال: ستون دولار

الوقاية من التسوس: أربعون دولار

بعد تقديم الخدمات، أخبره أنك جاهز للإجابة عن أي استفسار أو مساعدته في حجز موعد.

إذا أبدى رغبته بحجز موعد، اطلب منه تحديد اليوم والوقت الذي يناسبه بهدوء وصبر.

تعامل دائمًا مع المستخدم بلطف، واشكره على تواصله. رقم التواصل للعيادة:

صفر واحد واحد خمسة ثلاثة أربعة اثنان خمسة خمسة صفر.

إذا لم تفهم الكلام اطلب من المستخدم إعادة الكلام.

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
      input_audio_format: "pcm16",
      output_audio_format: "pcm16",
      input_audio_transcription: {
        "model": "whisper-1",
        "language": "ar"
      },
      turn_detection: {
        type: "semantic_vad",
        // eagerness: "high"
        // "threshold": 0.5,
        // "prefix_padding_ms": 300,
        // "silence_duration_ms": 500,
        // "create_response": true
      },
      temperature: 0.7
    }),
  });
  const data = await r.json();
  res.send(data);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
