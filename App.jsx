// App.jsx — root

const { useState: useSA, useEffect: useEA } = React;

const ORDER = ['present', 'memories', 'reasons', 'letter', 'hunt'];
const HELPER_BY_CHAPTER = {
  present:  'Tap the present, or press →',
  memories: 'Hover the photos · then →',
  reasons:  'Click a card to turn it · then →',
  letter:   'Read slowly · then →',
  hunt:     'Solve the clue · then find me',
};

function App() {
  const [chapter, setChapter] = useSA('present');

  const go = (id) => {
    if (!ORDER.includes(id)) return;
    setChapter(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const next = () => {
    const i = ORDER.indexOf(chapter);
    if (i < ORDER.length - 1) go(ORDER[i + 1]);
  };

  useEA(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') {
        const i = ORDER.indexOf(chapter);
        if (i > 0) go(ORDER[i - 1]);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [chapter]);

  const idx = ORDER.indexOf(chapter) + 1;

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: 'var(--cream)' }}>
      <TopNav current={chapter} onGo={go} />

      <div data-screen-label={`0${idx} ${chapter}`} key={chapter}
           style={{ animation: 'fadeUp 1100ms cubic-bezier(0.22,1,0.36,1)' }}>
        {chapter === 'present'  && <PresentChapter  onNext={next} />}
        {chapter === 'memories' && <MemoriesChapter onNext={next} />}
        {chapter === 'reasons'  && <ReasonsChapter  onNext={next} />}
        {chapter === 'letter'   && <LetterChapter   onNext={next} />}
        {chapter === 'hunt'     && <HuntChapter     onRestart={() => go('present')} />}
      </div>

      <PageHelpers index={idx} total={ORDER.length} helperText={HELPER_BY_CHAPTER[chapter]} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
