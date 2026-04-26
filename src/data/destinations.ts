// ── Core types ────────────────────────────────────────────────────

export interface Destination {
  id: string;
  name: string;
  province: string;
  region: string;
  description: string;
  activities: string[];
  wildlife: string[];
  placeholderImage: string;
  highlights: string[];
  bestTimeToVisit: string;
  category: "mountain" | "heritage" | "nature" | "pilgrimage" | "hill" | "agriculture";
  elevation?: string;
  travelTips: string[];
  gettingThere: string;
  coordinates: { lat: number; lng: number };
  basePrice: number; // estimated NPR per person per day (budget traveller)
}

/** A Spot is structurally identical to a Destination — the alias signals it
 *  lives inside a CategoryGroup rather than the flat destinations array. */
export type Spot = Destination;

export interface CategoryGroup {
  id: string;
  name: string;
  emoji: string;
  description: string;
  spots: Spot[];
}

// ── Spot data ─────────────────────────────────────────────────────

// ── Agriculture ───────────────────────────────────────────────────

const ilam: Spot = {
  id: "ilam",
  name: "Ilam",
  province: "Koshi (Province No. 1)",
  region: "Eastern Nepal",
  description:
    "Known as the 'Tea Capital of Nepal', Ilam is a charming hill town surrounded by rolling green tea estates, dense rhododendron forests, and panoramic views of Kanchenjunga and the eastern Himalayas. The cool misty climate, vibrant green hillsides, and warm local culture make it one of Nepal's most rewarding hill destinations.",
  activities: [
    "Tea estate tours and organic tea tasting",
    "Sunrise trek to Antu Danda viewpoint",
    "Sandakpur trekking (Kanchenjunga views)",
    "Birdwatching in rhododendron forests",
    "Mai Pokhari sacred lake visit",
    "Fikkal weekly market exploration",
    "Home-stay experiences with local families",
  ],
  wildlife: [
    "Red panda (in forested higher zones)",
    "Common leopard",
    "Himalayan black bear",
    "Barking deer (muntjac)",
    "Rufous-necked hornbill",
    "Kalij pheasant",
    "Over 300 bird species including sunbirds and laughingthrushes",
  ],
  placeholderImage: "https://images.unsplash.com/photo-1605105777592-c3430a67d033?w=800&q=80",
  highlights: ["Ilam tea gardens (largest in Nepal)", "Mai Pokhari sacred lake", "Sandakpur viewpoint", "Antu Danda sunrise point", "Kanchenjunga views", "Fikkal bazaar"],
  bestTimeToVisit: "October – May",
  category: "agriculture",
  elevation: "1,600 m (5,249 ft)",
  travelTips: [
    "Buy fresh tea directly from the estates — much cheaper than Kathmandu",
    "Antu Danda sunrise is best in clear October–November weather",
    "Homestays offer the most authentic experience and support local families",
    "Roads can be slippery in monsoon — travel by bus in the dry season",
    "Fikkal has better ATMs and shops than Ilam town itself",
  ],
  gettingThere: "Fly to Bhadrapur Airport (BDP) in Jhapa, then take a local bus or taxi to Ilam (3–4 hours). Alternatively, overnight buses run from Kathmandu to Ilam directly (12–14 hours).",
  coordinates: { lat: 26.9099, lng: 87.9238 },
  basePrice: 2500,
};

const lamjung: Spot = {
  id: "lamjung",
  name: "Lamjung",
  province: "Gandaki",
  region: "Central Nepal, Lamjung District",
  description:
    "Lamjung district in the Gandaki province is home to one of the world's most extraordinary natural phenomena — mad honey, or 'pang-khi' in the local Gurung language. Harvested twice a year by the Gurung honey hunters from towering cliff-face hives, this psychoactive honey is produced by Himalayan cliff bees that feed exclusively on Rhododendron flowers. The grayanotoxin in the honey causes hallucinations and euphoria in small doses and has been used in traditional medicine for centuries. Witnessing a honey hunt — ropes, smouldering grass smoke, and bamboo poles dangling over 100-metre cliffs — is one of Nepal's most dramatic and culturally unique experiences.",
  activities: [
    "Mad honey cliff-harvest observation (May–June and Nov–Dec)",
    "Traditional Gurung village homestays in Ghanpokhara",
    "Rhododendron forest trekking (March–April bloom)",
    "Cultural interaction with Gurung honey-hunting families",
    "Lamjung Himal viewpoint hike",
    "Photography of Himalayan cliff bee hives",
    "Trekking to Bhimphedi and surrounding ridges",
  ],
  wildlife: [
    "Himalayan cliff honey bee (Apis laboriosa)",
    "Red panda (rhododendron forest zones)",
    "Common leopard",
    "Himalayan monal pheasant",
    "Barking deer (muntjac)",
    "Assam macaque monkeys",
    "Various Himalayan raptors",
  ],
  placeholderImage: "https://images.unsplash.com/photo-1572109801525-0bb0272e8579?w=800&q=80",
  highlights: [
    "Mad honey cliff harvesting — ancient Gurung tradition",
    "Psychoactive honey used in traditional Gurung medicine",
    "Twice-yearly harvest spectacle (May–June and Nov–Dec)",
    "Rhododendron forests where the cliff bees feed",
    "Lamjung Himal panoramic views",
    "Authentic Gurung cultural village experience",
  ],
  bestTimeToVisit: "May – June and November – December (honey harvest seasons); March – April (rhododendron bloom)",
  category: "agriculture",
  elevation: "1,200 – 2,500 m (3,937 – 8,202 ft)",
  travelTips: [
    "Contact community homestays in Ghanpokhara village to arrange honey-hunt access — it is not a tourist show",
    "Mad honey should be consumed in tiny quantities only — larger doses cause serious toxicity",
    "The harvest happens twice yearly — book well ahead as slots fill fast with photographers and researchers",
    "Bring trekking shoes and waterproofs — trails to cliff-side viewing points are steep and muddy",
    "Respect the Gurung ceremony before the hunt — it is a sacred ritual, not a spectacle",
  ],
  gettingThere: "From Kathmandu take a bus or drive to Besisahar (~5 hrs via the Prithvi Highway), the main town of Lamjung district. Local jeeps and buses then reach villages like Ghanpokhara (1.5 hrs) where honey-hunting trips are arranged.",
  coordinates: { lat: 28.1500, lng: 84.3800 },
  basePrice: 3500,
};

