import Image from "next/image";

interface WeatherData {
  temp: number;
  feels_like: number;
  description: string;
  icon: string;
}

async function fetchWeather(lat: number, lng: number): Promise<WeatherData | null> {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`,
      { next: { revalidate: 1800 } } // 30-min cache — weather doesn't change by the second
    );
    if (!res.ok) return null;
    const data = await res.json();
    return {
      temp:        Math.round(data.main.temp),
      feels_like:  Math.round(data.main.feels_like),
      description: data.weather[0].description as string,
      icon:        data.weather[0].icon as string,
    };
  } catch {
    return null;
  }
}

export default async function WeatherBadgeServer({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}) {
  const weather = await fetchWeather(lat, lng);
  if (!weather) return null;

  return (
    <div
      className="flex items-center gap-1 bg-sky-50 text-sky-700 text-xs font-medium px-2 py-0.5 rounded-full"
      title={`Feels like ${weather.feels_like}°C · ${weather.description}`}
    >
      <Image
        src={`https://openweathermap.org/img/wn/${weather.icon}.png`}
        alt={weather.description}
        width={20}
        height={20}
      />
      <span>{weather.temp}°C</span>
    </div>
  );
}
