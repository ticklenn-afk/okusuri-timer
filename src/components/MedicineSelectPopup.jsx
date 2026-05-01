/**
 * MedicineSelectPopup
 * 「今すぐ服薬を記録する」ボタンから呼ばれる
 * どのスロットのお薬を飲んだか選んで一括記録できるドロワーポップアップ
 */
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { playFanfare } from '../utils/sounds'
import { PuffyCapsule } from './PuffyIcons'

const ZMG = "'Zen Maru Gothic', sans-serif"

const CHAR_IMAGES = {
  morning: '/images/lion.jpg',
  noon:    '/images/bird.jpg',
  night:   '/images/rabbit.jpg',
  prn:     '/images/squirrel.jpg',
}
const CHAR_EMOJI = { morning:'🦁', noon:'🐦', night:'🐰', prn:'🐿️' }

const CHAR_CFG = {
  morning: { name:'りょう学長', color:'rgba(255,215,50,.30)',  border:'rgba(255,185,0,.65)',  shadow:'rgba(210,145,0,.48)',  text:'#78350F', grad:['#FFE03A','#FFB800'] },
  noon:    { name:'シマエナガ', color:'rgba(100,195,255,.28)', border:'rgba(80,168,255,.65)', shadow:'rgba(55,145,240,.48)', text:'#075985', grad:['#82D9FF','#38B0FF'] },
  night:   { name:'うさぎ',    color:'rgba(249,168,212,.28)', border:'rgba(238,98,175,.65)', shadow:'rgba(215,72,155,.48)', text:'#9D174D', grad:['#FFB3D4','#FF6FA8'] },
  prn:     { name:'りす',      color:'rgba(134,239,172,.28)', border:'rgba(98,220,148,.65)', shadow:'rgba(50,188,112,.48)', text:'#064E3B', grad:['#A8F0C8','#5EE09A'] },
}

/* お祝いポップアップ用キャラ設定 */
const CELEBRATE_CHARS = [
  { id:'morning', img:'lion',     name:'りょう学長', emoji:'🦁', dur:1.6, rotArr:[-6,6,-6],  bg:'linear-gradient(135deg,#FFE566,#FFB800)', sh:'rgba(210,145,0,.5)'  },
  { id:'noon',    img:'bird',     name:'シマエナガ', emoji:'🐦', dur:2.0, rotArr:[-5,5,-5],  bg:'linear-gradient(135deg,#82D9FF,#38B0FF)', sh:'rgba(50,145,240,.5)' },
  { id:'night',   img:'rabbit',   name:'うさぎ',    emoji:'🐰', dur:1.8, rotArr:[-7,7,-7],  bg:'linear-gradient(135deg,#FFB3D4,#FF6FA8)', sh:'rgba(215,72,155,.5)' },
  { id:'prn',     img:'squirrel', name:'りす',      emoji:'🐿️', dur:2.3, rotArr:[-4,4,-4],  bg:'linear-gradient(135deg,#A8F0C8,#5EE09A)', sh:'rgba(50,188,112,.5)' },
]

/* きらきらパーティクル */
const SPARKLES = [
  { x:'6%',  y:'8%',  s:1.8, d:2.2, delay:0,    e:'✨' },
  { x:'86%', y:'6%',  s:1.5, d:1.8, delay:0.3,  e:'🌟' },
  { x:'10%', y:'78%', s:2.0, d:2.5, delay:0.6,  e:'💖' },
  { x:'82%', y:'74%', s:1.6, d:2.0, delay:0.9,  e:'✨' },
  { x:'48%', y:'4%',  s:1.4, d:3.0, delay:0.4,  e:'⭐' },
  { x:'22%', y:'48%', s:1.2, d:2.3, delay:1.1,  e:'💫' },
  { x:'74%', y:'42%', s:1.5, d:1.9, delay:0.7,  e:'🌸' },
  { x:'4%',  y:'44%', s:1.3, d:2.6, delay:1.4,  e:'💕' },
  { x:'93%', y:'50%', s:1.4, d:2.1, delay:0.2,  e:'✨' },
  { x:'55%', y:'88%', s:1.6, d:2.4, delay:0.8,  e:'🎊' },
  { x:'35%', y:'18%', s:1.3, d:2.8, delay:1.6,  e:'💝' },
  { x:'68%', y:'20%', s:1.5, d:2.0, delay:0.5,  e:'🌟' },
]

