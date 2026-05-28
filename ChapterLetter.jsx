// ChapterLetter.jsx — typed letter on cream paper

const { useState: useSL, useEffect: useEL } = React;

const LETTER = `My dearest Hilary,\n\nIt's strange how a year can feel like both a long time and no time at all. I've been keeping a list, in my head, of the small things — the way you make tea, the way you say my name when you're half-asleep, the way the room feels warmer when you walk into it.\n\nYou are the best part of my year. Of every year.\n\nHappy birthday, my love.`;

function LetterChapter({ onNext }) {
  const [done, setDone] = useSL(false);
  return (
    <section style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, var(--cream) 0%, var(--cream-deep) 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '120px 24px 100px',
    }}>
      <SectionTitle chapter="four" title="A letter," italicTail="for you." />

      <Reveal delay={900} duration={1100}>
        <div style={{
          position: 'relative',
          background: 'linear-gradient(170deg, #FFFDF8 0%, #FBF6EE 100%)',
          borderRadius: 6,
          padding: '72px 80px 80px',
          boxShadow:
            '0 50px 100px -40px rgba(43,31,26,0.32), ' +
            '0 14px 36px -18px rgba(122,90,79,0.30), ' +
            '0 0 0 1px rgba(43,31,26,0.05)',
          maxWidth: 680, width: 'min(680px, 92vw)',
          fontFamily: "'Caveat', cursive",
          fontSize: 26, lineHeight: 1.6, color: 'var(--ink)',
          whiteSpace: 'pre-wrap', minHeight: 460,
        }}>
          {/* Folded corner */}
          <div style={{
            position: 'absolute', top: 0, right: 0, width: 36, height: 36,
            background: 'linear-gradient(225deg, transparent 50%, rgba(43,31,26,0.06) 50%)',
          }} />
          {/* Ruled lines */}
          <div style={{
            position: 'absolute', inset: '60px 60px',
            backgroundImage: 'repeating-linear-gradient(transparent, transparent 41px, rgba(43,31,26,0.04) 41px, rgba(43,31,26,0.04) 42px)',
            pointerEvents: 'none',
          }} />

          <Typewriter text={LETTER} speed={38} onDone={() => setDone(true)} />

          {done && (
            <div style={{
              marginTop: 32, textAlign: 'right',
              fontFamily: "'Caveat', cursive", fontSize: 32, color: 'var(--gold)',
              opacity: done ? 1 : 0,
              transition: 'opacity 1400ms cubic-bezier(0.22,1,0.36,1)',
            }}>— always, yours.</div>
          )}
        </div>
      </Reveal>

      <div style={{
        marginTop: 56,
        opacity: done ? 1 : 0,
        transform: done ? 'translateY(0)' : 'translateY(8px)',
        transition: 'all 900ms cubic-bezier(0.22,1,0.36,1) 400ms',
      }}>
        <Button onClick={onNext} variant="primary">Now — find me →</Button>
      </div>
    </section>
  );
}

window.LetterChapter = LetterChapter;
