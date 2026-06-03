/* PokéVerse UI Kit — Auth / Home screen (login wall) */
function AuthScreen({ onLogin }) {
  const [emailMode, setEmailMode] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const social = (label, brand, bg, color, border) => (
    <Pressable onClick={() => onLogin(label)} style={{
      display:'flex', alignItems:'center', justifyContent:'center', gap:11,
      padding:'15px 18px', borderRadius:12, background:bg, color,
      border: border || 'none', boxShadow:'0 2px 4px rgba(0,0,0,.1)', fontWeight:700, fontSize:15,
    }}>
      {brand === 'mail' ? <Icon name="envelope" style={{ fontSize:17 }} /> : <Brand name={brand} style={{ fontSize:18 }} />}
      {label}
    </Pressable>
  );

  if (emailMode) {
    return (
      <div style={{ minHeight:'100%', background:'#f8f9fa', padding:'24px', boxSizing:'border-box' }}>
        <Pressable onClick={() => setEmailMode(false)} style={{ width:40, height:40, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:14 }}>
          <Icon name="arrow-left" style={{ fontSize:20, color:'#666' }} />
        </Pressable>
        <div style={{ textAlign:'center', marginBottom:30 }}>
          <div style={{ fontWeight:900, fontSize:30, color:'#333' }}>PokéVerse</div>
          <div style={{ color:'#666', fontSize:15, marginTop:4 }}>Join the adventure</div>
        </div>
        <div style={{ fontWeight:900, fontSize:23, color:'#333', textAlign:'center', marginBottom:26 }}>Create Account</div>
        <Field icon="envelope" value={email} ph="Email address" onChange={setEmail} />
        <Field icon="user" value={name} ph="Display name (optional)" onChange={setName} />
        <Pressable onClick={() => onLogin('Trainer')} style={{
          background:RED, color:'#fff', padding:'15px', borderRadius:12, textAlign:'center',
          fontWeight:800, fontSize:16, marginTop:8, boxShadow:'0 2px 4px rgba(0,0,0,.2)',
        }}>Continue</Pressable>
        <div style={{ fontSize:12, color:'#999', textAlign:'center', marginTop:20, lineHeight:1.5 }}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:'100%', background:'#f8f9fa', padding:'28px 24px', boxSizing:'border-box', display:'flex', flexDirection:'column' }}>
      <div style={{ textAlign:'center', marginTop:8, marginBottom:30 }}>
        <div style={{ display:'flex', justifyContent:'center', marginBottom:18 }}><PokeBall size={78} /></div>
        <div style={{ fontWeight:900, fontSize:32, color:'#333' }}>PokéVerse</div>
        <div style={{ color:'#666', fontSize:15, lineHeight:1.5, marginTop:8, padding:'0 18px' }}>
          Catch, collect, and trade in the ultimate Pokémon experience
        </div>
      </div>

      <div style={{ marginBottom:26, display:'flex', flexDirection:'column', gap:14 }}>
        {[['book-open','Interactive Pokédex with catch tracking'],
          ['layer-group','Build custom TCG card binders'],
          ['wand-magic-sparkles','Stunning holographic card effects']].map(([ic, t]) => (
          <div key={t} style={{ display:'flex', alignItems:'center', gap:12, padding:'0 6px' }}>
            <Icon name={ic} style={{ fontSize:22, color:RED, width:26, textAlign:'center' }} />
            <span style={{ color:'#555', fontSize:15, fontWeight:600 }}>{t}</span>
          </div>
        ))}
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:11, marginTop:'auto' }}>
        {social('Continue with Apple','apple','#000','#fff')}
        {social('Continue with Google','google','#fff','#666','1px solid #ddd')}
        {social('Continue with Email','mail','#fff',RED,`1px solid ${RED}`)}
        <div style={{ display:'flex', alignItems:'center', gap:14, margin:'8px 0' }}>
          <div style={{ flex:1, height:1, background:'#ddd' }} /><span style={{ color:'#999', fontSize:13 }}>or</span><div style={{ flex:1, height:1, background:'#ddd' }} />
        </div>
        <Pressable onClick={() => onLogin('Guest Trainer')} style={{ textAlign:'center', padding:'4px' }}>
          <span style={{ color:'#666', fontSize:15, textDecoration:'underline', fontWeight:600 }}>Continue as Guest</span>
        </Pressable>
      </div>
    </div>
  );
}

function Field({ icon, value, ph, onChange }) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{
      display:'flex', alignItems:'center', gap:12, background:'#fff',
      border:`1px solid ${focus ? RED : '#e0e0e0'}`, borderRadius:12, padding:'14px 16px', marginBottom:16,
      boxShadow: focus ? `0 0 0 3px ${RED}1a` : 'none',
    }}>
      <Icon name={icon} style={{ fontSize:18, color:'#666', width:20, textAlign:'center' }} />
      <input value={value} placeholder={ph} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        onChange={e => onChange(e.target.value)}
        style={{ flex:1, border:'none', outline:'none', fontSize:15, color:'#333', fontFamily:'inherit', background:'transparent' }} />
    </div>
  );
}

Object.assign(window, { AuthScreen });
