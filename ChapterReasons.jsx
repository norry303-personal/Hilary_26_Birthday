// ChapterReasons.jsx — a deck of cards you click through

const { useState: useSR, useEffect: useER } = React;

const REASONS = [
  { n: '01', tag: 'mornings',  text: 'The way you make tea — like it matters that I get the good cup.' },
  { n: '02', tag: 'laughter',  text: 'You laugh at your own jokes a half-second early. It is the best sound I know.' },
  { n: '03', tag: 'kindness',  text: 'You remember small things. Names of strangers. The book my mother loved.' },
  { n: '04', tag: 'mind',      text: 'You think out loud, and your thinking is more beautiful than most people’s writing.' },
  { n: '05', tag: 'taste',     text: 'You always know which song. Always. It is a kind of magic, I think.' },
  { n: '06', tag: 'us',        text: 'You make ordinary days feel like the ones I will want to remember.' },
  { n: '07', tag: 'always',    text: 'And the way you look back at me — like I am the answer to something.' },
];

function ReasonCard({ n, tag, text, isFront, offset = 0, rotate = 0, scale = 1, opacity = 1, onTopClick }) {
  return (
    <div
      onClick={isFront ? onTopClick : undefined}
      style={{
        position: 'absolute',
        left: '50%', top: '50%',
        transform: `translate(-50%, -50%) translate(${offset}px, ${offset * 0.6}px) rotate(${rotate}deg) scale(${scale})`,
        transformOrigin: '50% 50%',
        width: 460, height: 600,
        background: 'linear-gradient(165deg, #FFFDF8 0%, #FBF6EE 60%, #F3EBDD 100%)',
        borderRadius: 18,
        boxShadow:
          '0 40px 80px -40px rgba(43,31,26,0.38), ' +
          '0 12px 28px -16px rgba(122,90,79,0.25), ' +
          '0 0 0 1px rgba(43,31,26,0.05), ' +
          'inset 0 0 60px rgba(232,210,168,0.18)',
        opacity,
        transition: 'transform 900ms cubic-bezier(0.22,1,0.36,1), opacity 700ms cubic-bezier(0.22,1,0.36,1)',
        cursor: isFront ? 'pointer' : 'default',
        padding: '48px 44px',
        display: 'flex', flexDirection: 'column',
        userSelect: 'none',
      }}
    >
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        marginBottom: 36,
      }}>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
          fontSize: 64, fontWeight: 300, color: 'var(--gold)',
          lineHeight: 1, letterSpacing: '-0.02em',
        }}>{n}</div>
        <div style={{
          fontFamily: "'Inter', sans-serif", fontSize: 10,
          letterSpacing: '0.24em', textTransform: 'uppercase',
          color: 'var(--fg-3)',
        }}>· {tag} ·</div>
      </div>

      <div style={{
        height: 1, width: 56,
        background: 'var(--gold)', opacity: 0.5, marginBottom: 36,
      }} />

      <div style={{
        flex: 1,
        fontFamily: "'Cormorant Garamond', serif",
        fontWeight: 400, fontSize: 28, lineHeight: 1.3,
        color: 'var(--ink)', letterSpacing: '-0.005em',
      }}>
        <span style={{ fontStyle: 'italic', fontSize: 36, color: 'var(--gold)', marginRight: 4, lineHeight: 0 }}>"</span>
        {text}
        <span style={{ fontStyle: 'italic', fontSize: 36, color: 'var(--gold)', marginLeft: 4, lineHeight: 0 }}>"</span>
      </div>

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginTop: 24,
      }}>
        <div style={{ fontFamily: "'Caveat', cursive", fontSize: 22, color: 'var(--taupe)' }}>
          — for hilary, with love
        </div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 18, color: 'var(--gold)' }}>
          ✦
        </div>
      </div>
    </div>
  );
}

function ReasonsChapter({ onNext }) {
  const [i, setI] = useSR(0);
  const total = REASONS.length;
  const advance = () => setI(v => (v + 1) % total);
  const back    = () => setI(v => (v - 1 + total) % total);

  const cards = [];
  for (let k = 2; k >= 0; k--) {
    const idx = (i + k) % total;
    cards.push({ idx, k });
  }

  return (
    <section style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 50% 45%, #FBF6EE 0%, #F3EBDD 60%, #ECDFCE 100%)',
      padding: '120px 24px 100px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      position: 'relative',
    }}>
      <SectionTitle
        chapter="three"
        title="The reasons —"
        italicTail="all of them, today."
        sub="A small deck of cards. I'll pretend this is a complete list. Tap a card to turn it."
      />

      <Reveal delay={900} duration={1100}>
        <div style={{ position: 'relative', width: 600, height: 640, perspective: '1400px' }}>
          {cards.map(({ idx, k }) => {
            const r = REASONS[idx];
            const isFront = k === 0;
            const offset  = k * 14;
            const rotate  = k === 0 ? -2 : (k === 1 ? 3 : -3.5);
            const scale   = 1 - k * 0.04;
            const opacity = k === 0 ? 1 : (k === 1 ? 0.85 : 0.6);
            return (
              <ReasonCard
                key={`${idx}-${k}`}
                n={r.n} tag={r.tag} text={r.text}
                isFront={isFront}
                offset={offset} rotate={rotate} scale={scale} opacity={opacity}
                onTopClick={advance}
              />
            );
          })}
        </div>
      </Reveal>

      <Reveal delay={1400}>
        <div style={{ marginTop: 48, display: 'flex', alignItems: 'center', gap: 28 }}>
          <button onClick={back} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            fontFamily: "'Cormorant Garamond', serif", fontSize: 22,
            color: 'var(--taupe)', padding: '8px 14px', transition: 'color 250ms',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--taupe)'}>
            ← back
          </button>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {REASONS.map((_, k) => (
              <div key={k} style={{
                width: k === i ? 18 : 5, height: 5, borderRadius: 999,
                background: k === i ? 'var(--gold)' : 'rgba(43,31,26,0.18)',
                transition: 'all 500ms cubic-bezier(0.22,1,0.36,1)',
              }} />
            ))}
          </div>

          <button onClick={advance} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            fontFamily: "'Cormorant Garamond', serif", fontSize: 22,
            color: 'var(--ink)', padding: '8px 14px', transition: 'color 250ms',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--ink)'}>
            next →
          </button>
        </div>
      </Reveal>

      <Reveal delay={1700}>
        <div style={{ marginTop: 36 }}>
          <Button onClick={onNext} variant="primary">Read the letter →</Button>
        </div>
      </Reveal>
    </section>
  );
}

window.ReasonsChapter = ReasonsChapter;
