// SuccessModal is kept as a legacy/fallback component.
// The primary ending is now handled by LoveFinaleScreen in App.jsx.
export default function SuccessModal({ onConfirm, letterContent = '', letterSign = '' }) {
  return (
    <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Particle burst */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-gold-400 opacity-0"
            style={{
              left: `${30 + Math.random() * 40}%`,
              top: `${20 + Math.random() * 60}%`,
              animation: `particle-float ${0.8 + Math.random()}s ${Math.random() * 0.5}s ease-out forwards`,
              '--tx': `${(Math.random() - 0.5) * 120}px`,
              '--ty': `${-(40 + Math.random() * 80)}px`,
            }}
          />
        ))}
      </div>

      <div
        className="success-modal relative w-full max-w-lg rounded-lg overflow-hidden"
        style={{
          border: '1px solid rgba(163,123,16,0.5)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.7), 0 0 60px rgba(245,197,24,0.12)',
        }}
      >
        {['tl', 'tr', 'bl', 'br'].map((pos) => (
          <div key={pos} className={`corner-ornament corner-${pos}`} />
        ))}

        <div className="flex justify-center pt-6 pb-2">
          <div className="relative">
            <span className="text-3xl animate-glow-rotate">✨</span>
            <span className="absolute -top-1 -right-4 text-lg text-gold-400 animate-twinkle" style={{ animationDelay: '0.5s' }}>✦</span>
            <span className="absolute -top-1 -left-4 text-lg text-gold-400 animate-twinkle" style={{ animationDelay: '1s' }}>✦</span>
          </div>
        </div>

        <div className="relative z-10 px-10 pb-10 pt-2 flex flex-col items-center gap-5">
          <div className="text-center">
            <h2 className="font-cinzel text-lg md:text-xl font-bold tracking-[0.2em] text-amber-900 uppercase leading-tight">
              Actualización v2.0<br />Completada
            </h2>
            <div className="gold-divider w-48 mx-auto mt-3" />
          </div>

          {letterContent && (
            <div className="text-left w-full">
              <p className="font-cormorant text-base text-amber-900 italic leading-relaxed tracking-wide"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {letterContent.split('\n\n').map((para, i) => (
                  <span key={i}>{i > 0 && <><br /><br /></>}{para}</span>
                ))}
              </p>
            </div>
          )}

          {letterSign && (
            <div className="w-full">
              <div className="gold-divider w-32 mx-auto mb-3" />
              <p className="text-center font-cormorant text-base font-semibold text-amber-800 italic tracking-widest"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {letterSign}
              </p>
            </div>
          )}

          <button onClick={onConfirm} className="yes-btn w-full max-w-xs py-4 rounded text-sm font-bold tracking-[0.3em] mt-2">
            ✦ Sí ✦
          </button>
        </div>
      </div>
    </div>
  );
}
