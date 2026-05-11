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
  story:       string;        // "Why we celebrate" deep-story paragraph
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
    story:       "Shivaratri marks the great night when Lord Shiva performed the Tandava — his cosmic dance of creation and destruction. Devotees fast through the day and keep vigil all night at Pashupatinath temple, offering bilva leaves and chanting mantras, believing that a single night of devotion can absolve a lifetime of sins and grant liberation. Sadhus from across South Asia gather here, their bodies ash-smeared, turning the Bagmati ghats into a living tableau of ancient asceticism.",
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
    story:       "Holi is rooted in the legend of Prahlad — a devoted boy who survived a fire his demoness aunt Holika had set to destroy him. The bonfire lit the night before (Holika Dahan) re-enacts her defeat, while the explosion of colour powder the next morning celebrates spring's arrival and the victory of devotion over ego. On this day, caste, age, and social rank dissolve in a joyful wash of pigment and music.",
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
    story:       "Bisket Jatra marks the Nepali New Year with a fierce tug-of-war as the two halves of Bhaktapur battle to pull a towering chariot through the medieval streets. The new year officially begins when a 25-metre bamboo pole — hung with long cloth serpents — is toppled, symbolising the destruction of demon serpents that once terrorised the city and ensuring prosperity for the year ahead.",
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
    story:       "This full-moon day uniquely commemorates all three defining moments of Siddhartha Gautama's life — his birth, his enlightenment, and his passing — each believed to have occurred on the same lunar date. Pilgrims circle the Mayadevi Temple in his birthplace of Lumbini and the great Boudhanath stupa under seas of butter lamps, pausing to reflect on impermanence and compassion.",
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
    story:       "Run since 1987 as a tribute to the Sherpa communities who make every Himalayan expedition possible, this race follows the ancient porter route from Base Camp down to Namche Bazaar. Finishing is less about speed than about surviving altitude, bitter cold, and the sheer awe of competing in the shadow of the world's highest peak — a reminder that the mountain gives, and the mountain takes.",
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
    story:       "Teej is Nepal's great women's festival — married women fast for the long life of their husbands while unmarried women pray for good matches, both honouring the goddess Parvati who herself fasted for 107 years to win the love of Lord Shiva. The fast is a profound act of devotion; the red sarees, communal songs, and all-night dancing that follow are a celebration of feminine power and solidarity.",
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
    story:       "Indra Jatra honours the rain god Indra and gives communal thanks for the monsoon harvest that sustains the valley. For eight days, the living goddess Kumari — a young girl venerated as the earthly form of Taleju Bhavani — rides a chariot through Kathmandu's ancient streets; the inaugural blessing is traditionally bestowed upon Nepal's President, connecting divine authority to civic life.",
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
    story:       "Dashain commemorates the goddess Durga's fifteen-day battle against the buffalo demon Mahishasura — a cosmic victory of righteousness that Nepalis re-enact each autumn with offerings, sacrifice, and devotion. The centrepiece is the tikka blessing: elders press vermillion paste mixed with yoghurt and rice onto the foreheads of every younger family member as a benediction of long life and prosperity, uniting the entire nation in a single act of intergenerational love.",
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
    story:       "Founded in 2005 to bridge cultures through music, Jazzmandu has grown into Asia's highest-altitude jazz festival. Concerts unfold in temple courtyards and open-air stages across Kathmandu, blending Himalayan rhythms with global jazz improvisation under skies still clear from the retreating monsoon — a reminder that Nepal's openness to the world is one of its greatest qualities.",
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
    story:       "Tihar venerates the animals believed to be messengers of Yama, the god of death — crows on Day 1, dogs on Day 2, cows on Day 3 — honouring them with garlands and sweets in hopes of warding off untimely death. The festival culminates with Laxmi Puja on the fourth night, when every home blazes with oil lamps and intricate rangoli to guide the goddess of wealth across the threshold and into the household.",
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
    story:       "Created to channel tourism income directly into remote mountain communities, this race funds local schools and trail maintenance through its entry fees. Runners cross 5,000-metre passes, traverse rhododendron forests, and trace paths that Gurung and Magar herders have walked for centuries — a celebration of the Himalayan landscape that honours the people who have always been its true custodians.",
    accent:      "#059669",
    emoji:       "🏃",
    img:         U("photo-1527856263669-12c3a0af2aa6"),
    category:    "adventure",
  },
];
