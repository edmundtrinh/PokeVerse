/* PokéVerse UI Kit — TCG (Binder Planner + holo cards) */
const RARITY = {
  'Common':      { foil:'none', glow:false },
  'Rare':        { foil:'linear-gradient(115deg, transparent 30%, rgba(255,215,0,.5) 50%, transparent 70%)', glow:false },
  'Holo':        { foil:'linear-gradient(115deg, rgba(255,0,255,.45), rgba(0,255,255,.45), rgba(255,255,0,.45), rgba(255,0,0,.45), rgba(0,255,0,.45))', glow:true },
  'Secret Rare': { foil:'linear-gradient(115deg, rgba(255,215,0,.55), rgba(255,20,147,.55), rgba(138,43,226,.55), rgba(0,191,255,.55), rgba(50,205,50,.55))', glow:true },
};

function HoloTCGCard({ c, w = 96, onClick }) {
  const r = RARITY[c.rarity] || RARITY.Common;
  const tint = TYPE_COLORS[(POKEMON.find(p => p.id === c.id) || {}).types?.[0]] || '#A8A878';
  return (
    <Pressable onClick={onClick} activeScale={0.95} style={{ width:w }}>
      <div style={{
        width:w, height:w*1.4, borderRadius:9, position:'relative', overflow:'hidden',
        background:`linear-gradient(160deg, ${tint}, ${tint}aa)`,
        border:'3px solid #f7d046', boxSizing:'border-box',
        boxShadow: r.glow ? `0 0 12px rgba(255,255,255,.55), 0 4px 10px rgba(0,0,0,.25)` : '0 4px 10px rgba(0,0,0,.2)',
      }}>
        <div style={{ position:'absolute', top:5, left:7, color:'#fff', fontWeight:800, fontSize:9, textShadow:'0 1px 2px rgba(0,0,0,.4)' }}>{c.name}</div>
        <div style={{ position:'absolute', top:`${w*0.18}px`, left:'50%', transform:'translateX(-50%)', width:'82%', height:'52%', background:'rgba(255,255,255,.92)', borderRadius:4, display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid rgba(0,0,0,.1)' }}>
          <img src={artSprite(c.id)} alt={c.name} style={{ maxWidth:'92%', maxHeight:'92%' }} />
        </div>
        <div style={{ position:'absolute', bottom:5, left:7, right:7, color:'#fff', fontSize:7, fontWeight:600, textShadow:'0 1px 2px rgba(0,0,0,.5)', display:'flex', justifyContent:'space-between' }}>
          <span>{c.set}</span><span>{c.rarity}</span>
        </div>
        {/* foil overlay */}
        {r.foil !== 'none' && <div style={{ position:'absolute', inset:0, background:r.foil, mixBlendMode:'color-dodge', opacity:.6, animation:'pvshimmer 3s ease-in-out infinite' }} />}
      </div>
    </Pressable>
  );
}

function TCGScreen({ onCard }) {
  const [mode, setMode] = useState('binder');
  const tab = (id, label, ic) => (
    <Pressable key={id} onClick={() => setMode(id)} activeScale={0.95} style={{
      flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:'10px 6px',
      borderRadius:20, fontWeight:700, fontSize:12.5,
      background: mode===id ? RED : '#f8f8f8', color: mode===id ? '#fff' : '#666',
      border:`2px solid ${mode===id ? RED_PRESS : 'transparent'}`,
    }}><Icon name={ic} style={{ fontSize:14 }} />{label}</Pressable>
  );

  return (
    <div>
      <div style={{ background:'#fff', display:'flex', gap:6, padding:'10px 14px', borderBottom:'1px solid #e0e0e0' }}>
        {tab('binder','Binder', 'table-cells')}
        {tab('saved','My Binders', 'folder')}
        {tab('deck','Deck Builder', 'layer-group')}
      </div>

      {mode === 'binder' && (
        <div style={{ padding:'16px' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
            <div>
              <div style={{ fontWeight:800, fontSize:18, color:'#1f2937' }}>Kanto Classics</div>
              <div style={{ fontSize:12.5, color:'#9ca3af', fontWeight:600 }}>3×3 binder · 9 / 9 slots</div>
            </div>
            <div style={{ display:'flex', gap:6 }}>
              {['Base Set','Holo'].map(t => <span key={t} style={{ background:'#fdecea', color:RED, fontWeight:700, fontSize:11, padding:'5px 11px', borderRadius:999 }}>{t}</span>)}
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:12, justifyItems:'center' }}>
            {TCG_CARDS.map(c => <HoloTCGCard key={c.id} c={c} w={96} onClick={() => onCard(c)} />)}
          </div>
        </div>
      )}

      {mode === 'saved' && (
        <div style={{ padding:'16px', display:'flex', flexDirection:'column', gap:12 }}>
          {[['Kanto Classics','#f44336',9],['Shiny Vault','#9c27b0',24],['Investment Binder','#4caf50',16]].map(([n,col,ct]) => (
            <div key={n} style={{ display:'flex', alignItems:'center', gap:14, background:'#fff', borderRadius:16, padding:14, boxShadow:'0 2px 8px rgba(0,0,0,.07)' }}>
              <div style={{ width:46, height:60, borderRadius:8, background:col, boxShadow:'inset -4px 0 0 rgba(0,0,0,.15)' }} />
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:800, fontSize:16, color:'#1f2937' }}>{n}</div>
                <div style={{ fontSize:12.5, color:'#9ca3af', fontWeight:600 }}>{ct} cards</div>
              </div>
              <Icon name="chevron-right" style={{ fontSize:16, color:'#d1d5db' }} />
            </div>
          ))}
        </div>
      )}

      {mode === 'deck' && (
        <div style={{ padding:'16px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, height:44, background:'#f3f4f6', border:'1px solid #d1d5db', borderRadius:22, padding:'0 16px', marginBottom:16 }}>
            <Icon name="magnifying-glass" style={{ fontSize:16, color:'#9ca3af' }} />
            <span style={{ color:'#9ca3af', fontSize:15 }}>Search cards to add…</span>
          </div>
          <div style={{ fontSize:13, color:'#6b7280', fontWeight:700, marginBottom:12 }}>Your deck · 4 cards</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:8, justifyItems:'center' }}>
            {TCG_CARDS.slice(0,4).map(c => <HoloTCGCard key={c.id} c={c} w={70} onClick={() => onCard(c)} />)}
          </div>
        </div>
      )}
    </div>
  );
}

