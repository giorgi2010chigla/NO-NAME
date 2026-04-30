import { Link } from "wouter"

const COLLECTIONS = [
  { label: "TOPS", category: "tops" },
  { label: "OUTERWEAR", category: "outerwear" },
  { label: "ACCESSORIES", category: "accessories" },
  { label: "FOOTWEAR", category: "footwear" },
]

export function Ticker() {
  return (
    <div className="relative w-full overflow-hidden bg-black border-y border-white/10 py-8">
      <div className="flex whitespace-nowrap animate-ticker pause-on-hover">
        {/* Double the items for seamless loop */}
        {[...COLLECTIONS, ...COLLECTIONS, ...COLLECTIONS].map((item, index) => (
          <Link
            key={index}
            href={`/shop?category=${item.category}`}
            className="inline-block mx-12 text-6xl md:text-8xl font-bold uppercase tracking-tighter text-white/20 hover:text-white transition-colors cursor-pointer"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
