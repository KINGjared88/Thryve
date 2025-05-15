
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
    if (!configuration.apiKey) {
        return res.status(500).json({ error: 'OpenAI API key not configured, please follow instructions in README.md' });
    }

    const { messages } = req.body;
    if (!messages || messages.length === 0) {
        return res.status(400).json({ error: 'No messages provided' });
    }

  res.status(200).json({ reply: "This is a test response." });
}
