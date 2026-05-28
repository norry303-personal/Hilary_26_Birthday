// ChapterMemories.jsx — magnet-board memory wall

const { useState: useSM, useEffect: useEM, useRef: useRM } = React;

const PHOTO_TONES = {
  sunset:     'linear-gradient(160deg, #F3D9CE 0%, #D9A89A 55%, #B07F70 100%)',
  goldenHour: 'linear-gradient(150deg, #F5E2BD 0%, #E8C079 60%, #B8893E 100%)',
  rosebed:    'linear-gradient(180deg, #F8E6DD 0%, #D9A89A 70%, #7A5A4F 100%)',
  espresso:   'linear-gradient(170deg, #C9A493 0%, #7A5A4F 65%, #2B1F1A 100%)',
  cream:      'linear-gradient(150deg, #FBF6EE 0%, #E8D2A8 70%, #B8893E 100%)',
  evening:    'linear-gradient(170deg, #B8B0AB 0%, #6B6360 60%, #2B1F1A 100%)',
  blush:      'linear-gradient(160deg, #FBF6EE 0%, #F3D9CE 50%, #D9A89A 100%)',
  field:      'linear-gradient(170deg, #E8D2A8 0%, #C9A493 50%, #7A5A4F 100%)',
  shore:      'linear-gradient(180deg, #DCE5E8 0%, #C9A493 50%, #7A5A4F 100%)',
};

function PhotoFill({ tone, kind = 'horizon', accent }) {
  const grad = PHOTO_TONES[tone] || PHOTO_TONES.sunset;
  return (
    <div style={{ position: 'absolute', inset: 0, background: grad, overflow: 'hidden' }}>
      {kind === 'horizon' && (
        <>
          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: 0, height: '38%',
            background: 'linear-gradient(0deg, rgba(43,31,26,0.32), transparent)',
          }} />
          <div style={{
            position: 'absolute', left: '60%', top: '22%', width: 28, height: 28,
            borderRadius: '50%',
            background: accent || 'radial-gradient(circle, #FBF6EE 0%, rgba(232,210,168,0.4) 70%, transparent 100%)',
            filter: 'blur(0.5px)',
          }} />
        </>
      )}
      {kind === 'portrait' && (
        <>
          <div style={{
            position: 'absolute', left: '30%', bottom: '12%', width: '40%', height: '60%',
            borderRadius: '50% 50% 45% 45%', background: 'rgba(43,31,26,0.22)', filter: 'blur(2px)',
          }} />
          <div style={{
            position: 'absolute', left: '38%', bottom: '52%', width: '24%', height: '20%',
            borderRadius: '50%', background: 'rgba(43,31,26,0.18)', filter: 'blur(1px)',
          }} />
        </>
      )}
      {kind === 'cityscape' && (
        <>
          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: 0, height: '52%',
            background: 'linear-gradient(0deg, rgba(43,31,26,0.4), transparent 80%)',
          }} />
          {[12, 28, 44, 60, 78].map((x, i) => (
            <div key={i} style={{
              position: 'absolute', bottom: '18%', left: `${x}%`,
              width: 8 + (i % 2) * 4, height: 28 + (i * 5) % 22,
              background: 'rgba(43,31,26,0.55)',
            }} />
          ))}
        </>
      )}
      {kind === 'lights' && (
        <>
          {[15, 32, 48, 62, 78, 88].map((x, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `${x}%`, top: `${15 + (i * 13) % 60}%`,
              width: 4 + (i % 3) * 2, height: 4 + (i % 3) * 2,
              borderRadius: '50%', background: '#F2D592',
              boxShadow: '0 0 8px rgba(242,213,146,0.8)', filter: 'blur(0.4px)',
            }} />
          ))}
        </>
      )}
      <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 60px rgba(43,31,26,0.18)' }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(232,210,168,0.06), transparent 40%, rgba(122,90,79,0.08))',
      }} />
    </div>
  );
}

function MagnetDot({ x = '50%', y = -6, color = 'gold' }) {
  const fills = {
    gold:  'radial-gradient(circle at 35% 30%, #F2D592 0%, #B8893E 70%, #7A5A1F 100%)',
    pearl: 'radial-gradient(circle at 35% 30%, #FFFDF8 0%, #E8D2A8 70%, #B8893E 100%)',
    rose:  'radial-gradient(circle at 35% 30%, #F3D9CE 0%, #D9A89A 70%, #7A5A4F 100%)',
    ink:   'radial-gradient(circle at 35% 30%, #7A5A4F 0%, #2B1F1A 90%)',
  };
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      width: 11, height: 11, borderRadius: 999,
      transform: 'translateX(-50%)',
      background: fills[color] || fills.gold,
      boxShadow: '0 2px 4px rgba(43,31,26,0.4), inset 0 0 2px rgba(255,255,255,0.5)',
      zIndex: 10,
    }} />
  );
}