const dolpa: Spot = {
  id: "dolpa",
  name: "Dolpa",
  province: "Karnali",
  region: "Northwestern Nepal, Dolpa District",
  description:
    "Remote and rarely visited, Dolpa is Nepal's largest district by area — a vast, arid trans-Himalayan plateau that shelters one of Asia's most extraordinary natural resources: yarsagumba (Ophiocordyceps sinensis), the caterpillar fungus known as 'Himalayan Gold'. Found only above 3,500 m where larvae of ghost moths are parasitised by a specific fungus, a single kilogram of yarsagumba can sell for up to USD 50,000 on international markets. Each May and June, thousands of collectors trek to remote meadows in an ancient communal harvest that sustains entire village economies in Karnali. Dolpa also holds Shey Phoksundo Lake — Nepal's deepest lake at 145 m — Tibetan Buddhist monasteries unchanged for centuries, and some of the planet's most dramatic high-altitude wilderness.",
  activities: [
    "Yarsagumba (caterpillar fungus) harvest observation (May–June)",
    "Shey Phoksundo Lake trekking circuit (Lower Dolpa)",
    "Tibetan Buddhist monastery visits at Shey Gompa",
    "Upper Dolpa restricted-area expedition",
    "Snow leopard wildlife tracking with a naturalist guide",
    "Photography in the surreal turquoise lake and red-cliff landscape",
    "Cultural immersion with Bon-po Buddhist Dolpo-pa communities",
  ],
  wildlife: [
    "Snow leopard",
    "Tibetan wolf",
    "Blue sheep (bharal)",
    "Himalayan tahr",
    "Golden eagle",
    "Ghost moth (yarsagumba host insect)",
    "Tibetan snowcock",
  ],
  placeholderImage: "https://images.unsplash.com/photo-1691516347496-f9ada8248715?w=800&q=80",
  highlights: [
    "Yarsagumba harvest — the world's most valuable wild fungus",
    "Shey Phoksundo Lake — Nepal's deepest lake (145 m) at 3,611 m",
    "Shey Gompa — ancient Tibetan Buddhist monastery",
    "Upper Dolpa restricted area — fewer than 500 visitors per year",
    "Dramatic red-cliff canyons and turquoise lake landscape",
    "Living Bon-po Buddhist culture virtually unchanged for centuries",
  ],
  bestTimeToVisit: "May – June (yarsagumba season); September – October (clearest trekking weather)",
  category: "agriculture",
  elevation: "Phoksundo Lake at 3,611 m; upper meadows 4,000–5,000 m",
  travelTips: [
    "Upper Dolpa requires a Restricted Area Permit (USD 500/10 days) — arrange through a licensed trekking agency",
    "Lower Dolpa (Phoksundo Lake) needs only standard TIMS + Shey Phoksundo National Park entry permit",
    "Fly Kathmandu → Nepalgunj → Juphal Airport (the nearest airstrip to Dolpa, 35 min)",
    "Mobile signal is absent throughout most of Dolpa — carry a satellite communicator",
    "May–June yarsagumba collectors do not welcome uninvited observers — access must be arranged through a trusted local guide",
  ],
  gettingThere: "Fly from Kathmandu to Nepalgunj (1 hr), then take a mountain flight to Juphal Airport in Dolpa (35 min). From Juphal, the trek to Shey Phoksundo Lake takes 2 days. Accessing Upper Dolpa and the yarsagumba meadows requires further trekking from the lake.",
  coordinates: { lat: 29.1500, lng: 82.9000 },
  basePrice: 10000,
};

// ── Adventure ─────────────────────────────────────────────────────

const pokhara: Spot = {
  id: "pokhara",
  name: "Pokhara",
  province: "Gandaki",
  region: "Central-West Nepal",
  description:
    "Nestled beside the tranquil Phewa Lake with the Annapurna range as a dramatic backdrop, Pokhara is Nepal's adventure capital. It serves as the gateway to the Annapurna Circuit and offers a relaxed lakeside atmosphere loved by trekkers and tourists alike.",
  activities: [
    "Paragliding over the Annapurna range",
    "Annapurna Circuit & Poon Hill trekking",
    "Boating and kayaking on Phewa Lake",
    "Zip-lining across the valley",
    "White-water rafting on the Seti River",
    "Sunrise hike to Sarangkot viewpoint",
    "Cave exploration at Gupteswar",
    "Ultralight aircraft flights",
  ],
  wildlife: [
    "Mahseer fish (Phewa Lake)",
    "Grey wagtails and kingfishers",
    "Himalayan griffon vultures",
    "Jungle cats",
    "Porcupines and civets (forested hills)",
    "Common leopards (outskirts)",
  ],
  placeholderImage: "https://images.unsplash.com/photo-1562462181-b228e3cff9ad?w=800&q=80",
  highlights: ["Phewa Lake", "World Peace Pagoda", "Sarangkot sunrise viewpoint", "Davis Falls", "Gupteswar Cave", "Paragliding over the Himalayas"],
  bestTimeToVisit: "October – December and March – May",
  category: "mountain",
  elevation: "822 m (2,696 ft)",
  travelTips: [
    "Book paragliding in advance during peak season (Oct–Nov)",
    "Hire a rowing boat at Phewa Lake for under NPR 500/hour",
    "Sarangkot sunrise starts around 05:30 — go the night before if possible",
    "Lakeside area has the best restaurant and café options",
    "TIMS card required before starting any trek — get it in Pokhara",
  ],
  gettingThere: "Pokhara Regional International Airport (PKR) has domestic flights from Kathmandu (25 min). Tourist buses and private cars make the scenic 6–7 hour road journey from Kathmandu along the Prithvi Highway.",
  coordinates: { lat: 28.2096, lng: 83.9856 },
  basePrice: 3000,
};

