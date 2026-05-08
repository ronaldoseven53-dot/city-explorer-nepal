const OWM_KEY = process.env.OPENWEATHER_API_KEY;

const CITY_COORDS: Record<string, { lat: number; lon: number }> = {
  kathmandu: { lat: 27.7172, lon: 85.324  },
  pokhara:   { lat: 28.2096, lon: 83.9856 },
  chitwan:   { lat: 27.6833, lon: 84.4333 },
  lumbini:   { lat: 27.4833, lon: 83.2833 },
  namche:    { lat: 27.8069, lon: 86.7139 },
};

const SKY_LABEL: Record<string, string> = {
  Clear:        "Clear Skies",
  Clouds:       "Overcast",
  Rain:         "Rain Showers",
  Drizzle:      "Light Drizzle",
  Thunderstorm: "Stormy",
  Snow:         "Snowfall",
  Mist:         "Misty",
  Fog:          "Foggy",
  Haze:         "Hazy Skies",
  Smoke:        "Smoky Haze",
  Dust:         "Dusty",
  Sand:         "Sandstorm",
  Squall:       "Gusty Squalls",
};

function resolveIcon(id: number): string {
  if (id === 800)             return "sun";
  if (id >= 801 && id <= 802) return "partly-cloudy";
  if (id >= 803 && id <= 804) return "hazy";
  if (id >= 700 && id <= 799) return "hazy";   // mist / fog / haze
  if (id >= 600 && id <= 699) return "snow";
  if (id >= 200 && id <= 599) return "rain";   // drizzle / rain / thunderstorm
  return "sun";
}

function resolveVisibility(meters: number): { label: string; score: number } {
  if (meters >= 10_000) return { label: "Excellent", score: 1.00 };
  if (meters >=  5_000) return { label: "Good",      score: 0.70 };
  return { label: "Poor", score: Math.max(meters / 10_000, 0.15) };
}

function titleCase(s: string) {
  return s.replace(/\b\w/g, c => c.toUpperCase());
}

export async function GET(request: Request) {
  const cityId = new URL(request.url).searchParams.get("city") ?? "kathmandu";
  const coords  = CITY_COORDS[cityId];

  if (!coords) {
    return Response.json({ error: "Unknown city" }, { status: 400 });
  }

  if (!OWM_KEY || OWM_KEY === "your_api_key_here") {
    return Response.json({ error: "API key not configured" }, { status: 503 });
  }

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather` +
      `?lat=${coords.lat}&lon=${coords.lon}&appid=${OWM_KEY}&units=metric`,
      { next: { revalidate: 600 } }, // cache 10 min per city per deployment
    );

    if (!res.ok) throw new Error(`OWM responded ${res.status}`);

    const d = await res.json();

    const weatherId  = (d.weather?.[0]?.id   as number) ?? 800;
    const visMeters  = (d.visibility          as number) ?? 10_000;
    const { label: visibilityLabel, score: visibilityScore } = resolveVisibility(visMeters);

    return Response.json({
      temp:          Math.round(d.main.temp as number),
      condition:     titleCase((d.weather?.[0]?.description as string) ?? "Clear"),
      icon:          resolveIcon(weatherId),
      visibilityLabel,
      visibilityScore,
      skyCondition:  SKY_LABEL[d.weather?.[0]?.main as string] ?? "Clear Skies",
    });
  } catch {
    return Response.json({ error: "Failed to fetch weather data" }, { status: 502 });
  }
}
