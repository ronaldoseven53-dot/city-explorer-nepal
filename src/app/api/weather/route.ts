import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!lat || !lng) {
    return NextResponse.json({ error: "Missing coordinates" }, { status: 400 });
  }

  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 503 });
  }

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`,
      { next: { revalidate: 1800 } } // cache 30 min — weather doesn't change by the second
    );

    if (!res.ok) {
      return NextResponse.json({ error: "Weather API error" }, { status: res.status });
    }

    const data = await res.json();

    return NextResponse.json({
      temp:        Math.round(data.main.temp),
      feels_like:  Math.round(data.main.feels_like),
      description: data.weather[0].description as string,
      icon:        data.weather[0].icon as string,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch weather" }, { status: 500 });
  }
}
