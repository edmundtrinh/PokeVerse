/* PokéVerse UI Kit — Pokédex (search, filter rails, list) */
function PokemonCard({ p, fav, onFav, onOpen }) {
  const tint = TYPE_COLORS[p.types[0]];
  return (
    <Pressable onClick={onOpen} style={{
      display:'flex', alignItems:'center', background:'#fff', borderRadius:16, padding:'12px 14px',
      margin:'0 0 12px', boxShadow:'0 4px 12px rgba(0,0,0,.10)',
      border:`1px solid ${tint}40`, backgroundColor:`${tint}15`,
    }}>
      <div style={{ fontFamily:"'Press Start 2P'", color:'#9ca3af', fontSize:11, width:54, textAlign:'center' }}>{dexNo(p.id)}</div>
      <div style={{ width:56, height:56, margin:'0 12px', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <img src={homeSprite(p.id)} alt={p.name} style={{ maxWidth:'100%', maxHeight:'100%' }} />
      </div>
      <div style={{ flex:1 }}>
        <div style={{ fontFamily:"'VT323', monospace", fontWeight:400, fontSize:23, color:'#1f2937', textTransform:'capitalize', letterSpacing:'.01em', lineHeight:1 }}>{p.name}</div>
        <div style={{ display:'flex', gap:6, marginTop:5 }}>{p.types.map(t => <TypeBadge key={t} type={t} size="sm" />)}</div>
      </div>
      <Pressable onClick={(e) => { e.stopPropagation(); onFav(); }} activeScale={0.8}
        style={{ padding:8, marginRight:4 }}>
        <Icon name="heart" solid={fav} style={{ fontSize:22, color: fav ? '#ef4444' : '#9ca3af' }} />
      </Pressable>
      <Icon name="chevron-right" style={{ fontSize:16, color:'#9ca3af' }} />
    </Pressable>
  );
}

function Pokedex({ favorites, toggleFav, onOpen, onlyFavs, setOnlyFavs }) {
  const [query, setQuery] = useState('');
  const [activeTypes, setActiveTypes] = useState([]);
  const [activeGens, setActiveGens] = useState([]);
  const [searchFocus, setSearchFocus] = useState(false);

  const TYPES = Object.keys(TYPE_COLORS);

  const toggle = (arr, set, v) => set(arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);

  const list = POKEMON.filter(p => {
    if (query.trim()) {
      const q = query.toLowerCase();
      if (!p.name.includes(q) && !String(p.id).includes(q) && !p.types.some(t => t.includes(q))) return false;
    }
    if (activeTypes.length && !p.types.some(t => activeTypes.includes(t))) return false;
    if (activeGens.length && !activeGens.includes(p.gen)) return false;
    if (onlyFavs && !favorites.has(p.id)) return false;
    return true;
  });

  return (
    <div>
      {/* search */}
      <div style={{ background:'#fff', padding:'12px 16px', borderBottom:'1px solid #e5e7eb' }}>
        <div style={{
          display:'flex', alignItems:'center', gap:10, height:44, background:'#f3f4f6',
          border:`1px solid ${searchFocus ? RED : '#d1d5db'}`, borderRadius:22, padding:'0 16px',
        }}>
          <Icon name="magnifying-glass" style={{ fontSize:16, color:'#9ca3af' }} />
          <input value={query} onChange={e => setQuery(e.target.value)} onFocus={() => setSearchFocus(true)} onBlur={() => setSearchFocus(false)}
            placeholder="Search name, number, or type…"
            style={{ flex:1, border:'none', outline:'none', background:'transparent', fontSize:15, color:'#374151', fontFamily:'inherit' }} />
        </div>
      </div>

      {/* type rail */}
      <div style={{ background:'#fff', padding:'12px 0', borderBottom:'1px solid #e5e7eb' }}>
        <div style={{ display:'flex', gap:8, overflowX:'auto', padding:'0 16px', scrollbarWidth:'none' }}>
          {TYPES.map(t => {
            const on = activeTypes.includes(t);
            return (
              <Pressable key={t} onClick={() => toggle(activeTypes, setActiveTypes, t)} activeScale={0.92} style={{
                background:TYPE_COLORS[t], color:'#fff', fontWeight:700, fontSize:13, padding:'8px 15px',
                borderRadius:16, whiteSpace:'nowrap', textTransform:'capitalize', flexShrink:0,
                opacity:on?1:.65, border:`2px solid ${on?'#fff':'transparent'}`,
                boxShadow:on?'0 2px 4px rgba(0,0,0,.15)':'none', textShadow:'0 1px 2px rgba(0,0,0,.3)',
              }}>{t}</Pressable>
            );
          })}
        </div>
      </div>

      {/* generation rail */}
      <div style={{ background:'#fff', padding:'12px 0', borderBottom:'1px solid #e5e7eb' }}>
        <div style={{ display:'flex', gap:8, overflowX:'auto', padding:'0 16px', scrollbarWidth:'none', alignItems:'center' }}>
          <Pressable onClick={() => setOnlyFavs(!onlyFavs)} activeScale={0.92} style={{
            display:'flex', alignItems:'center', gap:6, background: onlyFavs ? '#ef4444' : '#fff',
            border:'2px solid #ef4444', borderRadius:16, padding:'9px 14px', flexShrink:0,
          }}>
            <Icon name="heart" solid={onlyFavs} style={{ fontSize:13, color: onlyFavs ? '#fff' : '#ef4444' }} />
            <span style={{ fontWeight:800, fontSize:12, color: onlyFavs ? '#fff' : '#ef4444' }}>Favorites</span>
          </Pressable>
          {GENERATIONS.map(g => {
            const on = activeGens.includes(g.name);
            return (
              <Pressable key={g.name} onClick={() => toggle(activeGens, setActiveGens, g.name)} activeScale={0.92} style={{
                background:g.color, borderRadius:16, padding:'8px 14px', minWidth:74, textAlign:'center', flexShrink:0,
                opacity:on?1:.7, border:`2px solid ${on?'#fff':'transparent'}`,
                boxShadow:on?'0 2px 4px rgba(0,0,0,.15)':'none',
              }}>
                <div style={{ fontWeight:800, fontSize:13, color:'#fff', textShadow:'0 1px 2px rgba(0,0,0,.4)' }}>{g.name}</div>
                <div style={{ fontWeight:600, fontSize:10, color:'#fff', textShadow:'0 1px 2px rgba(0,0,0,.3)' }}>{g.label}</div>
              </Pressable>
            );
          })}
        </div>
      </div>

      {/* list */}
      <div style={{ padding:'16px' }}>
        <div style={{ fontSize:13, color:'#6b7280', fontWeight:600, marginBottom:12 }}>
          {list.length} Pokémon{onlyFavs ? ' · favorites' : ''}
        </div>
        {list.map(p => (
          <PokemonCard key={p.id} p={p} fav={favorites.has(p.id)} onFav={() => toggleFav(p.id)} onOpen={() => onOpen(p)} />
        ))}
        {list.length === 0 && (
          <div style={{ textAlign:'center', padding:'40px 0', color:'#9ca3af' }}>
            <PokeBall size={48} style={{ margin:'0 auto 14px', opacity:.5 }} />
            <div style={{ fontWeight:700 }}>No Pokémon match your filters</div>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { Pokedex, PokemonCard });
