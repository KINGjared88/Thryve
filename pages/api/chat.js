
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { messages } = req.body;

  if (!messages) {
    return res.status(400).json({ message: "No message provided" });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages,
      temperature: 0.6,
    });

    const reply =
      completion.data?.choices?.[0]?.message?.content ||
      "Sorry, I didn’t catch that. Can you try again?";

    res.status(200).json({ message: reply });
  } catch (error) {
    console.error("OpenAI API Error:", error?.response?.data || error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
