export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏔️</span>
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-lg text-gray-900">City Explorer</span>
              <span className="font-bold text-lg text-red-700">Nepal</span>
            </div>
          </div>
          <p className="hidden sm:block text-sm text-gray-400 italic">
            Discover the Himalayan Kingdom
          </p>
        </div>
      </div>
    </nav>
  );
}