/* Enlarged interactive holo card (tilt on pointer move) */
function HoloModal({ c, onClose }) {
  const ref = useRef(null);
  const [t, setT] = useState({ x:0, y:0 });
  const r = RARITY[c.rarity] || RARITY.Common;
  const tint = TYPE_COLORS[(POKEMON.find(p => p.id === c.id) || {}).types?.[0]] || '#A8A878';
  const move = (e) => {
    const el = ref.current; if (!el) return;
    const b = el.getBoundingClientRect();
    const px = (e.clientX - b.left) / b.width - 0.5;
    const py = (e.clientY - b.top) / b.height - 0.5;
    setT({ x: -py*16, y: px*16 });
  };
  return (
    <div onClick={onClose} style={{ position:'absolute', inset:0, zIndex:90, background:'rgba(0,0,0,.6)', display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(2px)' }}>
      <div onClick={e=>e.stopPropagation()} onMouseMove={move} onMouseLeave={()=>setT({x:0,y:0})}
        style={{ perspective:900 }}>
        <div ref={ref} style={{
          width:240, height:336, borderRadius:16, position:'relative', overflow:'hidden',
          background:`linear-gradient(160deg, ${tint}, ${tint}aa)`, border:'6px solid #f7d046', boxSizing:'border-box',
          transform:`rotateX(${t.x}deg) rotateY(${t.y}deg)`, transition:'transform .08s',
          boxShadow:'0 30px 60px rgba(0,0,0,.5)',
        }}>
          <div style={{ position:'absolute', top:12, left:16, color:'#fff', fontWeight:900, fontSize:18, textShadow:'0 1px 3px rgba(0,0,0,.5)' }}>{c.name}</div>
          <div style={{ position:'absolute', top:52, left:'50%', transform:'translateX(-50%)', width:'82%', height:'52%', background:'rgba(255,255,255,.94)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <img src={artSprite(c.id)} alt={c.name} style={{ maxWidth:'92%', maxHeight:'92%' }} />
          </div>
          <div style={{ position:'absolute', bottom:14, left:16, right:16, color:'#fff', fontSize:12, fontWeight:700, textShadow:'0 1px 3px rgba(0,0,0,.6)', display:'flex', justifyContent:'space-between' }}>
            <span>{c.set}</span><span>{c.rarity}</span>
          </div>
          {r.foil !== 'none' && <div style={{ position:'absolute', inset:0, background:r.foil, mixBlendMode:'color-dodge', opacity:.7, animation:'pvshimmer 3s ease-in-out infinite' }} />}
          <div style={{ position:'absolute', inset:0, background:`radial-gradient(circle at ${50+t.y*3}% ${50+t.x*3}%, rgba(255,255,255,.5), transparent 55%)`, mixBlendMode:'soft-light' }} />
        </div>
        <div style={{ textAlign:'center', color:'rgba(255,255,255,.7)', fontSize:12, marginTop:14, fontWeight:600 }}>Move your cursor across the card</div>
      </div>
    </div>
  );
}

Object.assign(window, { TCGScreen, HoloTCGCard, HoloModal });
