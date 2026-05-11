// ── Festival CMS ───────────────────────────────────────────────────────
// Edit this file to add / update festivals on the website.
// dateISO      = festival start date (YYYY-MM-DD)
// endDateISO   = optional end date (multi-day festivals)
// category     = one of: religious | music | local | adventure

export type FestivalCategory = "religious" | "music" | "local" | "adventure";

export interface Festival {
  id:          string;
  name:        string;
  month:       string;        // display label shown on the card pill
  dateISO:     string;        // YYYY-MM-DD  — used for notifications & calendar links
  endDateISO?: string;        // YYYY-MM-DD  — for multi-day events
  location:    string;
  description: string;
  accent:      string;        // hex colour for tints and glows
  emoji:       string;
  img:         string;
  category:    FestivalCategory;
}

export const CATEGORY_CONFIG: Record<FestivalCategory, { label: string; color: string; emoji: string }> = {
  religious: { label: "Religious", color: "#DC2626", emoji: "🕉️" },
  music:     { label: "Music",     color: "#7C3AED", emoji: "🎵" },
  local:     { label: "Local",     color: "#D97706", emoji: "🏘️" },
  adventure: { label: "Adventure", color: "#059669", emoji: "🏔️" },
};

const U = (id: string) => `https://images.unsplash.com/${id}?w=600&q=85&fit=crop`;

export const FESTIVALS: Festival[] = [
  {
    id:          "shivaratri",
    name:        "Maha Shivaratri",
    month:       "26 Feb 2026",
    dateISO:     "2026-02-26",
    location:    "Pashupatinath, Kathmandu",
    description: "The night of Shiva — bonfires, sadhus, and the sacred Bagmati river aglow.",
    accent:      "#A855F7",
    emoji:       "🔱",
    img:         U("photo-1518548419970-58e3b4079ab2"),
    category:    "religious",
  },
  {
    id:          "holi",
    name:        "Holi",
    month:       "13 Mar 2026",
    dateISO:     "2026-03-13",
    location:    "Nationwide",
    description: "Nepal's wildest colour festival — powder, music, and spring celebration.",
    accent:      "#EC4899",
    emoji:       "🎨",
    img:         U("photo-1520637836862-4d197d17c93a"),
    category:    "local",
  },
  {
    id:          "bisket",
    name:        "Bisket Jatra",
    month:       "14 Apr 2026",
    dateISO:     "2026-04-14",
    endDateISO:  "2026-04-20",
    location:    "Bhaktapur",
    description: "New Year chariot procession — the massive pole toppling marks the year's start.",
    accent:      "#F97316",
    emoji:       "🎡",
    img:         U("photo-1513614835783-51537729c8ba"),
    category:    "local",
  },
  {
    id:          "buddha",
    name:        "Buddha Purnima",
    month:       "12 May 2026",
    dateISO:     "2026-05-12",
    location:    "Lumbini & Boudhanath",
    description: "Full-moon birthday of the Enlightened One — pilgrims, butter lamps, and sutras.",
    accent:      "#F59E0B",
    emoji:       "☸️",
    img:         U("photo-1609168494389-230528e6a9c3"),
    category:    "religious",
  },
  {
    id:          "everest-marathon",
    name:        "Everest Marathon",
    month:       "29 May 2026",
    dateISO:     "2026-05-29",
    location:    "Everest Base Camp → Namche",
    description: "The world's highest marathon — 42 km from Base Camp (5,364 m) descending to Namche Bazaar.",
    accent:      "#059669",
    emoji:       "🏔️",
    img:         U("photo-1551632436-cbf8dd35adfa"),
    category:    "adventure",
  },
  {
    id:          "teej",
    name:        "Teej",
    month:       "22 Aug 2026",
    dateISO:     "2026-08-22",
    location:    "Pashupatinath & Temples",
    description: "Women's festival of fasting, red sarees, and devotional dancing for marital bliss.",
    accent:      "#EF4444",
    emoji:       "💃",
    img:         U("photo-1592285896110-8d88b5b3a5d8"),
    category:    "religious",
  },
  {
    id:          "indra",
    name:        "Indra Jatra",
    month:       "16 Sep 2026",
    dateISO:     "2026-09-16",
    endDateISO:  "2026-09-24",
    location:    "Kathmandu Durbar Square",
    description: "Living Goddess Kumari's chariot parade — masked dances and eight days of revelry.",
    accent:      "#0EA5E9",
    emoji:       "🏮",
    img:         U("photo-1546954552-eb2ada4a3654"),
    category:    "local",
  },
  {
    id:          "dashain",
    name:        "Dashain",
    month:       "11 Oct 2026",
    dateISO:     "2026-10-11",
    endDateISO:  "2026-10-25",
    location:    "Nationwide",
    description: "Nepal's greatest festival — 15 days of family, tikka blessings, and kite flying.",
    accent:      "#22C55E",
    emoji:       "🪁",
    img:         U("photo-1544442069-97dded965a9f"),
    category:    "religious",
  },
  {
    id:          "jazzmandu",
    name:        "Jazzmandu",
    month:       "17 Oct 2026",
    dateISO:     "2026-10-17",
    endDateISO:  "2026-10-19",
    location:    "Kathmandu",
    description: "Nepal's premier jazz festival — international and local musicians under the Himalayan sky.",
    accent:      "#7C3AED",
    emoji:       "🎷",
    img:         U("photo-1415201364774-f6f0bb35f28f"),
    category:    "music",
  },
  {
    id:          "tihar",
    name:        "Tihar",
    month:       "29 Oct 2026",
    dateISO:     "2026-10-29",
    endDateISO:  "2026-11-02",
    location:    "Nationwide",
    description: "Festival of Lights — oil lamps, rangoli, and the veneration of crows, dogs, and cows.",
    accent:      "#F59E0B",
    emoji:       "🪔",
    img:         U("photo-1558618666-fcd25c85cd64"),
    category:    "religious",
  },
  {
    id:          "annapurna-trail",
    name:        "Annapurna Trail Race",
    month:       "7 Nov 2026",
    dateISO:     "2026-11-07",
    location:    "Pokhara – Annapurna Circuit",
    description: "Ultra-trail race through Himalayan terrain — 50 km and 110 km routes for all levels.",
    accent:      "#059669",
    emoji:       "🏃",
    img:         U("photo-1527856263669-12c3a0af2aa6"),
    category:    "adventure",
  },
];