const mustang: Spot = {
  id: "mustang",
  name: "Mustang",
  province: "Gandaki",
  region: "Upper Mustang, North-West Nepal",
  description:
    "Hidden beyond the Annapurna and Dhaulagiri ranges, Mustang is a rain-shadow desert kingdom that preserves Tibetan culture largely untouched by modernity. Its ancient walled capital Lo Manthang, cave cities carved into canyon walls, and wind-sculpted red-cliffed landscapes make it one of the most extraordinary destinations on earth.",
  activities: [
    "Trekking the Upper Mustang trail to Lo Manthang",
    "Exploring sky caves of Chhoser",
    "Jeep safari through canyon landscapes",
    "Attending the Tiji Festival (May)",
    "Visiting ancient Tibetan gompas and monasteries",
    "Muktinath Temple pilgrimage",
    "Photography in the sculpted canyon badlands",
  ],
  wildlife: [
    "Snow leopard (rare, high-altitude zones)",
    "Tibetan wolf",
    "Blue sheep (bharal)",
    "Himalayan griffon vulture",
    "Kiang (Tibetan wild ass)",
    "Tibetan snowcock",
    "Bearded vulture (lammergeier)",
  ],
  placeholderImage: "https://images.unsplash.com/photo-1619463206719-f87a692cdd7a?w=800&q=80",
  highlights: ["Lo Manthang walled city", "Sky caves of Chhoser", "Tiji Festival", "Kagbeni village", "Muktinath Temple", "Dramatic red-cliffed canyons"],
  bestTimeToVisit: "May – October (restricted area permit required)",
  category: "mountain",
  elevation: "Lo Manthang at 3,840 m (12,598 ft)",
  travelTips: [
    "A Restricted Area Permit (USD 500 for 10 days) is mandatory",
    "Jeep is faster than trekking — roads connect Jomsom to Lo Manthang",
    "Acclimatise properly in Jomsom or Kagbeni before going higher",
    "Bring warm layers — temperatures drop sharply at night year-round",
    "There is no ATM in Upper Mustang — carry enough cash",
  ],
  gettingThere: "Fly Kathmandu → Pokhara → Jomsom (Tenzing-Hillary Airport). From Jomsom, jeeps run to Kagbeni and onward to Lo Manthang. The full jeep journey from Jomsom to Lo Manthang takes 6–8 hours.",
  coordinates: { lat: 29.1851, lng: 83.9649 },
  basePrice: 15000,
};

const chitwan: Spot = {
  id: "chitwan",
  name: "Chitwan",
  province: "Bagmati",
  region: "Southern Nepal (Terai)",
  description:
    "Chitwan National Park is Nepal's first national park and a UNESCO World Heritage Site, protecting one of Asia's last remaining expanses of tall grasslands and subtropical forests. Home to the endangered one-horned rhinoceros and Bengal tiger, Chitwan offers world-class wildlife safaris in a lush Terai setting.",
  activities: [
    "Jeep safari through the national park",
    "Elephant-back safari (observation only)",
    "Canoe ride on the Rapti River",
    "Jungle walking safari with a naturalist guide",
    "Tharu cultural village tour and dance show",
    "Birdwatching (over 540 species recorded)",
    "Sunrise river walk along the Rapti",
  ],
  wildlife: [
    "One-horned rhinoceros",
    "Bengal tiger",
    "Gharial and mugger crocodiles",
    "Asian elephant",
    "Sloth bear",
    "Spotted deer and sambar deer",
    "Giant hornbill and Bengal florican",
  ],
  placeholderImage: "https://images.unsplash.com/photo-1551410224-699683e15636?w=800&q=80",
  highlights: ["Chitwan National Park (UNESCO)", "One-horned rhino sightings", "Tharu cultural village", "Rapti River canoe safari", "Elephant Breeding Centre", "Jungle walking trail"],
  bestTimeToVisit: "October – March (park open year-round except core zone monsoon closures)",
  category: "nature",
  elevation: "150 m (490 ft)",
  travelTips: [
    "Book a reputable eco-lodge with a qualified naturalist guide",
    "Wear dull-coloured clothing (khaki, green) on safaris",
    "Early morning jeep safaris have the best chances of rhino sightings",
    "Do not approach rhinos on foot — stay with your guide at all times",
    "Park entry fee: NPR 2,000 for foreigners per day",
  ],
  gettingThere: "Tourist buses run daily from Kathmandu to Sauraha (5–6 hours). Alternatively, fly to Bharatpur Airport (BHR) — 30 minutes from Kathmandu — then take a taxi to Sauraha (30 min).",
  coordinates: { lat: 27.5291, lng: 84.3542 },
  basePrice: 5500,
};

const kalinchowk: Spot = {
  id: "kalinchowk",
  name: "Kalinchowk",
  province: "Bagmati",
  region: "Central-Eastern Nepal, Dolakha",
  description:
    "Perched at 3,842 m on a dramatic ridge in Dolakha district, Kalinchowk has exploded in popularity since its cable car opened, making the sacred Kalinchowk Bhagwati Temple and a jaw-dropping panorama of Langtang, Ganesh Himal, Gauri Shankar, and Everest accessible to everyone. In winter (December–February) deep snow blankets the ridge, drawing skiers, snowboarders, and Instagram photographers to what has become Nepal's trendiest winter escape — only 5–6 hours from Kathmandu.",
  activities: [
    "Skiing and snowboarding (December – February)",
    "Cable car ride to Kalinchowk Bhagwati Temple",
    "Himalayan sunrise viewpoint photography",
    "Snow play and winter trekking",
    "Pilgrimage to Kalinchowk Bhagwati Shrine",
    "Paragliding (spring and autumn)",
    "High-altitude nature walks",
  ],
  wildlife: [
    "Himalayan monal pheasant",
    "Musk deer",
    "Himalayan black bear",
    "Snow leopard (rare, upper ridges)",
    "Alpine hare",
    "Various high-altitude raptors",
  ],
  placeholderImage: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80",
  highlights: [
    "Kalinchowk Bhagwati Temple at 3,842 m",
    "360° panorama of 8+ Himalayan peaks",
    "Cable car — accessible for all fitness levels",
    "Nepal's trendiest winter snow destination",
    "Spectacular Everest and Gauri Shankar views",
    "Only 5–6 hours drive from Kathmandu",
  ],
  bestTimeToVisit: "December – February (snow and skiing) and March – May (clear trekking weather)",
  category: "mountain",
  elevation: "3,842 m (12,605 ft)",
  travelTips: [
    "Drive from Kathmandu via Charikot (Dolakha) — the road is paved all the way to Kuri village",
    "Take the cable car up to avoid the steep 2-hour hike to the temple ridge",
    "In winter, temperatures plunge to −15 °C — bring full snow gear",
    "Book lodges in Charikot a week ahead during the December–January peak snow season",
    "Weather can change within minutes — start your hike or cable car ride early morning",
  ],
  gettingThere: "From Kathmandu, take a tourist bus or drive (~150 km, 5–6 hrs) via the BP Highway to Charikot, then continue 20 km to Kuri village. The cable car from Kuri whisks you to the summit in minutes.",
  coordinates: { lat: 27.7980, lng: 86.0610 },
  basePrice: 4000,
};