function BoardItem({ children, x, y, w, h, rotate = 0, delay = 0, zIndex = 1, magnet = 'gold', magnetX = '50%' }) {
  const [hover, setHover] = useSM(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'absolute',
        left: x, top: y, width: w, height: h,
        transform: hover
          ? `rotate(${rotate * 0.3}deg) translateY(-6px) scale(1.02)`
          : `rotate(${rotate}deg)`,
        transformOrigin: '50% 0%',
        transition: 'transform 700ms cubic-bezier(0.22,1,0.36,1), filter 700ms',
        animation: `fadeUp 1000ms cubic-bezier(0.22,1,0.36,1) ${delay}ms backwards`,
        zIndex: hover ? 50 : zIndex,
        filter: hover
          ? 'drop-shadow(0 18px 28px rgba(43,31,26,0.28))'
          : 'drop-shadow(0 8px 16px rgba(43,31,26,0.14))',
        cursor: 'pointer',
      }}
    >
      <MagnetDot x={magnetX} color={magnet} />
      {children}
    </div>
  );
}

function Polaroid({ tone = 'sunset', kind = 'horizon', caption, frameColor = '#FFFDF8' }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: frameColor,
      padding: '10px 10px 32px', borderRadius: 2,
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ position: 'relative', flex: 1, borderRadius: 1, overflow: 'hidden' }}>
        <PhotoFill tone={tone} kind={kind} />
      </div>
      {caption && (
        <div style={{
          marginTop: 8, fontFamily: "'Caveat', cursive", fontSize: 16,
          color: 'var(--ink)', textAlign: 'center', lineHeight: 1,
        }}>{caption}</div>
      )}
    </div>
  );
}

function PlainPhoto({ tone = 'sunset', kind = 'horizon' }) {
  return (
    <div style={{
      width: '100%', height: '100%', borderRadius: 2,
      position: 'relative', overflow: 'hidden',
      boxShadow: 'inset 0 0 0 1px rgba(43,31,26,0.05)',
    }}>
      <PhotoFill tone={tone} kind={kind} />
    </div>
  );
}

function Postcard({ title, place, tone = 'goldenHour' }) {
  return (
    <div style={{
      width: '100%', height: '100%', background: '#FFFDF8',
      borderRadius: 3, overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ position: 'relative', flex: 1 }}>
        <PhotoFill tone={tone} kind="horizon" />
        <div style={{
          position: 'absolute', top: 8, right: 10,
          fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
          fontSize: 13, color: '#FFFDF8',
          textShadow: '0 1px 4px rgba(43,31,26,0.6)',
        }}>{title}</div>
      </div>
      <div style={{
        padding: '6px 10px 8px', textAlign: 'center',
        fontFamily: "'Inter', sans-serif", fontSize: 9,
        letterSpacing: '0.18em', textTransform: 'uppercase',
        color: 'var(--taupe)', borderTop: '1px solid rgba(43,31,26,0.08)',
        background: '#FFFDF8',
      }}>{place}</div>
    </div>
  );
}

function PhotoStrip({ count = 4 }) {
  return (
    <div style={{
      width: '100%', height: '100%', background: '#1F1814',
      padding: 4, display: 'flex', flexDirection: 'column', gap: 3,
    }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#2B1F1A' }}>
          <PhotoFill tone={['rosebed','blush','espresso','field'][i % 4]} kind="portrait" />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(150deg, rgba(232,210,168,0.05), transparent 50%)',
          }} />
        </div>
      ))}
    </div>
  );
}

