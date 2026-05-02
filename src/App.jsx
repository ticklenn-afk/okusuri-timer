import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
// CharacterPanel は設定タブのテスト用に残す（ホームでは使わない）
import { PuffyStar, PuffyHeart, PuffyHeartBlue, PuffyFlower, PuffyCapsule, PuffyBell, PuffyClover } from './components/PuffyIcons'
import MedicineForm from './components/MedicineForm'
import MedicinePopup from './components/MedicinePopup'
import MedicineSelectPopup from './components/MedicineSelectPopup'
import { useNotifications, NOTIFICATION_SCHEDULE } from './hooks/useNotifications'
import { playKiran, playKiraKiran, playShirin, playPowan } from './utils/sounds'

function KawaiiTitle({ text, compact=false }) {
  const id = text.replace(/\s/g,'')
  const h    = compact ? 72  : 112
  const y    = compact ? 52  : 78
  const fs   = compact ? 48  : 58
  const sw   = compact ? 13  : 16
  const ls   = compact ? -9  : -11
  const pad  = compact ? '14px 0 10px' : '30px 0'
  return (
    <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} transition={{duration:.3}}
      style={{display:'flex', alignItems:'center', justifyContent:'center', padding:pad}}
    >
      <svg viewBox={`0 0 340 ${h}`} style={{width:'100%', maxWidth:'340px', overflow:'visible'}} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`grad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#FF4DB0"/>
            <stop offset="60%"  stopColor="#FF80C8"/>
            <stop offset="100%" stopColor="#FF9ACB"/>
          </linearGradient>
          <filter id={`glow-${id}`} x="-20%" y="-40%" width="140%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur"/>
            <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0.15  0 0 0 0 0  0 0 0 0 0.08  0 0 0 0.55 0" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <text x="170" y={y} textAnchor="middle"
          fontFamily="'Zen Maru Gothic', sans-serif"
          fontWeight="900" fontSize={fs} letterSpacing={ls}
          stroke="white" strokeWidth={sw} strokeLinejoin="round"
          fill={`url(#grad-${id})`}
          style={{paintOrder:'stroke fill'}}
          filter={`url(#glow-${id})`}
        >{text}</text>
      </svg>
    </motion.div>
  )
}

const INITIAL_MEDICINES = [
  { id:1, name:'ビタミンC',  dose:'1錠', time:'朝食後', timingId:'morning', icon:'🫧', memo:'' },
  { id:2, name:'整腸剤',    dose:'2錠', time:'昼食後', timingId:'noon',    icon:'💊', memo:'' },
  { id:3, name:'鉄分サプリ', dose:'1錠', time:'夕食後', timingId:'night',   icon:'🫧', memo:'' },
]

const SCHEDULE = [
  { label:'朝',   time:'08:00', icon:'🦁', timingId:'morning' },
  { label:'昼',   time:'12:00', icon:'🐦', timingId:'noon'    },
  { label:'夜',   time:'18:00', icon:'🐰', timingId:'night'   },
  { label:'頓服', time:'22:00', icon:'🐿️', timingId:'prn'     },
]

const SCHEDULE_COLORS = {
  morning: { bg:'rgba(255,215,50,.30)',  shadow:'rgba(215,150,0,.50)',   border:'rgba(255,210,80,.7)',  avatarBg:'linear-gradient(145deg,#FFC400,#E07800)' },
  noon:    { bg:'rgba(100,195,255,.30)', shadow:'rgba(60,155,240,.50)',  border:'rgba(130,200,255,.7)', avatarBg:'linear-gradient(145deg,#7DD8FF,#2298E8)' },
  night:   { bg:'rgba(249,168,212,.30)', shadow:'rgba(220,80,160,.50)',  border:'rgba(255,170,220,.7)', avatarBg:'linear-gradient(145deg,#FFB0D8,#FF5BAA)' },
  prn:     { bg:'rgba(134,239,172,.30)', shadow:'rgba(60,190,120,.50)',  border:'rgba(140,230,170,.7)', avatarBg:'linear-gradient(145deg,#00C870,#007A40)' },
}

/* ════════════════════════════════
   🎀 かわいいSVGナビアイコン（ラインスタイル）
════════════════════════════════ */
/* ─── ナビアイコン（白線・太め） ─── */
function NavIconHome({ col }) {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12L13 3L24 12" stroke={col} strokeWidth="2.8"/>
      <path d="M5 10.5V23H10.5V17.5C10.5 16.4 11.4 15.5 12.5 15.5H13.5C14.6 15.5 15.5 16.4 15.5 17.5V23H21V10.5" stroke={col} strokeWidth="2.6"/>
      <path d="M13 7C13 7 10 5 10 3.5C10 2.7 10.7 2.2 11.5 2.2C12 2.2 12.4 2.5 12.6 2.9C12.8 2.5 13.2 2.2 13.7 2.2C14.5 2.2 15.2 2.7 15.2 3.5C15.2 5 13 7 13 7Z" fill={col} stroke="none"/>
    </svg>
  )
}
function NavIconHistory({ col }) {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="6" width="20" height="18" rx="3" stroke={col} strokeWidth="2.6"/>
      <line x1="3" y1="12" x2="23" y2="12" stroke={col} strokeWidth="2.2"/>
      <line x1="8.5" y1="3" x2="8.5" y2="9" stroke={col} strokeWidth="2.8"/>
      <line x1="17.5" y1="3" x2="17.5" y2="9" stroke={col} strokeWidth="2.8"/>
      <circle cx="8.5" cy="17" r="1.8" fill={col} stroke="none"/>
      <circle cx="13" cy="17" r="1.8" fill={col} stroke="none"/>
      <circle cx="17.5" cy="17" r="1.8" fill={col} stroke="none"/>
      <circle cx="8.5" cy="21.5" r="1.8" fill={col} stroke="none"/>
      <circle cx="13" cy="21.5" r="1.8" fill={col} stroke="none"/>
    </svg>
  )
}
function NavIconMedicine({ col }) {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <g transform="rotate(-40 13 13)">
        <path d="M13 8H17.5C19.98 8 22 10.02 22 12.5C22 14.98 19.98 17 17.5 17H13V8Z" fill={col} opacity="0.35" stroke={col} strokeWidth="2.4" strokeLinejoin="round"/>
        <path d="M13 8H8.5C6.02 8 4 10.02 4 12.5C4 14.98 6.02 17 8.5 17H13V8Z" stroke={col} strokeWidth="2.4" strokeLinejoin="round"/>
        <line x1="13" y1="8" x2="13" y2="17" stroke={col} strokeWidth="2.2" strokeLinecap="round"/>
      </g>
    </svg>
  )
}
function NavIconSetting({ col }) {
  const cx=13, cy=13, R=10.5, r=7.5, teeth=8
  let d = ''
  for (let i = 0; i < teeth; i++) {
    const a0 = (i / teeth) * Math.PI * 2 - Math.PI / 2
    const a1 = a0 + (Math.PI / teeth) * 0.55
    const a2 = a0 + (Math.PI / teeth) * 1.45
    const a3 = a0 + (Math.PI / teeth) * 2
    const p = (a, rad) => [cx + Math.cos(a)*rad, cy + Math.sin(a)*rad]
    const [x0,y0]=p(a0,r), [x1,y1]=p(a1,R), [x2,y2]=p(a2,R), [x3,y3]=p(a3,r)
    if (i===0) d += `M${x0.toFixed(1)} ${y0.toFixed(1)} `
    else d += `L${x0.toFixed(1)} ${y0.toFixed(1)} `
    d += `L${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)} L${x3.toFixed(1)} ${y3.toFixed(1)} `
  }
  d += 'Z'
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <path d={d} fill={col} opacity="0.25" stroke={col} strokeWidth="1.8" strokeLinejoin="round"/>
      <circle cx="13" cy="13" r="4" stroke={col} strokeWidth="2.6" fill="none"/>
    </svg>
  )
}

/* ─── タブ別カラー設定 ─── */
const NAV_TAB_CFG = {
  home:    { grad:'linear-gradient(150deg,#FF6EC0,#EE2090)', gradL:'linear-gradient(150deg,#FFCCE8,#FFB0D8)', sh:'rgba(220,20,130,.60)', shL:'rgba(220,100,180,.45)', iconA:'white', iconI:'#AA0050', label:'ホーム',  img:'/images/nav_home.png' },
  history: { grad:'linear-gradient(150deg,#38CCEE,#0AAAD0)', gradL:'linear-gradient(150deg,#B8EEFF,#80D8F0)', sh:'rgba(0,150,205,.60)',  shL:'rgba(60,185,228,.45)',  iconA:'white', iconI:'#006890', label:'履歴',    img:'/images/nav_history.png' },
  medicine:{ grad:'linear-gradient(150deg,#B870FF,#7028E0)', gradL:'linear-gradient(150deg,#E0C0FF,#C898FF)', sh:'rgba(110,20,230,.60)', shL:'rgba(160,100,240,.45)', iconA:'white', iconI:'#4A00A8', label:'お薬',    img:'/images/nav_medicine.png' },
  setting: { grad:'linear-gradient(150deg,#FFCC40,#FF9000)', gradL:'linear-gradient(150deg,#FFE890,#FFD060)', sh:'rgba(210,130,0,.60)',  shL:'rgba(230,170,30,.45)',  iconA:'#4A2800', iconI:'#7A4400', label:'設定', img:'/images/nav_setting.png' },
}
const NAV_TABS = Object.keys(NAV_TAB_CFG)

/* Zen Maru Gothic shorthand */
const ZMG = "'Zen Maru Gothic', sans-serif"

/* キャラ画像パス */
const CHAR_IMAGES = {
  morning: '/images/lion.png',
  noon:    '/images/bird.png',
  night:   '/images/rabbit.png',
  prn:     '/images/squirrel.png',
}

/* キャラアバター — 画像あればimg、なければ絵文字フォールバック */
function CharAvatar({ charId, emoji, size=48, bg, shadow }) {
  const src = CHAR_IMAGES[charId]
  return (
    <div style={{
      flexShrink:0, width:`${size}px`, height:`${size}px`, borderRadius:'50%',
      background: bg ?? 'linear-gradient(145deg,#ffe0f0,#e0cfff)',
      border:'2.5px solid rgba(255,255,255,.9)',
      boxShadow: shadow ?? '0 4px 10px rgba(180,140,255,.25), inset 0 1px 3px rgba(255,255,255,.6)',
      display:'flex', alignItems:'center', justifyContent:'center',
      overflow:'hidden', padding:'6px',
    }}>
      <img
        src={src} alt={charId}
        style={{width:'100%', height:'100%', objectFit:'contain', objectPosition:'50% 50%', borderRadius:'50%'}}
        onError={e => { e.currentTarget.style.display='none'; e.currentTarget.nextSibling.style.display='block' }}
      />
      <motion.span
        style={{fontSize:`${size*0.58}px`, lineHeight:1, display:'none', filter:'drop-shadow(0 2px 3px rgba(0,0,0,.12))'}}
        animate={{y:[0,-3,0]}} transition={{duration:2.5, repeat:Infinity, ease:'easeInOut'}}
      >{emoji}</motion.span>
    </div>
  )
}

