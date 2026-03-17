export default function ArtifactGrid({ artifacts, unlockedIds, currentId }) {
  return (
    <section className="relative z-10 py-6 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Section label */}
        <p className="font-cinzel text-xs tracking-[0.3em] text-gold-600/70 uppercase text-center mb-6">
          ✦ Reliquias del Alma ✦
        </p>

        {/* Grid */}
        <div className="flex flex-wrap justify-center gap-5">
          {artifacts.map((artifact, idx) => {
            const isUnlocked = unlockedIds.includes(artifact.id);
            const isCurrent = artifact.id === currentId;

            return (
              <ArtifactSlot
                key={artifact.id}
                artifact={artifact}
                isUnlocked={isUnlocked}
                isCurrent={isCurrent}
                index={idx}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ArtifactSlot({ artifact, isUnlocked, isCurrent, index }) {
  return (
    <div className="flex flex-col items-center gap-2 group">
      {/* Circle */}
      <div
        className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${
          isUnlocked
            ? 'artifact-slot unlocked'
            : isCurrent
            ? 'artifact-slot ring-2 ring-gold-400/60 animate-pulse-gold'
            : 'artifact-slot locked'
        }`}
        style={{
          background: isUnlocked
            ? `radial-gradient(circle at 35% 35%, ${hexBright(artifact.color)}, ${artifact.color})`
            : isCurrent
            ? 'radial-gradient(circle at 35% 35%, rgba(163,123,16,0.4), rgba(60,40,0,0.6))'
            : 'radial-gradient(circle at 35% 35%, rgba(30,30,50,0.8), rgba(15,15,30,0.9))',
          border: isUnlocked
            ? `2px solid ${artifact.color}`
            : isCurrent
            ? '2px solid rgba(245,197,24,0.5)'
            : '1px solid rgba(100,100,150,0.3)',
          boxShadow: isUnlocked
            ? `0 0 20px ${artifact.glowColor}, 0 0 40px ${artifact.glowColor}44`
            : isCurrent
            ? '0 0 15px rgba(245,197,24,0.3)'
            : 'none',
        }}
      >
        {/* Emoji icon */}
        <span
          className={`text-2xl select-none transition-all duration-500 ${
            isUnlocked ? '' : isCurrent ? 'opacity-70' : 'opacity-20'
          }`}
          style={{ filter: isUnlocked ? 'drop-shadow(0 0 6px rgba(255,255,255,0.4))' : 'none' }}
        >
          {isUnlocked ? artifact.emoji : isCurrent ? artifact.emoji : artifact.symbol}
        </span>

        {/* Lock icon for locked items */}
        {!isUnlocked && !isCurrent && (
          <span className="absolute bottom-1 right-1 text-[9px] text-navy-600 opacity-60">🔒</span>
        )}

        {/* Unlock sparkle ring */}
        {isUnlocked && (
          <div
            className="absolute inset-0 rounded-full border opacity-40 animate-ping"
            style={{ borderColor: artifact.color, animationDuration: '2s' }}
          />
        )}
      </div>

      {/* Label */}
      <span
        className={`font-cinzel text-[10px] tracking-widest uppercase transition-all duration-500 ${
          isUnlocked
            ? 'text-gold-400'
            : isCurrent
            ? 'text-gold-600/80'
            : 'text-navy-600/60'
        }`}
      >
        {artifact.name.split(' ').pop()}
      </span>
    </div>
  );
}

// Simple color brightener
function hexBright(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${Math.min(255, r + 80)}, ${Math.min(255, g + 80)}, ${Math.min(255, b + 80)})`;
}