function TicketStub({ title, sub }) {
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex',
      background: '#FFFDF8', borderRadius: 3, overflow: 'hidden',
      boxShadow: 'inset 0 0 0 1px rgba(43,31,26,0.06)',
    }}>
      <div style={{
        flex: 1, padding: '10px 14px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4,
      }}>
        <div style={{
          fontFamily: "'Inter', sans-serif", fontSize: 8, letterSpacing: '0.2em',
          textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 600,
        }}>Admit one</div>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: 16,
          color: 'var(--ink)', lineHeight: 1.1, fontWeight: 500,
        }}>{title}</div>
        <div style={{
          fontFamily: "'Inter', sans-serif", fontSize: 9, letterSpacing: '0.14em',
          textTransform: 'uppercase', color: 'var(--fg-3)',
        }}>{sub}</div>
      </div>
      <div style={{ width: 1, borderLeft: '1px dashed rgba(43,31,26,0.25)', margin: '6px 0' }} />
      <div style={{
        width: 36, padding: 6,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--cream-deep)',
        fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
        fontSize: 22, color: 'var(--gold)',
      }}>✦</div>
    </div>
  );
}

function CircleSouvenir({ tone = 'rosebed', label }) {
  return (
    <div style={{
      width: '100%', height: '100%', borderRadius: '50%',
      background: '#FFFDF8', padding: 4,
      boxShadow: 'inset 0 0 0 1px rgba(43,31,26,0.08)',
    }}>
      <div style={{ width: '100%', height: '100%', borderRadius: '50%', position: 'relative', overflow: 'hidden' }}>
        <PhotoFill tone={tone} kind="lights" />
        {label && (
          <div style={{
            position: 'absolute', inset: 0, display: 'grid', placeItems: 'center',
            fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
            fontSize: 12, color: '#FFFDF8', letterSpacing: '0.06em',
            textShadow: '0 1px 4px rgba(43,31,26,0.6)',
          }}>{label}</div>
        )}
      </div>
    </div>
  );
}

function StickyNote({ text, color = 'cream' }) {
  const colors = { cream: '#FFFDF8', blush: '#F8E6DD', champagne: '#F5E2BD' };
  return (
    <div style={{
      width: '100%', height: '100%',
      background: colors[color],
      padding: '12px 14px',
      fontFamily: "'Caveat', cursive",
      fontSize: 18, lineHeight: 1.2, color: 'var(--ink)',
      whiteSpace: 'pre-line',
      boxShadow: 'inset 0 0 0 1px rgba(43,31,26,0.05)',
    }}>{text}</div>
  );
}

const ITEMS = [
  { kind: 'polaroid',   x: 60,  y: 70,  w: 200, h: 180, rotate: -3,   tone: 'shore',      kindOf: 'horizon',   caption: 'maine, july',      delay: 100,  magnet: 'gold'  },
  { kind: 'postcard',   x: 290, y: 50,  w: 130, h: 130, rotate: 2,    title: 'Roma',      place: 'Trastevere, \'25',                          delay: 220,  magnet: 'pearl' },
  { kind: 'stripframe', x: 460, y: 40,  w: 90,  h: 290, rotate: -1.5,                                                                         delay: 340,  magnet: 'ink'   },
  { kind: 'circle',     x: 600, y: 70,  w: 110, h: 110, rotate: 0,    tone: 'goldenHour', label: 'paris',                                     delay: 460,  magnet: 'gold'  },
  { kind: 'plainphoto', x: 740, y: 60,  w: 220, h: 160, rotate: 2,    tone: 'sunset',     kindOf: 'horizon',                                  delay: 580,  magnet: 'rose'  },

  { kind: 'sticky',     x: 30,  y: 290, w: 130, h: 110, rotate: -4,   color: 'blush',
    text: 'twenty-seven —\nour best year\nyet  ♡',                                                                                              delay: 700,  magnet: 'rose'  },
  { kind: 'polaroid',   x: 200, y: 280, w: 170, h: 200, rotate: 3,    tone: 'rosebed',    kindOf: 'portrait',  caption: 'dancing, late',      delay: 820,  magnet: 'pearl' },
  { kind: 'ticket',     x: 390, y: 360, w: 200, h: 80,  rotate: -2,   title: 'The Met — Friday',    sub: 'Row G · Seat 14',                   delay: 940,  magnet: 'gold'  },
  { kind: 'plainphoto', x: 620, y: 270, w: 150, h: 200, rotate: -2.5, tone: 'cream',      kindOf: 'portrait',                                 delay: 1060, magnet: 'gold'  },
  { kind: 'postcard',   x: 800, y: 280, w: 160, h: 160, rotate: 3.5,  title: 'Capri',     place: 'Anacapri, \'24',                            delay: 1180, magnet: 'pearl' },

  { kind: 'polaroid',   x: 60,  y: 470, w: 200, h: 200, rotate: 2,    tone: 'evening',    kindOf: 'lights',    caption: 'tokyo, november',    delay: 1300, magnet: 'pearl' },
  { kind: 'circle',     x: 300, y: 510, w: 100, h: 100, rotate: 0,    tone: 'blush',      label: 'mine',                                      delay: 1420, magnet: 'rose'  },
  { kind: 'plainphoto', x: 430, y: 480, w: 180, h: 140, rotate: -2,   tone: 'goldenHour', kindOf: 'cityscape',                                delay: 1540, magnet: 'gold'  },
  { kind: 'polaroid',   x: 640, y: 500, w: 170, h: 170, rotate: 3,    tone: 'field',      kindOf: 'horizon',   caption: 'sunday, in bed',     delay: 1660, magnet: 'gold'  },
  { kind: 'sticky',     x: 850, y: 520, w: 130, h: 110, rotate: -3,   color: 'champagne',
    text: 'more soon —\npromise.',                                                                                                              delay: 1780, magnet: 'pearl' },
];

