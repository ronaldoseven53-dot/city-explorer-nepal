"use client";

export default function ShareButton({ name }: { name: string }) {
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: `${name} — City Explorer Nepal`, url });
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <button
      onClick={handleShare}
      title="Share this destination"
      className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
    >
      <span>↗</span> Share
    </button>
  );
}
