"use client";

import { useEffect, useState } from "react";

interface WeatherData {
  temp: number;
  feels_like: number;
  description: string;
  icon: string;
}

export default function WeatherBadge({ lat, lng }: { lat: number; lng: number }) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/weather?lat=${lat}&lng=${lng}`)
      .then((r) => r.json())
      .then((d: WeatherData & { error?: string }) => {
        if (!d.error) setWeather(d);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [lat, lng]);

  if (loading) {
    return <div className="h-6 w-20 bg-gray-100 rounded-full animate-pulse" />;
  }

  if (!weather) return null;

  return (
    <div
      className="flex items-center gap-1 bg-sky-50 text-sky-700 text-xs font-medium px-2 py-0.5 rounded-full"
      title={`Feels like ${weather.feels_like}°C · ${weather.description}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://openweathermap.org/img/wn/${weather.icon}.png`}
        alt={weather.description}
        width={20}
        height={20}
        className="w-5 h-5"
      />
      <span>{weather.temp}°C</span>
    </div>
  );
}
