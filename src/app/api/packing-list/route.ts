import { streamText } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(req: Request) {
  const { destination, category, elevation, weather } = await req.json();

  const result = streamText({
    model: google("gemini-2.0-flash"),
    system: "You are a Nepal travel packing expert. Return a practical, concise packing list. Use short bullet points grouped under bold category headings (Clothing, Gear, Documents, Health, Extras). Be specific to the destination type and weather provided.",
    prompt: `Create a personalised packing list for a trip to ${destination} in Nepal.
Category: ${category}
Elevation: ${elevation ?? "varies"}
Current weather: ${weather ?? "unknown"}

Keep it practical and specific. Group items under bold headings. Max 30 items total.`,
  });

  return result.toTextStreamResponse();
}
