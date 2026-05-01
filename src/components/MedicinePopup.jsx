import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CelebrationEffect, { PRAISE_CONFIG } from './CelebrationEffect'
import { playKiran } from '../utils/sounds'
import { PuffyStar, PuffySparkle, PuffyClock } from './PuffyIcons'

const CHAR_IMAGES = {
  morning: '/images/lion.png',
  noon:    '/images/bird.png',
  night:   '/images/rabbit.png',
  prn:     '/images/squirrel.png',
}
const CHAR_EMOJI = { morning:'🦁', noon:'🐦', night:'🐰', prn:'🐿️' }

function CharPopupImage({ timingId }) {
  return (
    <motion.div
      animate={{ y: [0, -14, 0] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      style={{ width: '200px', position: 'relative' }}
    >
      <img
        src={CHAR_IMAGES[timingId]}
        alt={timingId}
        style={{
          width: '100%', height: 'auto',
          objectFit: 'contain',
          filter: 'drop-shadow(0 12px 28px rgba(0,0,0,0.15))',
          display: 'block',
        }}
        onError={e => { e.currentTarget.style.display='none'; e.currentTarget.nextSibling.style.display='block' }}
      />
      <span style={{ fontSize: '7rem', lineHeight: 1, display: 'none' }}>{CHAR_EMOJI[timingId]}</span>
    </motion.div>
  )
}

const CHAR_CONFIG = {
  morning: {
    name: 'りょう学長',
    bg: 'from-yellow-300 via-amber-200 to-orange-200',
    orb1: 'rgba(255,220,50,0.5)',
    orb2: 'rgba(255,180,0,0.3)',
    shimmer: 'rgba(255,240,100,0.6)',
    textColor: 'text-amber-700',
    bubbleBorder: 'rgba(255,200,0,0.5)',
    shadow: '0 0 60px rgba(255,200,0,0.4)',
    particles: ['💛', '⭐', '✨', '🌟', '🌼', '🍋'],
    render: () => <CharPopupImage timingId="morning" />,
  },
  noon: {
    name: 'シマエナガ',
    bg: 'from-sky-300 via-blue-200 to-cyan-100',
    orb1: 'rgba(100,200,255,0.45)',
    orb2: 'rgba(150,220,255,0.3)',
    shimmer: 'rgba(180,240,255,0.5)',
    textColor: 'text-sky-700',
    bubbleBorder: 'rgba(100,190,255,0.5)',
    shadow: '0 0 60px rgba(100,190,255,0.4)',
    particles: ['💙', '🫧', '❄️', '🌤', '🩵', '✨'],
    render: () => <CharPopupImage timingId="noon" />,
  },
  night: {
    name: 'うさぎ',
    bg: 'from-pink-400 via-rose-300 to-pink-200',
    orb1: 'rgba(249,168,212,0.55)',
    orb2: 'rgba(244,114,182,0.3)',
    shimmer: 'rgba(255,200,230,0.5)',
    textColor: 'text-pink-700',
    bubbleBorder: 'rgba(249,100,180,0.5)',
    shadow: '0 0 60px rgba(240,100,180,0.4)',
    particles: ['💗', '🌙', '⭐', '💕', '✨', '🌸'],
    render: () => <CharPopupImage timingId="night" />,
  },
  prn: {
    name: 'りす',
    bg: 'from-green-300 via-teal-200 to-emerald-100',
    orb1: 'rgba(134,239,172,0.45)',
    orb2: 'rgba(100,220,180,0.3)',
    shimmer: 'rgba(180,255,220,0.5)',
    textColor: 'text-green-700',
    bubbleBorder: 'rgba(100,220,150,0.5)',
    shadow: '0 0 60px rgba(80,200,130,0.4)',
    particles: ['🌿', '🍀', '🌸', '💚', '🌱', '✨'],
    render: () => <CharPopupImage timingId="prn" />,
  },
}

// ランダムな位置にパーティクルを配置
const PARTICLE_POSITIONS = [
  { x: '8%', y: '12%' }, { x: '88%', y: '8%' }, { x: '5%', y: '45%' },
  { x: '92%', y: '40%' }, { x: '15%', y: '78%' }, { x: '82%', y: '75%' },
  { x: '50%', y: '5%' }, { x: '30%', y: '88%' }, { x: '70%', y: '85%' },
]

export default function MedicinePopup({ popup, onClose, onTaken }) {
  const char = CHAR_CONFIG[popup?.timingId] ?? CHAR_CONFIG.morning
  const [celebrating, setCelebrating] = useState(false)
  const [praiseText, setPraiseText] = useState('')

  // ポップアップが変わったら celebrating をリセット
  useEffect(() => { setCelebrating(false) }, [popup])

  // 通常モード: 30秒で自動クローズ
  useEffect(() => {
    if (!popup || celebrating) return
    const id = setTimeout(onClose, 30000)
    return () => clearTimeout(id)
  }, [popup, onClose, celebrating])

  // 「飲んだ！」ボタン
  const handleTaken = (e) => {
    e.stopPropagation()
    playKiran()
    const cfg   = PRAISE_CONFIG[popup?.timingId] ?? PRAISE_CONFIG.morning
    const lines = cfg.lines
    setPraiseText(lines[Math.floor(Math.random() * lines.length)])
    setCelebrating(true)
    onTaken()   // 記録は即時反映
  }

  // お祝い終了 → 全閉じ
  const handleCelebrationDone = () => {
    setCelebrating(false)
    onClose()
  }

  return (
    <>
      {/* ─── 通常のお薬通知ポップアップ ─── */}
      <AnimatePresence>
        {popup && !celebrating && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          >
            {/* 背景 */}
            <motion.div
              className={`absolute inset-0 bg-gradient-to-b ${char.bg}`}
              initial={{ opacity: 0 }} animate={{ opacity: 0.95 }} exit={{ opacity: 0 }}
            />
            <motion.div className="absolute w-80 h-80 rounded-full"
              style={{ background:`radial-gradient(circle, ${char.orb1} 0%, transparent 70%)`, top:'-40px', left:'-40px' }}
              animate={{ scale:[1,1.3,1], rotate:[0,20,0] }} transition={{ duration:5, repeat:Infinity, ease:'easeInOut' }}
            />
            <motion.div className="absolute w-64 h-64 rounded-full"
              style={{ background:`radial-gradient(circle, ${char.orb2} 0%, transparent 70%)`, bottom:'60px', right:'-20px' }}
              animate={{ scale:[1,1.2,1] }} transition={{ duration:6, repeat:Infinity, ease:'easeInOut', delay:1 }}
            />
            <motion.div className="absolute inset-0 pointer-events-none"
              style={{ background:`radial-gradient(ellipse at 50% 35%, ${char.shimmer} 0%, transparent 60%)` }}
              animate={{ opacity:[0.4,0.8,0.4] }} transition={{ duration:2.5, repeat:Infinity }}
            />

            {/* 浮遊パーティクル */}
            {PARTICLE_POSITIONS.map((pos, i) => (
              <motion.span key={i} className="absolute text-2xl select-none pointer-events-none"
                style={{ left:pos.x, top:pos.y }}
                initial={{ opacity:0, scale:0, rotate:-30 }}
                animate={{ opacity:[0,1,0.7,1,0], scale:[0,1.2,0.9,1.1,0], y:[0,-20,-40,-60], rotate:[0,15,-10,20] }}
                transition={{ duration:3+(i%3), repeat:Infinity, delay:i*0.4, ease:'easeOut' }}
              >
                {char.particles[i % char.particles.length]}
              </motion.span>
            ))}

            {/* 本体コンテンツ */}
            <div className="relative z-10 flex flex-col items-center gap-6 px-6 w-full max-w-sm" onClick={e=>e.stopPropagation()}>
              <motion.div
                initial={{ y:120, scale:0.3, rotate:-15 }}
                animate={{ y:0, scale:1, rotate:0 }}
                exit={{ y:-60, scale:0.5, opacity:0 }}
                transition={{ type:'spring', stiffness:260, damping:20, delay:0.1 }}
                style={{ filter:`drop-shadow(${char.shadow})` }}
              >
                {char.render()}
              </motion.div>

              <motion.div
                initial={{ opacity:0, scale:0.7, y:20 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0 }}
                transition={{ delay:0.45, type:'spring', stiffness:300, damping:22 }}
                className="w-full relative"
                style={{
                  borderRadius:'36px', padding:'22px 22px',
                  background:'rgba(255,255,255,0.95)',
                  backdropFilter:'blur(24px)', WebkitBackdropFilter:'blur(24px)',
                  border:`3.5px solid ${char.bubbleBorder}`,
                  boxShadow:`0 10px 0 ${char.orb1}, 0 18px 44px ${char.orb1}`,
                  animation:'rainbow-border 4s linear infinite',
                }}
              >
                {/* 吹き出し三角 */}
                <div style={{
                  position:'absolute', top:'-10px', left:'50%', transform:'translateX(-50%) rotate(45deg)',
                  width:'18px', height:'18px',
                  background:'rgba(255,255,255,0.95)',
                  borderTop:`3.5px solid ${char.bubbleBorder}`,
                  borderLeft:`3.5px solid ${char.bubbleBorder}`,
                }}/>
                {/* コーナーぷっくりデコ */}
                {[
                  {node:<PuffySparkle size={20}/>, pos:{top:'-12px',  left:'14px'}},
                  {node:<PuffyStar    size={20}/>, pos:{bottom:'-12px',left:'14px'}},
                  {node:<PuffySparkle size={18}/>, pos:{bottom:'-12px',right:'14px'}},
                ].map(({node,pos},i) => (
                  <motion.span key={i} style={{position:'absolute',...pos,lineHeight:0,display:'inline-flex'}}
                    animate={{scale:[0.85,1.2,0.85], rotate:[-10,10,-10]}}
                    transition={{duration:2.2+i*.3, repeat:Infinity, ease:'easeInOut', delay:i*.25}}>
                    {node}
                  </motion.span>
                ))}
                <p className="font-black text-center whitespace-pre-line"
                  style={{fontFamily:"'Zen Maru Gothic',sans-serif", fontWeight:700, fontSize:'1.05rem', lineHeight:1.85, margin:0, color:'#2D1A4E'}}>
                  {popup.body}
                </p>
              </motion.div>

              <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.6 }} className="flex gap-3 w-full">
                {/* ★ 飲んだ！ボタン ── ここを押すとお祝いへ */}
                <motion.button
                  className="flex-1 py-4 text-white rounded-2xl select-none relative overflow-hidden"
                  style={{
                    fontFamily:"'Zen Maru Gothic',sans-serif", fontWeight:900, fontSize:'17px',
                    background:'linear-gradient(135deg, #F9A8D4, #C084FC)',
                    boxShadow:'0 5px 0 rgba(192,132,252,0.45), 0 8px 24px rgba(180,100,240,0.3)',
                  }}
                  whileTap={{ y:4, scale:0.97 }}
                  onClick={handleTaken}
                >
                  {/* ぷわっと光るリングアニメ */}
                  <motion.span
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{ border:'2px solid rgba(255,255,255,0.6)' }}
                    animate={{ scale:[1,1.12,1], opacity:[0.8,0,0.8] }}
                    transition={{ duration:1.4, repeat:Infinity }}
                  />
                  <motion.span
                    style={{fontSize:'1.2em', display:'inline-block', marginRight:'6px'}}
                    animate={{scale:[1, 1.35, 1], rotate:[0, 18, -18, 0], y:[0,-5,0]}}
                    transition={{duration:1.4, repeat:Infinity, ease:'easeInOut'}}
                  >✅</motion.span>飲んだ！
                </motion.button>
                <motion.button
                  className="flex-1 py-4 rounded-2xl select-none"
                  style={{
                    fontFamily:"'Zen Maru Gothic',sans-serif", fontWeight:900, fontSize:'16px',
                    background:'rgba(255,255,255,0.75)',
                    border:`2px solid ${char.bubbleBorder}`,
                    color: char.textColor.includes('amber') ? '#D97706'
                      : char.textColor.includes('sky') ? '#0284C7'
                      : char.textColor.includes('pink') ? '#EC4899' : '#10B981',
                    boxShadow:'0 4px 0 rgba(180,180,220,0.3)',
                  }}
                  whileTap={{ y:3, scale:0.97 }}
                  onClick={e=>{ e.stopPropagation(); onClose() }}
                >
                  <motion.div
                    style={{display:'inline-block', marginRight:'8px', lineHeight:0, verticalAlign:'middle'}}
                    animate={{scale:[1, 1.25, 1], rotate:[0, 15, -15, 0], y:[0,-4,0]}}
                    transition={{duration:1.6, repeat:Infinity, ease:'easeInOut'}}
                  ><PuffyClock size={26}/></motion.div><span style={{fontSize:'18px'}}>あとで</span>
                </motion.button>
              </motion.div>

              <motion.button
                onClick={e=>{ e.stopPropagation(); onClose() }}
                style={{
                  fontFamily:"'Zen Maru Gothic',sans-serif", fontWeight:900, fontSize:'17px',
                  color: char.textColor.includes('amber') ? '#D97706'
                    : char.textColor.includes('sky') ? '#0284C7'
                    : char.textColor.includes('pink') ? '#EC4899' : '#10B981',
                  background:'rgba(255,255,255,0.82)',
                  border:'2.5px solid rgba(255,255,255,0.95)',
                  borderRadius:'100px',
                  padding:'10px 28px',
                  backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)',
                  boxShadow:'0 4px 0 rgba(255,180,220,0.35), 0 6px 18px rgba(0,0,0,0.1)',
                  textShadow:'none',
                  letterSpacing:'.04em',
                  cursor:'pointer',
                }}
                whileTap={{ scale:0.93, y:3 }}
                animate={{ scale:[1, 1.04, 1] }}
                transition={{ duration:2, repeat:Infinity }}
              >
                <motion.span
                  style={{fontSize:'1.5em', display:'inline-block', marginRight:'6px'}}
                  animate={{scale:[1, 1.3, 1], rotate:[0, 15, -15, 0]}}
                  transition={{duration:1.8, repeat:Infinity, ease:'easeInOut'}}
                >⭐</motion.span>とじる
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── お祝いエフェクト（飲んだ！後） ─── */}
      <AnimatePresence>
        {celebrating && popup && (
          <CelebrationEffect
            key="celebration"
            timingId={popup.timingId}
            praise={praiseText}
            onDone={handleCelebrationDone}
          />
        )}
      </AnimatePresence>
    </>
  )
}