// ── Trekking ──────────────────────────────────────────────────────

const manang: Spot = {
  id: "manang",
  name: "Manang",
  province: "Gandaki",
  region: "Annapurna Region, North-Central Nepal",
  description:
    "A high-altitude village on the classic Annapurna Circuit trek, Manang sits at the foot of Annapurna III and Gangapurna peak. Trekkers acclimatise here before crossing Thorong La pass (5,416 m), and the village retains a strong Tibetan-influenced culture with ancient gompas and yak herders.",
  activities: [
    "Acclimatisation hike to Ice Lake (4,600 m)",
    "Annapurna Circuit trekking",
    "Braga Gompa monastery visit",
    "Gangapurna glacier and lake viewpoint walk",
    "Milarepa Cave meditation retreat",
    "Photography of high-altitude Himalayan scenery",
    "Cultural interaction with Manangi and Gurung communities",
  ],
  wildlife: [
    "Snow leopard (elusive, higher terrain)",
    "Himalayan tahr",
    "Blue sheep (bharal)",
    "Golden eagle",
    "Himalayan monal pheasant (national bird of Nepal)",
    "Red-billed chough",
    "Marmots",
  ],
  placeholderImage: "https://images.unsplash.com/photo-1545662618-66de187bbf69?w=800&q=80",
  highlights: ["Gangapurna Lake and glacier", "Braga Gompa (monastery)", "Milarepa Cave", "Views of Annapurna III and Gangapurna", "Ice Lake day hike", "Traditional Gurung and Manangi culture"],
  bestTimeToVisit: "September – November and March – May",
  category: "mountain",
  elevation: "3,519 m (11,545 ft)",
  travelTips: [
    "Spend at least 2 nights for acclimatisation before crossing Thorong La",
    "Altitude sickness is common — ascend slowly and stay hydrated",
    "The Himalayan Rescue Association runs free altitude briefings each evening",
    "Tea houses are basic but warm — sleeping bags are recommended",
    "Electricity and phone signal are limited — carry a power bank",
  ],
  gettingThere: "From Kathmandu, take a bus or jeep to Besisahar, then continue by jeep to Chame or Dharapani. From there, Manang is a 2–3 day walk on the Annapurna Circuit. Some jeeps reach Manang directly from Chame in the dry season.",
  coordinates: { lat: 28.6671, lng: 84.0221 },
  basePrice: 4500,
};

const raraLake: Spot = {
  id: "rara-lake",
  name: "Rara Lake",
  province: "Karnali",
  region: "Northwestern Nepal",
  description:
    "Nepal's largest and deepest freshwater lake, Rara sits at 2,990 m inside Rara National Park — one of the remotest corners of the Himalayas. Often called the 'Queen of Lakes', its sapphire-blue water mirrors surrounding pine and juniper forests and snow-dusted peaks in an almost surreal silence. Virtually untouched by mass tourism, Rara rewards travellers willing to make the journey with some of the most pristine wilderness in Asia.",
  activities: [
    "Rara Lake circuit trekking (3–4 days)",
    "Boating and kayaking on the lake",
    "Wildlife safari in Rara National Park",
    "Night-sky photography (zero light pollution)",
    "Horse riding through alpine meadows",
    "Birdwatching (200+ species including Himalayan monal)",
    "Wild camping on the lakeshore",
  ],
  wildlife: [
    "Red panda",
    "Himalayan black bear",
    "Musk deer",
    "Common leopard",
    "Himalayan monal pheasant",
    "Migratory bar-headed geese",
    "Himalayan tahr",
  ],
  placeholderImage: "https://images.unsplash.com/photo-1544442069-97dded965a9f?w=800&q=80",
  highlights: [
    "Nepal's largest lake (10.8 km²)",
    "Rara National Park (UNESCO candidate)",
    "Zero-light-pollution night skies",
    "Remote wilderness — fewer than 3,000 visitors/year",
    "Lake circuit walking trail",
    "Alpine meadows and dense cedar forests",
  ],
  bestTimeToVisit: "September – November (autumn) and March – May (spring)",
  category: "nature",
  elevation: "2,990 m (9,810 ft)",
  travelTips: [
    "Fly Kathmandu → Nepalgunj → Talcha (Mugu) — the closest airstrip, then a 3-hour hike to the lake",
    "Trekking permits and national park entry fees required; arrange in Kathmandu",
    "Nights drop below 0 °C even in October — pack a proper sleeping bag",
    "Mobile network is absent; inform someone of your itinerary before entering",
    "Hire a local guide from Gamgadhi — trails are not marked and weather changes fast",
  ],
  gettingThere: "Fly from Kathmandu to Nepalgunj (1 hr), then take a mountain flight to Talcha Airport in Mugu (30 min). From Talcha a scenic 3-hour hike brings you to the lakeshore. Alternatively, trek 10–14 days from Jumla.",
  coordinates: { lat: 29.5272, lng: 82.0955 },
  basePrice: 9500,
};