/* ════════════════════════════════
   🌸 原宿ゆめかわ背景
════════════════════════════════ */
function Background() {
  const MARSHMALLOWS = [
    { l:'6%',  t:'8%',  w:32, h:28, r:'50% 50% 48% 52% / 55% 55% 45% 45%', c:'#FFD6EC', d:'4.5s', delay:'0s'   },
    { l:'82%', t:'6%',  w:26, h:22, r:'50%',                                  c:'#E8D5FF', d:'5.2s', delay:'0.8s' },
    { l:'15%', t:'45%', w:36, h:30, r:'50% 50% 46% 54% / 52% 48% 52% 48%',  c:'#FFE5CC', d:'3.8s', delay:'1.5s' },
    { l:'73%', t:'38%', w:28, h:24, r:'50%',                                  c:'#D5F0FF', d:'6.0s', delay:'0.3s' },
    { l:'3%',  t:'70%', w:24, h:20, r:'50% 50% 50% 50% / 60% 60% 40% 40%',  c:'#FFD6EC', d:'4.2s', delay:'2.0s' },
    { l:'86%', t:'64%', w:34, h:26, r:'50%',                                  c:'#D5FFE8', d:'5.5s', delay:'1.0s' },
    { l:'45%', t:'15%', w:22, h:20, r:'50% 50% 48% 52% / 55% 55% 45% 45%',  c:'#FFF0D5', d:'4.8s', delay:'2.5s' },
    { l:'60%', t:'80%', w:30, h:26, r:'50%',                                  c:'#E8D5FF', d:'3.5s', delay:'0.6s' },
    { l:'28%', t:'86%', w:28, h:22, r:'50% 50% 46% 54% / 52% 48% 52% 48%',  c:'#FFD6EC', d:'5.0s', delay:'1.8s' },
    { l:'53%', t:'53%', w:20, h:18, r:'50%',                                  c:'#D5F0FF', d:'4.0s', delay:'3.2s' },
  ]
  const SPARKLES = [
    { l:'13%', t:'20%', s:14, d:'3.2s', delay:'0.4s', c:'#FFB3D8' },
    { l:'77%', t:'16%', s:10, d:'2.8s', delay:'1.2s', c:'#C4A8FF' },
    { l:'24%', t:'60%', s:16, d:'3.8s', delay:'0.8s', c:'#A8DEFF' },
    { l:'67%', t:'53%', s:10, d:'2.5s', delay:'2.0s', c:'#FFD6A8' },
    { l:'41%', t:'32%', s:12, d:'4.2s', delay:'1.5s', c:'#FFB3D8' },
    { l:'90%', t:'41%', s:14, d:'3.0s', delay:'0.6s', c:'#C4A8FF' },
    { l:'4%',  t:'55%', s:10, d:'3.5s', delay:'2.2s', c:'#A8F0C8' },
    { l:'49%', t:'90%', s:12, d:'4.0s', delay:'1.0s', c:'#A8DEFF' },
    { l:'34%', t:'10%', s:10, d:'3.6s', delay:'2.8s', c:'#FFD6A8' },
  ]
  const CLOUDS = [
    {l:'1%',  t:'6%',  scale:.80, d:'9s',  delay:'0s'  },
    {l:'58%', t:'3%',  scale:.62, d:'11s', delay:'3s'  },
    {l:'14%', t:'57%', scale:.72, d:'8s',  delay:'1.5s'},
    {l:'70%', t:'75%', scale:.56, d:'10s', delay:'2.5s'},
    {l:'36%', t:'78%', scale:.68, d:'7s',  delay:'4s'  },
  ]
  const ORBS = [
    {l:'-30px', t:'-30px', w:'300px', h:'300px', c:'#FFB3E8'},
    {l:'22%',   t:'26%',   w:'240px', h:'240px', c:'#B8D8FF'},
    {l:'auto',  t:'auto',  r:'0', b:'60px', w:'210px', h:'210px', c:'#D8B8FF'},
    {l:'-15px', t:'58%',   w:'170px', h:'170px', c:'#FFB8CC'},
    {l:'58%',   t:'48%',   w:'130px', h:'130px', c:'#B8FFE0'},
    {l:'40%',   t:'70%',   w:'100px', h:'100px', c:'#FFFBB8'},
  ]
  return (
    <div style={{position:'fixed', inset:0, pointerEvents:'none', overflow:'hidden', zIndex:-1}}>
      {ORBS.map((o,i) => (
        <div key={'o'+i} style={{
          position:'absolute', left:o.l, top:o.t, right:o.r||'auto', bottom:o.b||'auto',
          width:o.w, height:o.h, borderRadius:'50%',
          background:`radial-gradient(circle, ${o.c} 0%, transparent 70%)`,
          animation:`orb-breathe ${6+i}s ease-in-out infinite`,
          animationDelay:`${i*0.8}s`, opacity:.32,
        }}/>
      ))}
      {CLOUDS.map((c,i) => (
        <div key={'c'+i} style={{
          position:'absolute', left:c.l, top:c.t,
          animation:`cloud-drift ${c.d} ease-in-out infinite`, animationDelay:c.delay,
          transform:`scale(${c.scale})`, transformOrigin:'top left',
        }}>
          <div style={{
            width:'96px', height:'44px',
            background:'rgba(255,232,248,.65)', borderRadius:'50px',
            boxShadow:'30px -14px 0 10px rgba(255,232,248,.6), 58px 0 0 5px rgba(255,232,248,.55)',
          }}/>
        </div>
      ))}
      {MARSHMALLOWS.map((m,i) => (
        <div key={'m'+i} style={{
          position:'absolute', left:m.l, top:m.t,
          width:`${m.w}px`, height:`${m.h}px`,
          borderRadius:m.r, background:m.c,
          boxShadow:`inset 0 -3px 6px rgba(255,255,255,.6), 0 3px 10px rgba(200,160,220,.2)`,
          animation:`float-gentle ${m.d} ease-in-out infinite`,
          animationDelay:m.delay, opacity:.45,
        }}/>
      ))}
      {SPARKLES.map((s,i) => (
        <div key={'sp'+i} style={{
          position:'absolute', left:s.l, top:s.t,
          width:`${s.s}px`, height:`${s.s}px`,
          borderRadius:'50%', background:s.c,
          animation:`sparkle-pop ${s.d} ease-in-out infinite`,
          animationDelay:s.delay, opacity:.35,
        }}/>
      ))}
    </div>
  )
}

/* ════════════════════════════════
   🌟 全画面 ⭐ 大・中・小 統一星レイヤー
   ※ 端・角寄り配置、中央コンテンツ付近は避ける
════════════════════════════════ */
const FLOAT_STARS = [
  { l:'4%',  t:'6%',  e:'⭐', s:'1.05rem', dur:2.2, delay:0.0 },
  { l:'88%', t:'4%',  e:'✨', s:'.90rem',  dur:1.8, delay:0.5 },
  { l:'18%', t:'14%', e:'💫', s:'.80rem',  dur:2.5, delay:1.1 },
  { l:'75%', t:'12%', e:'⭐', s:'.75rem',  dur:2.0, delay:0.3 },
  { l:'92%', t:'22%', e:'✨', s:'.85rem',  dur:1.9, delay:1.4 },
  { l:'2%',  t:'28%', e:'💫', s:'.70rem',  dur:2.3, delay:0.8 },
  { l:'55%', t:'8%',  e:'⭐', s:'.80rem',  dur:2.1, delay:1.7 },
  { l:'35%', t:'22%', e:'✨', s:'.70rem',  dur:2.4, delay:0.2 },
  { l:'8%',  t:'42%', e:'⭐', s:'.85rem',  dur:1.7, delay:1.0 },
  { l:'84%', t:'36%', e:'💫', s:'.75rem',  dur:2.6, delay:0.6 },
  { l:'62%', t:'30%', e:'✨', s:'.70rem',  dur:2.0, delay:1.9 },
  { l:'46%', t:'44%', e:'⭐', s:'.80rem',  dur:1.8, delay:0.4 },
  { l:'22%', t:'50%', e:'💫', s:'.75rem',  dur:2.3, delay:1.3 },
  { l:'90%', t:'52%', e:'✨', s:'.85rem',  dur:2.1, delay:0.9 },
  { l:'5%',  t:'60%', e:'⭐', s:'.70rem',  dur:1.9, delay:1.6 },
  { l:'70%', t:'58%', e:'💫', s:'.80rem',  dur:2.5, delay:0.1 },
  { l:'38%', t:'66%', e:'✨', s:'.75rem',  dur:2.2, delay:1.2 },
  { l:'80%', t:'70%', e:'⭐', s:'.70rem',  dur:1.7, delay:0.7 },
  { l:'14%', t:'74%', e:'💫', s:'.85rem',  dur:2.4, delay:1.5 },
  { l:'52%', t:'78%', e:'✨', s:'.80rem',  dur:2.0, delay:0.3 },
  { l:'94%', t:'80%', e:'⭐', s:'.70rem',  dur:1.8, delay:1.8 },
  { l:'28%', t:'86%', e:'💫', s:'.75rem',  dur:2.3, delay:0.5 },
  { l:'66%', t:'90%', e:'✨', s:'.80rem',  dur:2.1, delay:1.0 },
  { l:'10%', t:'92%', e:'⭐', s:'.70rem',  dur:1.9, delay:1.4 },
]

function FloatingStars() {
  return (
    <div style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none', overflow:'hidden' }}>
      {FLOAT_STARS.map((s, i) => (
        <motion.span key={i}
          style={{ position:'absolute', left:s.l, top:s.t, fontSize:s.s, userSelect:'none', lineHeight:1 }}
          animate={{ y:[0,-10,0], scale:[.85,1.2,.85], opacity:[.55,1,.55], rotate:[0,15,0] }}
          transition={{ duration:s.dur, repeat:Infinity, ease:'easeInOut', delay:s.delay }}
        >
          {s.e}
        </motion.span>
      ))}
    </div>
  )
}

