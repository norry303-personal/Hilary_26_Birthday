// ChapterPresent.jsx — premium 3D present box + Tweaks

const { useState: usePS, useEffect: useEPS, useRef: useRPS } = React;

const PRESENT_DEFAULTS = {
  "boxFinish": "rose",
  "ribbonColor": "gold",
  "shake": "gentle",
  "monogramOnLid": true,
  "ambientGlow": true
};

const FINISHES = {
  rose: {
    label: 'Rosé',
    body: { f: ['#EBC2B2','#D8A595','#B07F70'], s: ['#A57464','#7E5648'], t: ['#F4D2C3','#D9A89A'] },
    lid:  { f: ['#F4D2C3','#C99183'],           s: ['#B58775','#8E6253'], t: ['#FBE4D6','#E8C5B5'] },
    bgGrad: 'radial-gradient(ellipse at 50% 42%, #F8E6DD 0%, #F3D9CE 55%, #E8C2B4 100%)',
  },
  velvet: {
    label: 'Velvet',
    body: { f: ['#5A2E2C','#3E1F1D','#241211'], s: ['#3A1B19','#1A0908'], t: ['#6E3935','#48211F'] },
    lid:  { f: ['#683632','#3F1E1C'],           s: ['#3F1E1C','#1F0908'], t: ['#7B3F3A','#4F2522'] },
    bgGrad: 'radial-gradient(ellipse at 50% 42%, #F3E5DA 0%, #E8D2C4 55%, #D9B8A8 100%)',
  },
  cream: {
    label: 'Cream',
    body: { f: ['#FBF6EE','#EBDFCA','#C9B594'], s: ['#B69E7B','#8E7858'], t: ['#FDFAF4','#E8D2A8'] },
    lid:  { f: ['#FDFAF4','#D6BC8E'],           s: ['#A28A65','#7E6948'], t: ['#FFFDF8','#EAD5A2'] },
    bgGrad: 'radial-gradient(ellipse at 50% 42%, #FBF6EE 0%, #F3EBDD 55%, #ECDFCE 100%)',
  },
  ink: {
    label: 'Ink',
    body: { f: ['#2E2520','#1F1814','#100B09'], s: ['#1A1411','#0A0706'], t: ['#3A2F28','#1F1814'] },
    lid:  { f: ['#352A24','#1A1411'],           s: ['#1A1411','#0A0706'], t: ['#42352D','#22191A'] },
    bgGrad: 'radial-gradient(ellipse at 50% 42%, #EFE7DA 0%, #DCD0BC 55%, #BFAE93 100%)',
  },
};

const RIBBONS = {
  gold: {
    label: 'Gold',
    f: ['#F4D78A','#D6A85A','#B8893E','#8E6724'],
    s: ['#A37B30','#7A5A1F'],
    t: ['#F2D592','#C99B4F'],
    bow: { core: '#F2D592', mid: '#C99B4F', deep: '#8E6724' },
    accent: '#F2D592',
  },
  champagne: {
    label: 'Champagne',
    f: ['#FBE9C2','#E8D2A8','#C8A874','#967B4A'],
    s: ['#B59770','#8B6F4F'],
    t: ['#FBE9C2','#D6BC8E'],
    bow: { core: '#FBE9C2', mid: '#D6BC8E', deep: '#8B6F4F' },
    accent: '#FBE9C2',
  },
  ink: {
    label: 'Ink',
    f: ['#3A2F28','#22191A','#0F0908','#000000'],
    s: ['#1A1411','#0A0706'],
    t: ['#3A2F28','#1F1814'],
    bow: { core: '#3A2F28', mid: '#1F1814', deep: '#0A0706' },
    accent: '#B8893E',
  },
  blush: {
    label: 'Blush',
    f: ['#FBE0D2','#E9B5A1','#C58772','#8C5A4A'],
    s: ['#A87767','#7A5246'],
    t: ['#FBE0D2','#D9A89A'],
    bow: { core: '#FBE0D2', mid: '#D9A89A', deep: '#7A5246' },
    accent: '#FBE0D2',
  },
};

