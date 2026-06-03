/* PokéVerse UI Kit — Pokémon detail modal sheet */
function DetailSheet({ p, fav, onFav, onClose }) {
  const [closing, setClosing] = useState(false);
  const [style, setStyle] = useState('home');   // home | art | pixel
  const [shiny, setShiny] = useState(false);
  const [caught, setCaught] = useState(false);
  const tint = TYPE_COLORS[p.types[0]];

  const close = () => { setClosing(true); setTimeout(onClose, 200); };

  const spriteUrl = () => {
    if (style === 'pixel') return `${SPRITE_BASE}/versions/generation-v/black-white/animated/${shiny?'shiny/':''}${p.id}.gif`;
    if (style === 'art')   return `${SPRITE_BASE}/other/official-artwork/${shiny?'shiny/':''}${p.id}.png`;
    return `${SPRITE_BASE}/other/home/${shiny?'shiny/':''}${p.id}.png`;
  };

  const styleBtn = (id, label, ic) => (
    <Pressable onClick={() => setStyle(id)} activeScale={0.94} style={{
      flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:'9px',
      borderRadius:10, fontWeight:700, fontSize:12,
      background: style===id ? RED : '#f3f4f6', color: style===id ? '#fff' : '#6b7280',
    }}><Icon name={ic} style={{ fontSize:12 }} />{label}</Pressable>
  );

  return (
    <div onClick={close} style={{
      position:'absolute', inset:0, zIndex:80, background:'rgba(0,0,0,.4)',
      display:'flex', alignItems:'flex-end', opacity: closing ? 0 : 1, transition:'opacity .2s',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background:'#f9fafb', width:'100%', height:'94%', borderRadius:'24px 24px 0 0', overflow:'hidden',
        transform: closing ? 'translateY(100%)' : 'translateY(0)', transition:'transform .25s cubic-bezier(.2,.8,.2,1)',
        display:'flex', flexDirection:'column',
      }}>
        {/* hero */}
        <div style={{ background:`linear-gradient(160deg, ${tint}, ${tint}cc)`, padding:'14px 18px 0', position:'relative' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', color:'#fff' }}>
            <Pressable onClick={close} style={{ width:40, height:40, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Icon name="chevron-down" style={{ fontSize:20 }} />
            </Pressable>
            <div style={{ fontFamily:"'Press Start 2P'", fontSize:12, opacity:.9 }}>{dexNo(p.id)}</div>
            <Pressable onClick={onFav} activeScale={0.8} style={{ width:40, height:40, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Icon name="heart" solid={fav} style={{ fontSize:22 }} />
            </Pressable>
          </div>
          <div style={{ padding:'0 4px 6px' }}>
            <div style={{ fontFamily:"'VT323', monospace", fontWeight:400, fontSize:38, color:'#fff', textTransform:'capitalize', textShadow:'0 2px 6px rgba(0,0,0,.2)', letterSpacing:'.01em', lineHeight:1 }}>{p.name}</div>
            <div style={{ color:'rgba(255,255,255,.92)', fontWeight:600, fontSize:14 }}>{p.genus}</div>
            <div style={{ display:'flex', gap:7, marginTop:9 }}>{p.types.map(t => (
              <span key={t} style={{ background:'rgba(255,255,255,.25)', color:'#fff', fontWeight:800, fontSize:12, padding:'5px 14px', borderRadius:999, textTransform:'capitalize', backdropFilter:'blur(4px)' }}>{t}</span>
            ))}</div>
          </div>
          <div style={{ display:'flex', justifyContent:'center', marginTop:-4 }}>
            <div style={{ width:170, height:170, display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
              <PokeBall size={150} style={{ position:'absolute', opacity:.14, boxShadow:'none' }} />
              <img src={spriteUrl()} alt={p.name} style={{ maxWidth:'88%', maxHeight:'88%', position:'relative', filter:'drop-shadow(0 8px 12px rgba(0,0,0,.25))', imageRendering: style==='pixel'?'pixelated':'auto' }} />
            </div>
          </div>
        </div>

        {/* body */}
        <div style={{ flex:1, overflowY:'auto', padding:'18px' }}>
          {/* sprite controls */}
          <div style={{ display:'flex', gap:8, marginBottom:10 }}>
            {styleBtn('home','HOME','cube')}
            {styleBtn('art','Artwork','palette')}
            {styleBtn('pixel','Pixel','ghost')}
          </div>
          <Pressable onClick={() => setShiny(!shiny)} activeScale={0.96} style={{
            display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'10px', borderRadius:10,
            background: shiny ? '#fff7e6' : '#f3f4f6', border:`1px solid ${shiny?'#f5c542':'#e5e7eb'}`, marginBottom:18,
          }}>
            <Icon name="star" solid={shiny} style={{ fontSize:14, color: shiny ? '#f5a623' : '#9ca3af' }} />
            <span style={{ fontWeight:700, fontSize:13, color: shiny ? '#b8860b' : '#6b7280' }}>{shiny ? 'Showing shiny' : 'Show shiny'}</span>
          </Pressable>

          {/* description */}
          <Card>
            <p style={{ margin:0, color:'#374151', fontSize:15, lineHeight:1.55 }}>{p.desc}</p>
            <div style={{ display:'flex', gap:12, marginTop:14 }}>
              <Mini label="Height" value={p.h} />
              <Mini label="Weight" value={p.w} />
            </div>
          </Card>

          {/* stats */}
          <SectionTitle>Base Stats</SectionTitle>
          <Card>
            {p.stats.map((s, i) => <StatBar key={s.name} name={s.name} value={s.v} delay={i*90} animate={!closing} />)}
          </Card>

          {/* abilities */}
          <SectionTitle>Abilities</SectionTitle>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:6 }}>
            {p.abilities.map(a => (
              <div key={a} style={{ background:'#fff', borderRadius:12, padding:'10px 16px', boxShadow:'0 2px 4px rgba(0,0,0,.08)', fontWeight:700, fontSize:14, color:'#374151' }}>{a}</div>
            ))}
          </div>

          {/* evolution */}
          <SectionTitle>Evolution</SectionTitle>
          <Card>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-around' }}>
              {p.evo.map((id, i) => (
                <React.Fragment key={id}>
                  {i>0 && <Icon name="arrow-right-long" style={{ fontSize:16, color:'#d1d5db' }} />}
                  <div style={{ textAlign:'center', opacity: id===p.id?1:.85 }}>
                    <div style={{ width:62, height:62, display:'flex', alignItems:'center', justifyContent:'center', background: id===p.id?`${tint}1f`:'#f3f4f6', borderRadius:14, border: id===p.id?`2px solid ${tint}`:'2px solid transparent' }}>
                      <img src={homeSprite(id)} alt="" style={{ maxWidth:'82%', maxHeight:'82%' }} />
                    </div>
                    <div style={{ fontFamily:"'Press Start 2P'", fontSize:8, color:'#9ca3af', marginTop:6 }}>{dexNo(id)}</div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </Card>

          {/* catch CTA */}
          <Pressable onClick={() => setCaught(!caught)} activeScale={0.97} style={{
            display:'flex', alignItems:'center', justifyContent:'center', gap:10, padding:'15px', borderRadius:14,
            background: caught ? '#fff' : RED, color: caught ? RED : '#fff',
            border: caught ? `2px solid ${RED}` : 'none', boxShadow:'0 4px 12px rgba(244,67,54,.28)', marginTop:18, marginBottom:8, fontWeight:800, fontSize:16,
          }}>
            <PokeBall size={22} style={{ boxShadow:'none' }} />
            {caught ? 'Caught!  Release' : 'Catch'}
          </Pressable>
        </div>
      </div>
    </div>
  );
}

function Card({ children }) {
  return <div style={{ background:'#fff', borderRadius:16, padding:16, boxShadow:'0 2px 8px rgba(0,0,0,.06)', marginBottom:16 }}>{children}</div>;
}
function SectionTitle({ children }) {
  return <div style={{ fontWeight:800, fontSize:17, color:'#1f2937', margin:'4px 2px 10px' }}>{children}</div>;
}
function Mini({ label, value }) {
  return (
    <div style={{ flex:1, background:'#f9fafb', borderRadius:12, padding:'10px 14px' }}>
      <div style={{ fontSize:11, color:'#9ca3af', fontWeight:700, textTransform:'uppercase', letterSpacing:'.04em' }}>{label}</div>
      <div style={{ fontWeight:800, fontSize:16, color:'#374151', marginTop:2 }}>{value}</div>
    </div>
  );
}

Object.assign(window, { DetailSheet });