/* ════════════════════════════════
   ⚙️ 設定タブ
════════════════════════════════ */
function SettingView({ notifEnabled, notifPermission, schedules, onToggleNotif, onTimeChange, onTestPopup }) {
  const SLOT = {
    morning:{ char:'🦁', name:'ライオン',   bg:'rgba(255,215,80,.22)',  border:'rgba(255,195,60,.7)',  shadow:'rgba(220,150,0,.45)',  text:'#92400E', deco:<PuffyStar size={28}/> },
    noon:   { char:'🐦', name:'シマエナガ', bg:'rgba(100,200,255,.22)', border:'rgba(80,175,255,.7)',  shadow:'rgba(50,145,235,.45)', text:'#075985', deco:<PuffyHeartBlue size={28}/> },
    night:  { char:'🐰', name:'うさぎ',    bg:'rgba(255,170,210,.22)', border:'rgba(245,110,185,.7)', shadow:'rgba(215,75,155,.45)', text:'#9D174D', deco:<PuffyHeart size={28}/> },
    prn:    { char:'🐿️', name:'りす',      bg:'rgba(140,235,175,.22)', border:'rgba(65,195,125,.7)',  shadow:'rgba(45,180,110,.45)', text:'#064E3B', deco:<PuffyFlower size={28}/> },
  }
  const TEST = [
    {id:'morning',emoji:'🦁',name:'りょう学長',g1:'#FFE566',g2:'#FFB800',sh:'rgba(210,145,0,.6)',  gl:'rgba(255,195,50,.28)', tx:'#78350F'},
    {id:'noon',   emoji:'🐦',name:'シマエナガ',g1:'#82D9FF',g2:'#38B0FF',sh:'rgba(50,145,240,.6)', gl:'rgba(100,185,255,.28)',tx:'#0C4A6E'},
    {id:'night',  emoji:'🐰',name:'うさぎ',   g1:'#FFB3D4',g2:'#FF6FA8',sh:'rgba(220,55,150,.6)', gl:'rgba(249,100,175,.28)',tx:'#881337'},
    {id:'prn',    emoji:'🐿️',name:'りす',     g1:'#A8F0C8',g2:'#5EE09A',sh:'rgba(50,185,115,.6)', gl:'rgba(100,215,155,.28)',tx:'#064E3B'},
  ]

  return (
    <div style={{display:'flex', flexDirection:'column', gap:'6px'}}>
      {/* ヘッダー */}
      <KawaiiTitle text="つうちのせってい" compact/>

      {/* かわいくカスタマイズ＋通知カード（gap逃がしサブコンテナ） */}
      <div style={{display:'flex', flexDirection:'column', gap:0}}>
      {/* かわいくカスタマイズ（カード外） */}
      <p style={{fontFamily:ZMG, fontWeight:900, fontSize:'1.15rem', color:'#22C55E', margin:'0 0 8px', display:'flex', alignItems:'center', justifyContent:'flex-start', paddingLeft:'28px', gap:'6px'}}>
        <div style={{position:'relative', display:'inline-flex', alignItems:'center', width:'34px', height:'34px', justifyContent:'center'}}>
          <motion.span style={{position:'absolute', top:'-8px', left:'-10px', fontSize:'.75rem'}} animate={{scale:[.8,1.5,.8],opacity:[.7,1,.7],rotate:[0,25,0],y:[0,-4,0]}} transition={{duration:1.5,repeat:Infinity,ease:'easeInOut',delay:.1}}>✨</motion.span>
          <motion.span style={{position:'absolute', bottom:'-6px', right:'-10px', fontSize:'.65rem'}} animate={{scale:[.8,1.4,.8],opacity:[.6,1,.6],rotate:[0,-18,0],y:[0,-3,0]}} transition={{duration:1.9,repeat:Infinity,ease:'easeInOut',delay:.8}}>⭐</motion.span>
          <motion.div style={{lineHeight:0}} animate={{y:[0,-5,0],scale:[1,1.12,1],rotate:[0,8,0]}} transition={{duration:2.2,repeat:Infinity,ease:'easeInOut'}}>
            <PuffyClover size={20}/>
          </motion.div>
        </div>
        かわいくカスタマイズ
        <div style={{position:'relative', display:'inline-flex', alignItems:'center', width:'34px', height:'34px', justifyContent:'center'}}>
          <motion.span style={{position:'absolute', top:'-8px', right:'-10px', fontSize:'.75rem'}} animate={{scale:[.8,1.5,.8],opacity:[.7,1,.7],rotate:[0,-25,0],y:[0,-4,0]}} transition={{duration:1.6,repeat:Infinity,ease:'easeInOut',delay:.4}}>✨</motion.span>
          <motion.span style={{position:'absolute', bottom:'-6px', left:'-10px', fontSize:'.65rem'}} animate={{scale:[.8,1.4,.8],opacity:[.6,1,.6],rotate:[0,18,0],y:[0,-3,0]}} transition={{duration:1.8,repeat:Infinity,ease:'easeInOut',delay:.6}}>⭐</motion.span>
          <motion.div style={{lineHeight:0}} animate={{y:[0,-5,0],scale:[1,1.12,1],rotate:[0,-8,0]}} transition={{duration:2.2,repeat:Infinity,ease:'easeInOut',delay:0.5}}>
            <PuffyClover size={20}/>
          </motion.div>
        </div>
      </p>

      {/* 通知カード */}
      <motion.div initial={{opacity:0,scale:.92}} animate={{opacity:1,scale:1}} transition={{delay:.1}}
        className="glass-purple" style={{padding:'32px 20px 28px', position:'relative', overflow:'visible', marginTop:0, marginBottom:0}}
      >
        {/* 角キラキラ */}
        <span style={{position:'absolute', top:10, left:14, fontSize:'18px', animation:'corner-twinkle 2.5s ease-in-out infinite'}}>✨</span>
        <div style={{position:'absolute', top:-6, right:14}}>
          <motion.span style={{position:'absolute', top:'-6px', left:'-10px', fontSize:'.8rem'}}
            animate={{scale:[.8,1.5,.8], opacity:[.6,1,.6], rotate:[0,25,0], y:[0,-4,0]}}
            transition={{duration:1.6, repeat:Infinity, ease:'easeInOut', delay:.2}}>✨</motion.span>
          <motion.span style={{position:'absolute', top:'-4px', right:'-8px', fontSize:'.7rem'}}
            animate={{scale:[.8,1.4,.8], opacity:[.7,1,.7], rotate:[0,-20,0], y:[0,-5,0]}}
            transition={{duration:1.9, repeat:Infinity, ease:'easeInOut', delay:.8}}>⭐</motion.span>
          <motion.span style={{position:'absolute', bottom:'-4px', left:'-6px', fontSize:'.65rem'}}
            animate={{scale:[.8,1.3,.8], opacity:[.6,1,.6], rotate:[0,15,0], y:[0,-3,0]}}
            transition={{duration:2.1, repeat:Infinity, ease:'easeInOut', delay:1.3}}>💫</motion.span>
          <motion.span style={{position:'absolute', bottom:'-2px', right:'-10px', fontSize:'.7rem'}}
            animate={{scale:[.8,1.4,.8], opacity:[.7,1,.7], rotate:[0,-18,0], y:[0,-4,0]}}
            transition={{duration:1.7, repeat:Infinity, ease:'easeInOut', delay:.5}}>✨</motion.span>
          <motion.div style={{rotate:'18deg', filter:'drop-shadow(0 4px 10px rgba(255,160,200,.55))', lineHeight:0}}
            animate={{y:[0,-7,0], scale:[1,1.22,1], rotate:[14,22,14]}}
            transition={{duration:2.0, repeat:Infinity, ease:'easeInOut'}}>
            <PuffyHeart size={40} colors={{from:'#FFE0F2', mid:'#FF80C0', to:'#F04090'}}/>
          </motion.div>
        </div>
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:'16px'}}>
          <div style={{flex:1}}>
            <p style={{fontFamily:ZMG, fontWeight:900, fontSize:'1.1rem', color:'#22C55E', margin:'0 0 4px', display:'flex', alignItems:'center', gap:'4px'}}>
              <motion.span style={{display:'inline-flex',alignItems:'center', position:'relative', top:'-5px', transform:'rotate(-30deg)'}}
                animate={{y:[0,-5,0], rotate:[-36,-24,-36], scale:[1,1.12,1]}}
                transition={{duration:1.8, repeat:Infinity, ease:'easeInOut'}}
              ><PuffyBell size={28}/></motion.span>
              <span style={{marginLeft:'8px', position:'relative', top:'-9px'}}>おくすりつうち ✨</span>
            </p>
            <p style={{fontFamily:ZMG, fontSize:'.9rem', color:'#4C1D95', fontWeight:900, margin:0, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', display:'flex', alignItems:'center', gap:'2px'}}>
              {notifPermission==='denied'
                ? <><motion.span animate={{y:[0,-4,0],scale:[1,1.2,1]}} transition={{duration:1.8,repeat:Infinity,ease:'easeInOut'}}>⚠️</motion.span><span style={{marginLeft:'6px', color:'#FF4DB0'}}>つうちがブロックされてるよ</span></>
                : notifPermission==='granted' ? <><motion.span animate={{y:[0,-4,0],scale:[1,1.2,1]}} transition={{duration:1.8,repeat:Infinity,ease:'easeInOut'}}>💜</motion.span><span style={{marginLeft:'4px'}}>つうちが許可されてるよ！</span></>
                : <><motion.span animate={{y:[0,-4,0],scale:[1,1.2,1]}} transition={{duration:1.8,repeat:Infinity,ease:'easeInOut'}}>🫶</motion.span><span style={{marginLeft:'4px'}}>つうちの許可をしてね</span></>}
            </p>
          </div>
          <motion.button
            style={{
              position:'relative', width:72, height:38, borderRadius:'100px', flexShrink:0, cursor:'pointer',
              background: notifEnabled && notifPermission==='granted'
                ? 'linear-gradient(135deg, #FF85C0, #C084FC)'
                : '#E2E8F0',
              boxShadow: notifEnabled && notifPermission==='granted'
                ? '0 5px 0 rgba(175,100,240,.5), 0 8px 20px rgba(175,100,240,.3)'
                : '0 5px 0 rgba(180,180,210,.35)',
              border:'3px solid rgba(255,255,255,.9)',
            }}
            onClick={onToggleNotif}
            whileTap={{scale:.9, y:4}}
            transition={{type:'spring', stiffness:500, damping:22}}
          >
            <motion.div
              style={{position:'absolute', top:'4px', width:'26px', height:'26px', background:'white', borderRadius:'100px', boxShadow:'0 2px 6px rgba(0,0,0,.18)'}}
              animate={{x: notifEnabled && notifPermission==='granted' ? 36 : 4}}
              transition={{type:'spring', stiffness:500, damping:30}}
            />
          </motion.button>
        </div>
        {notifPermission==='denied' && (
          <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}}
            style={{marginTop:'12px', padding:'8px 14px', borderRadius:'22px', fontFamily:ZMG, fontSize:'.95rem', fontWeight:700, color:'#92400E', background:'rgba(255,242,160,.65)', border:'2px solid rgba(255,222,100,.75)'}}
          >
            <span style={{whiteSpace:'nowrap'}}>ブラウザの設定から通知を許可してね！</span>
          </motion.div>
        )}
      </motion.div>
      </div>{/* /かわいくカスタマイズ＋通知カード サブコンテナ */}

      {/* 上の余白スペーサー */}
      <div style={{flex:'1 0 0'}}/>

      {/* 通知時刻 */}
      <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:.15}}>
        <p className="kawaii-label-purple" style={{fontSize:'1.08rem', fontWeight:900, marginBottom:'12px', marginTop:'10px', paddingLeft:'4px', display:'flex', alignItems:'center', gap:'6px', color:'#22C55E'}}>
          <motion.div style={{lineHeight:0}} animate={{y:[0,-5,0],scale:[1,1.2,1]}} transition={{duration:2.0,repeat:Infinity,ease:'easeInOut'}}>
            <PuffyFlower size={26}/>
          </motion.div>
          つうちじこく
          <motion.span animate={{y:[0,-5,0],scale:[1,1.2,1]}} transition={{duration:1.8,repeat:Infinity,ease:'easeInOut',delay:0.3}}>✨</motion.span>
        </p>
        <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
          {schedules.map((slot,i) => {
            const cfg = SLOT[slot.timingId] ?? SLOT.morning
            return (
              <motion.div key={slot.timingId+i}
                initial={{opacity:0,x:-12}} animate={{opacity:1,x:0}} transition={{delay:.18+i*.07}}
                style={{
                  borderRadius:'100px', padding:'8px 14px 8px 8px',
                  display:'flex', alignItems:'center', gap:'10px',
                  background:`rgba(255,255,255,.82)`,
                  border:`2.5px solid ${cfg.border}`,
                  boxShadow:`0 5px 0 ${cfg.shadow}, 0 8px 20px ${cfg.shadow.replace('.45','.12')}`,
                  backdropFilter:'blur(8px)', WebkitBackdropFilter:'blur(8px)',
                }}
              >
                {/* アバター */}
                <CharAvatar charId={slot.timingId} emoji={cfg.char} size={56}
                  bg={`linear-gradient(145deg,${cfg.bg.replace('.22','.7')},${cfg.border.replace('.7','.5')})`}
                  shadow={`0 3px 8px ${cfg.shadow.replace('.45','.3')}, inset 0 1px 3px rgba(255,255,255,.7)`}
                />
                {/* 名前・ラベル */}
                <div style={{flex:1, minWidth:0}}>
                  <p style={{fontFamily:ZMG, fontWeight:900, fontSize:'1rem', color:cfg.text, margin:0, lineHeight:1.2, whiteSpace:'nowrap'}}>{cfg.name}</p>
                  <p style={{fontFamily:ZMG, fontWeight:700, fontSize:'.82rem', color:cfg.text, margin:0, opacity:.75, whiteSpace:'nowrap'}}>{slot.label}のおくすり</p>
                </div>
                {/* 時刻 */}
                <div style={{display:'flex', alignItems:'center', gap:'4px', flexShrink:0,
                  background:'rgba(255,255,255,.95)', borderRadius:'100px',
                  border:`2px solid ${cfg.border}`, padding:'6px 10px',
                  boxShadow:`0 3px 0 ${cfg.shadow}`,
                }}>
                  <input type="time"
                    defaultValue={`${String(slot.hour).padStart(2,'0')}:${String(slot.minute).padStart(2,'0')}`}
                    onChange={e=>onTimeChange(i,e.target.value)}
                    style={{
                      fontFamily:ZMG, fontSize:'1rem', fontWeight:900, color:cfg.text,
                      background:'transparent', border:'none', outline:'none',
                      width:'72px', textAlign:'center', padding:0,
                    }}
                  />
                  <span style={{fontSize:'.9rem'}}>🕐</span>
                </div>
                {/* 矢印 */}
                <span style={{fontFamily:ZMG, fontWeight:900, fontSize:'1rem', color:cfg.border, flexShrink:0}}>›</span>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* ぷにぷにテストボタン */}
      <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:.35}}>
        <p className="kawaii-label-purple" style={{fontSize:'1.08rem', fontWeight:900, marginBottom:'12px', marginTop:'10px', paddingLeft:'4px', display:'flex', alignItems:'center', gap:'6px', color:'#22C55E'}}>
          <motion.div style={{lineHeight:0}} animate={{y:[0,-5,0],scale:[1,1.2,1]}} transition={{duration:2.2,repeat:Infinity,ease:'easeInOut'}}>
            <PuffyFlower size={26}/>
          </motion.div>
          キャラポップアップを確認
          <motion.span animate={{y:[0,-5,0],scale:[1,1.2,1]}} transition={{duration:1.8,repeat:Infinity,ease:'easeInOut',delay:0.35}}>✨</motion.span>
        </p>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px'}}>
          {TEST.map(c => (
            <motion.button key={c.id} onClick={()=>onTestPopup(c.id)}
              style={{
                borderRadius:'32px', position:'relative',
                background:`linear-gradient(145deg, ${c.g1}, ${c.g2})`,
                border:'3.5px solid rgba(255,255,255,.9)',
                boxShadow:`0 10px 0 ${c.sh}, 0 18px 36px ${c.gl}`,
                aspectRatio:'1 / 1', cursor:'pointer',
                overflow:'hidden',
                margin:'0 4px',
              }}
              whileTap={{y:9, scale:.95, boxShadow:`0 1px 0 ${c.sh}`}}
              transition={{type:'spring', stiffness:600, damping:18}}
            >
              {/* キャラ丸：テキスト上の余白の中心 */}
              <div style={{position:'absolute', top:'28px', left:0, right:0, bottom:'38px', display:'flex', alignItems:'center', justifyContent:'center'}}>
                <motion.div
                  animate={{y:[0,-8,0], rotate:[-4,4,-4]}}
                  transition={{duration:2.4, repeat:Infinity, ease:'easeInOut'}}
                  style={{width:'80px', height:'80px', borderRadius:'50%', overflow:'hidden', border:'3px solid rgba(255,255,255,.9)'}}
                >
                  <img src={CHAR_IMAGES[c.id]}
                    alt={c.name}
                    style={{width:'100%', height:'100%', objectFit:'cover', objectPosition:'50% 20%', display:'block'}}
                    onError={e => { e.currentTarget.style.display='none'; e.currentTarget.nextSibling.style.display='block' }}
                  />
                  <span style={{fontSize:'3.2rem', lineHeight:1, display:'none'}}>{c.emoji}</span>
                </motion.div>
              </div>
              {/* 名前：下部固定 */}
              <div style={{position:'absolute', bottom:'6px', left:0, right:0, textAlign:'center'}}>
                <span style={{fontFamily:ZMG, fontWeight:700, fontSize:'1rem', color:c.tx}}>{c.name}</span>
              </div>
            </motion.button>
          ))}
        </div>
        <p style={{fontFamily:ZMG, fontWeight:700, textAlign:'center', marginTop:'10px', fontSize:'1rem', color:'#5B21B6'}}>
          ✨ タップしてポップアップを確認！ ✨
        </p>
      </motion.div>

      {/* 下の余白スペーサー */}
      <div style={{flex:'1 0 0'}}/>
    </div>
  )
}