const tsumValley: Spot = {
  id: "tsum-valley",
  name: "Tsum Valley",
  province: "Gandaki",
  region: "Manaslu Conservation Area, Northern Gorkha",
  description:
    "Hidden deep in the Manaslu Conservation Area and closed to outsiders until 2008, Tsum Valley — known as 'Beyul Kyimolung' or the Hidden Valley of Happiness — is one of the last pockets of truly ancient Tibetan Buddhist culture on Earth. The Tsumba people maintain 14th-century monasteries, prayer-flag passes, and a way of life unchanged for centuries, all framed by the dramatic flanks of Ganesh Himal, Boudha Himal, and Sringi Himal.",
  activities: [
    "Tsum Valley cultural trekking (14–17 days)",
    "Gumba Lungdang and Mu Gompa monastery visits",
    "Village homestays with Tsumba families",
    "Prayer wheel and chorten trails",
    "High-pass crossings — Ngula Dhojhyang (5,093 m)",
    "Wildlife trekking in Manaslu Conservation Area",
    "Photography of centuries-old Buddhist art and murals",
  ],
  wildlife: [
    "Snow leopard",
    "Blue sheep (bharal)",
    "Himalayan musk deer",
    "Red panda",
    "Himalayan black bear",
    "Golden eagle",
    "Himalayan griffon vulture",
  ],
  placeholderImage: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80",
  highlights: [
    "Mu Gompa — largest active monastery in the region",
    "Ngula Dhojhyang high pass (5,093 m)",
    "Pristine Tibetan Buddhist culture, closed pre-2008",
    "Ganesh Himal and Boudha Himal panoramas",
    "Ancient chortens, mani walls, and prayer flags",
    "Fewer than 1,500 annual visitors",
  ],
  bestTimeToVisit: "March – May and September – November",
  category: "heritage",
  elevation: "1,905 – 5,093 m (valley to pass)",
  travelTips: [
    "Restricted Area Permit (RAP) required: minimum 2 trekkers + licensed guide — no independent trekking",
    "Combine with the Manaslu Circuit for the classic 3-week loop",
    "Tea houses exist in main villages but are basic — carry snacks and a water filter",
    "Respect photography restrictions inside monasteries; always ask first",
    "The trail from Jagat (road-head) to Tsum takes 4–5 days — acclimatise properly",
  ],
  gettingThere: "Drive from Kathmandu to Soti Khola or Machha Khola road-head (8–9 hrs via Arughat). The trek begins here and reaches the Tsum Valley turn-off at Lokpa after 4–5 walking days.",
  coordinates: { lat: 28.5700, lng: 85.0400 },
  basePrice: 12000,
};

const dhampus: Spot = {
  id: "dhampus",
  name: "Dhampus",
  province: "Gandaki",
  region: "Annapurna Foothills, Kaski",
  description:
    "A traditional Gurung village draped along a ridge at 1,750 m with front-row views of Annapurna South, Machhapuchhre (Fishtail), and Dhaulagiri, Dhampus has become the go-to 'accessible Himalayan village' for travellers based in Pokhara. The Australian Camp viewpoint above the village — only a 3-hour hike from the trailhead — went viral on Instagram and TikTok in 2023–24, turning this quiet hamlet into one of Nepal's fastest-growing short-trek destinations.",
  activities: [
    "Hike to Australian Camp panorama viewpoint",
    "Sunrise photography of Annapurna and Machhapuchhre",
    "Village walk through traditional Gurung homesteads",
    "Rhododendron forest walk (March – April bloom)",
    "Cycling descent from Dhampus to Phedi",
    "Cultural evening with traditional Gurung dance",
    "Short trek extension to Pothana and Landruk",
  ],
  wildlife: [
    "Red panda (rhododendron forests)",
    "Assam macaque monkeys",
    "Himalayan griffon vultures on thermals",
    "Various Himalayan pheasants",
    "Barking deer",
    "Langur monkeys",
  ],
  placeholderImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  highlights: [
    "Australian Camp — viral Annapurna panorama viewpoint",
    "360° view: Annapurna, Machhapuchhre, Dhaulagiri",
    "Only 30 min drive + 3 hr hike from Pokhara",
    "Rhododendron forests in full bloom (March–April)",
    "Authentic Gurung village culture and homestays",
    "Gateway to Pothana–Landruk village trek loop",
  ],
  bestTimeToVisit: "October – November (clear views) and March – April (rhododendron bloom)",
  category: "hill",
  elevation: "1,750 m (5,741 ft)",
  travelTips: [
    "Start from Phedi (30 min taxi from Pokhara) — the uphill trek takes 2.5–3 hours at a comfortable pace",
    "Stay overnight in a village guesthouse for the sunrise — same-day trips miss the best light",
    "March and April are the most photogenic months when rhododendrons are in full bloom",
    "The Australian Camp viewpoint requires a small ACAP entry fee — keep your permit",
    "Combine with a 2-day loop to Pothana and Landruk for a fuller Annapurna foothills experience",
  ],
  gettingThere: "From Pokhara Lakeside take a taxi or local bus to Phedi village (30 min, ~NPR 500). The well-marked trail climbs steadily through forests to Dhampus in 2.5–3 hours.",
  coordinates: { lat: 28.2700, lng: 83.8800 },
  basePrice: 3000,
};

const gosaikunda: Spot = {
  id: "gosaikunda",
  name: "Gosaikunda",
  province: "Bagmati",
  region: "Langtang National Park, Rasuwa",
  description:
    "A sacred cluster of glacial lakes at 4,380 m in Langtang National Park, Gosaikunda has been venerated by Hindu and Buddhist pilgrims for millennia. For trekkers, Gosaikunda offers a stunning off-the-beaten-path route that connects to the Langtang Valley and the Helambu circuit, making it one of Nepal's most versatile multi-day adventures.",
  activities: [
    "Gosaikunda lake pilgrimage and trekking (4–5 days from Dhunche)",
    "Janai Purnima festival pilgrimage (August full moon)",
    "Cross-country trail to Langtang Valley and Helambu",
    "High-altitude sunrise photography at the sacred lakes",
    "Langtang National Park wildlife tracking",
    "Yoga and meditation by the lakeshore",
    "Crossing the Laurebina Pass (4,610 m)",
  ],
  wildlife: [
    "Snow leopard (Langtang park zone)",
    "Red panda",
    "Himalayan tahr",
    "Blue sheep (bharal)",
    "Himalayan monal pheasant",
    "Yellow-billed blue magpie",
  ],
  placeholderImage: "https://images.unsplash.com/photo-1513614835783-51537729c8ba?w=800&q=80",
  highlights: [
    "Sacred glacial lakes at 4,380 m",
    "Janai Purnima festival — one of Nepal's largest pilgrimages",
    "Laurebina Pass (4,610 m) crossing",
    "Langtang National Park wilderness",
    "Connection route: Langtang Valley to Helambu circuit",
    "Lord Shiva legend and ancient pilgrimage history",
  ],
  bestTimeToVisit: "March – May and September – November; August for Janai Purnima festival",
  category: "pilgrimage",
  elevation: "4,380 m (14,370 ft)",
  travelTips: [
    "Acclimatise in Dhunche or Syabrubesi for at least one night before pushing to the lakes",
    "The Laurebina Pass route to Helambu is a superb alternative descent — arrange permits in advance",
    "August visits during Janai Purnima are magical but very crowded — book lodges weeks ahead",
    "Above 4,000 m temperatures drop below −10 °C at night even in summer — carry a 4-season sleeping bag",
    "Langtang National Park entry permit + TIMS card required; buy both in Kathmandu or Dhunche",
  ],
  gettingThere: "Take a tourist bus or jeep from Kathmandu to Dhunche (7–8 hours, ~130 km via Trishuli). The trail from Dhunche to Gosaikunda takes 2 days of trekking through Langtang National Park.",
  coordinates: { lat: 28.0858, lng: 85.4167 },
  basePrice: 5000,
};

