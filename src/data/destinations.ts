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
  category: "mountain" | "heritage" | "nature" | "pilgrimage" | "hill";
  elevation?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export const destinations: Destination[] = [
  {
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
    placeholderImage: "/images/destinations/kathmandu.jpg",
    highlights: [
      "Pashupatinath Temple",
      "Boudhanath Stupa",
      "Swayambhunath (Monkey Temple)",
      "Durbar Square",
      "Thamel district",
      "Garden of Dreams",
    ],
    bestTimeToVisit: "October – November and March – April",
    category: "heritage",
    elevation: "1,400 m (4,600 ft)",
    coordinates: { lat: 27.7172, lng: 85.324 },
  },
  {
    id: "pokhara",
    name: "Pokhara",
    province: "Gandaki",
    region: "Central-West Nepal",
    description:
      "Nestled beside the tranquil Phewa Lake with the Annapurna range as a dramatic backdrop, Pokhara is Nepal's adventure capital. It serves as the gateway to the Annapurna Circuit and offers a relaxed lakeside atmosphere loved by trekkers and tourists alike. The city perfectly balances adrenaline and serenity.",
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
    placeholderImage: "/images/destinations/pokhara.jpg",
    highlights: [
      "Phewa Lake",
      "World Peace Pagoda",
      "Sarangkot sunrise viewpoint",
      "Davis Falls",
      "Gupteswar Cave",
      "Paragliding over the Himalayas",
    ],
    bestTimeToVisit: "October – December and March – May",
    category: "mountain",
    elevation: "822 m (2,696 ft)",
    coordinates: { lat: 28.2096, lng: 83.9856 },
  },
  {
    id: "lumbini",
    name: "Lumbini",
    province: "Lumbini",
    region: "Southern Nepal (Terai)",
    description:
      "The birthplace of Siddhartha Gautama — the Buddha — Lumbini is one of the holiest pilgrimage sites in the world. The UNESCO-listed sacred garden contains the Maya Devi Temple, the ancient Ashokan Pillar, and a sacred pond, drawing Buddhist pilgrims from across the globe. The surrounding monastic zone hosts monasteries from over 30 nations.",
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
    placeholderImage: "/images/destinations/lumbini.jpg",
    highlights: [
      "Maya Devi Temple",
      "Ashokan Pillar (249 BC)",
      "Sacred Garden",
      "Mayadevi Pond",
      "World Peace Flame",
      "International monastic zone",
    ],
    bestTimeToVisit: "October – March",
    category: "pilgrimage",
    elevation: "96 m (315 ft)",
    coordinates: { lat: 27.4833, lng: 83.2765 },
  },
  {
    id: "mustang",
    name: "Mustang",
    province: "Gandaki",
    region: "Upper Mustang, North-West Nepal",
    description:
      "Hidden beyond the Annapurna and Dhaulagiri ranges, Mustang is a rain-shadow desert kingdom that preserves Tibetan culture largely untouched by modernity. Its ancient walled capital Lo Manthang, cave cities carved into canyon walls, and wind-sculpted red-cliffed landscapes make it one of the most extraordinary and remote destinations on earth.",
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
    placeholderImage: "/images/destinations/mustang.jpg",
    highlights: [
      "Lo Manthang walled city",
      "Sky caves of Chhoser",
      "Tiji Festival",
      "Kagbeni village",
      "Muktinath Temple",
      "Dramatic red-cliffed canyons",
    ],
    bestTimeToVisit: "May – October (restricted area permit required)",
    category: "mountain",
    elevation: "Lo Manthang at 3,840 m (12,598 ft)",
    coordinates: { lat: 29.1851, lng: 83.9649 },
  },
  {
    id: "manang",
    name: "Manang",
    province: "Gandaki",
    region: "Annapurna Region, North-Central Nepal",
    description:
      "A high-altitude village on the classic Annapurna Circuit trek, Manang sits at the foot of Annapurna III and Gangapurna peak. Trekkers acclimatise here before crossing Thorong La pass (5,416 m), and the village retains a strong Tibetan-influenced culture with ancient gompas, yak herders, and stone-walled homes surrounded by glaciers.",
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
    placeholderImage: "/images/destinations/manang.jpg",
    highlights: [
      "Gangapurna Lake and glacier",
      "Braga Gompa (monastery)",
      "Milarepa Cave",
      "Views of Annapurna III and Gangapurna",
      "Ice Lake day hike",
      "Traditional Gurung and Manangi culture",
    ],
    bestTimeToVisit: "September – November and March – May",
    category: "mountain",
    elevation: "3,519 m (11,545 ft)",
    coordinates: { lat: 28.6671, lng: 84.0221 },
  },
  {
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
    placeholderImage: "/images/destinations/ilam.jpg",
    highlights: [
      "Ilam tea gardens (largest in Nepal)",
      "Mai Pokhari sacred lake",
      "Sandakpur viewpoint",
      "Antu Danda sunrise point",
      "Kanchenjunga views",
      "Fikkal bazaar",
    ],
    bestTimeToVisit: "October – May",
    category: "hill",
    elevation: "1,600 m (5,249 ft)",
    coordinates: { lat: 26.9099, lng: 87.9238 },
  },
  {
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
    placeholderImage: "/images/destinations/kanyam.jpg",
    highlights: [
      "Kanyam tea gardens",
      "Himalayan foothills panorama",
      "Tinjure Milke Jaljale trekking route",
      "Birding (over 300 species recorded)",
      "Fresh organic tea tasting",
      "Peaceful hill walks through plantations",
    ],
    bestTimeToVisit: "October – April",
    category: "nature",
    elevation: "~1,340 m (4,396 ft)",
    coordinates: { lat: 26.8618, lng: 87.9038 },
  },
];

export const getCategoryLabel = (category: Destination["category"]): string => {
  const labels: Record<Destination["category"], string> = {
    mountain: "Mountain & Trekking",
    heritage: "Heritage & Culture",
    nature: "Nature & Scenic",
    pilgrimage: "Pilgrimage",
    hill: "Hill Station",
  };
  return labels[category];
};
