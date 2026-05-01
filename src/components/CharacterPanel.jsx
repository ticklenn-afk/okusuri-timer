import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { playCharSound } from '../utils/sounds'
import { PuffyHeart, PuffyStar, PuffySparkle, PuffyFlower, PuffyHeartBlue } from './PuffyIcons'

const ZMG = "'Zen Maru Gothic', sans-serif"

const CHARACTERS = [
  {
    id: 'morning',
    label: '朝',
    name: 'りょう学長',
    emoji: '🦁',
    tabDecor: '👑',
    message: '今日がいちばん若い日やでー！！\n健康は最大の資産やで！\nお薬ちゃんと飲まなあかんで💪',
    bg:         'linear-gradient(135deg, #FFE03A 0%, #FFB800 60%, #FF9A00 100%)',
    cardBg:     'rgba(255,218,30,.25)',
    cardBorder: 'rgba(255,190,0,.65)',
    shadow:     '0 10px 0 rgba(210,145,0,.52), 0 16px 40px rgba(210,145,0,.28)',
    orbColor:   'rgba(255,215,80,.35)',
    textColor:  '#78350F',
    badgeBg:    'rgba(255,255,255,.75)',
    badgeColor: '#92400E',
    time:       '朝の担当',
    tagline:    '今日も最高やでー！！',
    cornerIcons: [
      {node:<PuffyStar size={20}/>,        pos:{top:'-10px',left:'10px'}},
      {node:<PuffySparkle size={18}/>,     pos:{top:'-10px',right:'10px'}},
      {node:<PuffySparkle size={16}/>,     pos:{bottom:'-10px',left:'10px'}},
      {node:<PuffyStar size={18}/>,        pos:{bottom:'-10px',right:'10px'}},
    ],
  },
  {
    id: 'noon',
    label: '昼',
    name: 'シマエナガ',
    emoji: '🐦',
    tabDecor: '✨',
    message: 'お昼もかわいく頑張ろう！\nおくすり飲んでね〜♪\nふわふわ一緒に乗り越えよ！',
    bg:         'linear-gradient(135deg, #82D9FF 0%, #38B0FF 60%, #1890E0 100%)',
    cardBg:     'rgba(100,200,255,.22)',
    cardBorder: 'rgba(80,185,255,.65)',
    shadow:     '0 10px 0 rgba(50,150,240,.52), 0 16px 40px rgba(50,150,240,.28)',
    orbColor:   'rgba(100,205,255,.35)',
    textColor:  '#075985',
    badgeBg:    'rgba(255,255,255,.75)',
    badgeColor: '#0C4A6E',
    time:       '昼の担当',
    tagline:    'ふわふわ〜♪',
    cornerIcons: [
      {node:<PuffySparkle size={18}/>,   pos:{top:'-10px',left:'10px'}},
      {node:<PuffyHeartBlue size={20}/>, pos:{top:'-10px',right:'10px'}},
      {node:<PuffyHeartBlue size={16}/>, pos:{bottom:'-10px',left:'10px'}},
      {node:<PuffySparkle size={18}/>,   pos:{bottom:'-10px',right:'10px'}},
    ],
  },
  {
    id: 'night',
    label: '夜',
    name: 'うさぎ',
    emoji: '🐰',
    tabDecor: '💗',
    message: '今日もお疲れ様〜💗\n一日よく頑張ったね！\nお薬飲んでゆっくり休もう❤️',
    bg:         'linear-gradient(135deg, #FFB3D4 0%, #FF6FA8 60%, #E8458A 100%)',
    cardBg:     'rgba(249,168,212,.22)',
    cardBorder: 'rgba(240,100,175,.65)',
    shadow:     '0 10px 0 rgba(220,70,155,.52), 0 16px 40px rgba(220,70,155,.28)',
    orbColor:   'rgba(249,168,212,.38)',
    textColor:  '#881337',
    badgeBg:    'rgba(255,255,255,.75)',
    badgeColor: '#9D174D',
    time:       '夜の担当',
    tagline:    'おやすみ〜💕',
    cornerIcons: [
      {node:<PuffyHeart size={20}/>,   pos:{top:'-10px',left:'10px'}},
      {node:<PuffyStar size={18}/>,    pos:{top:'-10px',right:'10px'}},
      {node:<PuffySparkle size={16}/>, pos:{bottom:'-10px',left:'10px'}},
      {node:<PuffyHeart size={18}/>,   pos:{bottom:'-10px',right:'10px'}},
    ],
  },
  {
    id: 'prn',
    label: '頓服',
    name: 'りす',
    emoji: '🐿️',
    tabDecor: '🌿',
    message: '大丈夫かなぁ…🌿\n無理しちゃだめだよ。\nそっと側にいるからね…',
    bg:         'linear-gradient(135deg, #A8F0C8 0%, #5EE09A 60%, #28C070 100%)',
    cardBg:     'rgba(134,239,172,.22)',
    cardBorder: 'rgba(100,220,150,.65)',
    shadow:     '0 10px 0 rgba(50,190,115,.52), 0 16px 40px rgba(50,190,115,.28)',
    orbColor:   'rgba(134,239,172,.35)',
    textColor:  '#064E3B',
    badgeBg:    'rgba(255,255,255,.75)',
    badgeColor: '#065F46',
    time:       '頓服のとき',
    tagline:    'そっと寄り添うよ',
    cornerIcons: [
      {node:<PuffyFlower size={20}/>, pos:{top:'-10px',left:'10px'}},
      {node:<PuffySparkle size={18}/>,pos:{top:'-10px',right:'10px'}},
      {node:<PuffySparkle size={16}/>,pos:{bottom:'-10px',left:'10px'}},
      {node:<PuffyFlower size={18}/>, pos:{bottom:'-10px',right:'10px'}},
    ],
  },
]