// ── Heritage ──────────────────────────────────────────────────────

const kathmandu: Spot = {
  id: "kathmandu",
  name: "Kathmandu",
  province: "Bagmati",
  region: "Central Nepal",
  description:
    "Nepal's capital and cultural heart, Kathmandu is a vibrant city where ancient temples and medieval squares stand alongside a thriving modern urban life. The Kathmandu Valley holds seven UNESCO World Heritage Sites, making it one of the densest concentrations of world heritage on the planet.",
  activities: [
    "Temple & stupa tours (Pashupatinath, Boudhanath)",
    "Durbar Square heritage walks",
    "Mountain flights over the Himalayas",
    "Thamel bazaar shopping",
    "Traditional thangka painting classes",
    "Cooking classes — authentic Newari cuisine",
    "Day hike to Nagarjuna forest",
  ],
  wildlife: [
    "Rhesus macaque monkeys (Swayambhunath)",
    "Black kites and Egyptian vultures",
    "House sparrows and common mynas",
    "Spotted owlets",
    "Monitor lizards (Bagmati riverbanks)",
  ],
  placeholderImage: "https://images.unsplash.com/photo-1592285896110-8d88b5b3a5d8?w=800&q=80",
  highlights: ["Pashupatinath Temple", "Boudhanath Stupa", "Swayambhunath (Monkey Temple)", "Durbar Square", "Thamel district", "Garden of Dreams"],
  bestTimeToVisit: "October – November and March – April",
  category: "heritage",
  elevation: "1,400 m (4,600 ft)",
  travelTips: [
    "Carry cash — many smaller temples and shops don't accept cards",
    "Hire a licensed guide for Durbar Square to avoid unofficial touts",
    "Avoid Pashupatinath during cremation hours if you are sensitive",
    "Traffic is heavy — allow extra time between sights",
    "Respect dress codes: cover shoulders and knees at temples",
  ],
  gettingThere: "Tribhuvan International Airport (KTM) is the main entry point, with direct flights from major Asian hubs. From the airport, taxis and ride apps reach the city centre in 20–40 minutes.",
  coordinates: { lat: 27.7172, lng: 85.324 },
  basePrice: 3500,
};

const bhaktapur: Spot = {
  id: "bhaktapur",
  name: "Bhaktapur",
  province: "Bagmati",
  region: "Kathmandu Valley, Central Nepal",
  description:
    "Often called the 'City of Devotees', Bhaktapur is the best-preserved medieval city in Nepal and a UNESCO World Heritage Site. Its magnificent Durbar Square, five-storey pagoda temples, traditional pottery squares, and narrow brick-paved alleys offer an immersive step back into 15th-century Newari civilisation.",
  activities: [
    "Durbar Square and Nyatapola Temple exploration",
    "Traditional pottery making at Pottery Square",
    "Tasting juju dhau — the famous Bhaktapur king yogurt",
    "Sunrise walk through the old town alleys",
    "Bisket Jatra festival (Nepali New Year, April)",
    "Woodcarving and thangka workshop visits",
    "Siddha Pokhari pond evening walk",
  ],
  wildlife: [
    "Rhesus macaque monkeys (temple courtyards)",
    "Common kestrel and house sparrows",
    "Black kites soaring above the city",
    "Indian flying fox bats (evenings near Dattatreya Square)",
  ],
  placeholderImage: "https://images.unsplash.com/photo-1679578064614-ba0ad375c143?w=800&q=80",
  highlights: ["Nyatapola Temple (5-storey pagoda)", "Bhaktapur Durbar Square", "55-Window Palace", "Pottery Square", "Taumadhi Square", "Dattatreya Square"],
  bestTimeToVisit: "October – April",
  category: "heritage",
  elevation: "1,401 m (4,596 ft)",
  travelTips: [
    "Entry fee: NPR 1,800 for foreign visitors — keep the ticket for multiple days",
    "Arrive early morning before day-trip crowds from Kathmandu",
    "Try juju dhau (king curd) served in clay pots — a local speciality",
    "The town is best explored on foot — no vehicles in the old quarter",
    "Many guesthouses inside the old city offer rooftop views of the pagodas",
  ],
  gettingThere: "From Kathmandu, take a local bus or microbus from Bag Bazaar (40–50 minutes) or a taxi (30 minutes). Bhaktapur is 13 km east of Kathmandu city centre.",
  coordinates: { lat: 27.6710, lng: 85.4298 },
  basePrice: 3200,
};

const bandipur: Spot = {
  id: "bandipur",
  name: "Bandipur",
  province: "Gandaki",
  region: "Central-West Nepal",
  description:
    "Perched on a ridge at 1,030 m, Bandipur is a beautifully preserved Newari hilltop bazaar town with sweeping views of the Himalayan ranges including Annapurna, Lamjung, and Manaslu. Its traffic-free cobblestone main street, traditional architecture, and peaceful atmosphere make it one of Nepal's most charming off-the-beaten-path destinations.",
  activities: [
    "Sunrise viewpoint walk to Tundikhel for Himalayan panoramas",
    "Exploring the traffic-free Newari bazaar street",
    "Siddha Cave exploration (one of Nepal's largest caves)",
    "Village trekking to Ramkot and Gurungche Hill",
    "Cultural walk through traditional Newari homes",
    "Birdwatching in the surrounding forests",
    "Paragliding with views of Annapurna and Manaslu",
  ],
  wildlife: [
    "Common leopard (forest outskirts)",
    "Rhesus macaque monkeys",
    "Various Himalayan bird species",
    "Indian giant squirrel",
    "Civets and small cats",
  ],
  placeholderImage: "https://images.unsplash.com/photo-1586500036706-41963de24d8b?w=800&q=80",
  highlights: ["Himalayan panorama from Tundikhel", "Traffic-free Newari bazaar", "Siddha Cave", "Bindabasini Temple", "Gurungche Hill viewpoint", "Traditional Newari architecture"],
  bestTimeToVisit: "October – May",
  category: "hill",
  elevation: "1,030 m (3,379 ft)",
  travelTips: [
    "No vehicles are allowed on the main bazaar street — enjoy the quiet",
    "Stay overnight to see the Himalayas at sunrise — day trips miss the best light",
    "Siddha Cave requires a torch and takes about 45 minutes to explore",
    "The town has excellent boutique guesthouses with mountain views",
    "Very few ATMs — bring enough cash from Dumre or Pokhara",
  ],
  gettingThere: "From Kathmandu or Pokhara, travel along the Prithvi Highway and turn off at Dumre. From Dumre, local buses and taxis climb the 8 km hill road to Bandipur in 20–30 minutes.",
  coordinates: { lat: 27.9333, lng: 84.4167 },
  basePrice: 3500,
};

