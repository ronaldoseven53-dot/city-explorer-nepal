import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { destinations } from "@/data/destinations";

const destinationList = JSON.stringify(
  destinations.map(({ id, name, province, region, category, description,
    activities, highlights, bestTimeToVisit, elevation, gettingThere, travelTips }) => ({
    id, name, province, region, category, description,
    activities, highlights, bestTimeToVisit, elevation, gettingThere, travelTips,
  }))
);

const SYSTEM_PROMPT = `You are a friendly and knowledgeable Nepal Travel Assistant for City Explorer Nepal.

Plan trips and answer questions using ONLY the destinations listed below. Do not invent places that are not in this list.

When suggesting an itinerary:
- Recommend a logical order based on geography (group nearby destinations)
- Mention the best time to visit each stop
- Include 2–3 top activities per destination
- Give a practical "Getting There" tip between stops
- Keep the tone warm, enthusiastic, and helpful

If the user asks about a place not in the list, politely say it is not covered yet and suggest the closest match.

AVAILABLE DESTINATIONS:
${destinationList}`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google("gemini-2.0-flash"),
    system: SYSTEM_PROMPT,
    messages,
  });

  return result.toUIMessageStreamResponse();
}
