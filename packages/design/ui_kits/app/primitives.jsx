/* PokéVerse UI Kit — primitives (exported to window) */
const { useState, useEffect, useRef } = React;

const RED = '#f44336';
const RED_PRESS = '#d32f2f';

/* ---------- Icon (Font Awesome) ---------- */
function Icon({ name, solid = true, style = {}, className = '' }) {
  const fam = solid ? 'fa-solid' : 'fa-regular';
  return <i className={`${fam} fa-${name} ${className}`} style={style} aria-hidden="true" />;
}
function Brand({ name, style = {} }) {
  return <i className={`fa-brands fa-${name}`} style={style} aria-hidden="true" />;
}

/* ---------- Poké Ball mark (CSS) ---------- */
function PokeBall({ size = 64, spin = false, style = {} }) {
  const btn = Math.round(size * 0.28);
  const bw = Math.max(2, Math.round(size * 0.045));
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', position: 'relative',
      overflow: 'hidden', background: '#fff', flexShrink: 0,
      boxShadow: '0 4px 8px rgba(0,0,0,0.25)',
      animation: spin ? 'pvspin 1s linear infinite' : 'none', ...style,
    }}>
      <div style={{ position:'absolute', insetInline:0, top:0, height:'50%', background:'#ee1515' }} />
      <div style={{ position:'absolute', insetInline:0, top:'50%', height:Math.max(2,Math.round(size*0.075)), transform:'translateY(-50%)', background:'#222224' }} />
      <div style={{
        position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
        width:btn, height:btn, borderRadius:'50%', background:'#fff',
        border:`${bw}px solid #222224`, zIndex:2,
      }} />
    </div>
  );
}

/* ---------- Type badge ---------- */
function TypeBadge({ type, size = 'md' }) {
  const pad = size === 'sm' ? '4px 11px' : '6px 16px';
  const fs = size === 'sm' ? 11 : 13;
  return (
    <span style={{
      background: TYPE_COLORS[type] || '#888', color:'#fff', fontWeight:800,
      fontSize: fs, padding: pad, borderRadius: 999, letterSpacing: '.02em',
      textTransform:'capitalize', textShadow:'0 1px 2px rgba(0,0,0,.3)', whiteSpace:'nowrap',
    }}>{type}</span>
  );
}

/* ---------- Animated stat bar ---------- */
function StatBar({ name, value, delay = 0, animate = true }) {
  const [w, setW] = useState(animate ? 0 : Math.min(100, (value/200)*100));
  useEffect(() => {
    if (!animate) return;
    const t = setTimeout(() => setW(Math.min(100, (value/200)*100)), delay + 40);
    return () => clearTimeout(t);
  }, [value, delay, animate]);
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:9 }}>
      <div style={{ width:62, textAlign:'right', fontWeight:800, fontSize:12.5, color:'#374151' }}>{STAT_LABELS[name]}</div>
      <div style={{ width:30, fontFamily:"'Press Start 2P'", fontSize:9, color:'#1f2937' }}>{value}</div>
      <div style={{ flex:1, height:11, background:'#f3f4f6', borderRadius:6, overflow:'hidden' }}>
        <div style={{ height:'100%', width:`${w}%`, background:STAT_COLORS[name], borderRadius:6, transition:'width .8s cubic-bezier(.2,.8,.2,1)' }} />
      </div>
    </div>
  );
}

/* ---------- Pressable (scale-down feedback like RN) ---------- */
function Pressable({ children, onClick, style = {}, activeScale = 0.96, className = '' }) {
  const [down, setDown] = useState(false);
  return (
    <div
      className={className}
      onMouseDown={() => setDown(true)}
      onMouseUp={() => setDown(false)}
      onMouseLeave={() => setDown(false)}
      onClick={onClick}
      style={{
        transform: down ? `scale(${activeScale})` : 'scale(1)',
        transition:'transform .12s ease', cursor:'pointer', ...style,
      }}
    >{children}</div>
  );
}

/* ---------- Phone frame with native red status bar ---------- */
function PhoneFrame({ children, onMenu, headerTitle, headerRight, showHeader = true }) {
  return (
    <div style={{
      width:392, height:812, borderRadius:46, position:'relative', overflow:'hidden',
      background: RED, boxShadow:'0 40px 80px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,0,0,0.1)',
      fontFamily:"'Nunito', system-ui, sans-serif", WebkitFontSmoothing:'antialiased',
    }}>
      {/* status bar — white icons on red, like the app */}
      <div style={{
        position:'absolute', top:0, left:0, right:0, height:50, zIndex:40, background:RED,
        display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 30px',
        color:'#fff', paddingTop:6,
      }}>
        <span style={{ fontWeight:700, fontSize:15 }}>9:41</span>
        <div style={{ display:'flex', alignItems:'center', gap:7 }}>
          <Icon name="signal" style={{ fontSize:13 }} />
          <Icon name="wifi" style={{ fontSize:13 }} />
          <Icon name="battery-three-quarters" style={{ fontSize:15 }} />
        </div>
      </div>
      {/* dynamic island */}
      <div style={{ position:'absolute', top:11, left:'50%', transform:'translateX(-50%)', width:118, height:33, borderRadius:20, background:'#000', zIndex:50 }} />

      {/* app header */}
      {showHeader && (
        <div style={{
          position:'absolute', top:50, left:0, right:0, height:56, zIndex:30, background:RED,
          display:'flex', alignItems:'center', gap:8, padding:'0 8px', color:'#fff',
          boxShadow:'0 2px 6px rgba(0,0,0,0.18)',
        }}>
          <Pressable onClick={onMenu} style={{ minWidth:44, minHeight:44, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Icon name="bars" style={{ fontSize:20 }} />
          </Pressable>
          <div style={{ flex:1, fontWeight:800, fontSize:18 }}>{headerTitle}</div>
          {headerRight}
        </div>
      )}

      {/* content surface */}
      <div style={{
        position:'absolute', top: showHeader ? 106 : 50, left:0, right:0, bottom:0,
        background:'#f9fafb', overflowY:'auto', overflowX:'hidden',
      }}>{children}</div>

      {/* home indicator */}
      <div style={{ position:'absolute', bottom:8, left:'50%', transform:'translateX(-50%)', width:128, height:5, borderRadius:3, background:'rgba(0,0,0,.32)', zIndex:60 }} />
    </div>
  );
}

Object.assign(window, { Icon, Brand, PokeBall, TypeBadge, StatBar, Pressable, PhoneFrame, RED, RED_PRESS });
