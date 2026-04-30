import { Link } from "wouter"

const TICKER_ITEMS = [
  "COLLECTION 001",
  "BRUTALIST ESSENTIALS",
  "NO-NAME CONCEPT",
  "FORM & FABRIC",
  "INDUSTRIAL DESIGN",
  "AESTHETIC VOID",
  "IDENTITY REMOVED",
  "MINIMALIST STRUCTURE",
]

export function Ticker() {
  return (
    <div className="relative w-full overflow-hidden bg-black border-y border-white/10 py-8">
      <div className="flex whitespace-nowrap animate-ticker pause-on-hover">
        {/* Double the items for seamless loop */}
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, index) => (
          <Link key={index} href="/shop">
            <span className="inline-block mx-12 text-6xl md:text-8xl font-bold uppercase tracking-tighter text-white/20 hover:text-white transition-colors cursor-pointer">
              {item}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
