import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PuffyFlower, PuffyCapsule, PuffyClover } from './PuffyIcons'

function KawaiiTitle({ text, compact=true }) {
  const h = compact ? 72 : 100
  const y = compact ? 52 : 68
  const pad = compact ? '8px 0' : '30px 0'
  const id = text.replace(/\s/g,'')
  return (
    <div style={{display:'flex', alignItems:'center', justifyContent:'center', padding:pad}}>
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
          fontWeight="900" fontSize="48" letterSpacing="-9"
          stroke="white" strokeWidth="13" strokeLinejoin="round"
          fill={`url(#grad-${id})`}
          style={{paintOrder:'stroke fill'}}
          filter={`url(#glow-${id})`}
        >{text}</text>
      </svg>
    </div>
  )
}

const TIMINGS = [
  { id:'morning', label:'朝',   name:'りょう学長', emoji:'🦁', sub:'朝食後',
    g1:'#FFE566', g2:'#FFB800', sh:'rgba(210,145,0,.6)',  gl:'rgba(255,195,50,.28)', tx:'#78350F' },
  { id:'noon',    label:'昼',   name:'シマエナガ',  emoji:'🐦', sub:'昼食後',
    g1:'#82D9FF', g2:'#38B0FF', sh:'rgba(50,145,240,.6)', gl:'rgba(100,185,255,.28)',tx:'#0C4A6E' },
  { id:'night',   label:'夜',   name:'うさぎ',      emoji:'🐰', sub:'夕食後',
    g1:'#FF90C8', g2:'#F020A0', sh:'rgba(220,55,150,.6)', gl:'rgba(249,100,175,.28)',tx:'#881337' },
  { id:'prn',     label:'頓服', name:'りすちゃん',  emoji:'🐿️', sub:'必要なとき',
    g1:'#38DA90', g2:'#00A858', sh:'rgba(50,185,115,.6)', gl:'rgba(100,215,155,.28)',tx:'#064E3B' },
]

const ICONS = [
  { icon: '💊', label: 'お薬',   c1:'#FFD0EC', c2:'#FF8CC8', sh:'rgba(255,80,170,.4)',  tx:'#CC1080' },
  { icon: '🫧', label: 'サプリ', c1:'#D8F4FF', c2:'#96DEFF', sh:'rgba(80,190,240,.35)', tx:'#3A8FC0' },
  { icon: '🍃', label: '漢方',   c1:'#D8F5E8', c2:'#96E8BE', sh:'rgba(80,200,140,.35)', tx:'#2E8A60' },
  { icon: '⭐', label: '頓服',   c1:'#C8FAF0', c2:'#60E8C0', sh:'rgba(40,195,150,.4)', tx:'#0A7A60' },
  { icon: '🩹', label: '外用薬', c1:'#FFE8D4', c2:'#FFC898', sh:'rgba(230,150,60,.35)', tx:'#B06020' },
  { icon: '💧', label: '目薬',   c1:'#DAEEFF', c2:'#96CFFF', sh:'rgba(60,140,230,.35)', tx:'#2255A0' },
]

const CHAR_IMG = {
  morning: '/images/lion.png',
  noon:    '/images/bird.png',
  night:   '/images/rabbit.png',
  prn:     '/images/squirrel.png',
}
const UNITS = ['錠', '包', 'カプセル', '滴', '枚']

const inputBase = {
  background: 'rgba(255,255,255,1.0)',
  border: '1.5px solid rgba(220,180,240,0.5)',
  outline: 'none',
}

