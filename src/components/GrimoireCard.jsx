import { useState, useEffect } from 'react';

// ─── Date validation helper ────────────────────────────────────────────────
function isValidDateFormat(value) {
  // Must match DD/MM/AAAA strictly, digits only, separators at positions 2 and 5
  return /^\d{2}\/\d{2}\/\d{4}$/.test(value);
}

// ─── Date input masking: auto-insert slashes as user types ─────────────────
function maskDate(raw) {
  // Strip everything except digits, then insert slashes
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  let result = digits;
  if (digits.length > 2) result = digits.slice(0, 2) + '/' + digits.slice(2);
  if (digits.length > 4) result = result.slice(0, 5) + '/' + result.slice(5);
  return result;
}

// Prevent non-digit keys from affecting the input (date mode)
function onDateKeyDown(e) {
  const allowed = ['Backspace','Delete','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Tab','Home','End'];
  if (allowed.includes(e.key)) return;
  // Allow only digit keys 0-9
  if (!/^\d$/.test(e.key)) e.preventDefault();
}

// ─── Main component ────────────────────────────────────────────────────────
export default function GrimoireCard({
  artifact,
  onUnlock,
  isShaking,
  errorMsg,
}) {
  const [inputValue, setInputValue] = useState('');
  const [showHint, setShowHint]     = useState(false);
  const [dateError, setDateError]   = useState('');

  // Reset state when the artifact changes
  useEffect(() => {
    setInputValue('');
    setShowHint(false);
    setDateError('');
  }, [artifact?.id]);

  if (!artifact) return null;
  const { riddle } = artifact;
  const type = riddle.type ?? 'text';

  // ── Handlers ──
  const handleTextSubmit = (e) => {
    e.preventDefault();
    setDateError('');
    if (type === 'date') {
      if (!isValidDateFormat(inputValue)) {
        setDateError('Ingresa una fecha válida en formato DD/MM/AAAA');
        return;
      }
    }
    onUnlock(inputValue.trim());
  };

  const handleDateChange = (e) => {
    const masked = maskDate(e.target.value);
    setInputValue(masked);
    setDateError('');
  };

  // ── Render by type ──────────────────────────────────────────────────────
  const renderBody = () => {
    switch (type) {

      // ── Multiple choice (Diadema) ─────────────────────────────────────
      case 'multiple-choice':
        return (
          <div className="w-full flex flex-col items-center gap-4">
            <p className="font-cormorant text-sm text-amber-700 italic text-center">
              — Todas las respuestas revelan un fragmento de tu alma —
            </p>
            <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
              {riddle.options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => onUnlock(opt)}
                  className="unlock-btn py-4 px-3 rounded text-xs font-semibold tracking-widest text-center"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );

      // ── Button only (Serpiente) ───────────────────────────────────────
      case 'button-only':
        return (
          <div className="w-full flex flex-col items-center gap-4">
            <button
              type="button"
              onClick={() => onUnlock('__button_only__')}
              className="unlock-btn w-full max-w-sm py-5 rounded text-sm font-semibold tracking-widest"
            >
              {riddle.buttonLabel ?? 'Continuar ✦'}
            </button>
          </div>
        );

      // ── Final SÍ/NO (Rayo) ────────────────────────────────────────────
      case 'final':
        return (
          <div className="w-full flex flex-col items-center gap-4">
            <div className="flex gap-4 w-full max-w-sm">
              <button
                type="button"
                onClick={() => onUnlock('si')}
                className="flex-1 unlock-btn py-5 rounded text-sm font-bold tracking-widest"
                style={{ borderColor: 'rgba(100,200,100,0.6)' }}
              >
                ✦ Sí ✦
              </button>
              <button
                type="button"
                onClick={() => onUnlock('no')}
                className="flex-1 py-5 rounded text-sm font-bold tracking-widest transition-all duration-300 hover:brightness-110"
                style={{
                  background: 'linear-gradient(135deg, #1a0000 0%, #3d0000 40%, #1a0000 100%)',
                  border: '1px solid rgba(180,30,30,0.6)',
                  color: '#e05555',
                  fontFamily: "'Cinzel', serif",
                  letterSpacing: '0.15em',
                }}
              >
                ✗ No ✗
              </button>
            </div>
          </div>
        );

      // ── Default text / date ───────────────────────────────────────────
      default:
        return (
          <form onSubmit={handleTextSubmit} className="w-full max-w-sm flex flex-col gap-4">
            <input
              type="text"
              value={inputValue}
              onChange={type === 'date' ? handleDateChange : (e) => setInputValue(e.target.value)}
              onKeyDown={type === 'date' ? onDateKeyDown : undefined}
              placeholder={riddle.placeholder}
              className="gold-input w-full px-5 py-3 rounded text-center"
              autoComplete="off"
              spellCheck="false"
              maxLength={type === 'date' ? 10 : undefined}
              inputMode={type === 'date' ? 'numeric' : 'text'}
            />

            {/* Date format error */}
            {dateError && (
              <p className="text-center text-sm text-crimson-400 font-cormorant italic">
                📅 {dateError}
              </p>
            )}

            {/* General error */}
            {errorMsg && !dateError && (
              <p className="text-center text-sm text-crimson-400 font-cormorant italic">
                ✗ {errorMsg}
              </p>
            )}

            <button
              type="submit"
              className="unlock-btn w-full py-4 rounded text-sm font-semibold tracking-widest"
            >
              ⚿ Desbloquear
            </button>
          </form>
        );
    }
  };

  // Has hint only if riddle.hint is defined and type is not button-only/final
  const hasHint = riddle.hint && type !== 'button-only' && type !== 'final';

  return (
    <main className="relative z-10 flex justify-center px-4 py-2">
      <div
        className={`parchment-card relative w-full max-w-2xl rounded-lg shadow-parchment ${
          isShaking ? 'shake' : ''
        }`}
        style={{ border: '1px solid rgba(163,123,16,0.45)', minHeight: '320px' }}
      >
        {/* Corner ornaments */}
        <div className="corner-ornament corner-tl" />
        <div className="corner-ornament corner-tr" />
        <div className="corner-ornament corner-bl" />
        <div className="corner-ornament corner-br" />

        <div className="relative z-10 p-8 md:p-12 flex flex-col items-center gap-6">
          {/* Title */}
          <div className="text-center">
            <p className="font-cinzel text-xs tracking-[0.3em] text-gold-700 uppercase mb-2">
              ✦ {riddle.title} ✦
            </p>
            <div className="gold-divider w-40 mx-auto" />
          </div>

          {/* Verse */}
          <div className="text-center px-2">
            <p
              className="font-cormorant text-xl md:text-2xl text-amber-900 italic leading-relaxed"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {riddle.verse}
            </p>
          </div>

          <div className="gold-divider w-32 mx-auto" />

          {/* Dynamic body by type */}
          {renderBody()}

          {/* Hint toggle — only when hint exists */}
          {hasHint && (
            <>
              <button
                onClick={() => setShowHint((v) => !v)}
                className="text-xs font-cinzel tracking-widest text-gold-700 hover:text-gold-600 transition-colors uppercase mt-1"
                style={{ letterSpacing: '0.2em' }}
              >
                {showHint ? '▲ Ocultar pista' : '▼ Necesito una pista'}
              </button>

              {showHint && (
                <p className="text-center text-sm text-amber-800 italic font-cormorant bg-parchment-300/50 px-4 py-2 rounded border border-gold-300/50">
                  💭 {riddle.hint}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