/* ════════════════════════════════
   キャラヒーロー設定 & ボディ
════════════════════════════════ */
const HERO_CHARS = {
  morning:{ name:'りょう学長', time:'朝の担当', message:'今日がいちばん若い日やでー！！\n健康は最大の資産やで！\nお薬ちゃんと飲まなあかんで💪', bg:'linear-gradient(135deg,#FFF0A0 0%,#FFCE50 55%,#FFB840 100%)', shadow:'rgba(210,145,0,.45)', border:'rgba(255,225,80,.88)', textColor:'#78350F', stroke:'#B86000' },
  noon:   { name:'シマエナガ', time:'昼の担当', message:'お昼もかわいく頑張ろう！\nおくすり飲んでね〜♪\nふわふわ一緒に乗り越えよ！', bg:'linear-gradient(135deg,#B8E8FF 0%,#70C8FF 55%,#4AAFF0 100%)', shadow:'rgba(50,150,240,.45)', border:'rgba(130,200,255,.88)', textColor:'#075985', stroke:'#00489E' },
  night:  { name:'うさぎ', time:'夜の担当', message:'今日もお疲れ様〜💗\n一日よく頑張ったね！\nお薬飲んでゆっくり休もう❤️', bg:'linear-gradient(135deg,#FFC8E0 0%,#FF9AC8 55%,#F070AC 100%)', shadow:'rgba(220,70,155,.45)', border:'rgba(255,170,220,.88)', textColor:'#881337', stroke:'#A01060' },
  prn:    { name:'りす', time:'頓服のとき', message:'大丈夫かなぁ…🌿\n無理しちゃだめだよ。\nそっと側にいるからね…', bg:'linear-gradient(135deg,#C0F5D8 0%,#88EABB 55%,#50D08A 100%)', shadow:'rgba(50,190,115,.45)', border:'rgba(140,230,170,.88)', textColor:'#064E3B', stroke:'#007040' },
}

const CHAR_EMOJI = { morning:'🦁', noon:'🐦', night:'🐰', prn:'🐿️' }
const CHAR_ANIM  = {
  morning:{ animate:{y:[0,-6,0],rotate:[-5,5,-5]}, duration:1.8 },
  noon:   { animate:{y:[0,-10,0],rotate:[-4,4,-4]}, duration:2.2 },
  night:  { animate:{y:[0,-8,0],rotate:[-3,3,-3]}, duration:2.5 },
  prn:    { animate:{y:[0,-8,0],rotate:[-2,2,-2]}, duration:3.0 },
}

function CharHeroBody({ charId }) {
  const anim = CHAR_ANIM[charId] ?? CHAR_ANIM.prn
  return (
    <motion.div
      animate={anim.animate}
      transition={{duration:anim.duration, repeat:Infinity, ease:'easeInOut'}}
      style={{width:'84px', height:'84px', display:'flex', alignItems:'center', justifyContent:'center', position:'relative'}}
    >
      <img
        src={CHAR_IMAGES[charId]} alt={charId}
        style={{width:'80px', height:'80px', objectFit:'cover', objectPosition:'50% 30%', borderRadius:'50%', filter:'drop-shadow(0 4px 8px rgba(0,0,0,.15))'}}
        onError={e => { e.currentTarget.style.display='none'; e.currentTarget.nextSibling.style.display='block' }}
      />
      <span style={{fontSize:'3.4rem', lineHeight:1, display:'none'}}>{CHAR_EMOJI[charId]}</span>
    </motion.div>
  )
}

