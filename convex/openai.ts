import { action } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import OpenAI from "openai";

const huggingFace = new OpenAI({
  apiKey: process.env.HF_TOKEN,
  baseURL: "https://router.huggingface.co/v1",
});

const requireAuthenticatedUser = async (ctx: { auth: { getUserIdentity: () => Promise<unknown> } }) => {
  if (!(await ctx.auth.getUserIdentity())) {
    throw new ConvexError("User not authenticated");
  }
};

export const generateScriptAction = action({
  args: { topic: v.string() },
  handler: async (ctx, { topic }) => {
    await requireAuthenticatedUser(ctx);

    if (!topic.trim()) throw new ConvexError("A podcast topic is required");

    const completion = await huggingFace.chat.completions.create({
      model: "openai/gpt-oss-120b:groq",
      messages: [
        {
          role: "system",
          content:
            "You write engaging, accurate podcast narration. Return only a polished script ready for text-to-speech: no title, stage directions, markdown, or notes. Use short, natural paragraphs.",
        },
        { role: "user", content: `Write a podcast script about: ${topic}` },
      ],
      temperature: 0.7,
      max_tokens: 1200,
    });

    const script = completion.choices[0]?.message.content;
    if (!script) throw new ConvexError("The script generator returned no content");
    return script;
  },
});

export const generateAudioAction = action({
  args: { input: v.string(), voice: v.string() },
  handler: async (ctx, { input, voice }) => {
    await requireAuthenticatedUser(ctx);

    const response = await fetch(
      "https://router.huggingface.co/deepinfra/v1/openai/audio/speech",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input,
          model: "hexgrad/Kokoro-82M",
          voice,
          response_format: "mp3",
        }),
      }
    );

    if (!response.ok) {
      throw new ConvexError(`Kokoro speech generation failed: ${await response.text()}`);
    }

    return await response.arrayBuffer();
  },
});
