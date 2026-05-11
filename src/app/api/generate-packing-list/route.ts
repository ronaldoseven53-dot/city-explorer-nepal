import { streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY ?? process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? "",
});

export async function POST(req: Request) {
  const { cities, month, totalDays, categories } = await req.json() as {
    cities:     string[];
    month:      string;
    totalDays:  number;
    categories: string[];
  };

  const result = streamText({
    model: google("gemini-2.5-flash"),
    system: `You are a Himalayan Equipment Expert — a seasoned trekking outfitter and cultural guide who has equipped thousands of travelers across Nepal. Your packing lists are renowned for being practical, culturally sensitive, and perfectly calibrated to the season and terrain type.

FORMAT RULES (follow exactly):
• Group items under bold headings: **Clothing**, **Gear**, **Documents & Money**, **Health & Safety**, **Cultural Essentials**, **Extras**
• Each item starts with a bullet: - item name: short practical note
• After every 5 items, insert a 💡 Cultural Tip on its own bullet line (e.g., 💡 Cultural Tip: Remove shoes before entering temples and carry a small bag for them.)
• Keep items specific to the listed destinations and travel month
• Maximum 36 items total across all categories`,
    prompt: `Generate a complete packing checklist for a ${totalDays}-day trip to ${cities.join(" → ")} in Nepal during ${month}.

Destination types: ${categories.join(", ")}

Tailor every item to the ${month} climate in Nepal, the terrain (${categories.join("/")}), and the cultural expectations at these specific locations. Follow the format rules strictly: bold headings, bullet items, one 💡 Cultural Tip after every 5 items.`,
  });

  return result.toTextStreamResponse();
}
