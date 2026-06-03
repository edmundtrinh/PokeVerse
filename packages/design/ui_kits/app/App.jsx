/* PokéVerse UI Kit — root app (nav state machine + drawer) */
function Drawer({ open, onClose, screen, setScreen, user, onLogout }) {
  const items = [
    { id:'pokedex', label:'Pokédex', ic:'list' },
    { id:'tcg', label:'Trading Cards', ic:'table-cells' },
    { id:'team', label:'Team Builder', ic:'users' },
  ];
  return (
    <div style={{ position:'absolute', inset:0, zIndex:70, pointerEvents: open ? 'auto' : 'none' }}>
      <div onClick={onClose} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,.4)', opacity: open?1:0, transition:'opacity .25s' }} />
      <div style={{
        position:'absolute', top:0, bottom:0, left:0, width:300, background:'#fff',
        transform: open ? 'translateX(0)' : 'translateX(-100%)', transition:'transform .26s cubic-bezier(.2,.8,.2,1)',
        display:'flex', flexDirection:'column', boxShadow:'4px 0 24px rgba(0,0,0,.18)',
      }}>
        {/* user header */}
        <div style={{ padding:'58px 20px 18px', background:'#f8f9fa', borderBottom:'1px solid #e0e0e0' }}>
          <div style={{ width:60, height:60, borderRadius:30, background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 4px rgba(0,0,0,.1)', marginBottom:12 }}>
            <Icon name="user" style={{ fontSize:28, color:RED }} />
          </div>
          <div style={{ fontWeight:800, fontSize:18, color:'#333' }}>{user}</div>
          <div style={{ fontSize:13, color:'#666' }}>Trainer since 2026</div>
        </div>
        {/* items */}
        <div style={{ flex:1, padding:'8px' }}>
          {items.map(it => {
            const on = screen === it.id;
            return (
              <Pressable key={it.id} onClick={() => { setScreen(it.id); onClose(); }} activeScale={0.97} style={{
                display:'flex', alignItems:'center', gap:16, padding:'14px 16px', borderRadius:10, marginBottom:2,
                background: on ? '#fdecea' : 'transparent',
              }}>
                <Icon name={it.ic} style={{ fontSize:18, color: on ? RED : '#666', width:22, textAlign:'center' }} />
                <span style={{ fontWeight:700, fontSize:15, color: on ? RED : '#444' }}>{it.label}</span>
              </Pressable>
            );
          })}
        </div>
        {/* logout */}
        <div style={{ borderTop:'1px solid #e0e0e0', padding:'10px 8px 24px' }}>
          <Pressable onClick={onLogout} activeScale={0.97} style={{ display:'flex', alignItems:'center', gap:16, padding:'14px 16px', borderRadius:10 }}>
            <Icon name="right-from-bracket" style={{ fontSize:18, color:RED, width:22, textAlign:'center' }} />
            <span style={{ fontWeight:700, fontSize:15, color:RED }}>Sign Out</span>
          </Pressable>
        </div>
      </div>
    </div>
  );
}

function ComingSoon({ title, sub }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', padding:'40px', textAlign:'center' }}>
      <PokeBall size={64} style={{ marginBottom:20, opacity:.6 }} />
      <div style={{ fontWeight:800, fontSize:20, color:'#1f2937', marginBottom:6 }}>{title}</div>
      <div style={{ color:'#9ca3af', fontSize:14, fontWeight:600, lineHeight:1.5 }}>{sub}</div>
    </div>
  );
}

function App() {
  const [authed, setAuthed] = useState(false);
  const [user, setUser] = useState('Trainer');
  const [screen, setScreen] = useState('pokedex');
  const [drawer, setDrawer] = useState(false);
  const [favorites, setFavorites] = useState(new Set([6, 25]));
  const [onlyFavs, setOnlyFavs] = useState(false);
  const [detail, setDetail] = useState(null);
  const [holo, setHolo] = useState(null);

  const toggleFav = (id) => setFavorites(prev => {
    const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n;
  });

  const titles = { pokedex:'PokéVerse · Pokédex', tcg:'PokéVerse · Trading Cards', team:'PokéVerse · Team Builder' };

  if (!authed) {
    return (
      <PhoneFrame showHeader={false}>
        <AuthScreen onLogin={(name) => { setUser(name); setAuthed(true); }} />
      </PhoneFrame>
    );
  }

  const settingsBtn = screen === 'pokedex' ? (
    <Pressable style={{ minWidth:44, minHeight:44, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <Icon name="compact-disc" style={{ fontSize:21, color:'#fff' }} />
    </Pressable>
  ) : null;

  return (
    <PhoneFrame headerTitle={titles[screen]} headerRight={settingsBtn} onMenu={() => setDrawer(true)}>
      {screen === 'pokedex' && (
        <Pokedex favorites={favorites} toggleFav={toggleFav} onOpen={setDetail} onlyFavs={onlyFavs} setOnlyFavs={setOnlyFavs} />
      )}
      {screen === 'tcg' && <TCGScreen onCard={setHolo} />}
      {screen === 'team' && <ComingSoon title="Showdown Team Builder" sub="Build and analyze competitive teams. Coming soon!" />}

      <Drawer open={drawer} onClose={() => setDrawer(false)} screen={screen} setScreen={setScreen} user={user}
        onLogout={() => { setDrawer(false); setAuthed(false); setScreen('pokedex'); }} />

      {detail && <DetailSheet p={detail} fav={favorites.has(detail.id)} onFav={() => toggleFav(detail.id)} onClose={() => setDetail(null)} />}
      {holo && <HoloModal c={holo} onClose={() => setHolo(null)} />}
    </PhoneFrame>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
