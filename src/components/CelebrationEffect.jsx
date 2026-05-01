import { useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ─────────────────────────────────────────
   キャラ別・褒めセリフ & パーティクル設定
───────────────────────────────────────── */
export const PRAISE_CONFIG = {
  morning: {
    lines: [
      'えらいやないか！！',
      'さすがやで！！💪',
      '完璧やで〜！！',
      'やるやんけ！！✨',
    ],
    sub: ['今日もええ調子やで！', '続けることが大事やで！', 'お薬飲んで最高の一日に！'],
    particles: ['✨','🌟','💛','⭐','🌼','💫','🍋','🌻'],
    bg: 'from-yellow-300 via-amber-200 to-orange-200',
    glow: 'rgba(255,220,80,0.6)',
    ribbon: ['#FDE68A','#FCD34D','#FDE68A','#FEF08A','#FCA5A1'],
    textColor: 'text-amber-800',
    bubbleShadow: '0 8px 40px rgba(255,200,80,0.4)',
  },
  noon: {
    lines: [
      'えらいピヨ！！',
      'すごいピヨ〜！！',
      'かわいいピヨ！！💙',
      'さすがピヨ！！✨',
    ],
    sub: ['かわいくて偉いね♪', 'お昼もばっちりピヨ！', 'ふわふわ最高ピヨ〜！'],
    particles: ['✨','🐦','💙','🫧','💫','🌸','🩵','🫐'],
    bg: 'from-sky-300 via-blue-200 to-cyan-100',
    glow: 'rgba(120,200,255,0.55)',
    ribbon: ['#BAE6FD','#7DD3FC','#93C5FD','#C7D2FE','#BAE6FD'],
    textColor: 'text-sky-800',
    bubbleShadow: '0 8px 40px rgba(100,180,255,0.4)',
  },
  night: {
    lines: [
      'えらいよ〜💗',
      'がんばったね！！',
      '大好きだよ！！❤️',
      'さすがだね！！💕',
    ],
    sub: ['今日もよく頑張ったね', '一日お疲れ様！', 'ゆっくり休んでね🌙'],
    particles: ['💗','🌙','🌸','💕','✨','💫','🩷','🌷'],
    bg: 'from-pink-400 via-rose-300 to-pink-200',
    glow: 'rgba(250,130,190,0.55)',
    ribbon: ['#FBCFE8','#F9A8D4','#FCA5A1','#FBCFE8','#FDE68A'],
    textColor: 'text-pink-900',
    bubbleShadow: '0 8px 40px rgba(240,100,180,0.4)',
  },
  prn: {
    lines: [
      'よかった…！！🌿',
      'えらいね！！',
      '無理せずえらい！！',
      'ちゃんと飲めたね！',
    ],
    sub: ['無理しないでね♡', 'りすがそばにいるよ', 'ゆっくり治ってね🌿'],
    particles: ['🌿','🍀','💚','✨','🌱','💫','🌼','🩶'],
    bg: 'from-green-300 via-teal-200 to-emerald-100',
    glow: 'rgba(100,220,160,0.55)',
    ribbon: ['#BBF7D0','#A7F3D0','#D1FAE5','#BBF7D0','#FDE68A'],
    textColor: 'text-green-900',
    bubbleShadow: '0 8px 40px rgba(80,200,130,0.4)',
  },
}

/* ─── パーティクル1個の設定を生成 ─── */
function makeParticle(i, emojis) {
  // 画面下中央から四方へ射出
  const angle = (Math.random() * 200 - 100)           // -100 〜 +100 deg（上方向メイン）
  const speed = 180 + Math.random() * 420              // px
  const rad   = (angle * Math.PI) / 180
  return {
    id: i,
    emoji: emojis[i % emojis.length],
    tx: Math.sin(rad) * speed,
    ty: -Math.abs(Math.cos(rad)) * speed - 60,         // 必ず上へ
    rotate: Math.random() * 720 - 360,
    scale:  0.7 + Math.random() * 1.6,
    delay:  Math.random() * 0.35,
    dur:    1.1 + Math.random() * 0.9,
    size:   ['text-2xl','text-3xl','text-4xl','text-xl'][i % 4],
    // 初期位置：画面下 40〜60%の横幅にランダム散らす
    startX: 30 + Math.random() * 40,   // %
    startY: 55 + Math.random() * 20,   // %
  }
}

/* ─── ふわふわ紙吹雪（パステル丸形） ─── */
const CONFETTI_SHAPES = ['circle', 'oval', 'petal']
function makeConfetti(i, colors) {
  const shape = CONFETTI_SHAPES[i % 3]
  const size = 8 + Math.random() * 10
  return {
    id: i,
    color: colors[i % colors.length],
    tx: (Math.random() - 0.5) * 300,
    ty: -(80 + Math.random() * 500),
    rotate: Math.random() * 720,
    delay: Math.random() * 0.5,
    dur: 1.6 + Math.random() * 1.0,
    startX: 20 + Math.random() * 60,
    startY: 60 + Math.random() * 15,
    w: shape === 'circle' ? size : size * (0.6 + Math.random() * 0.5),
    h: shape === 'circle' ? size : size * (1.2 + Math.random() * 0.5),
    borderRadius: shape === 'circle' ? '50%' : shape === 'oval' ? '50%' : '50% 50% 50% 50% / 60% 60% 40% 40%',
  }
}

export default function CelebrationEffect({ timingId, praise, onDone }) {
  const cfg = PRAISE_CONFIG[timingId] ?? PRAISE_CONFIG.morning
  const doneRef = useRef(false)

  const particles = useMemo(() => Array.from({ length: 32 }, (_, i) => makeParticle(i, cfg.particles)), [timingId])
  const confetti  = useMemo(() => Array.from({ length: 22 }, (_, i) => makeConfetti(i, cfg.ribbon)),   [timingId])

  /* 6秒後に自動終了 */
  useEffect(() => {
    const id = setTimeout(() => {
      if (!doneRef.current) { doneRef.current = true; onDone?.() }
    }, 15000)
    return () => clearTimeout(id)
  }, [onDone])

  return (
    <motion.div
      className="fixed inset-0 z-[60] overflow-hidden flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.4 } }}
      onClick={() => { if (!doneRef.current) { doneRef.current = true; onDone?.() } }}
    >
      {/* 背景フラッシュ */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-b ${cfg.bg}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.92, 0.85] }}
        transition={{ duration: 0.25 }}
      />

      {/* 中央の爆発光 */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{ width: '110vw', height: '110vw', background: `radial-gradient(circle, ${cfg.glow} 0%, transparent 65%)`, left: '-5vw', top: '20%' }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.4, 1.1], opacity: [0, 0.9, 0.5] }}
        transition={{ duration: 0.5, ease: [0.2, 1.4, 0.4, 1] }}
      />

      {/* 🎊 パーティクル（絵文字） */}
      {particles.map(p => (
        <motion.span
          key={p.id}
          className={`absolute select-none pointer-events-none leading-none ${p.size}`}
          style={{ left: `${p.startX}%`, top: `${p.startY}%` }}
          initial={{ opacity: 1, x: 0, y: 0, scale: 0, rotate: 0 }}
          animate={{
            opacity:  [1, 1, 0],
            x:        [0, p.tx * 0.6, p.tx],
            y:        [0, p.ty * 0.55, p.ty],
            scale:    [0, p.scale * 1.2, p.scale * 0.6],
            rotate:   [0, p.rotate * 0.5, p.rotate],
          }}
          transition={{ duration: p.dur, delay: p.delay, ease: 'easeOut' }}
        >
          {p.emoji}
        </motion.span>
      ))}

      {/* 🎊 紙吹雪リボン */}
      {confetti.map(c => (
        <motion.div
          key={c.id}
          className="absolute pointer-events-none"
          style={{
            left: `${c.startX}%`, top: `${c.startY}%`,
            width: c.w, height: c.h,
            background: c.color,
            borderRadius: c.borderRadius,
            opacity: 0.85,
            transformOrigin: 'center',
          }}
          initial={{ opacity: 1, x: 0, y: 0, scaleX: 1, rotate: 0 }}
          animate={{
            opacity: [1, 1, 0],
            x:       [0, c.tx],
            y:       [0, c.ty],
            scaleX:  [1, c.scaleX],
            rotate:  [0, c.rotate],
          }}
          transition={{ duration: c.dur, delay: c.delay, ease: 'easeOut' }}
        />
      ))}

      {/* ─── キャラクター（独立・画面中央固定） ─── */}
      <div className="absolute z-10 pointer-events-none flex justify-center" style={{ top: '12%', left: 0, right: 0 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: [0.4, 1.15, 1] }}
          transition={{ duration: 0.5, ease: [0.2, 1.5, 0.4, 1] }}
        >
          <CharEmoji timingId={timingId} />
        </motion.div>
      </div>

      {/* ─── テキスト・バッジ（下部） ─── */}
      <div className="relative z-10 flex flex-col items-center gap-4 px-6 w-full max-w-xs pointer-events-none" style={{ marginTop: '220px' }}>

        {/* 褒め吹き出し */}
        <motion.div
          className="w-full rounded-3xl px-5 py-4 relative"
          style={{
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: cfg.bubbleShadow,
            border: '2.5px solid rgba(255,255,255,0.9)',
          }}
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: [0.5, 1.1, 1], y: 0 }}
          transition={{ delay: 0.22, duration: 0.45, ease: [0.2, 1.4, 0.4, 1] }}
        >
          {/* 三角 */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 rotate-45"
            style={{ background:'rgba(255,255,255,0.92)', borderTop:'2.5px solid rgba(255,255,255,0.9)', borderLeft:'2.5px solid rgba(255,255,255,0.9)' }}
          />
          <motion.p
            className={`text-center ${cfg.textColor}`}
            style={{ fontFamily:"'Zen Maru Gothic',sans-serif", fontWeight:900, fontSize:'20px' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.38 }}
          >
            {praise}
          </motion.p>
          <motion.p
            className={`text-center mt-1 ${cfg.textColor}`}
            style={{ fontFamily:"'Zen Maru Gothic',sans-serif", fontWeight:700, fontSize:'15px', opacity: 0.9 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            transition={{ delay: 0.5 }}
          >
            {cfg.sub[Math.floor(Math.random() * cfg.sub.length)]}
          </motion.p>
        </motion.div>

        {/* ✅ バッジ */}
        <motion.div
          className="flex items-center gap-2 px-5 py-2.5 rounded-full"
          style={{ background:'rgba(255,255,255,0.75)', backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)' }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: [0, 1.2, 1] }}
          transition={{ delay: 0.45, duration: 0.4, ease:[0.2,1.5,0.4,1] }}
        >
          <motion.span
            animate={{ rotate: [0, -15, 15, 0], scale: [1, 1.3, 1] }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-2xl"
          >
            ✅
          </motion.span>
          <span style={{fontSize:'16px', fontWeight:'900'}} className={cfg.textColor}>服薬記録しました！</span>
        </motion.div>

        <motion.button
          onClick={() => { if (!doneRef.current) { doneRef.current = true; onDone?.() } }}
          style={{
            fontFamily:"'Zen Maru Gothic',sans-serif", fontWeight:900, fontSize:'17px',
            color: cfg.textColor.includes('amber') ? '#D97706'
              : cfg.textColor.includes('sky') ? '#0284C7'
              : cfg.textColor.includes('pink') ? '#EC4899' : '#10B981',
            background:'rgba(255,255,255,0.82)',
            border:'2.5px solid rgba(255,255,255,0.95)',
            borderRadius:'100px',
            padding:'10px 28px',
            backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)',
            boxShadow:'0 4px 0 rgba(255,180,220,0.35), 0 6px 18px rgba(0,0,0,0.1)',
            textShadow:'none',
            letterSpacing:'.04em',
            cursor:'pointer',
            marginTop:'6px',
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
  )
}

/* ─── キャラ大型表示（ご褒美演出） ─── */
const REWARD_IMAGES = {
  morning: '/images/lion_celebrate.png',
  noon:    '/images/bird_celebrate.png',
  night:   '/images/rabbit_celebrate.png',
  prn:     '/images/squirrel_celebrate.png',
}
const FALLBACK_EMOJI = { morning:'🦁', noon:'🐦', night:'🐰', prn:'🐿️' }

function CharEmoji({ timingId }) {
  return (
    <motion.div
      animate={{ y:[0,-16,0] }}
      transition={{ duration:1.6, repeat:Infinity, ease:'easeInOut' }}
    >
      <img
        src={REWARD_IMAGES[timingId]}
        alt={timingId}
        style={{
          width:'220px',
          height:'auto',
          display:'block',
          background:'none',
          boxShadow:'none',
          border:'none',
          borderRadius:0,
          outline:'none',
        }}
        onError={e => {
          e.currentTarget.style.display='none'
          e.currentTarget.nextSibling.style.display='block'
        }}
      />
      <span style={{ fontSize:'9rem', lineHeight:1, display:'none' }}>
        {FALLBACK_EMOJI[timingId]}
      </span>
    </motion.div>
  )
}