/* ════════════════════════════════
   🏠 ホームタブ
════════════════════════════════ */
function HomeView({ medicines, takenMap, toggleTaken, onRecord, onCharTap, schedules=[] }) {
  const takenCount = Object.values(takenMap).filter(Boolean).length
  const totalCount = SCHEDULE.length
  const progress   = takenCount / totalCount
  const hour   = new Date().getHours()
  const charId = hour < 11 ? 'morning' : hour < 16 ? 'noon' : hour < 21 ? 'night' : 'prn'
  const char   = HERO_CHARS[charId]
  const todayDate = new Date().toLocaleDateString('ja-JP',{year:'numeric',month:'numeric',day:'numeric'})
  const todayDay  = new Date().toLocaleDateString('ja-JP',{weekday:'short'})

  return (
    <div style={{display:'flex', flexDirection:'column', gap:0, minHeight:'calc(100svh - 120px)'}}>

      {/* ① タイトル */}
      <div style={{flex:'1 0 0', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-end', paddingBottom:'0px'}}>
        <KawaiiTitle text="おくすりタイマー"/>
      </div>

      {/* ② 日付 — ヒーローカードのすぐ上 */}
      <motion.div initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} transition={{duration:.3,delay:.05}}
        style={{flexShrink:0, display:'flex', justifyContent:'center', marginBottom:'10px', marginTop:'-14px'}}
      >
        <p style={{display:'flex', alignItems:'center', gap:'6px', margin:'0', whiteSpace:'nowrap'}}>
          <motion.div style={{lineHeight:0}} animate={{y:[0,-5,0],scale:[1,1.2,1]}} transition={{duration:2.0,repeat:Infinity,ease:'easeInOut'}}>
            <PuffyFlower size={26} colors={{from:'#FFD8F8',mid:'#E888FF',to:'#A040F0',shadow:'#8020D0',stroke:'#FF60B0'}}/>
          </motion.div>
          <span style={{fontFamily:ZMG, fontSize:'1.15rem', color:'#22C55E'}}>
            <span style={{fontWeight:900}}>{todayDate}</span>
            <span style={{fontWeight:900}}>(</span>
            <span style={{fontWeight:700}}>{todayDay}</span>
            <span style={{fontWeight:900}}>)</span>
          </span>
          <motion.div style={{lineHeight:0}} animate={{y:[0,-5,0],scale:[1,1.2,1]}} transition={{duration:2.0,repeat:Infinity,ease:'easeInOut',delay:0.4}}>
            <PuffyFlower size={26} colors={{from:'#FFD8F8',mid:'#E888FF',to:'#A040F0',shadow:'#8020D0',stroke:'#FF60B0'}}/>
          </motion.div>
        </p>
      </motion.div>

      {/* ② キャラヒーローカード — タップでポップアップ */}
      <motion.div initial={{opacity:0,scale:.94}} animate={{opacity:1,scale:1}}
        transition={{delay:.07,type:'spring',stiffness:320,damping:24}}
        onClick={()=>onCharTap?.(charId, char.message)}
        whileTap={{scale:.97}}
        style={{
          flexShrink:0,
          height:'clamp(190px, 40vh, 265px)',
          marginBottom:'28px',
          display:'flex', flexDirection:'column',
          borderRadius:'22px', background:char.bg,
          border:`2.5px solid ${char.border}`,
          boxShadow:`0 6px 0 ${char.shadow},0 14px 32px ${char.shadow.replace('.52','.18')}`,
          overflow:'hidden', position:'relative', cursor:'pointer',
        }}
      >
        <div style={{position:'absolute',right:'-6px',top:'-6px',width:'80px',height:'80px',borderRadius:'50%',background:'radial-gradient(rgba(255,255,255,.3),transparent 70%)',pointerEvents:'none'}}/>
        {/* 上段 */}
        <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',padding:'14px',flexShrink:0}}>
          <div style={{flex:1}}>
            <span style={{display:'inline-block',fontFamily:ZMG,fontWeight:700,fontSize:'.85rem',padding:'2px 10px',borderRadius:'100px',background:'rgba(255,255,255,.85)',color:char.textColor}}>今日の担当キャラ</span>
            <p style={{fontFamily:ZMG,fontWeight:900,fontSize:'1.3rem',color:'white',margin:'4px 0 2px',lineHeight:1.1,
              textShadow:`1.5px 1.5px 0 ${char.stroke},-1.5px 1.5px 0 ${char.stroke},1.5px -1.5px 0 ${char.stroke},-1.5px -1.5px 0 ${char.stroke},0 1.5px 0 ${char.stroke},0 -1.5px 0 ${char.stroke}`
            }}>{char.name}</p>
            <p style={{fontFamily:ZMG,fontWeight:700,fontSize:'1rem',color:'rgba(255,255,255,0.92)',margin:0,
              textShadow:`1px 1px 0 ${char.stroke},-1px 1px 0 ${char.stroke},1px -1px 0 ${char.stroke},-1px -1px 0 ${char.stroke}`
            }}>{char.time}</p>
          </div>
          <div style={{flexShrink:0,transform:'scale(.72)',transformOrigin:'top right',marginTop:'-2px',marginRight:'-6px'}}>
            <CharHeroBody charId={charId}/>
          </div>
        </div>
        {/* メッセージバブル */}
        <div style={{flex:1,background:'rgba(255,255,255,.95)',borderRadius:'16px 16px 0 0',padding:'8px 12px 10px',position:'relative',overflow:'hidden',display:'flex',flexDirection:'column',justifyContent:'flex-start',gap:'8px'}}>
          <div style={{position:'absolute',top:'-6px',left:'20px',width:'11px',height:'11px',transform:'rotate(45deg)',background:'rgba(255,255,255,.95)'}}/>
          <p style={{fontFamily:ZMG,fontWeight:700,fontSize:'1rem',color:char.textColor,whiteSpace:'pre-line',lineHeight:1.65,margin:0,overflow:'hidden',display:'-webkit-box',WebkitLineClamp:'3',WebkitBoxOrient:'vertical'}}>
            {char.message}
          </p>
          <motion.div style={{alignSelf:'flex-end',marginTop:'6px',background:'rgba(255,255,255,.9)',borderRadius:'20px',padding:'4px 10px',border:`2px solid ${char.border}`,boxShadow:`0 3px 0 ${char.shadow}`,display:'flex',alignItems:'center',gap:'4px'}}
            animate={{scale:[1,1.04,1]}} transition={{duration:2.5,repeat:Infinity}}>
            <span style={{fontFamily:ZMG,fontWeight:900,fontSize:'1rem',color:char.textColor,lineHeight:1}}>{takenCount}<span style={{fontWeight:700,fontSize:'.85rem'}}>/{totalCount}</span></span>
            <motion.span style={{fontSize:'.88rem',lineHeight:1}} animate={{rotate:[-8,8,-8]}} transition={{duration:2.2,repeat:Infinity}}>{progress===1?'🌟':'💊'}</motion.span>
            <span style={{fontSize:'.7rem',fontWeight:'900',color:char.textColor}}>{progress===1?'全完了！':'きょう'}</span>
          </motion.div>
        </div>
      </motion.div>

      {/* ③ お薬4枚 横並び（スクロールなし・等幅） */}
      <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:.14}} style={{flexShrink:0,marginBottom:'28px'}}>
        <p style={{fontFamily:ZMG, fontWeight:900, fontSize:'1.2rem', marginBottom:'5px', paddingLeft:'2px', display:'flex', alignItems:'center', gap:'6px', color:'#22C55E'}}>
          <motion.div style={{lineHeight:0,flexShrink:0}} animate={{y:[0,-5,0],scale:[1,1.2,1]}} transition={{duration:2.0,repeat:Infinity,ease:'easeInOut'}}>
            <PuffyFlower size={22} colors={{from:'#FFD8F8',mid:'#E888FF',to:'#A040F0',shadow:'#8020D0',stroke:'#FF60B0'}}/>
          </motion.div>
          今日のおくすり
          <motion.div style={{lineHeight:0,flexShrink:0}} animate={{y:[0,-5,0],scale:[1,1.2,1]}} transition={{duration:2.0,repeat:Infinity,ease:'easeInOut',delay:0.4}}>
            <PuffyFlower size={22} colors={{from:'#FFD8F8',mid:'#E888FF',to:'#A040F0',shadow:'#8020D0',stroke:'#FF60B0'}}/>
          </motion.div>
        </p>
        <div style={{display:'flex',gap:'7px'}}>
          {SCHEDULE.map((slot,i) => {
            const taken    = takenMap[slot.label] ?? false
            const sc       = SCHEDULE_COLORS[slot.timingId] ?? SCHEDULE_COLORS.morning
            const slotMeds = medicines.filter(m => m.timingId===slot.timingId)
            const dynSlot  = schedules.find(s => s.timingId===slot.timingId)
            const dispTime = dynSlot
              ? `${String(dynSlot.hour).padStart(2,'0')}:${String(dynSlot.minute).padStart(2,'0')}`
              : slot.time
            return (
              <motion.button key={slot.label}
                onClick={()=>{ playShirin(); toggleTaken(slot.label) }}
                initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
                transition={{delay:.18+i*.06,type:'spring',stiffness:360,damping:22}}
                style={{
                  flex:'1 1 0',
                  minWidth:0,
                  width:0,
                  height:'120px',
                  boxSizing:'border-box',
                  borderRadius:'18px',
                  padding:'10px 4px',
                  background:taken?'linear-gradient(145deg,rgba(249,168,212,.72),rgba(167,139,250,.62))':sc.bg,
                  border:`2px solid ${taken?'rgba(255,190,230,.9)':sc.border}`,
                  boxShadow:`0 5px 0 ${sc.shadow},0 8px 16px ${sc.shadow.replace('.50','.12')}`,
                  cursor:'pointer',
                  display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'space-between',
                  overflow:'hidden',
                  backdropFilter:'blur(16px)',WebkitBackdropFilter:'blur(16px)',
                }}
                whileTap={{y:4,scale:.91}}
              >
                <motion.div
                  animate={taken?{scale:[1,1.2,1]}:{y:[0,-3,0]}}
                  transition={{duration:taken?.4:2.4,repeat:taken?0:Infinity,ease:'easeInOut'}}
                  style={{width:'60px',height:'60px',borderRadius:'50%',overflow:'hidden',
                    background:sc.avatarBg,
                    border:'2px solid rgba(255,255,255,.9)',
                    display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}
                >
                  {taken
                    ? <span style={{fontSize:'1.5rem',lineHeight:1}}>✅</span>
                    : <>
                        <img src={CHAR_IMAGES[slot.timingId]} alt={slot.label}
                          style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'50% 30%'}}
                          onError={e=>{e.currentTarget.style.display='none';e.currentTarget.nextSibling.style.display='block'}}
                        />
                        <span style={{fontSize:'1.4rem',lineHeight:1,display:'none'}}>{slot.icon}</span>
                      </>
                  }
                </motion.div>
                <span style={{fontFamily:ZMG,fontWeight:900,fontSize:'1.1rem',color:taken?'#6D28D9':'#1A0050',whiteSpace:'nowrap'}}>{slot.label}</span>
                <span style={{fontFamily:ZMG,fontWeight:900,fontSize:'.95rem',color:'#3B1F7A',whiteSpace:'nowrap'}}>{dispTime}</span>
                <div style={{height:'18px',width:'100%',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
                  {slotMeds[0] && (
                    <div style={{fontFamily:ZMG,fontWeight:700,fontSize:'.88rem',color:taken?'#6D28D9':'#4C1D95',background:'rgba(255,255,255,.85)',borderRadius:'100px',padding:'1px 6px',maxWidth:'100%',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                      {slotMeds[0].icon === '💊'
                        ? <><PuffyCapsule size={20} style={{display:'inline-block',verticalAlign:'middle',transform:'rotate(135deg)',marginRight:'2px'}}/>{slotMeds[0].name}</>
                        : <>{slotMeds[0].icon}{slotMeds[0].name}</>
                      }
                    </div>
                  )}
                </div>
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      {/* ④ 記録ボタン（fixed ではなく flow 配置） */}
      <motion.div
        initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:.25,type:'spring',stiffness:320,damping:22}}
        style={{flexShrink:0, display:'flex', alignItems:'center', marginTop:'-10px', marginBottom:'4px'}}
      >
        <motion.button
          style={{
            flex:1,
            padding:'17px 12px',
            background:'linear-gradient(135deg, #FF4DB0 0%, #FF80C8 60%, #FF9ACB 100%)',
            borderRadius:'100px',
            border:'3.5px solid rgba(255,255,255,.95)',
            boxShadow:'0 9px 0 rgba(220,50,150,.35), 0 14px 36px rgba(220,50,150,.2)',
            color:'white', fontFamily:ZMG, fontWeight:900, fontSize:'1.1rem',
            cursor:'pointer', letterSpacing:'.01em', whiteSpace:'nowrap',
            display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
          }}
          whileTap={{y:8,scale:.97,boxShadow:'0 1px 0 rgba(180,120,240,.3), 0 3px 10px rgba(180,120,240,.15)'}}
          onClick={()=>{ playKiran(); onRecord() }}
        >
          <motion.div style={{lineHeight:0}} animate={{y:[0,-5,0],scale:[1,1.2,1]}} transition={{duration:2.0,repeat:Infinity,ease:'easeInOut'}}>
            <PuffyFlower size={22} colors={{from:'#FFF0FF',mid:'#FFB0F0',to:'#EE80FF',shadow:'#D060E8',stroke:'#FF88D0'}}/>
          </motion.div>
          今すぐ服薬を記録する
          <motion.div style={{lineHeight:0}} animate={{y:[0,-5,0],scale:[1,1.2,1]}} transition={{duration:2.0,repeat:Infinity,ease:'easeInOut',delay:0.35}}>
            <PuffyFlower size={22} colors={{from:'#FFF0FF',mid:'#FFB0F0',to:'#EE80FF',shadow:'#D060E8',stroke:'#FF88D0'}}/>
          </motion.div>
        </motion.button>
      </motion.div>

      {/* 下スペーサー */}
      <div style={{flex:'0.35 0 0'}}/>

    </div>
  )
}

/* ════════════════════════════════
   📋 服薬履歴ビュー
════════════════════════════════ */
function HistoryView({ medHistory, addHistory, updateHistory, deleteHistory, medLog, addLog, updateLog, deleteLog }) {
  const today = new Date().toISOString().split('T')[0]
  const [histTab, setHistTab] = useState('detail') // 'detail' | 'log'
  const [newName, setNewName] = useState('')

  const formatDate = (d) => {
    if (!d) return ''
    const [, m, day] = d.split('-')
    return `${parseInt(m)}月${parseInt(day)}日`
  }

  const getStatus = (start, end) => {
    if (!start) return null
    if (end && end <= today) return { label:'飲み終わり 🎉', color:'#10B981', bg:'rgba(16,185,129,.13)' }
    return { label:'飲んでいる中 💊', color:'#F05AA8', bg:'rgba(240,90,168,.13)' }
  }

  const inputStyle = (accent = 'rgba(220,180,255,.55)') => ({
    fontFamily:ZMG, fontWeight:700, fontSize:'15px',
    width:'100%', padding:'9px 13px', borderRadius:'12px',
    border:`2px solid ${accent}`,
    background:'rgba(255,255,255,.95)',
    color:'#3B1A6E', outline:'none', boxSizing:'border-box',
  })

  const handleAdd = () => {
    if (!newName.trim()) return
    const name = newName.trim()
    addHistory({ id: Date.now(), name, startDate: today, endDate: '' })
    addLog({ id: Date.now() + 1, name, startDate: today, endDate: '' })
    setNewName('')
  }

  return (
    <div style={{display:'flex',flexDirection:'column',paddingBottom:'16px'}}>

      {/* タイトル */}
      <KawaiiTitle text="おくすりのきろく" compact/>

      {/* ── サブタブ ── */}
      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.08}}
        style={{display:'flex',gap:'8px',marginTop:'14px',marginBottom:'18px',
          background:'rgba(255,255,255,.7)',borderRadius:'18px',padding:'5px',
          boxShadow:'0 3px 12px rgba(200,100,200,.1)'}}
      >
        {[
          {id:'detail', label:'お薬のきろく',  emoji:'📋'},
          {id:'log',    label:'飲んできたお薬', emoji:'📝'},
        ].map(t => (
          <button key={t.id} onClick={()=>setHistTab(t.id)}
            style={{
              flex:1, padding:'9px 4px', borderRadius:'13px', cursor:'pointer',
              fontFamily:ZMG, fontWeight:900, fontSize:'15px',
              display:'flex', alignItems:'center', justifyContent:'center', gap:'5px',
              transition:'all .18s',
              ...(histTab===t.id ? {
                background:'linear-gradient(135deg, #FFFAD0, #FFE870)',
                color:'#A07800',
                boxShadow:'0 3px 8px rgba(220,190,0,.25)',
                border:'1.5px solid rgba(255,220,50,.5)',
              } : {
                background:'transparent', color:'#6B3FA8', border:'1.5px solid transparent',
              }),
            }}
          ><motion.span style={{fontSize:'1.2em',marginRight:'2px'}} animate={{y:[0,-4,0]}} transition={{duration:2,repeat:Infinity,ease:'easeInOut'}}>{t.emoji}</motion.span>{t.label}</button>
        ))}
      </motion.div>

      {histTab === 'log' ? (
        /* ════ シンプル一覧ページ ════ */
        <MedLogView medLog={medLog} addLog={addLog} updateLog={updateLog} deleteLog={deleteLog} today={today} inputStyle={inputStyle}/>
      ) : (

      <>
      {/* ── 新規追加エリア ── */}
      <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{delay:.08}}
        className="glass-card rounded-2xl"
        style={{padding:'14px 16px',marginBottom:'18px',boxShadow:'0 4px 20px rgba(220,100,200,.1)'}}
      >
        <p style={{fontFamily:ZMG,fontWeight:900,fontSize:'16px',color:'#7C3AED',margin:'0 0 10px',display:'flex',alignItems:'center',gap:'5px'}}>
          <motion.span style={{fontSize:'1.25em',marginRight:'4px'}} animate={{y:[0,-4,0]}} transition={{duration:2.2,repeat:Infinity,ease:'easeInOut'}}>✏️</motion.span>新しいお薬を追加
        </p>
        <div style={{display:'flex',gap:'8px'}}>
          <input
            type="text"
            placeholder="お薬の名前を入力…"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            style={{...inputStyle(), flex:1, fontSize:'14px'}}
          />
          <motion.button
            onClick={handleAdd}
            whileTap={{y:8,scale:.97,boxShadow:'0 1px 0 rgba(180,120,240,.3), 0 3px 10px rgba(180,120,240,.15)'}}
            style={{
              fontFamily:ZMG, fontWeight:900, fontSize:'14px', color:'white',
              padding:'9px 16px', borderRadius:'100px', flexShrink:0, cursor:'pointer',
              background:'linear-gradient(135deg, #FF4DB0 0%, #FF80C8 60%, #FF9ACB 100%)',
              border:'3.5px solid rgba(255,255,255,.95)',
              boxShadow:'0 9px 0 rgba(220,50,150,.35), 0 14px 36px rgba(220,50,150,.2)',
              display:'flex', alignItems:'center', gap:'5px',
            }}
          >
            <motion.div style={{lineHeight:0}} animate={{y:[0,-5,0],scale:[1,1.2,1]}} transition={{duration:2.0,repeat:Infinity,ease:'easeInOut'}}>
              <PuffyFlower size={16} colors={{from:'#FFF0FF',mid:'#FFB0F0',to:'#EE80FF',shadow:'#D060E8',stroke:'#FF88D0'}}/>
            </motion.div>
            追加
          </motion.button>
        </div>
      </motion.div>

      {/* ── きろく一覧 ── */}
      {medHistory.length === 0 ? (
        <motion.div className="glass-pink" style={{padding:'32px 24px',textAlign:'center'}}
          initial={{scale:.9}} animate={{scale:1}} transition={{type:'spring',stiffness:300,damping:18}}
        >
          <div style={{position:'relative',display:'inline-block',marginBottom:'28px',marginTop:'36px'}}>
            {[
              {top:'-14px',left:'8px',s:16,d:2.2,delay:0},
              {top:'-8px',right:'-4px',s:12,d:2.6,delay:.4},
              {top:'18px',right:'-18px',s:14,d:2.4,delay:.8},
              {bottom:'-4px',right:'4px',s:10,d:2.8,delay:.2},
              {top:'10px',left:'-18px',s:13,d:2.5,delay:.6},
              {bottom:'4px',left:'-4px',s:11,d:3.0,delay:1.0},
            ].map((sp,i)=>(
              <motion.span key={i} style={{position:'absolute',top:sp.top,left:sp.left,right:sp.right,bottom:sp.bottom,fontSize:`${sp.s}px`,lineHeight:1,pointerEvents:'none'}}
                animate={{scale:[1,1.4,1],opacity:[.7,1,.7],rotate:[0,20,0],y:[0,-6,0]}}
                transition={{duration:sp.d,repeat:Infinity,ease:'easeInOut',delay:sp.delay}}
              >✨</motion.span>
            ))}
            <motion.div style={{display:'inline-block'}}
              animate={{y:[0,-12,0]}} transition={{duration:3,repeat:Infinity,ease:'easeInOut'}}>
              <PuffyHeart size={80}/>
            </motion.div>
          </div>
          <p style={{fontFamily:ZMG,fontWeight:900,fontSize:'1.05rem',color:'#FF1493',margin:'0 0 4px'}}>まだきろくがないよ</p>
          <p style={{fontFamily:ZMG,fontWeight:700,fontSize:'.9rem',color:'#9D174D',margin:0}}>上から追加してね💕</p>
        </motion.div>
      ) : (
        <AnimatePresence>
          {medHistory.map((item, i) => {
            const status = getStatus(item.startDate, item.endDate)
            return (
              <motion.div key={item.id}
                initial={{opacity:0,y:10,scale:.97}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,x:-30,scale:.95}}
                transition={{delay:i*0.05, type:'spring',stiffness:320,damping:24}}
                className="glass-card rounded-2xl"
                style={{marginBottom:'12px',overflow:'hidden',boxShadow:'0 4px 18px rgba(200,100,200,.1)'}}
              >
                {/* ヘッダー行 */}
                <div style={{
                  background:'linear-gradient(135deg,#FFE0F8,#F0C0FF)',
                  padding:'10px 14px',display:'flex',alignItems:'center',gap:'8px',
                }}>
                  <span style={{fontSize:'1.4rem',lineHeight:1,flexShrink:0}}>💊</span>
                  {/* お薬の名前：直接編集できる入力欄 */}
                  <input
                    type="text"
                    value={item.name}
                    onChange={e => updateHistory(item.id, 'name', e.target.value)}
                    style={{
                      flex:1, minWidth:0,
                      fontFamily:ZMG, fontWeight:900, fontSize:'1rem', color:'#5B1A8E',
                      background:'rgba(255,255,255,.55)',
                      border:'1.5px solid rgba(220,160,255,.5)',
                      borderRadius:'10px', padding:'4px 10px',
                      outline:'none',
                    }}
                  />
                  {status && (
                    <span style={{
                      fontFamily:ZMG,fontWeight:700,fontSize:'.75rem',flexShrink:0,
                      padding:'3px 9px',borderRadius:'100px',
                      background:status.bg,color:status.color,
                      border:`1.5px solid ${status.color}44`,
                    }}>{status.label}</span>
                  )}
                  {/* 削除ボタン */}
                  <motion.button onClick={()=>deleteHistory(item.id)} whileTap={{scale:.85}}
                    style={{
                      width:'26px',height:'26px',borderRadius:'8px',flexShrink:0,cursor:'pointer',
                      background:'rgba(255,255,255,.6)',border:'1.5px solid rgba(220,100,180,.3)',
                      display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px',
                    }}>✕</motion.button>
                </div>

                {/* 日付エリア */}
                <div style={{padding:'12px 14px',display:'flex',flexDirection:'column',gap:'8px'}}>
                  {/* 飲み始め */}
                  <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                    <span style={{fontFamily:ZMG,fontWeight:900,fontSize:'15px',color:'#7C3AED',flexShrink:0,width:'96px'}}>
                      🌱 飲み始め
                    </span>
                    <input type="date" value={item.startDate||''} max={today}
                      onChange={e=>updateHistory(item.id,'startDate',e.target.value)}
                      style={{...inputStyle('rgba(200,160,255,.5)'),fontSize:'14px'}}
                    />
                  </div>
                  {/* 飲み終わり */}
                  <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                    <span style={{fontFamily:ZMG,fontWeight:900,fontSize:'15px',color:'#7C3AED',flexShrink:0,width:'96px'}}>
                      🏁 飲み終わり
                    </span>
                    <input type="date" value={item.endDate||''} min={item.startDate||''}
                      onChange={e=>updateHistory(item.id,'endDate',e.target.value)}
                      style={{...inputStyle('rgba(200,160,255,.5)'),fontSize:'14px'}}
                    />
                  </div>

                  {/* 副作用メモ */}
                  <div>
                    <span style={{fontFamily:ZMG,fontWeight:900,fontSize:'15px',color:'#7C3AED',display:'flex',alignItems:'center',gap:'4px',marginBottom:'5px'}}>
                      ⚠️ 副作用メモ
                    </span>
                    <textarea
                      value={item.sideEffect||''}
                      onChange={e=>updateHistory(item.id,'sideEffect',e.target.value)}
                      placeholder="気になる症状などを書いてね…"
                      rows={2}
                      style={{
                        ...inputStyle('rgba(200,160,255,.5)'),
                        fontSize:'14px', resize:'none', lineHeight:1.6,
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      )}
      </>
      )}
    </div>
  )
}

/* ════ シンプル飲んできたお薬一覧 ════ */
function MedLogView({ medLog, addLog, updateLog, deleteLog, today, inputStyle }) {
  const [shownName, setShownName] = useState(null) // { name, id }

  const handleAddRow = () => {
    addLog({ id: Date.now(), name: '', startDate: '', endDate: '' })
  }

  return (
    <div style={{display:'flex',flexDirection:'column',gap:'0'}}>

      {/* お薬名フルポップアップ */}
      <AnimatePresence>
        {shownName && (
          <motion.div
            initial={{opacity:0,scale:.85}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:.85}}
            transition={{type:'spring',stiffness:400,damping:28}}
            onClick={()=>setShownName(null)}
            style={{
              position:'fixed',inset:0,zIndex:999,
              display:'flex',alignItems:'center',justifyContent:'center',
              background:'rgba(100,60,160,.18)',backdropFilter:'blur(4px)',
            }}
          >
            <motion.div
              onClick={e=>e.stopPropagation()}
              className="glass-purple"
              style={{padding:'28px 32px',maxWidth:'320px',width:'85%',textAlign:'center'}}
            >
              <p style={{fontFamily:ZMG,fontWeight:900,fontSize:'1.5rem',color:'#6D28D9',margin:'0 0 12px',wordBreak:'break-all'}}>
                {shownName.name}
              </p>
              <motion.button
                onClick={()=>setShownName(null)}
                whileTap={{scale:.92}}
                style={{
                  fontFamily:ZMG,fontWeight:900,fontSize:'15px',color:'#22C55E',
                  padding:'10px 32px',borderRadius:'100px',cursor:'pointer',
                  background:'linear-gradient(135deg,#C084FC,#818CF8)',
                  border:'3px solid rgba(255,255,255,.9)',
                  boxShadow:'0 6px 0 rgba(140,80,220,.45)',
                }}
              >とじる</motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 追加ボタン */}
      <motion.button
        onClick={handleAddRow}
        whileTap={{scale:.95,y:2}}
        initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{delay:.05}}
        style={{
          fontFamily:ZMG, fontWeight:900, fontSize:'15px', color:'white',
          padding:'13px', borderRadius:'100px', cursor:'pointer', marginBottom:'16px',
          background:'linear-gradient(135deg, #FF4DB0 0%, #FF80C8 60%, #FF9ACB 100%)',
          border:'3.5px solid rgba(255,255,255,.95)',
          boxShadow:'0 9px 0 rgba(220,50,150,.35), 0 14px 36px rgba(220,50,150,.2)',
          display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
        }}
        whileTap={{y:8,scale:.97,boxShadow:'0 1px 0 rgba(180,120,240,.3), 0 3px 10px rgba(180,120,240,.15)'}}
      >
        <motion.div style={{lineHeight:0}} animate={{y:[0,-5,0],scale:[1,1.2,1]}} transition={{duration:2.0,repeat:Infinity,ease:'easeInOut'}}>
          <PuffyFlower size={20} colors={{from:'#FFF0FF',mid:'#FFB0F0',to:'#EE80FF',shadow:'#D060E8',stroke:'#FF88D0'}}/>
        </motion.div>
        お薬を追加する
        <motion.div style={{lineHeight:0}} animate={{y:[0,-5,0],scale:[1,1.2,1]}} transition={{duration:2.0,repeat:Infinity,ease:'easeInOut',delay:0.35}}>
          <PuffyFlower size={20} colors={{from:'#FFF0FF',mid:'#FFB0F0',to:'#EE80FF',shadow:'#D060E8',stroke:'#FF88D0'}}/>
        </motion.div>
      </motion.button>

      {/* ヘッダー行ラベル */}
      {medLog.length > 0 && (
        <div style={{display:'grid',gridTemplateColumns:'1fr 90px 90px 28px',gap:'6px',
          padding:'0 4px 6px',marginBottom:'2px'}}>
          {['お薬の名前','飲み始め','飲み終わり',''].map((h,i) => (
            <span key={i} style={{fontFamily:ZMG,fontWeight:900,fontSize:'13px',color:'#9B7EC8'}}>{h}</span>
          ))}
        </div>
      )}

      {/* 一覧 */}
      <AnimatePresence>
        {medLog.length === 0 ? (
          <motion.div initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}}
            className="glass-pink" style={{padding:'28px 20px',textAlign:'center'}}
          >
            <motion.span style={{fontSize:'3rem',display:'block',marginBottom:'10px'}}
              animate={{y:[0,-8,0],rotate:[-5,5,-5]}} transition={{duration:3,repeat:Infinity}}>📝</motion.span>
            <p style={{fontFamily:ZMG,fontWeight:900,fontSize:'1rem',color:'#BE185D',margin:'0 0 4px'}}>まだないよ</p>
            <p style={{fontFamily:ZMG,fontWeight:700,fontSize:'.9rem',color:'#9D174D',margin:0}}>上のボタンから追加してね💕</p>
          </motion.div>
        ) : medLog.map((row, i) => (
          <motion.div key={row.id}
            initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,x:-20}}
            transition={{delay:i*0.04,type:'spring',stiffness:340,damping:26}}
            style={{
              display:'grid', gridTemplateColumns:'1fr 110px 110px 28px', gap:'6px',
              alignItems:'center', marginBottom:'8px',
              background:'rgba(255,255,255,.82)', borderRadius:'14px',
              padding:'8px 10px',
              border:'1.5px solid rgba(220,180,255,.4)',
              boxShadow:'0 2px 10px rgba(200,100,200,.08)',
            }}
          >
            {/* 名前 */}
            <div style={{position:'relative'}}>
              <input type="text" value={row.name} placeholder="お薬の名前"
                onChange={e=>updateLog(row.id,'name',e.target.value)}
                onClick={()=>row.name && setShownName({id:row.id,name:row.name})}
                readOnly={!!row.name}
                style={{
                  fontFamily:ZMG,fontWeight:900,fontSize:'13px',color:'#3B1A6E',
                  background:'rgba(248,240,255,.8)',border:'1.5px solid rgba(210,170,255,.5)',
                  borderRadius:'9px',padding:'6px 9px',outline:'none',width:'100%',boxSizing:'border-box',
                  cursor: row.name ? 'pointer' : 'text',
                }}
              />
            </div>
            {/* 飲み始め */}
            <input type="date" value={row.startDate||''}
              onChange={e=>updateLog(row.id,'startDate',e.target.value)}
              style={{
                fontFamily:ZMG,fontWeight:900,fontSize:'13px',color:'#3B1A6E',
                background:'rgba(248,240,255,.8)',border:'1.5px solid rgba(210,170,255,.5)',
                borderRadius:'9px',padding:'6px 6px',outline:'none',width:'100%',boxSizing:'border-box',
              }}
            />
            {/* 飲み終わり */}
            <input type="date" value={row.endDate||''} min={row.startDate||''}
              onChange={e=>updateLog(row.id,'endDate',e.target.value)}
              style={{
                fontFamily:ZMG,fontWeight:900,fontSize:'13px',color:'#3B1A6E',
                background:'rgba(248,240,255,.8)',border:'1.5px solid rgba(210,170,255,.5)',
                borderRadius:'9px',padding:'6px 6px',outline:'none',width:'100%',boxSizing:'border-box',
              }}
            />
            {/* 削除 */}
            <motion.button onClick={()=>deleteLog(row.id)} whileTap={{scale:.8}}
              style={{
                width:'28px',height:'28px',borderRadius:'8px',cursor:'pointer',flexShrink:0,
                background:'rgba(255,200,220,.4)',border:'1.5px solid rgba(255,150,180,.4)',
                display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',
              }}>✕</motion.button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

/* ════════════════════════════════
   💾 localStorage ユーティリティ
════════════════════════════════ */
function loadLS(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch { return fallback }
}
function saveLS(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}

/* ════════════════════════════════
   App
════════════════════════════════ */
export default function App() {
  const [activeTab,       setActiveTab]       = useState('home')

  // 今日の日付（飲んだ記録は日付が変わったらリセット）
  const todayKey = new Date().toISOString().split('T')[0]
  const savedTakenDate = loadLS('okusuri_taken_date', '')
  const initTakenMap = savedTakenDate === todayKey ? loadLS('okusuri_taken_map', {}) : {}
  const [takenMap,        setTakenMap]        = useState(initTakenMap)

  const [medicines,       setMedicines]       = useState(() => loadLS('okusuri_medicines', INITIAL_MEDICINES))
  const [medHistory,      setMedHistory]      = useState(() => loadLS('okusuri_history', []))
  const [medLog,          setMedLog]          = useState(() => loadLS('okusuri_log', []))

  // localStorageへの保存
  useEffect(() => { saveLS('okusuri_medicines', medicines) }, [medicines])
  useEffect(() => { saveLS('okusuri_history',   medHistory) }, [medHistory])
  useEffect(() => { saveLS('okusuri_log',       medLog) },    [medLog])
  useEffect(() => {
    saveLS('okusuri_taken_map',  takenMap)
    saveLS('okusuri_taken_date', todayKey)
  }, [takenMap])

  const addHistory    = useCallback((item) => setMedHistory(prev => [item, ...prev]), [])
  const updateHistory = useCallback((id, field, value) =>
    setMedHistory(prev => prev.map(r => r.id===id ? {...r,[field]:value} : r)), [])
  const deleteHistory = useCallback((id) =>
    setMedHistory(prev => prev.filter(r => r.id!==id)), [])

  const sortLog = (list) => [...list].sort((a, b) => {
    if (!a.startDate && !b.startDate) return 0
    if (!a.startDate) return 1
    if (!b.startDate) return -1
    return a.startDate.localeCompare(b.startDate)
  })
  const addLog    = useCallback((item) => setMedLog(prev => sortLog([...prev, item])), [])
  const updateLog = useCallback((id, field, value) =>
    setMedLog(prev => sortLog(prev.map(r => r.id===id ? {...r,[field]:value} : r))), [])
  const deleteLog = useCallback((id) =>
    setMedLog(prev => prev.filter(r => r.id!==id)), [])
  const [popup,           setPopup]           = useState(null)
  const [showMedSelect,   setShowMedSelect]   = useState(false)
  const [notifEnabled,    setNotifEnabled]    = useState(() => loadLS('okusuri_notif_enabled', false))
  const [notifPermission, setNotifPermission] = useState(window.Notification?.permission ?? 'default')
  const [schedules,       setSchedules]       = useState(() => loadLS('okusuri_schedules', NOTIFICATION_SCHEDULE))

  const handlePopup = useCallback((data) => setPopup(data), [])
  const { requestPermission, scheduleAll, clearAll } = useNotifications({ onPopup: handlePopup })

  const handleToggleNotif = async () => {
    if (notifEnabled) { clearAll(); setNotifEnabled(false); return }
    const perm = await requestPermission()
    setNotifPermission(perm)
    if (perm==='granted') { scheduleAll(schedules); setNotifEnabled(true) }
  }

  const handleTimeChange = (idx, value) => {
    const [h, m] = value.split(':').map(Number)
    setSchedules(prev => {
      const next = prev.map((s,i) => i===idx ? {...s, hour:h, minute:m} : s)
      saveLS('okusuri_schedules', next)
      if (notifEnabled) scheduleAll(next)
      return next
    })
  }

  const TEST_MESSAGES = {
    morning: '今日がいちばん若い日やでー！！\nお薬もルーティーンに入れるで💪',
    noon:    'お昼もかわいく頑張ろう♪\nお薬飲んでね〜！✨',
    night:   '今日もお疲れ様〜💗\n一日頑張ったね。お薬飲もうね',
    prn:     '大丈夫かなぁ…🌿\n無理しちゃだめよ。お薬飲んでね',
  }
  const handleTestPopup = (timingId) => setPopup({timingId, body:TEST_MESSAGES[timingId], label:timingId})

  const toggleTaken    = (label) => setTakenMap(prev => ({...prev, [label]:!prev[label]}))
  const addMedicine    = (med)   => {
    setMedicines(prev => [...prev, med])
    const today = new Date().toISOString().split('T')[0]
    const ts = Date.now()
    addHistory({ id: ts,     name: med.name, startDate: today, endDate: '' })
    addLog(    { id: ts + 1, name: med.name, startDate: today, endDate: '' })
  }
  const deleteMedicine = (id)    => setMedicines(prev => prev.filter(m => m.id!==id))
  const editMedicine   = (med)   => setMedicines(prev => prev.map(m => m.id===med.id ? med : m))

  return (
    <div className="font-rounded" style={{minHeight:'100svh', display:'block', position:'relative', overflowX:'hidden'}}>
      <Background />
      <FloatingStars />

      {/* コンテンツ */}
      <div className="content-scroll" style={{position:'relative', zIndex:1, width:'100%', maxWidth:'390px', margin:'0 auto',
        overflowX:'hidden',
        paddingTop:'10px', paddingLeft:'16px', paddingRight:'16px',
        paddingBottom:'calc(90px + env(safe-area-inset-bottom, 0px))',
        WebkitOverflowScrolling:'touch'}}>
        <AnimatePresence mode="wait">
          {activeTab==='home' && (
            <motion.div key="home" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.22}} style={{height:'100%'}}>
              <HomeView medicines={medicines} takenMap={takenMap} toggleTaken={toggleTaken} onRecord={()=>setShowMedSelect(true)} onCharTap={(timingId,body)=>setPopup({timingId,body,label:timingId})} schedules={schedules}/>
            </motion.div>
          )}
          {activeTab==='medicine' && (
            <motion.div key="medicine" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.22}} style={{paddingTop:'28px'}}>
              <MedicineForm medicines={medicines} onAdd={addMedicine} onDelete={deleteMedicine} onEdit={editMedicine}/>
            </motion.div>
          )}
          {activeTab==='setting' && (
            <motion.div key="setting" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.22}}
              style={{display:'flex', flexDirection:'column', paddingTop:'20px', minHeight:'calc(100svh - 110px)'}}>
              <SettingView notifEnabled={notifEnabled} notifPermission={notifPermission} schedules={schedules}
                onToggleNotif={handleToggleNotif} onTimeChange={handleTimeChange} onTestPopup={handleTestPopup}/>
            </motion.div>
          )}
          {activeTab==='history' && (
            <motion.div key="history" initial={{opacity:0,scale:.92}} animate={{opacity:1,scale:1}} exit={{opacity:0}} transition={{duration:.25}}
              style={{display:'flex', flexDirection:'column', paddingTop:'28px'}}
            >
              <HistoryView
                medHistory={medHistory} addHistory={addHistory} updateHistory={updateHistory} deleteHistory={deleteHistory}
                medLog={medLog} addLog={addLog} updateLog={updateLog} deleteLog={deleteLog}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 🍬 カラーぷくぷくシールナビ */}
      <motion.nav initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:.6, type:'spring', stiffness:300, damping:24}}
        style={{position:'fixed', bottom:0, left:0, right:0, display:'flex', justifyContent:'center', zIndex:40}}
      >
        <div style={{
          width:'96%', maxWidth:'390px',
          marginBottom:'max(10px, env(safe-area-inset-bottom, 10px))',
          background:'rgba(255,240,250,0.95)',
          borderRadius:'36px',
          border:'2px solid rgba(255,182,193,0.4)',
          boxShadow:'0 -6px 20px rgba(255,182,193,.3)',
          backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)',
          display:'flex', justifyContent:'space-around', alignItems:'center',
          padding:'10px 8px', gap:'6px',
        }}>
          {NAV_TABS.map(id => {
            const cfg = NAV_TAB_CFG[id]
            const active = activeTab === id
            return (
              <motion.button key={id} onClick={()=>setActiveTab(id)}
                animate={{ scale: active ? 1.05 : 0.95 }}
                style={{
                  display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                  gap:'5px', cursor:'pointer', border:'none', padding:'8px 10px',
                  flex:1, borderRadius:'16px',
                  background: active ? cfg.grad : cfg.gradL,
                  border: `2px solid rgba(255,255,255,${active ? '.95' : '.85'})`,
                  boxShadow: active
                    ? `0 7px 0 ${cfg.sh}, 0 12px 24px ${cfg.sh.replace('.60','.25')}, inset 0 2px 4px rgba(255,255,255,.6)`
                    : `0 5px 0 ${cfg.shL}, 0 8px 18px ${cfg.shL.replace('.45','.18')}, inset 0 2px 4px rgba(255,255,255,.6)`,
                  position:'relative', overflow:'hidden',
                }}
                whileTap={{y:6, scale:.95}}
                transition={{type:'spring', stiffness:500, damping:20}}
              >
                {/* ツヤハイライト（アイコンを掠れさせない程度に控えめに） */}
                <div style={{
                  position:'absolute', top:0, left:'8%', right:'8%', height:'28%',
                  background:'linear-gradient(180deg, rgba(255,255,255,.18) 0%, rgba(255,255,255,0) 100%)',
                  borderRadius:'0 0 60% 60%', pointerEvents:'none',
                }}/>
                {/* アイコン（画像） */}
                <motion.div
                  animate={active ? {scale:[1,1.18,1.06], rotate:[0,-10,0]} : {scale:1, rotate:0}}
                  transition={{duration:.4, ease:[.34,1.56,.64,1]}}
                  style={{lineHeight:0, position:'relative', zIndex:1}}
                >
                  <img
                    src={cfg.img} alt={cfg.label}
                    style={{
                      width:'38px', height:'38px',
                      objectFit:'contain',
                      filter: active
                        ? 'drop-shadow(0 2px 8px rgba(0,0,0,.32)) saturate(1.5) contrast(1.15)'
                        : 'drop-shadow(0 2px 6px rgba(0,0,0,.22)) saturate(1.6) contrast(1.2) brightness(0.96)',
                      transition:'filter .25s',
                      display:'block',
                    }}
                  />
                </motion.div>
                {/* ラベル */}
                <span style={{
                  fontFamily:ZMG, fontSize:'.88rem', lineHeight:1, fontWeight:900,
                  color: active ? cfg.iconA : cfg.iconI,
                  textShadow: active ? 'none' : '0 1px 2px rgba(0,0,0,.12)',
                  position:'relative', zIndex:1,
                }}>{cfg.label}</span>
              </motion.button>
            )
          })}
        </div>
      </motion.nav>

      <MedicinePopup popup={popup} onClose={()=>setPopup(null)}
        onTaken={()=>{ if(popup?.label) setTakenMap(prev=>({...prev,[popup.label]:true})) }}
      />

      {showMedSelect && (
        <MedicineSelectPopup
          medicines={medicines}
          takenMap={takenMap}
          schedule={SCHEDULE}
          onConfirm={(updates) => {
            playKiraKiran()
            setTakenMap(prev => ({ ...prev, ...updates }))
            setTimeout(() => setShowMedSelect(false), 1000)
          }}
          onClose={() => setShowMedSelect(false)}
        />
      )}
    </div>
  )
}
