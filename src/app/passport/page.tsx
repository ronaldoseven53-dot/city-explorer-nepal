import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { destinations } from "@/data/destinations";
import Navbar from "@/components/Navbar";
import PassportActions from "@/components/PassportActions";

export const dynamic = "force-dynamic";
export const metadata = { title: "My Passport — City Explorer Nepal" };

export default async function PassportPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: rows } = await supabase
    .from("favorites")
    .select("destination_id")
    .eq("user_id", user.id);

  const savedIds = new Set((rows ?? []).map((r: { destination_id: string }) => r.destination_id));
  const saved = destinations.filter((d) => savedIds.has(d.id));

  const categoryColors: Record<string, string> = {
    mountain: "bg-blue-600", heritage: "bg-amber-600",
    nature: "bg-green-600",  pilgrimage: "bg-purple-600", hill: "bg-teal-600",
  };

  return (
    <>
      <Navbar />
      <div className="pt-16 min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-900 via-red-950 to-slate-900 py-16 px-4 text-center">
          <p className="text-5xl mb-3">🛂</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">My Passport</h1>
          <p className="text-white/50 text-sm">{user.email}</p>
          <p className="text-white/40 text-xs mt-1">{saved.length} destination{saved.length !== 1 ? "s" : ""} saved</p>
        </div>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          {saved.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-5xl mb-4">🗺️</p>
              <p className="text-gray-700 font-semibold text-lg">No destinations saved yet</p>
              <p className="text-gray-400 text-sm mt-2 mb-6">Hit the ❤️ button on any destination to save it here</p>
              <Link href="/" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl transition-colors">
                Browse Destinations →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {saved.map((d) => (
                <div key={d.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition-all">
                  <div className="relative h-44">
                    <Image
                      src={d.placeholderImage}
                      alt={d.name}
                      fill
                      sizes="(max-width:640px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className={`absolute top-3 right-3 ${categoryColors[d.category]} text-white text-xs font-semibold px-2.5 py-1 rounded-full`}>
                      {d.category}
                    </span>
                    <PassportActions userId={user.id} destinationId={d.id} saved />
                  </div>
                  <div className="p-4">
                    <h2 className="font-bold text-gray-900 text-lg leading-tight">{d.name}</h2>
                    <p className="text-gray-400 text-xs mt-0.5">{d.province} Province{d.elevation && ` · ${d.elevation}`}</p>
                    <p className="text-gray-500 text-sm mt-2 line-clamp-2">{d.description}</p>
                    <Link
                      href={`/destinations/${d.id}`}
                      className="mt-3 inline-flex items-center text-xs font-semibold text-red-600 hover:text-red-800"
                    >
                      View full page →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