export default function CharacterPanel() {
  const [activeId, setActiveId] = useState('morning')
  const char = CHARACTERS.find(c => c.id === activeId)

  return (
    <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
      <p style={{fontFamily:ZMG, fontWeight:700, fontSize:'1rem', color:'#6D28D9', display:'flex', alignItems:'center', gap:'6px', paddingLeft:'4px', margin:'0 0 2px'}}>
        🎭 今日のたんとうキャラ ✨
      </p>

      {/* ● キャラタブ（まんまる） */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'10px'}}>
        {CHARACTERS.map(c => {
          const active = activeId === c.id
          return (
            <motion.button key={c.id} onClick={()=>{ playCharSound(c.id); setActiveId(c.id) }}
              style={{
                display:'flex', flexDirection:'column', alignItems:'center', gap:'6px',
                padding:'14px 4px', borderRadius:'100px',
                background: active ? c.cardBg : 'rgba(255,255,255,.65)',
                border: active ? `3px solid ${c.cardBorder}` : '3px solid rgba(255,255,255,.88)',
                boxShadow: active ? c.shadow : '0 5px 0 rgba(180,180,220,.3)',
                backdropFilter:'blur(16px)', WebkitBackdropFilter:'blur(16px)',
                cursor:'pointer', position:'relative',
              }}
              whileTap={{y:5, scale:.92}}
              transition={{type:'spring', stiffness:500, damping:22}}
            >
              <div style={{position:'relative'}}>
                <motion.span style={{fontSize:'1.6rem', lineHeight:1, display:'block'}}
                  animate={active ? {scale:[1,1.25,1],y:[0,-4,0]} : {scale:1}}
                  transition={{duration: active?2:.35, repeat: active?Infinity:0, ease:'easeInOut'}}
                >{c.emoji}</motion.span>
                {active && (
                  <motion.span
                    style={{position:'absolute', top:'-10px', right:'-10px', fontSize:'.8rem', lineHeight:1}}
                    initial={{scale:0}} animate={{scale:1}}
                    transition={{type:'spring', stiffness:400, damping:12}}
                  >{c.tabDecor}</motion.span>
                )}
              </div>
              <span style={{fontFamily:ZMG, fontWeight:700, fontSize:'.82rem', color: active ? char.textColor : '#6B4FA0'}}>{c.label}</span>
            </motion.button>
          )
        })}
      </div>

      {/* ▼ キャラカード */}
      <AnimatePresence mode="wait">
        <motion.div key={activeId}
          initial={{opacity:0, scale:.84, y:16}}
          animate={{opacity:1, scale:1,   y:0 }}
          exit={{  opacity:0, scale:.84, y:-16}}
          transition={{duration:.4, ease:[0.34,1.56,0.64,1]}}
          style={{
            borderRadius:'40px', overflow:'hidden',
            background:'rgba(255,255,255,.92)',
            border:`3.5px solid ${char.cardBorder}`,
            boxShadow: char.shadow,
          }}
        >
          {/* グラデーションヘッダー */}
          <div style={{background:char.bg, padding:'20px 20px 44px', position:'relative', overflow:'hidden'}}>
            {/* 白オーブ */}
            <motion.div style={{position:'absolute', right:'-20px', top:'-20px', width:'160px', height:'160px', borderRadius:'50%', background:'radial-gradient(circle,rgba(255,255,255,.4) 0%,transparent 70%)'}}
              animate={{scale:[1,1.22,1], opacity:[.6,.95,.6]}} transition={{duration:3.2, repeat:Infinity}}/>
            <motion.div style={{position:'absolute', left:'-10px', bottom:0, width:'120px', height:'120px', borderRadius:'50%', background:'radial-gradient(circle,rgba(255,255,255,.3) 0%,transparent 70%)'}}
              animate={{scale:[1,1.18,1], opacity:[.5,.85,.5]}} transition={{duration:3.5, repeat:Infinity, delay:.9}}/>

            <div style={{position:'relative', display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'12px'}}>
              {/* 左: 名前 */}
              <div style={{flex:1, minWidth:0}}>
                <span style={{display:'inline-block', fontFamily:ZMG, fontWeight:700, fontSize:'.88rem', padding:'4px 12px', borderRadius:'100px', background:char.badgeBg, color:char.badgeColor, marginBottom:'8px'}}>今日の担当キャラ</span>
                <p style={{fontFamily:ZMG, fontWeight:900, fontSize:'1.45rem', color:'white', margin:'0 0 4px', lineHeight:1.2}}>{char.name}</p>
                <p style={{fontSize:'.78rem', color:'rgba(255,255,255,.9)', fontWeight:'bold', margin:0}}>{char.tagline}</p>
              </div>
              {/* 右: キャラ */}
              <div style={{position:'relative', flexShrink:0}}>
                <motion.div style={{position:'absolute', bottom:'-8px', left:'50%', transform:'translateX(-50%)', width:'72px', height:'18px', borderRadius:'50%', background:'rgba(0,0,0,.1)', filter:'blur(5px)'}}
                  animate={{scaleX:[1,.8,1], opacity:[.5,.25,.5]}} transition={{duration:3, repeat:Infinity, ease:'easeInOut'}}/>
                <motion.div animate={{y:[0,-14,0], rotate:[-2.5,2.5,-2.5]}} transition={{duration:3, repeat:Infinity, ease:'easeInOut'}}>
                  <CharacterBody char={char}/>
                </motion.div>
              </div>
            </div>
          </div>

          {/* ✨ 吹き出し（キラキラ縁取り） */}
          <div style={{padding:'6px 18px 22px', marginTop:'-26px', position:'relative'}}>
            <div style={{
              borderRadius:'28px', padding:'18px 20px', position:'relative',
              background:'rgba(255,255,255,.95)',
              border:`3px solid ${char.cardBorder}`,
              boxShadow:`0 5px 0 ${char.orbColor}, 0 10px 28px ${char.orbColor}`,
              animation:'rainbow-border 5s linear infinite',
            }}>
              {/* 吹き出し三角 */}
              <div style={{
                position:'absolute', top:'-9px', right:'72px', width:'16px', height:'16px', transform:'rotate(45deg)',
                background:'rgba(255,255,255,.95)',
                borderTop:`3px solid ${char.cardBorder}`,
                borderLeft:`3px solid ${char.cardBorder}`,
              }}/>
              {/* コーナーぷっくりデコ */}
              {char.cornerIcons.map(({node,pos},i) => (
                <motion.div key={i} style={{position:'absolute', ...pos, lineHeight:0, display:'inline-flex'}}
                  animate={{y:[0,-5,0], scale:[0.9,1.2,0.9]}}
                  transition={{duration:2.0+i*.3, repeat:Infinity, ease:'easeInOut', delay:i*.25}}
                >{node}</motion.div>
              ))}
              {char.id === 'prn' ? (
                <motion.div
                  style={{fontFamily:"'Zen Maru Gothic',sans-serif", fontSize:'.9rem', fontWeight:'900', color:char.textColor, lineHeight:1.8, margin:0}}
                  initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.25, duration:.4}}
                >
                  <div style={{display:'flex', alignItems:'center', gap:'4px'}}>
                    <span>大丈夫かなぁ…</span>
                    <div style={{flexShrink:0, lineHeight:0}}>
                      <motion.div
                        style={{fontSize:'1.2rem', lineHeight:1}}
                        animate={{y:[0,-8,0], rotate:[-8,8,-8], scale:[1,1.2,1]}}
                        transition={{duration:1.8, repeat:Infinity, ease:'easeInOut', repeatType:'loop'}}
                      >🌿</motion.div>
                    </div>
                  </div>
                  <div>無理しちゃだめだよ。</div>
                  <div>そっと側にいるからね…</div>
                </motion.div>
              ) : (
                <motion.p
                  style={{fontFamily:"'Zen Maru Gothic',sans-serif", fontSize:'.9rem', fontWeight:'900', color:char.textColor, whiteSpace:'pre-line', lineHeight:1.8, margin:0}}
                  initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.25, duration:.4}}
                >{char.message}</motion.p>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ─── キャラクター本体 ─── */