function MemoriesChapter({ onNext }) {
  return (
    <section style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, var(--cream) 0%, var(--cream-deep) 100%)',
      padding: '120px 24px 100px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    }}>
      <SectionTitle
        chapter="two"
        title="The year"
        italicTail="we had."
        sub="Every magnet is a small thing we did. Hover them — the whole year is here, somewhere in a room of warm light."
      />

      <Reveal delay={900} duration={1300}>
        <div style={{
          position: 'relative',
          width: 'min(1100px, 96vw)',
          aspectRatio: '11 / 7',
          background: 'linear-gradient(155deg, #FFFDF8 0%, #FBF6EE 100%)',
          borderRadius: 8,
          boxShadow:
            '0 60px 120px -50px rgba(43,31,26,0.40), ' +
            '0 18px 40px -16px rgba(122,90,79,0.25), ' +
            '0 0 0 1px rgba(43,31,26,0.06), ' +
            'inset 0 0 100px rgba(232,210,168,0.10)',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0 }}>
            {/* Paper grain */}
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/></svg>\")",
              opacity: 0.06, mixBlendMode: 'multiply', pointerEvents: 'none',
            }} />
            {/* Window-light vignette */}
            <div style={{
              position: 'absolute', top: -100, right: -100, width: 500, height: 500,
              background: 'radial-gradient(circle, rgba(245,226,189,0.4) 0%, transparent 65%)',
              pointerEvents: 'none',
            }} />

            <div style={{
              position: 'absolute', inset: 0,
              transform: 'scale(var(--board-scale))',
              transformOrigin: '0 0',
            }} ref={(el) => {
              if (!el) return;
              const apply = () => {
                const parent = el.parentElement;
                const w = parent.clientWidth;
                const scale = w / 1000;
                el.style.setProperty('--board-scale', scale);
                el.style.width  = '1000px';
                el.style.height = '700px';
              };
              apply();
              const ro = new ResizeObserver(apply);
              ro.observe(el.parentElement);
            }}>
              {ITEMS.map((it, i) => {
                let inner = null;
                if      (it.kind === 'polaroid')   inner = <Polaroid tone={it.tone} kind={it.kindOf} caption={it.caption} />;
                else if (it.kind === 'plainphoto')  inner = <PlainPhoto tone={it.tone} kind={it.kindOf} />;
                else if (it.kind === 'postcard')    inner = <Postcard title={it.title} place={it.place} tone={it.tone} />;
                else if (it.kind === 'stripframe')  inner = <PhotoStrip count={4} />;
                else if (it.kind === 'circle')      inner = <CircleSouvenir tone={it.tone} label={it.label} />;
                else if (it.kind === 'ticket')      inner = <TicketStub title={it.title} sub={it.sub} />;
                else if (it.kind === 'sticky')      inner = <StickyNote text={it.text} color={it.color} />;
                return (
                  <BoardItem
                    key={i}
                    x={it.x} y={it.y} w={it.w} h={it.h}
                    rotate={it.rotate} delay={it.delay} zIndex={i + 1}
                    magnet={it.magnet}
                  >
                    {inner}
                  </BoardItem>
                );
              })}
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal delay={2200}>
        <div style={{ marginTop: 56, display: 'flex', gap: 16 }}>
          <Button onClick={onNext} variant="primary">Why I love you →</Button>
        </div>
      </Reveal>
    </section>
  );
}

window.MemoriesChapter = MemoriesChapter;
