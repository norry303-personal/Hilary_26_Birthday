// Components.jsx — shared atoms

const { useState, useEffect, useRef } = React;

function Monogram({ size = 24 }) {
  return (
    <span style={{
      fontFamily: "'Cormorant Garamond', serif",
      fontStyle: 'italic', fontWeight: 400, fontSize: size,
      color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: 1,
    }}>h.</span>
  );
}

function Button({ children, variant = 'default', onClick, style = {} }) {
  const [hover, setHover] = useState(false);
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 10,
    padding: '14px 30px',
    fontFamily: "'Inter', sans-serif",
    fontSize: 14, fontWeight: 500, letterSpacing: '0.02em',
    border: '1px solid var(--hairline)',
    borderRadius: 999, cursor: 'pointer',
    transition: 'all 320ms cubic-bezier(0.22,1,0.36,1)',
    background: 'var(--cream)', color: 'var(--ink)',
    boxShadow: hover ? '0 0 56px -8px rgba(184,137,62,0.45), 0 8px 18px -10px rgba(122,90,79,0.25)' : 'none',
    transform: hover ? 'translateY(-1px)' : 'translateY(0)',
    ...style,
  };
  const variants = {
    primary: { background: 'var(--ink)', color: 'var(--cream)', border: '1px solid transparent' },
    gold:    { background: 'var(--gold)', color: 'var(--cream)', border: '1px solid transparent' },
    ghost:   { background: 'transparent', border: '1px solid var(--hairline)' },
  };
  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      style={{ ...base, ...(variants[variant] || {}) }}
    >{children}</button>
  );
}

function TopNav({ current, onGo }) {
  const items = [
    { id: 'present',  label: 'Home' },
    { id: 'memories', label: 'Memories' },
    { id: 'reasons',  label: 'Reasons' },
    { id: 'letter',   label: 'Letter' },
    { id: 'hunt',     label: 'Find me', accent: true },
  ];
  return (
    <div style={{
      position: 'fixed', top: 28, left: 0, right: 0,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '0 40px', zIndex: 50, pointerEvents: 'none',
    }}>
      <div style={{ pointerEvents: 'auto' }}><Monogram /></div>
      <div style={{
        pointerEvents: 'auto',
        display: 'flex', alignItems: 'center', gap: 4, padding: 6,
        background: 'rgba(251,246,238,0.62)',
        backdropFilter: 'blur(20px) saturate(120%)',
        WebkitBackdropFilter: 'blur(20px) saturate(120%)',
        border: '1px solid rgba(255,255,255,0.55)',
        borderRadius: 999,
        boxShadow: '0 8px 24px -12px rgba(122,90,79,0.18)',
      }}>
        {items.map(it => {
          const active = current === it.id;
          return (
            <button key={it.id} onClick={() => onGo(it.id)} style={{
              padding: '10px 18px', border: 'none', cursor: 'pointer',
              fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500,
              letterSpacing: '0.02em',
              borderRadius: 999,
              transition: 'all 280ms cubic-bezier(0.22,1,0.36,1)',
              background: active ? 'var(--ink)' : 'transparent',
              color: active ? 'var(--cream)' : (it.accent ? 'var(--gold)' : 'var(--ink)'),
            }}>{it.label}</button>
          );
        })}
      </div>
      <div style={{ pointerEvents: 'auto', width: 24 }} />
    </div>
  );
}

function PageHelpers({ index, total, helperText = 'Scroll, or press →' }) {
  return (
    <>
      <div style={{
        position: 'fixed', left: 40, bottom: 28, zIndex: 50,
        fontFamily: "'Inter', sans-serif", fontSize: 11, color: 'var(--fg-3)',
        letterSpacing: '0.14em', textTransform: 'uppercase',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        {helperText.split('→')[0]}
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, color: 'var(--ink)', textTransform: 'none', letterSpacing: 0 }}>→</span>
      </div>
      <div style={{
        position: 'fixed', right: 40, bottom: 28, zIndex: 50,
        fontFamily: "'Inter', sans-serif", fontSize: 11, color: 'var(--fg-3)',
        letterSpacing: '0.14em',
      }}>
        {String(index).padStart(2, '0')} <span style={{ opacity: 0.5 }}>/</span> {String(total).padStart(2, '0')}
      </div>
    </>
  );
}

function Eyebrow({ children, style = {} }) {
  return (
    <div style={{
      fontFamily: "'Inter', sans-serif",
      fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase',
      color: 'var(--fg-3)', ...style,
    }}>{children}</div>
  );
}

function Reveal({ children, delay = 0, y = 24, duration = 1100 }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShown(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div style={{
      opacity: shown ? 1 : 0,
      transform: `translateY(${shown ? 0 : y}px)`,
      transition: `opacity ${duration}ms cubic-bezier(0.22,1,0.36,1), transform ${duration}ms cubic-bezier(0.22,1,0.36,1)`,
    }}>{children}</div>
  );
}

function Typewriter({ text, speed = 48, onDone, style }) {
  const [shown, setShown] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    setShown(''); setDone(false);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setShown(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        setDone(true);
        if (onDone) onDone();
      }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return (
    <span style={style}>
      {shown}
      <span style={{
        display: 'inline-block', width: 2, height: '0.85em',
        background: 'currentColor', marginLeft: 3,
        verticalAlign: 'text-bottom', opacity: done ? 0 : 1,
        animation: 'caretBlink 900ms steps(2) infinite',
        transition: 'opacity 700ms',
      }} />
    </span>
  );
}

function SectionTitle({ chapter, title, italicTail, sub }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 56 }}>
      <Reveal delay={150}><Eyebrow>Chapter {chapter}</Eyebrow></Reveal>
      <Reveal delay={350}>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 400, fontSize: 'clamp(44px, 5.5vw, 80px)',
          letterSpacing: '-0.02em', lineHeight: 1.22, color: 'var(--ink)',
          margin: '14px 0 28px', paddingBottom: 6,
          maxWidth: '20ch',
        }}>
          {title}{italicTail && <> <span style={{ fontStyle: 'italic', whiteSpace: 'nowrap' }}>{italicTail}</span></>}
        </h2>
      </Reveal>
      {sub && (
        <Reveal delay={650}>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: 16, color: 'var(--taupe)',
            maxWidth: 480, margin: '0 auto', lineHeight: 1.6,
          }}>{sub}</p>
        </Reveal>
      )}
    </div>
  );
}

Object.assign(window, { Monogram, Button, TopNav, PageHelpers, Eyebrow, Reveal, Typewriter, SectionTitle });