function CharacterBody({ char }) {
  if (char.id === 'morning') {
    return (
      <div style={{position:'relative', display:'flex', alignItems:'center', justifyContent:'center', width:'110px', height:'110px'}}>
        <motion.div style={{position:'absolute', inset:0, borderRadius:'50%', background:'radial-gradient(circle,rgba(255,215,0,.65) 0%,transparent 68%)'}}
          animate={{scale:[1,1.3,1]}} transition={{duration:1.8, repeat:Infinity}}/>
        <motion.div style={{position:'absolute', inset:'4px', borderRadius:'50%', background:'radial-gradient(circle,rgba(255,240,100,.45) 0%,transparent 60%)'}}
          animate={{scale:[1,1.45,1],opacity:[.5,.9,.5]}} transition={{duration:2.2, repeat:Infinity, delay:.6}}/>
        <div style={{position:'relative', display:'flex', flexDirection:'column', alignItems:'center', gap:'2px'}}>
          <motion.div style={{lineHeight:0}} animate={{y:[0,-5,0],scale:[0.9,1.2,0.9]}} transition={{duration:1.8,repeat:Infinity,ease:'easeInOut'}}>
            <PuffyStar size={26}/>
          </motion.div>
          <div style={{display:'flex', alignItems:'center', gap:'2px'}}>
            <motion.span style={{fontSize:'1.8rem'}}
              animate={{rotate:[-24,-5,-24],scale:[1,1.14,1]}} transition={{duration:1.4, repeat:Infinity, ease:'easeInOut'}}>💪</motion.span>
            <span style={{fontSize:'3.4rem', lineHeight:1, userSelect:'none'}}>🦁</span>
            <motion.span style={{fontSize:'1.8rem'}}
              animate={{rotate:[24,5,24],scale:[1,1.14,1]}} transition={{duration:1.4, repeat:Infinity, ease:'easeInOut', delay:.25}}>💪</motion.span>
          </div>
          <motion.div style={{lineHeight:0}} animate={{y:[0,-4,0],scale:[0.8,1.3,0.8],opacity:[0.6,1,0.6]}} transition={{duration:1.2,repeat:Infinity,delay:.5}}>
            <PuffySparkle size={18}/>
          </motion.div>
        </div>
      </div>
    )
  }
  if (char.id === 'noon') {
    return (
      <div style={{position:'relative', display:'flex', alignItems:'center', justifyContent:'center', width:'110px', height:'110px'}}>
        <motion.div style={{position:'absolute', inset:0, borderRadius:'50%', background:'radial-gradient(circle,rgba(100,210,255,.55) 0%,transparent 68%)'}}
          animate={{scale:[1,1.25,1]}} transition={{duration:2.4, repeat:Infinity}}/>
        <div style={{position:'relative', display:'flex', flexDirection:'column', alignItems:'center', gap:'6px'}}>
          <span style={{fontSize:'3.8rem', lineHeight:1, userSelect:'none'}}>🐦</span>
          <div style={{display:'flex', gap:'8px'}}>
            {[0,.35,.7].map((delay,i) => (
              <motion.div key={i} style={{lineHeight:0}} animate={{y:[0,-8,0],scale:[0.9,1.2,0.9]}} transition={{duration:1.3,repeat:Infinity,delay}}>
                <PuffySparkle size={20}/>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  if (char.id === 'night') {
    return (
      <div style={{position:'relative', display:'flex', alignItems:'center', justifyContent:'center', width:'110px', height:'110px'}}>
        <motion.div style={{position:'absolute', inset:0, borderRadius:'50%', background:'radial-gradient(circle,rgba(249,168,212,.58) 0%,transparent 68%)'}}
          animate={{scale:[1,1.22,1]}} transition={{duration:3, repeat:Infinity}}/>
        <div style={{position:'relative', display:'flex', flexDirection:'column', alignItems:'center', gap:'4px'}}>
          <div style={{position:'relative'}}>
            <motion.div style={{position:'absolute', top:'-14px', right:'-4px', lineHeight:0, filter:'drop-shadow(0 2px 6px rgba(255,100,170,.5))'}}
              animate={{y:[-4,-14,-4],opacity:[.7,1,.7],scale:[.85,1.2,.85]}} transition={{duration:2, repeat:Infinity, delay:.5}}>
              <PuffyHeart size={28}/>
            </motion.div>
            <span style={{fontSize:'3.8rem', lineHeight:1, userSelect:'none'}}>🐰</span>
          </div>
          <motion.div style={{lineHeight:0}} animate={{y:[0,-5,0],scale:[0.9,1.15,0.9],rotate:[-12,12,-12]}} transition={{duration:2.2,repeat:Infinity}}>
            <PuffySparkle size={22}/>
          </motion.div>
        </div>
      </div>
    )
  }
  return (
    <div style={{position:'relative', display:'flex', alignItems:'center', justifyContent:'center', width:'110px', height:'110px'}}>
      <motion.div style={{position:'absolute', inset:0, borderRadius:'50%', background:'radial-gradient(circle,rgba(134,239,172,.52) 0%,transparent 68%)'}}
        animate={{scale:[1,1.18,1]}} transition={{duration:3.5, repeat:Infinity}}/>
      <div style={{position:'relative', display:'flex', flexDirection:'column', alignItems:'center', gap:'4px'}}>
        <div style={{display:'flex', alignItems:'flex-end', gap:'2px'}}>
          <motion.div style={{lineHeight:0}} animate={{rotate:[-12,6,-12],y:[0,-4,0]}} transition={{duration:2.2,repeat:Infinity}}>
            <PuffyFlower size={26}/>
          </motion.div>
          <span style={{fontSize:'3.4rem', lineHeight:1, userSelect:'none'}}>🐿️</span>
          <motion.div style={{lineHeight:0}} animate={{rotate:[12,-6,12],y:[0,-4,0]}} transition={{duration:2.2,repeat:Infinity,delay:.3}}>
            <PuffyFlower size={26}/>
          </motion.div>
        </div>
        <motion.span style={{fontFamily:"'Zen Maru Gothic',sans-serif", fontSize:'.75rem', fontWeight:'900', color:'#065F46'}}
          animate={{opacity:[.4,1,.4]}} transition={{duration:2, repeat:Infinity}}>ꔫ ꔫ ꔫ</motion.span>
      </div>
    </div>
  )
}