export default function MedicineForm({ medicines, onAdd, onDelete, onEdit }) {
  const [view, setView] = useState('list') // 'list' | 'form'
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({
    name: '',
    dose: '1',
    unit: '錠',
    timing: '',
    icon: '💊',
    memo: '',
  })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [focusedField, setFocusedField] = useState(null)

  const startEdit = (med) => {
    const doseNum  = med.dose.replace(/[^0-9.]/g, '') || '1'
    const doseUnit = med.dose.replace(/[0-9.]/g, '')  || '錠'
    setForm({ name: med.name, dose: doseNum, unit: doseUnit, timing: med.timingId, icon: med.icon, memo: med.memo || '' })
    setEditingId(med.id)
    setErrors({})
    setView('form')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm({ name: '', dose: '1', unit: '錠', timing: '', icon: '💊', memo: '' })
    setErrors({})
    setView('list')
  }

  const focusStyle = (field) => focusedField === field ? {
    ...inputBase,
    border: '1.5px solid rgba(192,132,252,0.7)',
    boxShadow: '0 0 0 3px rgba(192,132,252,0.18)',
  } : inputBase

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'お薬の名前を入力してね💊'
    if (!form.timing) e.timing = '担当キャラを選んでね🐾'
    return e
  }

  const handleSubmit = () => {
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length > 0) return

    const timing = TIMINGS.find(t => t.id === form.timing)
    const medData = {
      name: form.name.trim(),
      dose: `${form.dose}${form.unit}`,
      time: timing.sub,
      timingId: form.timing,
      icon: form.icon,
      memo: form.memo,
      color: timing.g1,
      dot: timing.g2,
    }

    if (editingId) {
      onEdit({ id: editingId, ...medData })
    } else {
      onAdd({ id: Date.now(), ...medData })
    }

    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setEditingId(null)
      setForm({ name: '', dose: '1', unit: '錠', timing: '', icon: '💊', memo: '' })
      setErrors({})
      setView('list')
    }, 1800)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* ページヘッダー */}
      <div>
        <KawaiiTitle text="おくすりリスト" compact/>
        <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', margin:0, marginTop:'4px'}}>
          {/* 左クローバー＋外側キラキラ */}
          <div style={{position:'relative', display:'inline-flex', alignItems:'center', width:'48px', height:'48px', justifyContent:'center'}}>
            <motion.span style={{position:'absolute', top:'-12px', left:'-14px', fontSize:'1rem'}}
              animate={{scale:[.8,1.6,.8], opacity:[.7,1,.7], rotate:[0,30,0], y:[0,-5,0]}}
              transition={{duration:1.5, repeat:Infinity, ease:'easeInOut', delay:.1}}>✨</motion.span>
            <motion.span style={{position:'absolute', top:'-10px', right:'-16px', fontSize:'.9rem'}}
              animate={{scale:[.8,1.5,.8], opacity:[.8,1,.8], rotate:[0,-25,0], y:[0,-6,0]}}
              transition={{duration:1.8, repeat:Infinity, ease:'easeInOut', delay:.6}}>⭐</motion.span>
            <motion.span style={{position:'absolute', bottom:'-10px', left:'-10px', fontSize:'.85rem'}}
              animate={{scale:[.8,1.5,.8], opacity:[.7,1,.7], rotate:[0,20,0], y:[0,-4,0]}}
              transition={{duration:2.0, repeat:Infinity, ease:'easeInOut', delay:1.1}}>💫</motion.span>
            <motion.div style={{lineHeight:0}} animate={{y:[0,-5,0],scale:[1,1.12,1],rotate:[0,8,0]}} transition={{duration:2.2,repeat:Infinity,ease:'easeInOut'}}>
              <PuffyClover size={22}/>
            </motion.div>
          </div>
          <p style={{fontFamily:"'Zen Maru Gothic',sans-serif", fontWeight:900, fontSize:'1rem', color:'#22C55E', margin:0}}>
            かわいく管理しよう
          </p>
          {/* 右クローバー＋外側キラキラ */}
          <div style={{position:'relative', display:'inline-flex', alignItems:'center', width:'48px', height:'48px', justifyContent:'center'}}>
            <motion.span style={{position:'absolute', top:'-12px', right:'-14px', fontSize:'1rem'}}
              animate={{scale:[.8,1.6,.8], opacity:[.7,1,.7], rotate:[0,-30,0], y:[0,-5,0]}}
              transition={{duration:1.6, repeat:Infinity, ease:'easeInOut', delay:.4}}>✨</motion.span>
            <motion.span style={{position:'absolute', top:'-10px', left:'-16px', fontSize:'.9rem'}}
              animate={{scale:[.8,1.5,.8], opacity:[.8,1,.8], rotate:[0,25,0], y:[0,-6,0]}}
              transition={{duration:1.9, repeat:Infinity, ease:'easeInOut', delay:1.0}}>⭐</motion.span>
            <motion.span style={{position:'absolute', bottom:'-10px', right:'-10px', fontSize:'.85rem'}}
              animate={{scale:[.8,1.5,.8], opacity:[.7,1,.7], rotate:[0,-20,0], y:[0,-4,0]}}
              transition={{duration:1.7, repeat:Infinity, ease:'easeInOut', delay:.5}}>💫</motion.span>
            <motion.div style={{lineHeight:0}} animate={{y:[0,-5,0],scale:[1,1.12,1],rotate:[0,-8,0]}} transition={{duration:2.2,repeat:Infinity,ease:'easeInOut',delay:0.5}}>
              <PuffyClover size={22}/>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 切り替えタブ（編集中は非表示） */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 glass-card rounded-2xl p-1.5"
        style={{ boxShadow: '0 4px 16px rgba(200,100,200,0.1)', marginTop:'-4px', display: editingId ? 'none' : 'flex' }}
      >
        {[{ id: 'list', icon: '🌸', label: '登録済み' }, { id: 'form', label: '追加する' }].map(tab => (
          <button
            key={tab.id}
            onClick={() => { if (tab.id === 'list') { cancelEdit() } else { setView('form') } }}
            className="flex-1 py-2 rounded-xl transition-all select-none"
            style={{
              display:'flex', alignItems:'center', justifyContent:'center', gap:'10px',
              ...(view === tab.id ? {
                fontFamily:"'Zen Maru Gothic',sans-serif", fontWeight:700, fontSize:'18px',
                background: 'linear-gradient(135deg, #FFFAD0, #FFE870)',
                color: '#A07800',
                boxShadow: '0 3px 8px rgba(220,190,0,.25)',
              } : { fontFamily:"'Zen Maru Gothic',sans-serif", fontWeight:700, fontSize:'18px', color:'#5B3F8C' })
            }}
          >
            <motion.span
              style={{ display:'inline-block' }}
              animate={{ y:[0,-4,0], scale:[1,1.2,1] }}
              transition={{ duration: tab.id==='list' ? 2.0 : 1.8, repeat:Infinity, ease:'easeInOut' }}
            >
              {tab.id === 'list' ? (
                <PuffyFlower size={32}/>
              ) : (
                <svg width="24" height="24" viewBox="0 0 100 100" style={{ display:'block' }}>
                  <defs>
                    <radialGradient id="plusGrad" cx="42%" cy="28%" r="72%">
                      <stop offset="0%"   stopColor="#FFFBD0"/>
                      <stop offset="40%"  stopColor="#FFE600"/>
                      <stop offset="100%" stopColor="#FFA800"/>
                    </radialGradient>
                    <filter id="plusShadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor="#FFA800" floodOpacity="0.45"/>
                    </filter>
                  </defs>
                  {/* 1つのpathで描いた塗りつぶしプラス（重なりなし） */}
                  <path
                    d="M42,10 L58,10 A8,8 0 0,1 66,18 L66,34 L82,34 A8,8 0 0,1 90,42
                       L90,58 A8,8 0 0,1 82,66 L66,66 L66,82 A8,8 0 0,1 58,90
                       L42,90 A8,8 0 0,1 34,82 L34,66 L18,66 A8,8 0 0,1 10,58
                       L10,42 A8,8 0 0,1 18,34 L34,34 L34,18 A8,8 0 0,1 42,10 Z"
                    fill="url(#plusGrad)"
                    stroke="#E08800" strokeWidth="5"
                    filter="url(#plusShadow)"
                  />
                  {/* ぷっくり光沢 */}
                  <ellipse cx="40" cy="28" rx="13" ry="8" fill="rgba(255,255,255,.38)" transform="rotate(-15,40,28)"/>
                  <ellipse cx="38" cy="24" rx="6"  ry="4" fill="rgba(255,255,255,.65)" transform="rotate(-15,38,24)"/>
                </svg>
              )}
            </motion.span>
            {tab.label}
          </button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        {view === 'list' ? (
          <MedicineList key="list" medicines={medicines} onDelete={onDelete} onEdit={startEdit} onAdd={() => setView('form')} />
        ) : (
          <FormView
            key="form"
            form={form}
            setForm={setForm}
            errors={errors}
            submitted={submitted}
            focusedField={focusedField}
            setFocusedField={setFocusedField}
            focusStyle={focusStyle}
            onSubmit={handleSubmit}
            isEditing={!!editingId}
            onCancel={cancelEdit}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function MedicineList({ medicines, onDelete, onEdit, onAdd }) {
  return (
    <motion.div
      key="list"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-3"
    >
      {medicines.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-3xl p-8 flex flex-col items-center gap-3"
          style={{ boxShadow: '0 4px 24px rgba(200,100,200,0.1)' }}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{width:'72px', height:'72px', borderRadius:'50%', overflow:'hidden',
              background:'linear-gradient(145deg,#A8F0C8,#5EE09A)',
              border:'3px solid rgba(255,255,255,.9)'}}
          >
            <img src="/images/squirrel.png" alt="りすちゃん"
              style={{width:'100%', height:'100%', objectFit:'cover', objectPosition:'50% 20%'}}
              onError={e=>{e.currentTarget.style.display='none'; e.currentTarget.nextSibling.style.display='block'}}
            />
            <span style={{fontSize:'3rem', lineHeight:1, display:'none'}}>🐿️</span>
          </motion.div>
          <p style={{fontSize:'15px', fontWeight:'900', textAlign:'center', color:'#6B4FA0'}}>
            まだお薬が登録されていないよ<br />
            <span style={{color:'#7C3AED'}}>「追加する」から登録してね！</span>
          </p>
        </motion.div>
      ) : (
        medicines.map((med, i) => {
          const timing = TIMINGS.find(t => t.id === med.timingId) ?? TIMINGS[0]
          return (
            <motion.div
              key={med.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="glass-card rounded-2xl p-3.5 flex items-center gap-3"
              style={{ boxShadow: '0 4px 20px rgba(200,100,200,0.09)' }}
            >
              <div
                style={{
                  width:'52px', height:'52px', borderRadius:'18px', flexShrink:0,
                  background:`radial-gradient(circle at 36% 28%, rgba(255,255,255,.72) 0%, transparent 52%), linear-gradient(150deg, ${timing.g1}, ${timing.g2})`,
                  border:`2.5px solid rgba(255,255,255,.9)`,
                  boxShadow:`0 8px 0 ${timing.sh}, 0 14px 26px ${timing.sh}99, inset 0 3px 0 rgba(255,255,255,.95), inset 0 -3px 8px rgba(0,0,0,.12)`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}
              >
                <motion.div
                  style={{ display:'inline-block', lineHeight:0 }}
                  animate={{ y:[0,-4,0], scale:[1,1.15,1], rotate:[0,8,-8,0] }}
                  transition={{ duration:2+i*.2, repeat:Infinity, ease:'easeInOut' }}
                >
                  {med.icon === '💊'
                    ? <PuffyCapsule size={36} style={{transform:'rotate(135deg)'}}/>
                    : <span style={{fontSize:'1.55rem', lineHeight:1, filter:'drop-shadow(0 3px 5px rgba(0,0,0,.28)) drop-shadow(0 1px 2px rgba(0,0,0,.18))'}}>{med.icon}</span>
                  }
                </motion.div>
              </div>
              <div className="flex-1 min-w-0">
                <p style={{fontFamily:"'Zen Maru Gothic',sans-serif",fontWeight:700,fontSize:'16px',color:'#22C55E',margin:'-4px 0 8px'}}>{med.name}</p>
                <div className="flex items-center gap-1.5 flex-wrap" style={{marginTop:'16px'}}>
                  <span style={{
                    fontFamily:"'Zen Maru Gothic',sans-serif", fontWeight:700, fontSize:'13px',
                    padding:'2px 8px 2px 4px', borderRadius:'100px',
                    background:`linear-gradient(135deg, ${timing.g1}99, ${timing.g2}66)`,
                    color: timing.tx,
                    display:'flex', alignItems:'center', gap:'4px',
                  }}>
                    <img src={CHAR_IMG[timing.id]} alt={timing.name}
                      style={{width:'20px', height:'20px', borderRadius:'50%', objectFit:'cover', objectPosition:'50% 20%',
                        background:`linear-gradient(135deg, ${timing.g1}, ${timing.g2})`,
                        border:`1.5px solid rgba(255,255,255,.9)`, flexShrink:0}}
                      onError={e=>{e.currentTarget.style.display='none'; e.currentTarget.nextSibling.style.display='inline'}}
                    />
                    <span style={{display:'none'}}>{timing.emoji}</span>
                    {timing.name}
                  </span>
                  <span style={{fontFamily:"'Zen Maru Gothic',sans-serif",fontWeight:700,fontSize:'14px',color:'#22C55E'}}>{med.dose} · {med.time}</span>
                </div>
                {med.memo ? <p style={{fontFamily:"'Zen Maru Gothic',sans-serif",fontWeight:700,fontSize:'14px',color:'#22C55E',marginTop:'2px'}} className="truncate">{med.memo}</p> : null}
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:'5px',flexShrink:0}}>
                {/* 編集ボタン */}
                <motion.button
                  className="w-9 h-9 rounded-xl flex items-center justify-center select-none"
                  style={{
                    background:'rgba(255,255,255,.97)',
                    border:'2px solid rgba(200,160,255,.6)',
                    boxShadow:'0 4px 0 rgba(180,130,240,.35), inset 0 1px 0 rgba(255,255,255,.9)',
                  }}
                  whileTap={{ scale:0.88, y:3, boxShadow:'0 1px 0 rgba(180,130,240,.3)' }}
                  transition={{ type:'spring', stiffness:500, damping:18 }}
                  onClick={() => onEdit(med)}
                >
                  <motion.span
                    style={{fontSize:'16px', display:'inline-block'}}
                    animate={{y:[0,-4,0], rotate:[-5,5,-5]}}
                    transition={{duration:2.2, repeat:Infinity, ease:'easeInOut'}}
                  >✏️</motion.span>
                </motion.button>
                {/* 削除ボタン */}
                <motion.button
                  className="w-9 h-9 rounded-xl flex items-center justify-center select-none"
                  style={{
                    background:'rgba(255,255,255,.97)',
                    border:'2px solid rgba(255,160,180,.55)',
                    boxShadow:'0 4px 0 rgba(240,120,150,.3), inset 0 1px 0 rgba(255,255,255,.9)',
                  }}
                  whileTap={{ scale:0.88, y:3, boxShadow:'0 1px 0 rgba(240,120,150,.25)' }}
                  transition={{ type:'spring', stiffness:500, damping:18 }}
                  onClick={() => onDelete(med.id)}
                >
                  <motion.span
                    style={{fontSize:'16px', display:'inline-block'}}
                    animate={{y:[0,-4,0]}}
                    transition={{duration:2.6, repeat:Infinity, ease:'easeInOut', delay:0.4}}
                  >🗑️</motion.span>
                </motion.button>
              </div>
            </motion.div>
          )
        })
      )}

    </motion.div>
  )
}

function FormView({ form, setForm, errors, submitted, focusedField, setFocusedField, focusStyle, onSubmit, isEditing, onCancel }) {
  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-3xl p-10 flex flex-col items-center gap-4"
        style={{ boxShadow: '0 4px 28px rgba(200,100,200,0.15)' }}
      >
        <motion.span
          className="text-6xl"
          animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 0.6 }}
        >
          🎉
        </motion.span>
        <p style={{fontSize:'20px', fontWeight:'900', color:'#7C3AED'}}>{isEditing ? '変更できたよ！✏️' : '登録できたよ！'}</p>
        <p style={{fontSize:'15px', fontWeight:'900', color:'#6B4FA0', textAlign:'center'}}>{isEditing ? 'お薬の情報を更新したよ💕' : 'お薬をちゃんと飲もうね💊✨'}</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-7"
      style={{ paddingTop: '20px' }}
    >
      {/* 編集中バナー */}
      {isEditing && (
        <motion.div initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}}
          style={{
            display:'flex', alignItems:'center', justifyContent:'center', gap:'12px',
            padding:'10px 20px', borderRadius:'16px', marginBottom:'-8px',
            background:'rgba(255,255,255,.97)',
            border:'2px solid rgba(220,160,255,.6)',
            boxShadow:'0 4px 16px rgba(200,160,255,.18)',
          }}
        >
          <motion.span
            style={{fontSize:'1.2rem', display:'inline-block'}}
            animate={{y:[0,-6,0], rotate:[-8,8,-8]}}
            transition={{duration:2.0, repeat:Infinity, ease:'easeInOut'}}
          >✏️</motion.span>
          <span style={{fontFamily:"'Zen Maru Gothic',sans-serif",fontWeight:900,fontSize:'17px',color:'#22C55E'}}>
            お薬の情報を編集中だよ
          </span>
          <motion.span
            style={{fontSize:'1.2rem', display:'inline-block'}}
            animate={{y:[0,-6,0], rotate:[8,-8,8]}}
            transition={{duration:2.0, repeat:Infinity, ease:'easeInOut', delay:0.4}}
          >✏️</motion.span>
        </motion.div>
      )}

      {/* お薬の名前 */}
      <FormSection label="お薬の名前" icon="💊" error={errors.name}>
        <div className="relative" style={{background:'rgba(255,255,255,0.97)', borderRadius:'16px'}}>
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg pointer-events-none">
            <motion.span
              style={{ display:'inline-block' }}
              animate={{ y:[0,-5,0], scale:[1,1.2,1] }}
              transition={{ duration:2.0, repeat:Infinity, ease:'easeInOut' }}
            >✏️</motion.span>
          </span>
          <input
            type="text"
            placeholder="例：ビタミンC"
            value={form.name}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            onFocus={() => setFocusedField('name')}
            onBlur={() => setFocusedField(null)}
            className="w-full pl-10 pr-4 py-3.5 rounded-2xl placeholder-slate-300 transition-all"
            style={{fontFamily:"'Zen Maru Gothic',sans-serif",fontWeight:700,fontSize:'16px',
              color: form.name ? '#22C55E' : '#9CA3AF',
              ...focusStyle('name')}}
          />
        </div>
      </FormSection>

      {/* アイコン選択 */}
      <FormSection label="種類" icon="🏷️">
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px' }}>
          {ICONS.map(({ icon, label, c1, c2, sh, tx }, idx) => {
            const selected = form.icon === icon
            return (
              <motion.button
                key={icon}
                onClick={() => setForm(p => ({ ...p, icon }))}
                style={{
                  display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-start',
                  gap:'0px', padding:'6px 4px 10px', borderRadius:'16px', cursor:'pointer', minHeight:'92px',
                  background: selected
                    ? 'linear-gradient(160deg, #FFFDE8 0%, #FFFAD0 40%, #FFE870 100%)'
                    : 'rgba(255,255,255,0.97)',
                  border: selected ? `2.5px solid #FFE040` : `2px solid ${c2}88`,
                  boxShadow: selected
                    ? `0 6px 0 rgba(200,160,0,.55), 0 10px 18px rgba(220,190,0,.2), inset 0 2px 0 rgba(255,255,255,.85)`
                    : `0 5px 0 ${sh}, 0 8px 14px ${sh}66, inset 0 2px 0 rgba(255,255,255,.9)`,
                }}
                whileTap={{ scale: 0.93, y: 4 }}
              >
                {/* アイコンエリア：上部スペースの中央に配置 */}
                <div style={{ flex:'1 0 0', display:'flex', alignItems:'center', justifyContent:'center', width:'100%', overflow:'hidden', padding:'4px 2px' }}>
                  <motion.div
                    style={{ lineHeight:0, display:'inline-block' }}
                    animate={{ y:[0,-3,0], scale:[1,1.12,1] }}
                    transition={{ duration:1.8+idx*0.15, repeat:Infinity, ease:'easeInOut', delay:idx*0.1 }}
                  >
                    {icon === '💊' ? <PuffyCapsule size={46} style={{transform:'rotate(135deg)'}}/> : <span style={{fontSize:'2.1rem',lineHeight:1}}>{icon}</span>}
                  </motion.div>
                </div>
                {/* ラベル：下部固定 */}
                <span style={{ fontFamily:"'Zen Maru Gothic',sans-serif", fontWeight:700, fontSize:'.85rem',
                  color: selected ? '#A07800' : '#7C3AED', flexShrink:0 }}>{label}</span>
              </motion.button>
            )
          })}
        </div>
      </FormSection>

      {/* 量・単位 */}
      <FormSection label="飲む量" icon="⚖️">
        <div className="flex gap-2">
          <div className="relative flex-1" style={{background:'rgba(255,255,255,0.97)', borderRadius:'16px'}}>
            <input
              type="number"
              min="0.5"
              max="10"
              step="0.5"
              value={form.dose}
              onChange={e => setForm(p => ({ ...p, dose: e.target.value }))}
              onFocus={() => setFocusedField('dose')}
              onBlur={() => setFocusedField(null)}
              className="w-full px-4 py-3.5 rounded-2xl text-center transition-all"
              style={{fontFamily:"'Zen Maru Gothic',sans-serif",fontWeight:700,fontSize:'16px',
                color:'#6D28D9',
                ...focusStyle('dose')}}
            />
          </div>
          <div className="flex gap-1.5 flex-wrap items-center">
            {UNITS.map(u => (
              <motion.button
                key={u}
                onClick={() => setForm(p => ({ ...p, unit: u }))}
                className="px-3 py-2.5 rounded-xl text-xs font-bold select-none transition-all"
                style={form.unit === u ? {
                  fontFamily:"'Zen Maru Gothic',sans-serif", fontWeight:700, fontSize:'15px',
                  background: 'linear-gradient(160deg, #FFFDE8 0%, #FFE870 100%)',
                  border: '2px solid #FFE040',
                  color: '#A07800',
                  boxShadow: '0 5px 0 rgba(200,160,0,.5), 0 8px 14px rgba(220,190,0,.2), inset 0 2px 0 rgba(255,255,255,.85)',
                } : {
                  fontFamily:"'Zen Maru Gothic',sans-serif", fontWeight:700, fontSize:'15px',
                  background: 'rgba(255,255,255,0.97)',
                  border: '2px solid rgba(200,180,255,.5)',
                  color: '#6D28D9',
                  boxShadow: '0 4px 0 rgba(180,150,240,.4), 0 6px 12px rgba(180,150,240,.15), inset 0 2px 0 rgba(255,255,255,.9)',
                }}
                whileTap={{ scale: 0.93, y: 4 }}
                transition={{ type:'spring', stiffness:520, damping:16 }}
              >
                {u}
              </motion.button>
            ))}
          </div>
        </div>
      </FormSection>

      {/* 担当キャラ（時間帯）選択 */}
      <FormSection label="飲む時間帯" icon="🌸" error={errors.timing}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
          {TIMINGS.map(t => {
            const selected = form.timing === t.id
            return (
              <motion.button
                key={t.id}
                onClick={() => setForm(p => ({ ...p, timing: t.id }))}
                style={{
                  position:'relative', borderRadius:'24px',
                  display:'flex', flexDirection:'column', alignItems:'center',
                  justifyContent:'flex-end', gap:0,
                  cursor:'pointer', overflow:'hidden',
                  aspectRatio:'1 / 1',
                  background: selected
                    ? `linear-gradient(145deg, ${t.g1}, ${t.g2})`
                    : `linear-gradient(145deg, rgba(255,255,255,.92), ${t.g2}BB)`,
                  border:'3px solid rgba(255,255,255,.88)',
                  boxShadow: selected
                    ? `0 8px 0 ${t.sh}, 0 14px 28px ${t.gl}`
                    : '0 6px 0 rgba(180,140,220,.45), 0 10px 20px rgba(180,140,220,.2)',
                }}
                whileTap={{ y:2, scale:.97 }}
                transition={{ type:'spring', stiffness:600, damping:22 }}
              >
                {/* ツヤ */}
                <div style={{
                  position:'absolute', top:0, left:'10%', right:'10%', height:'32%',
                  background:'linear-gradient(180deg,rgba(255,255,255,.35) 0%,transparent 100%)',
                  borderRadius:'0 0 60% 60%', pointerEvents:'none',
                }}/>

                {/* キャラ画像（中央ふわふわ） */}
                <div style={{ position:'absolute', top:'10px', left:0, right:0, bottom:'38px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <motion.div
                    animate={selected ? { y:[0,-8,0], rotate:[-4,4,-4] } : { y:[0,-4,0] }}
                    transition={{ duration:2.4, repeat:Infinity, ease:'easeInOut' }}
                    style={{
                      width:'86px', height:'86px', borderRadius:'50%', overflow:'hidden',
                      border:'3px solid rgba(255,255,255,.9)',
                      background: `linear-gradient(145deg, ${t.g1}, ${t.g2})`,
                    }}
                  >
                    <img src={CHAR_IMG[t.id]} alt={t.name}
                      style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'50% 20%', display:'block' }}
                      onError={e => { e.currentTarget.style.display='none'; e.currentTarget.nextSibling.style.display='block' }}
                    />
                    <span style={{ fontSize:'2.2rem', lineHeight:1, display:'none' }}>{t.emoji}</span>
                  </motion.div>
                </div>

                {/* 名前・時間帯（下部固定） */}
                <div style={{ position:'absolute', bottom:'6px', left:0, right:0, textAlign:'center' }}>
                  <p style={{ fontFamily:"'Zen Maru Gothic',sans-serif", fontWeight:900, fontSize:'15px', margin:0, color: selected ? t.tx : '#6D28D9' }}>{t.name}</p>
                  <p style={{ fontFamily:"'Zen Maru Gothic',sans-serif", fontWeight:800, fontSize:'13px', margin:0, color: selected ? t.tx : '#7C3AED', opacity:.8 }}>{t.sub}</p>
                </div>

                {/* 選択チェック */}
                {selected && (
                  <motion.span
                    style={{ position:'absolute', top:'6px', right:'8px', fontSize:'14px' }}
                    initial={{ scale:0 }} animate={{ scale:1 }}
                    transition={{ type:'spring', stiffness:500 }}
                  >✅</motion.span>
                )}
              </motion.button>
            )
          })}
        </div>
      </FormSection>

      {/* メモ */}
      <div style={{ marginTop:'8px' }}>
      <FormSection label="メモ（任意）" icon="📝">
        <div className="relative">
          <textarea
            placeholder="例：食後30分以内に飲む"
            value={form.memo}
            onChange={e => setForm(p => ({ ...p, memo: e.target.value }))}
            onFocus={() => setFocusedField('memo')}
            onBlur={() => setFocusedField(null)}
            rows={4}
            className="w-full px-4 py-3 rounded-2xl placeholder-slate-400 resize-none transition-all"
            style={{fontFamily:"'Zen Maru Gothic',sans-serif",fontWeight:700,fontSize:'16px',color:'#444'}}
            style={focusStyle('memo')}
          />
        </div>
      </FormSection>
      </div>

      {/* 登録／更新ボタン */}
      <div style={{ paddingLeft:'20px', paddingRight:'20px', display:'flex', flexDirection:'column', gap:'10px' }}>
        <motion.button
          onClick={onSubmit}
          className="w-full select-none cursor-pointer flex items-center justify-center gap-2"
          style={{
            fontFamily:"'Zen Maru Gothic',sans-serif", fontWeight:900, fontSize:'17px',
            color:'white', padding:'17px 12px',
            background: isEditing
              ? 'linear-gradient(135deg, #FFD0A0 0%, #FFB0D8 50%, #C890FF 100%)'
              : 'linear-gradient(135deg, #FF4DB0 0%, #FF80C8 60%, #FF9ACB 100%)',
            borderRadius:'100px',
            border:'3.5px solid rgba(255,255,255,.95)',
            boxShadow:'0 9px 0 rgba(220,50,150,.35), 0 14px 36px rgba(220,50,150,.2)',
          }}
          whileTap={{ y:8, scale:.97, boxShadow:'0 1px 0 rgba(220,50,150,.3), 0 3px 10px rgba(220,50,150,.15)' }}
          whileHover={{ scale: 1.02 }}
        >
          <motion.div style={{lineHeight:0}} animate={{y:[0,-5,0],scale:[1,1.2,1]}} transition={{duration:2.0,repeat:Infinity,ease:'easeInOut'}}>
            <PuffyFlower size={22} colors={{from:'#FFF0FF',mid:'#FFB0F0',to:'#EE80FF',shadow:'#D060E8',stroke:'#FF88D0'}}/>
          </motion.div>
          {isEditing ? '✏️ 変更を保存する' : 'このお薬を登録する'}
          <motion.div style={{lineHeight:0}} animate={{y:[0,-5,0],scale:[1,1.2,1]}} transition={{duration:2.0,repeat:Infinity,ease:'easeInOut',delay:0.4}}>
            <PuffyFlower size={22} colors={{from:'#FFF0FF',mid:'#FFB0F0',to:'#EE80FF',shadow:'#D060E8',stroke:'#FF88D0'}}/>
          </motion.div>
        </motion.button>
        {/* 編集中はキャンセルボタン */}
        {isEditing && (
          <motion.button
            onClick={onCancel}
            className="w-full select-none cursor-pointer"
            style={{
              fontFamily:"'Zen Maru Gothic',sans-serif", fontWeight:900, fontSize:'15px',
              color:'#7C3AED', padding:'12px',
              background:'rgba(255,255,255,.9)',
              borderRadius:'100px',
              border:'2.5px solid rgba(200,160,255,.6)',
              boxShadow:'0 4px 0 rgba(180,120,255,.3)',
            }}
            whileTap={{ y:3, scale:.97 }}
          >キャンセル</motion.button>
        )}
      </div>

      <div className="h-24" />
    </motion.div>
  )
}

function FormSection({ label, icon, error, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-2"
    >
      <div className="flex items-center gap-1.5 px-1">
        <motion.div style={{lineHeight:0, flexShrink:0}}
          initial={{ y: 0, scale: 1 }}
          animate={{y:[0,-6,0], scale:[1,1.2,1]}}
          transition={{duration:2.2, repeat:Infinity, ease:'easeInOut'}}
        >
          <PuffyFlower size={26}/>
        </motion.div>
        <span style={{fontFamily:"'Zen Maru Gothic',sans-serif",fontWeight:700,fontSize:'18px',color:'#22C55E'}}>{label}</span>
        {error && (
          <motion.span
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            style={{fontFamily:"'Zen Maru Gothic',sans-serif",fontWeight:700,fontSize:'14px',color:'#BE185D',marginLeft:'4px'}}
          >
            {error}
          </motion.span>
        )}
      </div>
      {children}
    </motion.div>
  )
}