/* ─── お祝いポップアップ ─── */
function CelebrationPopup({ onClose }) {
  /* 3秒後に自動で閉じる */
  useEffect(() => {
    const t = setTimeout(onClose, 20000)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(160deg, #FFE566 0%, #FF9DD8 38%, #C084FC 68%, #60A8FF 100%)',
        overflow: 'hidden',
        padding: '24px',
      }}
    >
      {/* きらきらパーティクル */}
      {SPARKLES.map((s, i) => (
        <motion.div key={i}
          style={{ position:'absolute', left:s.x, top:s.y, fontSize:`${s.s}rem`, pointerEvents:'none', userSelect:'none' }}
          animate={{ y: [-12, 12, -12], opacity: [0.4, 1, 0.4], rotate: [0, 180, 360] }}
          transition={{ duration: s.d, repeat: Infinity, delay: s.delay, ease:'easeInOut' }}
        >
          {s.e}
        </motion.div>
      ))}

      {/* メインテキスト */}
      <motion.div
        initial={{ scale: 0.3, opacity: 0, y: -30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 16, delay: 0.08 }}
        style={{ textAlign: 'center', marginBottom: '28px', position: 'relative', zIndex: 1 }}
      >
        <motion.p
          animate={{ rotate: [-5, 5, -5], scale: [1, 1.12, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ fontSize: '3.8rem', margin: '0 0 6px', lineHeight: 1 }}
        >🎉</motion.p>
        <h2 style={{
          fontFamily: ZMG, fontWeight: 900, fontSize: '2.1rem', color: 'white', margin: '0 0 8px', lineHeight: 1.15,
          textShadow: '-2px -2px 0 rgba(255,180,80,.7), 2px -2px 0 rgba(255,180,80,.7), -2px 2px 0 rgba(255,180,80,.7), 2px 2px 0 rgba(255,180,80,.7), 0 4px 16px rgba(0,0,0,.18)',
        }}>
          全部飲んだで！
        </h2>
        <p style={{
          fontFamily: ZMG, fontWeight: 700, fontSize: '1.05rem', color: 'rgba(255,255,255,.96)',
          textShadow: '0 2px 8px rgba(0,0,0,.18)', margin: 0,
        }}>
          えらい！今日もちゃんと飲めたね💖
        </p>
      </motion.div>

      {/* キャラクター4人 */}
      <div style={{
        display: 'flex', gap: '14px', justifyContent: 'center',
        marginBottom: '28px', position: 'relative', zIndex: 1,
        flexWrap: 'wrap',
      }}>
        {CELEBRATE_CHARS.map((char, i) => (
          <motion.div key={char.id}
            initial={{ scale: 0, y: 60, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 420, damping: 18, delay: 0.18 + i * 0.11 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '7px' }}
          >
            <motion.div
              animate={{ y: [0, -14, 0], rotate: char.rotArr }}
              transition={{ duration: char.dur, repeat: Infinity, ease: 'easeInOut', delay: i * 0.18 }}
              style={{
                width: '72px', height: '72px',
                borderRadius: '50%',
                background: char.bg,
                border: '3.5px solid rgba(255,255,255,.9)',
                boxShadow: `0 8px 0 ${char.sh}, 0 14px 28px ${char.sh.replace('.5','.25')}`,
                overflow: 'hidden',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <img
                src={`/images/${char.img}_celebrate.png`} alt={char.name}
                style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                onError={e => { e.currentTarget.style.display='none'; e.currentTarget.nextSibling.style.display='block' }}
              />
              <span style={{ fontSize: '2.4rem', display: 'none', lineHeight: 1 }}>{char.emoji}</span>
            </motion.div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              style={{
                fontFamily: ZMG, fontWeight: 700, fontSize: '.78rem', color: 'white',
                textShadow: '0 1px 5px rgba(0,0,0,.22)', textAlign: 'center',
                background: 'rgba(255,255,255,.22)', borderRadius: '100px',
                padding: '2px 10px',
              }}
            >
              {char.name}
            </motion.span>
          </motion.div>
        ))}
      </div>

      {/* とじるボタン */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        onClick={onClose}
        style={{
          fontFamily: ZMG, fontWeight: 900, fontSize: '1.05rem',
          color: '#22C55E',
          background: 'rgba(255,255,255,.95)',
          border: '3px solid rgba(255,255,255,.98)',
          borderRadius: '100px',
          padding: '13px 36px',
          cursor: 'pointer',
          boxShadow: '0 7px 0 rgba(0,0,0,.12), 0 12px 28px rgba(0,0,0,.1)',
          position: 'relative', zIndex: 1,
        }}
        whileTap={{ scale: .95, y: 6, boxShadow: '0 1px 0 rgba(0,0,0,.12)' }}
        transition={{ type: 'spring', stiffness: 500, damping: 20 }}
      >
        ✨ やったー！とじる ✨
      </motion.button>

      {/* 自動クローズの進行バー */}
      <motion.div
        initial={{ width: '80%' }}
        animate={{ width: '0%' }}
        transition={{ duration: 20, ease: 'linear' }}
        style={{
          position: 'absolute', bottom: '24px', left: '10%',
          height: '5px', borderRadius: '100px',
          background: 'rgba(255,255,255,.55)',
        }}
      />
    </motion.div>
  )
}

export default function MedicineSelectPopup({ medicines, takenMap, schedule, onConfirm, onClose }) {
  const [selected, setSelected] = useState(() => {
    const init = {}
    schedule.forEach(s => { init[s.label] = !(takenMap[s.label] ?? false) })
    return init
  })
  const [confirmed,        setConfirmed]        = useState(false)
  const [showCelebration,  setShowCelebration]  = useState(false)

  const toggle     = (label) => setSelected(prev => ({ ...prev, [label]: !prev[label] }))
  const selectAll  = () => { const all = {}; schedule.forEach(s => { all[s.label] = true }); setSelected(all) }
  const selectNone = () => { const none = {}; schedule.forEach(s => { none[s.label] = false }); setSelected(none) }

  const selectedCount  = Object.values(selected).filter(Boolean).length
  const alreadyAllDone = schedule.every(s => takenMap[s.label])

  const handleConfirm = () => {
    if (selectedCount === 0) return
    setConfirmed(true)
    const updates = {}
    schedule.forEach(s => { if (selected[s.label]) updates[s.label] = true })
    setTimeout(() => onConfirm(updates), 600)
  }

  /* 全部飲んだで！ボタン → ファンファーレ + お祝いポップアップ */
  const handleAllTaken = () => {
    selectAll()
    playFanfare()
    setShowCelebration(true)
  }

  /* お祝いポップアップを閉じる → 全部記録して完了 → ホームへ */
  const handleCelebrationClose = () => {
    setShowCelebration(false)
    const updates = {}
    schedule.forEach(s => { updates[s.label] = true })
    onConfirm(updates)
    onClose()
  }

  return (
    <>
      <AnimatePresence>
        {showCelebration && (
          <CelebrationPopup onClose={handleCelebrationClose} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 50,
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            background: 'rgba(240,210,255,.38)',
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '110%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: '420px',
              background: 'rgba(255,255,255,.98)',
              borderRadius: '44px 44px 0 0',
              padding: '20px 18px 48px',
              boxShadow: '0 -12px 60px rgba(200,100,220,.28)',
              border: '3.5px solid rgba(255,205,235,.9)',
              borderBottom: 'none',
              maxHeight: '88vh',
              overflowY: 'auto',
            }}
          >
            {/* ドラッグハンドル */}
            <div style={{ width:'52px', height:'7px', borderRadius:'100px', background:'rgba(220,185,240,.55)', margin:'0 auto 18px' }} />

            {/* タイトル */}
            <div style={{ textAlign:'center', marginBottom:'18px' }}>
              {confirmed ? (
                <motion.div initial={{ scale:.5, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ type:'spring', stiffness:400, damping:14 }}>
                  <p style={{ fontSize:'3rem', margin:'0 0 8px' }}>🎉</p>
                  <h3 style={{ fontFamily:ZMG, fontWeight:900, fontSize:'1.5rem', color:'#C2185B', margin:'0 0 4px' }}>
                    きろくしたよ！
                  </h3>
                  <p style={{ fontFamily:ZMG, fontWeight:700, fontSize:'1rem', color:'#9B27AF', margin:0 }}>えらい！！💖</p>
                </motion.div>
              ) : alreadyAllDone ? (
                <>
                  <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'6px', margin:'0 0 8px'}}>
                    <motion.span style={{fontSize:'1.1rem'}} animate={{y:[0,-6,0],scale:[1,1.3,1],opacity:[.7,1,.7]}} transition={{duration:2.0,repeat:Infinity,ease:'easeInOut',delay:.3}}>✨</motion.span>
                    <motion.span style={{fontSize:'1.1rem'}} animate={{y:[0,-5,0],scale:[1,1.2,1],opacity:[.6,1,.6]}} transition={{duration:1.8,repeat:Infinity,ease:'easeInOut',delay:.8}}>⭐</motion.span>
                    <motion.p style={{ fontSize:'2.5rem', margin:0, display:'inline-block' }}
                      animate={{y:[0,-8,0], scale:[1,1.15,1]}}
                      transition={{duration:2.2, repeat:Infinity, ease:'easeInOut'}}>🌟</motion.p>
                    <motion.span style={{fontSize:'1.1rem'}} animate={{y:[0,-5,0],scale:[1,1.2,1],opacity:[.6,1,.6]}} transition={{duration:1.8,repeat:Infinity,ease:'easeInOut',delay:.5}}>⭐</motion.span>
                    <motion.span style={{fontSize:'1.1rem'}} animate={{y:[0,-6,0],scale:[1,1.3,1],opacity:[.7,1,.7]}} transition={{duration:2.0,repeat:Infinity,ease:'easeInOut',delay:1.0}}>✨</motion.span>
                  </div>
                  <h3 style={{ fontFamily:ZMG, fontWeight:900, fontSize:'1.4rem', color:'#22C55E', margin:'0 0 4px' }}>
                    全部飲めてるよ！
                  </h3>
                  <p style={{ fontFamily:ZMG, fontWeight:700, fontSize:'1rem', color:'#22C55E', margin:0, display:'flex', alignItems:'center', justifyContent:'center', gap:'4px' }}>
                    <span>今日もえらい！</span><motion.span animate={{y:[0,-5,0]}} transition={{duration:1.8, repeat:Infinity, ease:'easeInOut', delay:.2}}>💊</motion.span><motion.span animate={{y:[0,-5,0], scale:[1,1.2,1]}} transition={{duration:2.0, repeat:Infinity, ease:'easeInOut', delay:.5}}>💚</motion.span>
                  </p>
                </>
              ) : (
                <>
                  <p style={{ fontSize:'2.2rem', margin:'0 0 6px', lineHeight:1 }}>💊</p>
                  <h3 style={{ fontFamily:ZMG, fontWeight:900, fontSize:'1.4rem', color:'#C2185B', margin:'0 0 6px' }}>
                    どれを飲んだか選んでね！
                  </h3>
                  <p style={{ fontFamily:ZMG, fontWeight:700, fontSize:'1rem', color:'#6B21A8', margin:0 }}>
                    ✨ タップで選択 · もう一度で解除 ✨
                  </p>
                </>
              )}
            </div>

            {/* スロット一覧 */}
            {!confirmed && (
              <div style={{ display:'flex', flexDirection:'column', gap:'11px', marginBottom:'18px' }}>
                {schedule.map(slot => {
                  const cfg        = CHAR_CFG[slot.timingId] ?? CHAR_CFG.morning
                  const slotMeds   = medicines.filter(m => m.timingId === slot.timingId)
                  const isOn       = selected[slot.label] ?? false
                  const alreadyDone = takenMap[slot.label] ?? false

                  return (
                    <motion.button key={slot.label}
                      onClick={() => toggle(slot.label)}
                      style={{
                        borderRadius: '26px',
                        padding: '13px 16px',
                        display: 'flex', alignItems: 'center', gap: '13px',
                        background: isOn ? cfg.color : 'rgba(245,240,255,.6)',
                        border: `3px solid ${isOn ? cfg.border : 'rgba(225,218,242,.75)'}`,
                        boxShadow: isOn
                          ? `0 7px 0 ${cfg.shadow}, 0 12px 22px ${cfg.shadow.replace('.48','.18')}`
                          : '0 5px 0 rgba(210,202,235,.38)',
                        cursor: 'pointer', width:'100%', textAlign:'left',
                        opacity: alreadyDone && !isOn ? .58 : 1,
                      }}
                      whileTap={{ scale:.96, y:5 }}
                      transition={{ type:'spring', stiffness:500, damping:20 }}
                    >
                      <motion.div
                        style={{ width:'44px', height:'44px', borderRadius:'50%', overflow:'hidden', flexShrink:0,
                          border:`2px solid ${isOn ? cfg.border : 'rgba(220,210,245,.6)'}` }}
                        animate={isOn ? { scale:[1,1.2,1], rotate:[-5,5,-5] } : { scale:1 }}
                        transition={{ duration: isOn ? 2 : .3, repeat: isOn ? Infinity : 0, ease:'easeInOut' }}
                      >
                        <img src={CHAR_IMAGES[slot.timingId]} alt={slot.timingId}
                          style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'50% 30%', display:'block' }}
                          onError={e => { e.currentTarget.style.display='none'; e.currentTarget.nextSibling.style.display='block' }}
                        />
                        <span style={{ fontSize:'1.8rem', lineHeight:'44px', display:'none', textAlign:'center' }}>
                          {CHAR_EMOJI[slot.timingId]}
                        </span>
                      </motion.div>

                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'4px' }}>
                          <p style={{ fontFamily:ZMG, fontWeight:700, fontSize:'1rem', color: isOn ? cfg.text : '#5B3F8C', margin:0 }}>
                            {slot.label} · {slot.time}
                          </p>
                        </div>
                        {slotMeds.length > 0 ? (
                          <div style={{ display:'flex', flexWrap:'wrap', gap:'4px' }}>
                            {slotMeds.map(m => (
                              <span key={m.id} style={{
                                fontSize:'.82rem', fontWeight:'900',
                                color: isOn ? cfg.text : 'rgba(100,80,160,.75)',
                                background: 'rgba(255,255,255,.85)',
                                borderRadius:'100px', padding:'2px 10px',
                                border:`2px solid ${isOn ? cfg.border : 'rgba(210,200,238,.7)'}`,
                              }}>
                                {m.icon === '💊'
                                  ? <><PuffyCapsule size={20} style={{display:'inline-block',verticalAlign:'middle',transform:'rotate(135deg)',marginRight:'2px'}}/>{m.name}</>
                                  : <>{m.icon} {m.name}</>
                                }
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p style={{ fontSize:'.82rem', color: cfg.text, fontWeight:'900', margin:0, opacity:.85 }}>
                            このじかんのお薬は未登録
                          </p>
                        )}
                      </div>

                      <div style={{
                        width:'48px', height:'28px', borderRadius:'100px', flexShrink:0,
                        background: isOn
                          ? `linear-gradient(135deg, ${cfg.grad[0]}, ${cfg.grad[1]})`
                          : 'rgba(215,208,238,.6)',
                        boxShadow: isOn ? `0 4px 0 ${cfg.shadow}` : '0 4px 0 rgba(205,198,232,.45)',
                        border: `2.5px solid ${isOn ? 'rgba(255,255,255,.85)' : 'rgba(225,218,242,.7)'}`,
                        position: 'relative',
                      }}>
                        <motion.div
                          style={{ position:'absolute', top:'4px', width:'16px', height:'16px', background:'white', borderRadius:'100px', boxShadow:'0 2px 6px rgba(0,0,0,.18)' }}
                          animate={{ x: isOn ? 24 : 4 }}
                          transition={{ type:'spring', stiffness:500, damping:30 }}
                        />
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            )}

            {/* アクションボタン */}
            {!confirmed && (
              <div style={{ display:'flex', flexDirection:'column', gap:'10px', marginTop:'8px' }}>

                {/* 全部飲んだで！（ファンファーレ + お祝いポップアップ） */}
                <motion.button
                  style={{
                    width:'100%', padding:'16px 24px', borderRadius:'100px',
                    background:'linear-gradient(135deg, #FFE03A, #FFB800)',
                    border:'3.5px solid rgba(255,255,255,.92)',
                    boxShadow:'0 8px 0 rgba(210,145,0,.52), 0 14px 32px rgba(210,145,0,.28)',
                    fontFamily:ZMG, fontWeight:900, fontSize:'1.05rem', color:'#78350F',
                    cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
                  }}
                  whileTap={{ y:7, scale:.97, boxShadow:'0 1px 0 rgba(210,145,0,.52)' }}
                  transition={{ type:'spring', stiffness:600, damping:18 }}
                  onClick={handleAllTaken}
                >
                  <img src="/images/lion_celebrate.png" alt="lion"
                    style={{ width:'36px', height:'36px', objectFit:'contain', flexShrink:0 }} />
                  全部飲んだで！
                  <img src="/images/squirrel_celebrate.png" alt="squirrel"
                    style={{ width:'36px', height:'36px', objectFit:'contain', flexShrink:0 }} />
                </motion.button>

                {/* これを記録する！ */}
                <motion.button style={{marginTop:'10px'}}
                  style={{
                    width:'100%', padding:'16px 24px', borderRadius:'100px',
                    background: selectedCount > 0
                      ? 'linear-gradient(135deg, #FFB0D8 0%, #C890FF 50%, #90CCFF 100%)'
                      : 'linear-gradient(135deg, #FFE4F6, #EDD8FF)',
                    border:'3.5px solid rgba(255,255,255,.92)',
                    boxShadow: selectedCount > 0
                      ? '0 8px 0 rgba(180,120,240,.35), 0 14px 32px rgba(180,120,240,.2)'
                      : '0 5px 0 rgba(220,170,255,.3), 0 8px 20px rgba(220,170,255,.15)',
                    fontFamily:ZMG, fontWeight:900, fontSize:'1.05rem',
                    color: selectedCount > 0 ? 'white' : '#9030A8',
                    cursor: selectedCount > 0 ? 'pointer' : 'default',
                    display:'flex', alignItems:'center', justifyContent: selectedCount > 0 ? 'center' : 'flex-start', gap:'8px', paddingLeft: selectedCount > 0 ? undefined : '20px',
                  }}
                  whileTap={selectedCount > 0 ? { y:7, scale:.97, boxShadow:'0 1px 0 rgba(180,120,240,.3)' } : {}}
                  transition={{ type:'spring', stiffness:600, damping:18 }}
                  onClick={handleConfirm}
                >
                  {selectedCount > 0 ? (
                    <>
                      <span style={{ fontSize:'1.2rem' }}>✅</span>
                      {selectedCount}つのおくすりを記録する！
                      <motion.span
                        style={{ fontSize:'1.2rem', display:'inline-block' }}
                        animate={{ y:[0,-6,0], scale:[1,1.25,1] }}
                        transition={{ duration:1.8, repeat:Infinity, ease:'easeInOut' }}
                      >✨</motion.span>
                    </>
                  ) : (
                    <><img src="/images/rabbit_celebrate.png" alt="" style={{ width:'34px', height:'34px', objectFit:'contain', marginLeft:'-8px', marginRight:'8px', filter:'drop-shadow(0 1px 3px rgba(160,60,180,.3))' }}/>飲んだおくすりを選んでね</>
                  )}
                </motion.button>

                {/* 解除 / あとで */}
                <div style={{ display:'flex', gap:'10px', marginTop:'4px' }}>
                  <motion.button
                    style={{ flex:1, padding:'11px', borderRadius:'100px',
                      background:'linear-gradient(135deg, #FFE0F0, #FFC8E8)',
                      border:'2.5px solid rgba(255,255,255,.9)',
                      boxShadow:'0 4px 0 rgba(255,150,200,.3), 0 6px 16px rgba(255,150,200,.15)',
                      cursor:'pointer', fontFamily:ZMG, fontWeight:900, fontSize:'1rem', color:'#C050A0' }}
                    whileTap={{ scale:.95, y:3 }}
                    onClick={selectNone}
                  >全部解除</motion.button>
                  <motion.button
                    style={{ flex:1, padding:'11px', borderRadius:'100px',
                      background:'linear-gradient(135deg, #EEE0FF, #D8EEFF)',
                      border:'2.5px solid rgba(255,255,255,.9)',
                      boxShadow:'0 4px 0 rgba(180,140,255,.3), 0 6px 16px rgba(180,140,255,.15)',
                      cursor:'pointer', fontFamily:ZMG, fontWeight:900, fontSize:'1rem', color:'#9060D8' }}
                    whileTap={{ scale:.95, y:3 }}
                    onClick={onClose}
                  >あとで記録する</motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  )
}