const SHAKE_LEVELS = {
  none:   { kf: null,           duration: 0 },
  gentle: { kf: 'boxWiggle',    duration: 800 },
  strong: { kf: 'boxShakeHard', duration: 700 },
};

function PresentBox3D({ wiggle, opening, opened, finish, ribbon, shakeKf, monogramOnLid, ambientGlow }) {
  const F = FINISHES[finish] || FINISHES.rose;
  const R = RIBBONS[ribbon]  || RIBBONS.gold;
  const id = (k) => `pb-${k}-${finish}-${ribbon}`;

  return (
    <div style={{
      width: 380, height: 360, position: 'relative',
      perspective: '1400px',
      animation: opening ? 'boxFloat 2200ms cubic-bezier(0.22,1,0.36,1) forwards' : 'boxBreathe 5500ms ease-in-out infinite',
    }}>
      {/* Contact shadow */}
      <div style={{
        position: 'absolute', left: '50%', bottom: 18, width: 320, height: 44,
        transform: 'translateX(-50%)',
        background: 'radial-gradient(ellipse, rgba(43,31,26,0.55) 0%, rgba(43,31,26,0.22) 35%, transparent 75%)',
        filter: 'blur(14px)',
        opacity: opening ? 0.3 : 0.85,
        transition: 'opacity 1200ms cubic-bezier(0.22,1,0.36,1)',
      }} />
      {/* Floor reflection */}
      <div style={{
        position: 'absolute', left: '50%', bottom: 6, width: 240, height: 14,
        transform: 'translateX(-50%)',
        background: 'radial-gradient(ellipse, rgba(232,210,168,0.35) 0%, transparent 70%)',
        filter: 'blur(6px)',
        opacity: opened && ambientGlow ? 1 : 0,
        transition: 'opacity 900ms',
      }} />
      {/* Ambient gold glow */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%', width: 560, height: 460,
        transform: 'translate(-50%,-50%)',
        background: 'radial-gradient(ellipse, rgba(232,210,168,0.65) 0%, rgba(232,210,168,0.20) 38%, transparent 70%)',
        opacity: opened && ambientGlow ? 1 : 0,
        transition: 'opacity 900ms cubic-bezier(0.22,1,0.36,1)',
        pointerEvents: 'none',
      }} />

      <div key={wiggle} style={{
        position: 'absolute', inset: 0,
        animation: opening || !shakeKf ? 'none' : `${shakeKf} ${SHAKE_LEVELS[Object.keys(SHAKE_LEVELS).find(k => SHAKE_LEVELS[k].kf === shakeKf)]?.duration || 800}ms cubic-bezier(0.36,0.07,0.19,0.97)`,
        transformOrigin: '50% 90%',
      }}>
        <svg viewBox="0 0 360 340" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          <defs>
            <linearGradient id={id('frontFace')} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={F.body.f[0]} />
              <stop offset="55%"  stopColor={F.body.f[1]} />
              <stop offset="100%" stopColor={F.body.f[2]} />
            </linearGradient>
            <linearGradient id={id('sideFace')} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor={F.body.s[0]} />
              <stop offset="100%" stopColor={F.body.s[1]} />
            </linearGradient>
            <linearGradient id={id('topFace')} x1="0" y1="0" x2="0.4" y2="1">
              <stop offset="0%"   stopColor={F.body.t[0]} />
              <stop offset="100%" stopColor={F.body.t[1]} />
            </linearGradient>
            <linearGradient id={id('lidFront')} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={F.lid.f[0]} />
              <stop offset="100%" stopColor={F.lid.f[1]} />
            </linearGradient>
            <linearGradient id={id('lidSide')} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor={F.lid.s[0]} />
              <stop offset="100%" stopColor={F.lid.s[1]} />
            </linearGradient>
            <linearGradient id={id('lidTop')} x1="0" y1="0" x2="0.3" y2="1">
              <stop offset="0%"   stopColor={F.lid.t[0]} />
              <stop offset="100%" stopColor={F.lid.t[1]} />
            </linearGradient>
            <linearGradient id={id('ribbonFront')} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={R.f[0]} />
              <stop offset="38%"  stopColor={R.f[1]} />
              <stop offset="60%"  stopColor={R.f[2]} />
              <stop offset="100%" stopColor={R.f[3]} />
            </linearGradient>
            <linearGradient id={id('ribbonSide')} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor={R.s[0]} />
              <stop offset="100%" stopColor={R.s[1]} />
            </linearGradient>
            <linearGradient id={id('ribbonTop')} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={R.t[0]} />
              <stop offset="100%" stopColor={R.t[1]} />
            </linearGradient>
            <radialGradient id={id('bowLoop')} cx="0.35" cy="0.3" r="0.85">
              <stop offset="0%"   stopColor={R.bow.core} />
              <stop offset="50%"  stopColor={R.bow.mid} />
              <stop offset="100%" stopColor={R.bow.deep} />
            </radialGradient>
            <radialGradient id={id('bowKnot')} cx="0.5" cy="0.4" r="0.7">
              <stop offset="0%"   stopColor={R.bow.core} />
              <stop offset="100%" stopColor={R.bow.deep} />
            </radialGradient>
            <radialGradient id={id('innerGlow')} cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%"   stopColor="#FFF1CF" stopOpacity="1" />
              <stop offset="60%"  stopColor="#F2D592" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#F2D592" stopOpacity="0" />
            </radialGradient>
            <linearGradient id={id('specular')} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"  stopColor="rgba(255,255,255,0.18)" />
              <stop offset="40%" stopColor="rgba(255,255,255,0.0)" />
            </linearGradient>
          </defs>

          {/* Box body */}
          <polygon points="80,170 280,170 310,148 110,148" fill={`url(#${id('topFace')})`}
                   opacity={opened ? 1 : 0} style={{ transition: 'opacity 600ms' }} />
          <polygon points="280,170 280,280 310,258 310,148" fill={`url(#${id('sideFace')})`} />
          <rect x="80" y="170" width="200" height="110" fill={`url(#${id('frontFace')})`} />
          <rect x="80" y="170" width="200" height="6"   fill="rgba(20,12,10,0.45)" />
          <rect x="80" y="176" width="200" height="1.5" fill="rgba(255,242,228,0.30)" />
          <rect x="80" y="170" width="200" height="55"  fill={`url(#${id('specular')})`} />
          <rect x="80" y="278" width="200" height="1"   fill={R.accent} opacity="0.5" />

          <ellipse cx="195" cy="165" rx="100" ry="14" fill={`url(#${id('innerGlow')})`}
                   opacity={opened ? 1 : 0}
                   style={{ transition: 'opacity 700ms cubic-bezier(0.22,1,0.36,1)' }} />

          {/* Ribbon on body */}
          <rect x="166" y="170" width="28" height="110" fill={`url(#${id('ribbonFront')})`} />
          <rect x="171" y="170" width="3"  height="110" fill="rgba(255,250,225,0.50)" />
          <rect x="187" y="170" width="1.5" height="110" fill="rgba(255,250,225,0.22)" />
          <polygon points="194,170 199,166 199,276 194,280" fill={`url(#${id('ribbonSide')})`} />
          <polygon points="166,170 194,170 199,166 171,166" fill={`url(#${id('ribbonTop')})`}
                   opacity={opened ? 1 : 0} style={{ transition: 'opacity 500ms' }} />

          {/* Lid */}
          <g style={{
            transform: opening ? 'translate(-4px,-200px) rotate(-16deg)' : 'translate(0,0)',
            transformOrigin: '195px 150px',
            transition: 'transform 1300ms cubic-bezier(0.34,1.2,0.64,1)',
          }}>
            <polygon points="285,148 285,184 318,160 318,124" fill={`url(#${id('lidSide')})`} />
            <rect x="74" y="148" width="211" height="36"  fill={`url(#${id('lidFront')})`} />
            <polygon points="74,148 285,148 318,124 107,124" fill={`url(#${id('lidTop')})`} />
            <rect x="74" y="180" width="211" height="4"   fill="rgba(20,12,10,0.30)" />
            <rect x="74" y="150" width="211" height="1.5" fill="rgba(255,250,240,0.7)" />
            <rect x="74" y="148" width="211" height="0.8" fill={R.accent} opacity="0.6" />
            <rect x="74" y="183" width="211" height="0.8" fill={R.accent} opacity="0.45" />
            <polygon points="285,150 285,158 287,156 287,150" fill="rgba(255,250,240,0.4)" />

            {monogramOnLid && (
              <g transform="translate(140, 130)">
                <text x="0" y="0" fontFamily="Cormorant Garamond, serif"
                      fontStyle="italic" fontWeight="400" fontSize="13"
                      fill={R.accent} opacity="0.85" letterSpacing="0.08em">for hilary</text>
              </g>
            )}

            {/* Ribbon on lid */}
            <rect x="166" y="148" width="28" height="36" fill={`url(#${id('ribbonFront')})`} />
            <rect x="171" y="148" width="3"  height="36" fill="rgba(255,250,225,0.55)" />
            <rect x="187" y="148" width="1.5" height="36" fill="rgba(255,250,225,0.25)" />
            <polygon points="194,148 199,144 199,184 194,184" fill={`url(#${id('ribbonSide')})`} />
            <polygon points="166,148 194,148 216,124 188,124" fill={`url(#${id('ribbonTop')})`} />
            <polygon points="172,144 178,144 200,120 194,120" fill="rgba(255,250,225,0.35)" />

            {/* Bow */}
            <g transform="translate(202, 116)">
              <ellipse cx="0" cy="6" rx="32" ry="6" fill="rgba(20,12,10,0.22)" />
              <path d="M -5,7 Q -20,26 -28,46 L -19,48 Q -10,30 0,16 Z" fill={`url(#${id('bowLoop')})`} />
              <path d="M  5,7 Q  20,26  28,46 L  19,48 Q  10,30 0,16 Z" fill={`url(#${id('bowLoop')})`} />
              <path d="M -28,46 L -22,42 L -19,48 Z" fill="rgba(20,12,10,0.45)" />
              <path d="M  28,46 L  22,42 L  19,48 Z" fill="rgba(20,12,10,0.45)" />
              <ellipse cx="-22" cy="-1" rx="20" ry="12" fill={`url(#${id('bowLoop')})`} transform="rotate(-16 -22 -1)" />
              <ellipse cx="-22" cy="-1" rx="12" ry="6"  fill="rgba(20,12,10,0.22)" transform="rotate(-16 -22 -1)" />
              <ellipse cx="-22" cy="-3" rx="8"  ry="2"  fill="rgba(255,250,225,0.4)" transform="rotate(-16 -22 -3)" />
              <ellipse cx="22"  cy="-1" rx="20" ry="12" fill={`url(#${id('bowLoop')})`} transform="rotate(16 22 -1)" />
              <ellipse cx="22"  cy="-1" rx="12" ry="6"  fill="rgba(20,12,10,0.22)" transform="rotate(16 22 -1)" />
              <ellipse cx="22"  cy="-3" rx="8"  ry="2"  fill="rgba(255,250,225,0.4)" transform="rotate(16 22 -3)" />
              <ellipse cx="0" cy="0" rx="8" ry="10" fill={`url(#${id('bowKnot')})`} />
              <ellipse cx="-1.5" cy="-2" rx="2.5" ry="1.5" fill="rgba(255,250,225,0.65)" />
              <ellipse cx="0" cy="0" rx="8" ry="10" fill="none" stroke="rgba(20,12,10,0.25)" strokeWidth="0.5" />
            </g>
          </g>

          {/* Hangtag */}
          <g transform="translate(286, 220) rotate(-8)" opacity={opening ? 0 : 1} style={{ transition: 'opacity 400ms' }}>
            <rect x="0" y="0" width="74" height="38" rx="3" fill="#FFFDF8" stroke="rgba(43,31,26,0.12)" />
            <line x1="0" y1="6" x2="74" y2="6" stroke="rgba(43,31,26,0.06)" />
            <circle cx="6" cy="6" r="2.5" fill="none" stroke={R.accent} strokeWidth="1" />
            <text x="37" y="25" textAnchor="middle"
                  fontFamily="Caveat, cursive" fontSize="18" fill="#2B1F1A">for hilary ✦</text>
          </g>
        </svg>
      </div>
    </div>
  );
}

