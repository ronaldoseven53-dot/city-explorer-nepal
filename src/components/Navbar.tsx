import NavPassportBadge from "@/components/NavPassportBadge";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-900/60 backdrop-blur-2xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <svg
              width="36"
              height="36"
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1e3a5f" />
                  <stop offset="100%" stopColor="#4a90c4" />
                </linearGradient>
                <linearGradient id="snowGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#dce8f5" />
                </linearGradient>
              </defs>
              <rect width="36" height="36" rx="8" fill="url(#skyGrad)" />
              <path d="M0 28 L8 16 L14 22 L20 12 L26 20 L36 28 Z" fill="#2a5f8a" opacity="0.6" />
              <path d="M6 30 L18 8 L30 30 Z" fill="#3a7abf" />
              <path d="M18 8 L13.5 18 L18 16 L22.5 18 Z" fill="url(#snowGrad)" />
              <path d="M0 30 L6 24 L12 28 L18 22 L24 27 L30 23 L36 28 L36 36 L0 36 Z" fill="#1a3050" />
            </svg>
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-lg text-white">City Explorer</span>
              <span className="font-bold text-lg text-red-400">Nepal</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <p className="hidden sm:block text-sm text-zinc-500 italic">
              Discover the Himalayan Kingdom
            </p>
            <NavPassportBadge />
          </div>
        </div>
      </div>
    </nav>
  );
}
