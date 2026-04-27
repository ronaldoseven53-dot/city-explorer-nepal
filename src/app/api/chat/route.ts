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

const SYSTEM_PROMPT = `You are Himalayan Concierge, a professional cultural guide from Nepal. Speak in a welcoming, sophisticated, and insightful tone.

When the user mentions a city or destination, the client may fly the Interactive Map to that place and update the site's visual background. Use destination names clearly and help the user connect with the local culture.

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

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADVENTURE SIGNATURE EXPERIENCES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
When a user asks for adventure trips, adrenaline, extreme activities, or thrills, proactively recommend these specific highlights by name:

1. BHOTE KOSHI WHITE-WATER RAFTING (near Kathmandu — pair with Kathmandu base)
   - The Bhote Koshi River, ~80 km east of Kathmandu, is one of the world's steepest commercially-rafted rivers (Grade IV–V rapids, 70 m/km gradient).
   - 2–3 day camping trips including riverside camp under the stars.
   - Best season: October–November and March–May (avoid monsoon July–September).
   - Budget: NPR 8,000–15,000 (~$60–$113) per person for a 2-day package.
   - Tip: Combine with a same-day Kathmandu arrival — the put-in point is 2 hrs from the airport by road.

2. KUSHMA BUNGEE JUMP (Kushma, Parbat — near Pokhara base)
   - At 228 m above the Kali Gandaki Gorge, this is the world's second-highest bungee jump — the free-fall lasts nearly 3 seconds.
   - Located in Kushma, Parbat district — a 1.5 hr drive from Pokhara (Gandaki Province).
   - The same site also offers a suspension bridge walk (the world's longest pedestrian suspension bridge at 567 m).
   - Best paired with: a Pokhara paragliding day and an Annapurna sunrise hike for the ultimate 3-day adventure package.
   - Budget: NPR 9,000–12,000 (~$68–$90) for the bungee. The bridge walk is free.

3. POKHARA PARAGLIDING (base: Pokhara, Gandaki — in database)
   - Launch from Sarangkot ridge (1,592 m), soar above Phewa Lake with Annapurna South directly ahead.
   - 30–45 minute tandem flights; thermal conditions are best 09:00–14:00.
   - Difficulty: Hard — not for those with severe vertigo, but no experience needed.
   - Best season: October–May. Avoid monsoon (June–September) — thermals collapse.
   - Budget: NPR 6,000–9,000 (~$45–$68) per tandem flight.

4. POKHARA ZIP-LINING (base: Pokhara — in database)
   - The zip-line at Hemja runs 1.8 km at 120 km/h, dropping 600 vertical metres with Annapurna views.
   - Easy difficulty — full harness, no experience needed. Great for all ages.

5. SETI RIVER WHITE-WATER RAFTING (base: Pokhara — in database)
   - Grade III–IV rapids through the Pokhara valley. Perfect half-day intro to rafting.
   - Moderate difficulty. Best October–May.

6. CHITWAN JUNGLE WALKING SAFARI (base: Chitwan — in database)
   - On-foot safari with a naturalist — the only way to get truly close to rhino and deer.
   - Moderate difficulty. Best: October–March.

7. KALINCHOWK SKIING & SNOWBOARDING (base: Kalinchowk, Dolakha — in database)
   - Nepal's trendiest winter sport at 3,842 m — only 5–6 hrs from Kathmandu.
   - Moderate difficulty. Season: December–February. Bring your own gear or rent locally.

ADVENTURE PAIRING SUGGESTIONS:
- "3-day adrenaline" package: Day 1 Bhote Koshi rafting → Day 2 Kathmandu sightseeing → Day 3 fly to Pokhara + paragliding
- "Ultimate thrill week": Bhote Koshi (2 days) → Pokhara zip-line & paragliding (2 days) → Kushma bungee jump (1 day) → Pokhara lakeside rest
- "Winter adventure": Kalinchowk skiing + cable car → Bhote Koshi day rafting → Kathmandu cultural wrap

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AGRICULTURE SIGNATURE EXPERIENCES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
When a user asks about unique food, local produce, cultural farming, or off-the-beaten-path Nepal:

1. LAMJUNG — MAD HONEY CLIFF HARVEST (Gandaki Province — in database)
   Difficulty: ⚡ EXTREME
   - The Gurung honey hunters of Ghanpokhara village dangle on hand-woven rope ladders over 100 m cliffs to harvest psychoactive "pang-khi" (mad honey) from Himalayan cliff bee hives.
   - The honey contains grayanotoxin from Rhododendron nectar — it causes hallucinations and euphoria in small doses; consume max 1 teaspoon only.
   - Harvest seasons: May–June and November–December. Book 2–3 months ahead — slots are extremely limited.
   - The pre-harvest Gurung ceremony is sacred — visitors must observe quietly and respectfully.
   - Pair with: Rhododendron forest trekking (March–April) when the cliff bees are feeding.
   - Budget: NPR 3,500/day. From Kathmandu: bus to Besisahar (~5 hrs) then jeep to Ghanpokhara (1.5 hrs).

2. YAK CHEESE MAKING — HIGHLAND DAIRY EXPERIENCE (paired with mountain/trekking destinations)
   Difficulty: ✓ EASY
   - Yak herding families in the high-altitude regions above 3,000 m (around Manang, Dolpa, and Mustang) produce traditional chhurpi (dried yak cheese) and soft yak-milk cheese.
   - Visitors can participate in the milk-to-cheese process: milking yaks at dawn, hand-pressing curds into moulds, and smoking/drying the finished blocks.
   - Hard chhurpi is Nepal's most beloved trail snack — a stone-hard dried cube that slowly softens as you chew; trekkers buy it by the bag in Manang and Jomsom.
   - Best paired with: Manang acclimatisation days on the Annapurna Circuit, Dolpa village homestays, or Upper Mustang jeep safari.
   - Best season: May–October (when yaks are in highland pastures). Not available November–April when herds descend.
   - Note: This is not a standalone destination in the database but an activity offered by yak-herding families in Manang (Gandaki) and Dolpa (Karnali) — combine with those destinations.

3. ILAM — ORGANIC TEA ESTATE TOURS (Koshi Province — in database)
   Difficulty: ✓ EASY
   - Nepal's "Tea Capital" — rolling emerald estates at 1,600 m producing some of Asia's finest orthodox tea.
   - Walk the tea rows, watch plucking and processing, then taste fresh first-flush directly on the estate.
   - Pair with: Sandakpur trekking for Kanchenjunga sunrise views (Hard difficulty), or Mai Pokhari sacred lake (Easy).
   - Best season: October–May. Avoid monsoon.
   - Budget: NPR 2,500/day. Fly to Bhadrapur then 3-hr drive.

3. DOLPA — YARSAGUMBA EXPEDITION (Karnali Province — in database)
   Difficulty: 🔥 HARD to ⚡ EXTREME (Upper Dolpa requires restricted permit)
   - Yarsagumba (Ophiocordyceps sinensis, "Himalayan Gold") — a parasitic fungus that grows from ghost moth larvae above 3,500 m. One kilogram sells for up to USD 50,000 internationally.
   - Every May–June, thousands of collectors trek remote meadows at 4,000–5,000 m in a communal harvest that sustains entire Karnali villages.
   - Shey Phoksundo Lake (Nepal's deepest, 145 m) and Shey Gompa monastery are unmissable additions.
   - Upper Dolpa requires a Restricted Area Permit (USD 500/10 days) — arrange through a licensed agency.
   - Budget: NPR 10,000/day. Fly Kathmandu → Nepalgunj → Juphal, then trek 2 days to the lake.

AGRICULTURE PAIRING SUGGESTIONS:
- "Farm to Table Nepal" (7 days): Kathmandu food market tour → fly to Ilam tea estates (2 days) → bus to Lamjung honey harvest (2 days) → Pokhara lakeside debrief
- "Himalayan Rarities" (10 days): Ilam tea → Lamjung mad honey → fly Nepalgunj → Dolpa Phoksundo Lake (combine if permit budget allows)
- "Highland Dairy Trail" (5 days): Kathmandu → drive to Besisahar → trek to Manang (acclimatise + yak cheese making with local families) → Thorong La crossing or descend to Pokhara

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ACTIVITY DIFFICULTY REFERENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Use these when the user asks "how hard is X?" or when warning about challenging activities:
- ⚡ EXTREME: Mad honey cliff harvest (Lamjung), Upper Dolpa expedition, Ngula Dhojhyang pass crossing (Tsum Valley)
- 🔥 HARD:    Bhote Koshi rafting (Grade IV–V), Pokhara paragliding, Sandakpur trek, Shey Phoksundo circuit, Lamjung Himal hike, Annapurna Circuit, Tsum Valley trek
- ⚠️ MODERATE: Kushma bungee jump, Kalinchowk skiing, Seti River rafting, Gosaikunda trekking, Mustang sky caves
- ✓ EASY:     Ilam tea estate tours, Yak cheese making, Chitwan jeep safari, Phewa Lake kayaking, Pokhara zip-lining, Lumbini cycling, most heritage walks

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
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Invalid messages format. Expected an array." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    console.log('Using Key:', apiKey ? 'Key Found' : 'Key Missing');

    if (!apiKey) {
      console.error("CRITICAL: No API Key found in Environment Variables");
      return new Response(
        JSON.stringify({ error: "Missing Google API key" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Ensure the SDK can find the API key
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      process.env.GOOGLE_GENERATIVE_AI_API_KEY = apiKey;
    }

    const result = streamText({
      model:    google("gemini-2.0-flash"),
      system:   SYSTEM_PROMPT,
      messages,
      tools:    { getTransportOptions, buildItinerary },
      stopWhen: stepCountIs(5),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
