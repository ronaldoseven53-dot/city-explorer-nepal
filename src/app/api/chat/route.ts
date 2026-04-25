import { streamText, tool, stepCountIs } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { destinations } from "@/data/destinations";

export const itineraryEventSchema = z.object({
  id: z.string(),
  day: z.number().int().min(1),
  title: z.string(),
  location: z.string(),
  description: z.string(),
  duration: z.string(),
  type: z.enum(["travel", "activity", "accommodation", "meal"]),
});

const destinationList = JSON.stringify(
  destinations.map(({ id, name, province, region, category, description,
    activities, highlights, bestTimeToVisit, elevation, gettingThere, travelTips, basePrice, coordinates }) => ({
    id, name, province, region, category, description,
    activities, highlights, bestTimeToVisit, elevation, gettingThere, travelTips, basePrice, coordinates,
  }))
);

const SYSTEM_PROMPT = `You are an expert Nepal Travel Agent for City Explorer Nepal.

Plan trips using ONLY the locations and activities in this data. If a user asks for something not covered here, politely tell them you specialize in these specific Nepal experiences and suggest the closest match from the list.

When suggesting an itinerary:
- Recommend a logical order based on geography (group nearby destinations)
- Mention the best time to visit each stop
- Include 2–3 top activities per destination
- Use the getTransportOptions tool whenever the user asks how to travel between two cities, or when building a multi-stop itinerary
- ALWAYS call the buildItinerary tool when creating any multi-day trip plan or itinerary. Pass every activity, travel leg, meal stop, and accommodation as a separate event. Use sequential IDs like "e1", "e2", etc.
- After calling buildItinerary, write a short warm summary paragraph (no bullet list needed — the timeline card UI handles the details)
- Keep the tone warm, enthusiastic, and expert

Budget guidance: each destination has a basePrice (NPR/day). Mention this when the user asks about cost.

KNOWLEDGE BASE — YOUR ONLY SOURCES:
${destinationList}`;

// ── Transport tool ────────────────────────────────────────────────
const getTransportOptions = tool({
  description:
    "Look up available transport routes, estimated travel time, and cost between two Nepal destinations in the database.",
  inputSchema: z.object({
    from: z.string().describe("Name of the origin city (e.g. 'Kathmandu')"),
    to:   z.string().describe("Name of the destination city (e.g. 'Pokhara')"),
  }),
  execute: async ({ from, to }) => {
    const origin = destinations.find(
      (d) => d.name.toLowerCase() === from.toLowerCase()
    );
    const dest = destinations.find(
      (d) => d.name.toLowerCase() === to.toLowerCase()
    );

    if (!origin || !dest) {
      return {
        found: false as const,
        message: `One or both destinations not found: "${from}", "${to}". Only use destination names from the database.`,
      };
    }

    // Haversine distance in km
    const R    = 6371;
    const dLat = ((dest.coordinates.lat - origin.coordinates.lat) * Math.PI) / 180;
    const dLng = ((dest.coordinates.lng - origin.coordinates.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((origin.coordinates.lat * Math.PI) / 180) *
        Math.cos((dest.coordinates.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    const distanceKm = Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));

    const toText  = dest.gettingThere.toLowerCase();
    const options: { mode: string; duration: string; cost: string; notes: string }[] = [];

    if (toText.includes("fly") || toText.includes("flight") || toText.includes("airport")) {
      options.push({
        mode:     "Domestic Flight ✈️",
        duration: distanceKm < 200 ? "25–40 min" : distanceKm < 400 ? "45–60 min" : "1–1.5 hrs",
        cost:     "NPR 8,000–18,000 (~$60–$135)",
        notes:    "Fastest option. Book 2–3 weeks ahead in peak season (Oct–Nov, Mar–Apr).",
      });
    }

    if (toText.includes("bus") || toText.includes("highway") || distanceKm < 500) {
      const hrs = Math.round(distanceKm / 40);
      options.push({
        mode:     "Tourist / Public Bus 🚌",
        duration: `${hrs}–${hrs + 2} hrs`,
        cost:     "NPR 600–1,500 (~$5–$11)",
        notes:    "Most budget-friendly. Tourist buses have reserved seats and A/C.",
      });
    }

    if (toText.includes("jeep") || toText.includes("4wd") || dest.category === "mountain") {
      const hrs = Math.round(distanceKm / 35);
      options.push({
        mode:     "Private Jeep / 4WD 🚙",
        duration: `${hrs}–${hrs + 1} hrs`,
        cost:     "NPR 6,000–15,000 (~$45–$113) charter",
        notes:    "Essential for high-altitude or restricted-area routes. Flexible stops.",
      });
    }

    if (options.length === 0) {
      options.push({
        mode:     "Road Transfer 🚐",
        duration: `~${Math.round(distanceKm / 40)} hrs`,
        cost:     "NPR 800–2,000 (~$6–$15)",
        notes:    dest.gettingThere,
      });
    }

    return {
      found: true as const,
      from:  origin.name,
      to:    dest.name,
      distanceKm,
      options,
      officialTip: dest.gettingThere,
    };
  },
});

// ── Itinerary tool ───────────────────────────────────────────────
const buildItinerary = tool({
  description:
    "Render a structured trip itinerary as a draggable timeline of events in the UI. Call this whenever you create any multi-day trip plan.",
  inputSchema: z.object({
    tripTitle: z.string().describe("Short title for the trip, e.g. '7-Day Nepal Highlights'"),
    totalDays: z.number().int().min(1),
    events: z.array(itineraryEventSchema),
  }),
  execute: async ({ tripTitle, totalDays, events }) => ({ tripTitle, totalDays, events }),
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model:    google("gemini-2.0-flash"),
    system:   SYSTEM_PROMPT,
    messages,
    tools:    { getTransportOptions, buildItinerary },
    stopWhen: stepCountIs(5),
  });

  return result.toUIMessageStreamResponse();
}
