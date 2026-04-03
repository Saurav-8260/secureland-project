import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

console.log("🔥 NEW SERVER RUNNING"); // ✅ DEBUG

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 OPENAI SETUP
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend Working 🚀");
});


// 🔥 FRAUD DETECTION
function detectFraud(lands) {
  let risk = "Low ✅";

  const owners = lands.map(l => l.owner);

  const duplicates = owners.filter(
    (o, i) => owners.indexOf(o) !== i
  );

  if (duplicates.length > 2) {
    risk = "High 🚨 Duplicate ownership";
  } else if (lands.length > 10) {
    risk = "Medium ⚠️ High activity";
  }

  return risk;
}

// 🤖 AI ROUTE
app.post("/ai-insight", async (req, res) => {

  console.log("🔥 AI ROUTE HIT"); // ✅ DEBUG

  try {
    const { lands } = req.body;

    if (!lands) {
      return res.json({ error: "No lands data" });
    }

    const risk = detectFraud(lands);

    const prompt = `
    Analyze this land data:
    ${JSON.stringify(lands)}

    Risk Level: ${risk}

    Give a short simple insight.
    `;

    let insight = "AI not connected";

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
          { role: "user", content: prompt }
        ]
      });

      insight = response.choices[0].message.content;

    } catch (aiErr) {
      console.log("⚠️ OpenAI error, using fallback");
      insight = "AI fallback: Data looks normal";
    }

    res.json({
      insight,
      risk
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Server error"
    });
  }
});

// 🚀 START SERVER
app.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});