// ── Nature ────────────────────────────────────────────────────────

const kanyam: Spot = {
  id: "kanyam",
  name: "Kanyam",
  province: "Koshi (Province No. 1)",
  region: "Eastern Nepal",
  description:
    "Perched at around 1,340 m in the Ilam district, Kanyam is a serene hill resort famous for its sweeping tea plantations, fresh mountain air, and misty views of the Himalayan foothills. A beloved weekend retreat for eastern Nepal, it offers immersive nature walks, silence, and the simple pleasure of watching tea pickers move through the emerald hills.",
  activities: [
    "Peaceful walks through tea plantation rows",
    "Tinjure Milke Jaljale rhododendron trail",
    "Birdwatching (over 300 species recorded)",
    "Photography of morning mist over tea fields",
    "Fresh-brew tea tasting at local estates",
    "Cycling through village trails",
    "Camping under a clear high-altitude sky",
  ],
  wildlife: [
    "Red panda (nearby forested areas)",
    "Wild boar",
    "Barking deer",
    "Grey-headed fish eagle",
    "Spiny babbler (Nepal's only endemic bird)",
    "Verditer flycatcher",
    "Himalayan bulbul",
  ],
  placeholderImage: "https://images.unsplash.com/photo-1546954552-eb2ada4a3654?w=800&q=80",
  highlights: ["Kanyam tea gardens", "Himalayan foothills panorama", "Tinjure Milke Jaljale trekking route", "Birding (over 300 species recorded)", "Fresh organic tea tasting", "Peaceful hill walks through plantations"],
  bestTimeToVisit: "October – April",
  category: "nature",
  elevation: "~1,340 m (4,396 ft)",
  travelTips: [
    "Visit on a weekday — weekends bring crowds from nearby towns",
    "Morning mist usually clears by 09:00, revealing the best Himalayan views",
    "Bring a light jacket even in summer — evenings are cool",
    "Local tea estates welcome walk-in visitors during harvest season",
    "Very limited accommodation — book ahead during holidays",
  ],
  gettingThere: "Take a bus or shared jeep from Ilam town to Kanyam (45 minutes). From Bhadrapur Airport in Jhapa, it is a 3-hour drive via Birtamod and Fikkal.",
  coordinates: { lat: 26.8618, lng: 87.9038 },
  basePrice: 2200,
};

const nagarkot: Spot = {
  id: "nagarkot",
  name: "Nagarkot",
  province: "Bagmati",
  region: "Kathmandu Valley, Central Nepal",
  description:
    "At 2,175 m on the eastern rim of the Kathmandu Valley, Nagarkot is Nepal's most popular Himalayan sunrise viewpoint. On a clear day, the panorama stretches from Dhaulagiri in the west to Kanchenjunga in the east — a 200 km arc that includes Everest, Lhotse, Makalu, Cho Oyu, and the Langtang range.",
  activities: [
    "Sunrise Himalayan panorama viewpoint",
    "Sunrise to Bhaktapur hiking trail (3–4 hours downhill)",
    "Cycling down to Bhaktapur or Changu Narayan",
    "Yoga and meditation retreats at hilltop resorts",
    "Village walk to Telkot and Changu Narayan temple",
    "Photography of cloud inversions over the Kathmandu Valley",
  ],
  wildlife: [
    "Himalayan griffon vultures soaring on thermals",
    "Various Himalayan bird species",
    "Rhesus macaque monkeys",
    "Barking deer in the forest trails",
  ],
  placeholderImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
  highlights: ["360° Himalayan sunrise panorama", "Views of Mount Everest on clear days", "Hiking trail to Bhaktapur", "Changu Narayan temple (UNESCO)", "Cloud inversions over Kathmandu Valley", "Peaceful hilltop resorts"],
  bestTimeToVisit: "October – December and February – April (clearest skies)",
  category: "mountain",
  elevation: "2,175 m (7,136 ft)",
  travelTips: [
    "Check weather forecasts — cloud cover ruins the sunrise view",
    "October and November offer the clearest Himalayan views",
    "Stay at a tower-room resort for unobstructed 360° views",
    "The hike down to Bhaktapur takes 3–4 hours and is easy to navigate",
    "Bring warm clothes — it is significantly colder than Kathmandu at night",
  ],
  gettingThere: "From Kathmandu, take a taxi or local bus from Bhaktapur to Nagarkot (32 km, 1.5 hours). Many Kathmandu hotels arrange day-trip and overnight packages.",
  coordinates: { lat: 27.7167, lng: 85.5167 },
  basePrice: 4000,
};

// ── Pilgrimage ────────────────────────────────────────────────────

