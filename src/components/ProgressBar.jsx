export default function ProgressBar({ found, total = 7 }) {
  const pct = Math.round((found / total) * 100);

  return (
    <header className="relative z-10 w-full px-4 pt-6 pb-4">
      <div className="max-w-2xl mx-auto">
        {/* Label */}
        <div className="flex items-center justify-between mb-2">
          <p className="font-cinzel text-xs tracking-[0.25em] text-gold-400 uppercase">
            Fragmentos de Alma Encontrados
          </p>
          <p className="font-cinzel text-sm font-semibold text-gold-300 tabular-nums">
            <span className="text-gold-400 text-base">{found}</span>
            <span className="text-gold-600 mx-1">/</span>
            <span>{total}</span>
          </p>
        </div>

        {/* Track */}
        <div className="relative h-2.5 rounded-full bg-navy-900 border border-gold-800/40 overflow-hidden shadow-inner">
          <div
            className="progress-fill h-full rounded-full"
            style={{ width: `${pct}%` }}
          />
          {/* Tick marks */}
          {Array.from({ length: total - 1 }).map((_, i) => (
            <div
              key={i}
              className="absolute top-0 w-px h-full bg-navy-800/60"
              style={{ left: `${((i + 1) / total) * 100}%` }}
            />
          ))}
        </div>

        {/* Stars below track matching unlocked fragments */}
        <div className="flex justify-between mt-1.5 px-[2px]">
          {Array.from({ length: total }).map((_, i) => (
            <span
              key={i}
              className={`text-[10px] transition-all duration-500 ${
                i < found ? 'text-gold-400 drop-shadow-[0_0_6px_rgba(245,197,24,0.8)]' : 'text-navy-700'
              }`}
            >
              ✦
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}
