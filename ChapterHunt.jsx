// ChapterHunt.jsx — treasure hunt + final reveal

const { useState: useSH, useEffect: useEH } = React;

const HUNT_STEPS = [
  { clue: "Your present is somewhere cosy…",                   temp: 'cold' },
  { clue: "Somewhere soft — where we'll end the night.",       temp: 'warm' },
  { clue: "You're close. Don't overthink it.",                 temp: 'hot'  },
  { clue: "Check where we'll be wrapped up together tonight.", temp: 'very-hot', final: true },
];

const TEMP_META = {
  cold:       { label: 'Cold',     fg: '#5E7A8C', bg: 'rgba(94,122,140,0.10)' },
  warm:       { label: 'Warm',     fg: '#B8893E', bg: 'rgba(184,137,62,0.12)' },
  hot:        { label: 'Hot',      fg: '#C2613A', bg: 'rgba(194,97,58,0.14)'  },
  'very-hot': { label: 'Very hot', fg: '#A0341E', bg: 'rgba(160,52,30,0.14)'  },
};

function TempBadge({ temp }) {
  const m = TEMP_META[temp];
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '6px 14px', borderRadius: 999,
      background: m.bg, color: m.fg,
      fontFamily: "'Inter', sans-serif",
      fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 500,
      transition: 'all 600ms cubic-bezier(0.22,1,0.36,1)',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 999, background: m.fg, boxShadow: `0 0 12px ${m.fg}` }} />
      {m.label}
    </div>
  );
}

function HuntChapter({ onRestart }) {
  const [step, setStep] = useSH(0);
  const [phase, setPhase] = useSH('hunt'); // 'hunt' | 'final-blur' | 'final' | 'found'
  const cur = HUNT_STEPS[step];

  const advance = () => {
    if (step < HUNT_STEPS.length - 1) {
      const ns = step + 1;
      setStep(ns);
      if (HUNT_STEPS[ns].final) setPhase('final-blur');
    } else if (phase === 'final-blur') {
      setPhase('final');
    } else if (phase === 'final') {
      setPhase('found');
    }
  };

  return (
    <section style={{
      minHeight: '100vh',
      background: phase === 'found'
        ? 'radial-gradient(ellipse at 50% 50%, #F5E2BD 0%, #F3D9CE 60%, #EBC9BC 100%)'
        : 'radial-gradient(ellipse at 50% 40%, #FBF6EE 0%, #F3EBDD 60%, #ECDFCE 100%)',
      transition: 'background 1400ms cubic-bezier(0.22,1,0.36,1)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '120px 24px 120px', position: 'relative',
    }}>
      {phase !== 'found' && (
        <>
          <SectionTitle chapter="five" title="A small" italicTail="treasure hunt." />

          <Reveal delay={800} duration={1100}>
            <div style={{
              background: 'rgba(255,253,248,0.85)',
              backdropFilter: 'blur(20px) saturate(120%)',
              WebkitBackdropFilter: 'blur(20px) saturate(120%)',
              border: '1px solid rgba(255,255,255,0.55)',
              borderRadius: 24,
              padding: '52px 56px',
              boxShadow: '0 32px 80px -28px rgba(122,90,79,0.35), 0 0 60px -20px rgba(232,210,168,0.6)',
              maxWidth: 580, width: 'min(580px, 92vw)',
              textAlign: 'center',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: 36,
              }}>
                <div style={{
                  fontFamily: "'Inter', sans-serif", fontSize: 11,
                  letterSpacing: '0.20em', textTransform: 'uppercase', color: 'var(--fg-3)',
                }}>Clue {step + 1} of {HUNT_STEPS.length}</div>
                <TempBadge temp={cur.temp} />
              </div>

              <div style={{
                fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
                fontSize: 'clamp(26px, 3vw, 36px)', lineHeight: 1.3, color: 'var(--ink)',
                margin: '8px 0 40px',
                filter: phase === 'final-blur' ? 'blur(10px)' : 'blur(0)',
                transition: 'filter 1200ms cubic-bezier(0.22,1,0.36,1)',
                cursor: phase === 'final-blur' ? 'pointer' : 'default',
                userSelect: 'none', minHeight: 60,
              }}
              onClick={() => phase === 'final-blur' && setPhase('final')}>
                {cur.clue}
              </div>

              {phase === 'final-blur' ? (
                <>
                  <div style={{
                    fontFamily: "'Inter', sans-serif", fontSize: 11,
                    letterSpacing: '0.20em', textTransform: 'uppercase', color: 'var(--fg-3)',
                    marginBottom: 18,
                  }}>Tap the clue to reveal</div>
                  <Button onClick={() => setPhase('final')} variant="gold">Reveal →</Button>
                </>
              ) : phase === 'final' ? (
                <Button onClick={() => setPhase('found')} variant="primary">I'm going →</Button>
              ) : (
                <Button onClick={advance} variant="primary">
                  {step < HUNT_STEPS.length - 1 ? 'Next clue →' : 'Reveal it →'}
                </Button>
              )}
            </div>
          </Reveal>

          <div style={{ marginTop: 48, display: 'flex', gap: 8, alignItems: 'center' }}>
            {HUNT_STEPS.map((_, k) => (
              <div key={k} style={{
                width: k === step ? 18 : 5, height: 5, borderRadius: 999,
                background: k <= step ? 'var(--gold)' : 'rgba(43,31,26,0.18)',
                transition: 'all 600ms cubic-bezier(0.22,1,0.36,1)',
              }} />
            ))}
          </div>
        </>
      )}

      {phase === 'found' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Reveal delay={300}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, color: 'var(--gold)', marginBottom: 24 }}>✦</div>
          </Reveal>
          <Reveal delay={600}>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300, fontSize: 'clamp(56px, 7vw, 112px)',
              letterSpacing: '-0.025em', lineHeight: 1.05, color: 'var(--ink)',
              margin: '0 0 24px',
            }}>You found it.</h2>
          </Reveal>
          <Reveal delay={900}>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
              fontSize: 26, color: 'var(--taupe)', maxWidth: 480, margin: '0 0 56px',
            }}>I knew you would.</p>
          </Reveal>
          <Reveal delay={1200}>
            <div style={{ fontFamily: "'Caveat', cursive", fontSize: 36, color: 'var(--gold)', marginBottom: 56 }}>
              — happy birthday, my love. ♡
            </div>
          </Reveal>
          <Reveal delay={1500}>
            <Button onClick={onRestart} variant="ghost">Start again</Button>
          </Reveal>
        </div>
      )}
    </section>
  );
}

window.HuntChapter = HuntChapter;