function PresentChapter({ onNext }) {
  const [t, setTweak] = useTweaks(PRESENT_DEFAULTS);
  const [wiggleKey, setWiggleKey] = usePS(0);
  const [opening, setOpening] = usePS(false);
  const [opened, setOpened] = usePS(false);
  const [taps, setTaps] = usePS(0);

  const shakeKf = SHAKE_LEVELS[t.shake]?.kf || null;

  const tap = () => {
    if (opening) return;
    if (window.startBgAudio) window.startBgAudio();
    setTaps(1);
    setWiggleKey(k => k + 1);
    setTimeout(() => {
      setOpening(true);
      setTimeout(() => setOpened(true), 1100);
      setTimeout(() => onNext(), 2600);
    }, 250);
  };

  const F = FINISHES[t.boxFinish] || FINISHES.rose;

  return (
    <section style={{
      minHeight: '100vh',
      background: F.bgGrad,
      transition: 'background 900ms cubic-bezier(0.22,1,0.36,1)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      position: 'relative', padding: '120px 24px 100px',
    }}>
      <Reveal delay={100}>
        <Eyebrow style={{ marginBottom: 28, color: 'var(--taupe)' }}>
          may · ninth · two&nbsp;thousand&nbsp;twenty&nbsp;six
        </Eyebrow>
      </Reveal>

      <Reveal delay={400} duration={1300}>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 300, fontSize: 'clamp(56px, 7.5vw, 124px)',
          letterSpacing: '-0.025em', lineHeight: 1.28, color: 'var(--ink)',
          textAlign: 'center', margin: '0 0 56px', paddingBottom: 16,
        }}>
          Happy birthday,<br />
          <span style={{ fontStyle: 'italic', fontWeight: 400 }}>baby g.</span>
        </h1>
      </Reveal>

      <Reveal delay={1100}>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
          fontSize: 22, color: 'var(--taupe)',
          maxWidth: 420, textAlign: 'center', margin: '0 0 56px',
          lineHeight: 1.4,
        }}>I made you something. Tap, when you're ready.</p>
      </Reveal>

      <Reveal delay={1600}>
        <div onClick={tap} style={{ cursor: opening ? 'default' : 'pointer' }}>
          <PresentBox3D
            wiggle={wiggleKey} opening={opening} opened={opened}
            finish={t.boxFinish} ribbon={t.ribbonColor}
            shakeKf={shakeKf}
            monogramOnLid={t.monogramOnLid}
            ambientGlow={t.ambientGlow}
          />
        </div>
      </Reveal>

      <div style={{
        marginTop: 24,
        fontFamily: "'Inter', sans-serif", fontSize: 11,
        letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-3)',
        opacity: opening ? 0 : (taps > 0 ? 0.6 : 1),
        transition: 'opacity 700ms',
        animation: 'shimmer 2400ms ease-in-out infinite',
      }}>
        {taps === 0 ? 'tap to begin' : 'opening —'}
      </div>

      <TweaksPanel>
        <TweakSection label="The box" />
        <TweakRadio
          label="Finish"
          value={t.boxFinish}
          options={['rose','velvet','cream','ink']}
          onChange={(v) => setTweak('boxFinish', v)}
        />
        <TweakRadio
          label="Ribbon"
          value={t.ribbonColor}
          options={['gold','champagne','ink','blush']}
          onChange={(v) => setTweak('ribbonColor', v)}
        />
        <TweakSection label="Motion" />
        <TweakRadio
          label="Shake"
          value={t.shake}
          options={['none','gentle','strong']}
          onChange={(v) => setTweak('shake', v)}
        />
        <TweakToggle
          label="Foil monogram on lid"
          value={t.monogramOnLid}
          onChange={(v) => setTweak('monogramOnLid', v)}
        />
        <TweakToggle
          label="Ambient gold glow"
          value={t.ambientGlow}
          onChange={(v) => setTweak('ambientGlow', v)}
        />
      </TweaksPanel>
    </section>
  );
}

window.PresentChapter = PresentChapter;

