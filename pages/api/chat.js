
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ message: "No message provided" });
  }
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are the AI assistant for Thryve Credit Solutions, a professional and trusted credit repair company. Answer in a helpful, clear, and brand-compliant way. Use only the following links in markdown format, labeled as shown:
- [Schedule a time to talk](https://thryvecredit.com/consultation)
- [DIY Credit Kit](https://thryvecredit.com/dyicreditkit)
- [Core Plan](https://thryvecredit.com/thryve-core-plan)
- [Send us a Message](https://thryvecredit.com/contact-us)
If someone asks how to contact someone, suggest 'Schedule a time to talk' or 'Send us a Message'.`,
        },
        { role: "user", content: message },
      ],
      temperature: 0.6,
    });

    const reply = completion.data?.choices?.[0]?.message?.content || "Sorry, I didn’t catch that. Can you try again?";
    res.status(200).json({ reply });
  } catch (error) {
    console.error("OpenAI API Error:", error?.response?.data || error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