const lumbini: Spot = {
  id: "lumbini",
  name: "Lumbini",
  province: "Lumbini",
  region: "Southern Nepal (Terai)",
  description:
    "The birthplace of Siddhartha Gautama — the Buddha — Lumbini is one of the holiest pilgrimage sites in the world. The UNESCO-listed sacred garden contains the Maya Devi Temple, the ancient Ashokan Pillar, and a sacred pond, drawing Buddhist pilgrims from across the globe.",
  activities: [
    "Pilgrimage & meditation at Maya Devi Temple",
    "Cycling through the monastic zone",
    "Visiting international monasteries",
    "Guided heritage walks",
    "Sunrise reflection at Mayadevi Pond",
    "Attending Buddhist prayer ceremonies",
    "Museum visits at Lumbini Museum",
  ],
  wildlife: [
    "Peacocks (common in the sacred garden)",
    "Spotted deer (chital)",
    "Grey langur monkeys",
    "Painted storks and open-bill storks",
    "Indian roller birds",
    "Monitor lizards",
    "Python (rarely spotted in forested edges)",
  ],
  placeholderImage: "https://images.unsplash.com/photo-1609168494389-230528e6a9c3?w=800&q=80",
  highlights: ["Maya Devi Temple", "Ashokan Pillar (249 BC)", "Sacred Garden", "Mayadevi Pond", "World Peace Flame", "International monastic zone"],
  bestTimeToVisit: "October – March",
  category: "pilgrimage",
  elevation: "96 m (315 ft)",
  travelTips: [
    "Remove footwear before entering the sacred garden and temple",
    "Dress modestly — white or neutral clothing is respectful",
    "Rent a bicycle inside the complex — it covers a large area",
    "Visit the Maya Devi Temple early morning to avoid crowds",
    "The Lumbini Development Trust manages entry — buy tickets at the gate",
  ],
  gettingThere: "Fly to Bhairahawa Airport (BWA), 22 km from Lumbini, with daily flights from Kathmandu (30 min). From Bhairahawa, take a taxi or rickshaw directly to the sacred garden.",
  coordinates: { lat: 27.4833, lng: 83.2765 },
  basePrice: 2500,
};

const janakpur: Spot = {
  id: "janakpur",
  name: "Janakpur",
  province: "Madhesh",
  region: "Southern Nepal (Terai)",
  description:
    "The spiritual capital of the Madhesh region and the legendary birthplace of Sita, Janakpur is one of Nepal's most important Hindu pilgrimage cities. Its magnificent Janaki Mandir — a gleaming white temple in Indo-Mughal style — draws hundreds of thousands of devotees each year. The city is also the living centre of the Mithila art tradition, famous for its intricate folk paintings.",
  activities: [
    "Pilgrimage to Janaki Mandir temple",
    "Mithila art workshop and gallery visits",
    "Attending the Ram Vivah Panchami festival (November)",
    "Cycling around the sacred ponds (kunds)",
    "Exploring the old city bazaars",
    "Train ride on the Janakpur Railway (heritage steam train)",
    "Maithili cultural performance visits",
  ],
  wildlife: [
    "Indian pond herons and egrets (sacred ponds)",
    "Purple sunbirds and bee-eaters",
    "Common kingfisher",
    "Indian roller birds",
    "Spotted deer in outskirts",
  ],
  placeholderImage: "https://images.unsplash.com/photo-1575861580700-f3e4a8c35e11?w=800&q=80",
  highlights: ["Janaki Mandir (Sita's birthplace)", "Mithila folk art paintings", "Ram Sagar and other sacred ponds", "Ram Vivah Panchami festival", "Janakpur Railway heritage train", "Traditional Maithili culture"],
  bestTimeToVisit: "October – March",
  category: "pilgrimage",
  elevation: "70 m (230 ft)",
  travelTips: [
    "Visit during Ram Vivah Panchami (Nov) for the most spectacular festival atmosphere",
    "Dress modestly and respectfully inside all temple premises",
    "Buy authentic Mithila paintings directly from women artists' cooperatives",
    "The sacred ponds are peaceful at sunrise — visit before the crowds arrive",
    "The heritage Janakpur Railway runs to the Indian border — a unique ride",
  ],
  gettingThere: "Fly from Kathmandu to Janakpur Airport (JKR) — 45 minutes with daily Tara Air and Shree Air flights. Overnight buses from Kathmandu take 8–9 hours via the East–West Highway.",
  coordinates: { lat: 26.7288, lng: 85.9280 },
  basePrice: 2500,
};

// ── Category groups (the new primary structure) ───────────────────

export const categoryGroups: CategoryGroup[] = [
  {
    id: "agriculture",
    name: "Agriculture & Local Produce",
    emoji: "🌾",
    description:
      "Discover Nepal's extraordinary agricultural heritage — from cliff-harvested mad honey to the finest Himalayan tea estates and the world's most valuable wild fungus.",
    spots: [ilam, lamjung, dolpa],
  },
  {
    id: "adventure",
    name: "Adventure & Thrills",
    emoji: "🧗",
    description:
      "Nepal's terrain is a natural adventure playground. Paraglide over Annapurna, ski at altitude, go on jeep safaris through ancient desert kingdoms, or spot rhinos in the jungle.",
    spots: [pokhara, mustang, chitwan, kalinchowk],
  },
  {
    id: "trekking",
    name: "Trekking & High Passes",
    emoji: "🥾",
    description:
      "Some of the world's greatest trekking routes pass through Nepal. Acclimatise in Manang, pilgrimage to Gosaikunda, or venture deep into the hidden Tsum Valley.",
    spots: [manang, raraLake, tsumValley, dhampus, gosaikunda],
  },
  {
    id: "heritage",
    name: "Heritage & Culture",
    emoji: "🏛️",
    description:
      "Nepal's heritage cities hold UNESCO-listed squares, living medieval architecture, and Newari traditions stretching back centuries.",
    spots: [kathmandu, bhaktapur, bandipur],
  },
  {
    id: "nature",
    name: "Nature & Scenic",
    emoji: "🌿",
    description:
      "From misty tea-garden panoramas to the greatest Himalayan sunrise views, Nepal's nature destinations offer extraordinary beauty without the crowds.",
    spots: [kanyam, nagarkot],
  },
  {
    id: "pilgrimage",
    name: "Pilgrimage",
    emoji: "🛕",
    description:
      "Walk in the footsteps of millions of devotees. Nepal holds the birthplace of Buddha and some of Hinduism's most sacred shrines.",
    spots: [lumbini, janakpur],
  },
];

// ── Backward-compatible flat array ───────────────────────────────
// All existing components (SearchableGrid, detail pages, passport, sitemap,
// API routes) continue to import and use `destinations` unchanged.
export const destinations: Destination[] = categoryGroups.flatMap((g) => g.spots);

// ── Helpers ───────────────────────────────────────────────────────

export const getCategoryLabel = (category: Destination["category"]): string => {
  const labels: Record<Destination["category"], string> = {
    mountain:    "Mountain & Trekking",
    heritage:    "Heritage & Culture",
    nature:      "Nature & Scenic",
    pilgrimage:  "Pilgrimage",
    hill:        "Hill Station",
    agriculture: "Agriculture & Produce",
  };
  return labels[category];
};
