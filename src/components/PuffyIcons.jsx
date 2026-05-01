import { useId } from 'react'

/* ─── ぷっくりハート ─── */
export function PuffyHeart({ size = 24, colors, style = {} }) {
  const id = useId().replace(/:/g, 'x')
  const c = colors || { from: '#FFE0EF', mid: '#FF3D9A', to: '#C40062' }
  return (
    <svg width={size} height={size} viewBox="0 0 100 86" style={{ display:'block', overflow:'visible', ...style }}>
      <defs>
        <radialGradient id={`${id}g`} cx="46%" cy="30%" r="70%">
          <stop offset="0%"   stopColor={c.from}/>
          <stop offset="48%"  stopColor={c.mid}/>
          <stop offset="100%" stopColor={c.to}/>
        </radialGradient>
        {/* 底面の暗いグラデ（奥行き感） */}
        <radialGradient id={`${id}depth`} cx="50%" cy="90%" r="55%">
          <stop offset="0%"   stopColor="rgba(0,0,0,.18)"/>
          <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
        </radialGradient>
        <filter id={`${id}f`} x="-25%" y="-20%" width="150%" height="160%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor={c.to} floodOpacity="0.60"/>
        </filter>
      </defs>
      <path
        d="M50,78 C44,78 5,56 5,30 C5,13 17,4 31,4 C39,4 46,10 50,18 C54,10 61,4 69,4 C83,4 95,13 95,30 C95,56 56,78 50,78 Z"
        fill={`url(#${id}g)`}
        stroke="rgba(255,255,255,.95)" strokeWidth="5"
        filter={`url(#${id}f)`}
      />
      {/* 底面の暗み（奥行き） */}
      <path
        d="M50,78 C44,78 5,56 5,30 C5,13 17,4 31,4 C39,4 46,10 50,18 C54,10 61,4 69,4 C83,4 95,13 95,30 C95,56 56,78 50,78 Z"
        fill={`url(#${id}depth)`}
      />
      {/* 光沢：大きめソフト */}
      <ellipse cx="35" cy="24" rx="22" ry="12" fill="rgba(255,255,255,.32)" transform="rotate(-14,35,24)"/>
      {/* 光沢：中 */}
      <ellipse cx="33" cy="19" rx="12" ry="6.5" fill="rgba(255,255,255,.58)" transform="rotate(-14,33,19)"/>
      {/* 光沢：ハイライト点 */}
      <ellipse cx="30" cy="16" rx="5" ry="3" fill="rgba(255,255,255,.88)" transform="rotate(-14,30,16)"/>
    </svg>
  )
}

/* ─── ぷっくり星 ─── */
export function PuffyStar({ size = 24, style = {} }) {
  const id = useId().replace(/:/g, 'x')
  const roundedStar =
    'M19.6,35.4 L38.2,33.8 L45.5,16.6 Q50,6 54.5,16.6 ' +
    'L61.8,33.8 L80.4,35.4 Q91.8,36.4 83.2,43.9 ' +
    'L69.0,56.2 L73.3,74.4 Q75.9,85.6 66.0,79.7 ' +
    'L50,70 L34.0,79.7 Q24.1,85.6 26.7,74.4 ' +
    'L30.98,56.2 L16.8,43.9 Q8.2,36.4 19.6,35.4 Z'
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display:'block', overflow:'visible', ...style }}>
      <defs>
        <radialGradient id={`${id}g`} cx="40%" cy="24%" r="76%">
          <stop offset="0%"   stopColor="#FFFEE0"/>
          <stop offset="35%"  stopColor="#FFE000"/>
          <stop offset="100%" stopColor="#FF7800"/>
        </radialGradient>
        <radialGradient id={`${id}depth`} cx="50%" cy="90%" r="55%">
          <stop offset="0%"   stopColor="rgba(0,0,0,.16)"/>
          <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
        </radialGradient>
        <filter id={`${id}f`} x="-25%" y="-25%" width="150%" height="160%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#E06000" floodOpacity="0.58"/>
        </filter>
      </defs>
      <path
        d={roundedStar}
        fill={`url(#${id}g)`}
        stroke="rgba(255,255,255,.95)" strokeWidth="5" strokeLinejoin="round"
        filter={`url(#${id}f)`}
      />
      <path d={roundedStar} fill={`url(#${id}depth)`}/>
      {/* 光沢 大 */}
      <ellipse cx="38" cy="29" rx="19" ry="10" fill="rgba(255,255,255,.30)" transform="rotate(-16,38,29)"/>
      {/* 光沢 中 */}
      <ellipse cx="36" cy="25" rx="10" ry="5.5" fill="rgba(255,255,255,.58)" transform="rotate(-16,36,25)"/>
      {/* ハイライト点 */}
      <ellipse cx="34" cy="22" rx="4.5" ry="2.5" fill="rgba(255,255,255,.90)" transform="rotate(-16,34,22)"/>
    </svg>
  )
}

/* ─── ぷっくりキラキラ（4点星） ─── */
export function PuffySparkle({ size = 24, style = {} }) {
  const id = useId().replace(/:/g, 'x')
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display:'block', overflow:'visible', ...style }}>
      <defs>
        <radialGradient id={`${id}g`} cx="50%" cy="30%" r="68%">
          <stop offset="0%"   stopColor="#FFFFFF"/>
          <stop offset="25%"  stopColor="#FFF8B0"/>
          <stop offset="100%" stopColor="#FFB800"/>
        </radialGradient>
        <filter id={`${id}f`} x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#FFA000" floodOpacity="0.55"/>
        </filter>
      </defs>
      <path
        d="M50,8 C52,30 70,48 92,50 C70,52 52,70 50,92 C48,70 30,52 8,50 C30,48 48,30 50,8 Z"
        fill={`url(#${id}g)`}
        stroke="rgba(255,255,255,.85)" strokeWidth="3.5"
        filter={`url(#${id}f)`}
      />
      <circle cx="44" cy="34" r="8" fill="rgba(255,255,255,.62)"/>
      <circle cx="42" cy="31" r="4" fill="rgba(255,255,255,.90)"/>
    </svg>
  )
}

/* ─── ぷっくりお花 ─── */
export function PuffyFlower({ size = 24, style = {}, colors }) {
  const id = useId().replace(/:/g, 'x')
  const c = colors || { from:'#FFE4F5', mid:'#FF85C0', to:'#E8187A', shadow:'#D0106A', stroke:'#FF88D0' }
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display:'block', overflow:'visible', ...style }}>
      <defs>
        <radialGradient id={`${id}g`} cx="48%" cy="32%" r="68%">
          <stop offset="0%"   stopColor={c.from}/>
          <stop offset="45%"  stopColor={c.mid}/>
          <stop offset="100%" stopColor={c.to}/>
        </radialGradient>
        <radialGradient id={`${id}c`} cx="44%" cy="30%" r="66%">
          <stop offset="0%"   stopColor="#FFFCE0"/>
          <stop offset="55%"  stopColor="#FFD700"/>
          <stop offset="100%" stopColor="#E09000"/>
        </radialGradient>
        <filter id={`${id}f`} x="-25%" y="-25%" width="150%" height="160%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor={c.shadow} floodOpacity="0.55"/>
        </filter>
      </defs>
      <g filter={`url(#${id}f)`}>
        {/* 花びら5枚 */}
        {[0, 72, 144, 216, 288].map((angle, i) => {
          const rad = (angle - 90) * Math.PI / 180
          const cx  = 50 + 23 * Math.cos(rad)
          const cy  = 50 + 23 * Math.sin(rad)
          return (
            <ellipse key={i}
              cx={cx} cy={cy} rx="22" ry="16"
              fill={`url(#${id}g)`}
              stroke={c.stroke || 'rgba(255,255,255,.9)'} strokeWidth="3.5"
              transform={`rotate(${angle},${cx},${cy})`}
            />
          )
        })}
        {/* 中心ボタン */}
        <circle cx="50" cy="50" r="19" fill={`url(#${id}c)`} stroke="rgba(255,255,255,.95)" strokeWidth="4"/>
      </g>
      {/* 中心光沢 */}
      <circle cx="45" cy="43" r="7.5" fill="rgba(255,255,255,.62)"/>
      <circle cx="43" cy="41" r="4" fill="rgba(255,255,255,.90)"/>
      {/* 花びら光沢 */}
      {[0, 72, 144, 216, 288].map((angle, i) => {
        const rad = (angle - 90) * Math.PI / 180
        const cx  = 50 + 23 * Math.cos(rad)
        const cy  = 50 + 23 * Math.sin(rad)
        return (
          <ellipse key={i}
            cx={cx - 6 * Math.cos(rad)} cy={cy - 6 * Math.sin(rad)}
            rx="9" ry="5.5"
            fill="rgba(255,255,255,.45)"
            transform={`rotate(${angle},${cx - 6*Math.cos(rad)},${cy - 6*Math.sin(rad)})`}
          />
        )
      })}
    </svg>
  )
}

/* ─── ぷっくりカプセル ─── */
export function PuffyCapsule({ size = 32, style = {} }) {
  const id = useId().replace(/:/g, 'x')
  return (
    <svg width={size} height={size * 0.55} viewBox="0 0 100 55" style={{ display:'block', overflow:'visible', ...style }}>
      <defs>
        <radialGradient id={`${id}lp`} cx="36%" cy="28%" r="72%">
          <stop offset="0%"   stopColor="#FFE8F8"/>
          <stop offset="48%"  stopColor="#FF80C8"/>
          <stop offset="100%" stopColor="#E8007A"/>
        </radialGradient>
        <radialGradient id={`${id}rm`} cx="64%" cy="28%" r="72%">
          <stop offset="0%"   stopColor="#FFFCE8"/>
          <stop offset="48%"  stopColor="#FFE040"/>
          <stop offset="100%" stopColor="#E09000"/>
        </radialGradient>
        <filter id={`${id}f`} x="-18%" y="-35%" width="136%" height="175%">
          <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#C00070" floodOpacity="0.55"/>
        </filter>
        <clipPath id={`${id}cl`}>
          <rect x="3" y="3" width="94" height="49" rx="24.5"/>
        </clipPath>
      </defs>
      <g filter={`url(#${id}f)`}>
        {/* 左半分（ピンク） */}
        <rect x="3" y="3" width="47" height="49" rx="0" fill={`url(#${id}lp)`} clipPath={`url(#${id}cl)`}/>
        {/* 右半分（イエロー） */}
        <rect x="50" y="3" width="47" height="49" rx="0" fill={`url(#${id}rm)`} clipPath={`url(#${id}cl)`}/>
        {/* 色付き縁 */}
        <rect x="2.5" y="2.5" width="95" height="50" rx="25" fill="none" stroke="rgba(200,0,100,.45)" strokeWidth="2.5"/>
        {/* 白い縁 */}
        <rect x="3" y="3" width="94" height="49" rx="24.5" fill="none" stroke="rgba(255,255,255,.95)" strokeWidth="4"/>
        {/* 中央仕切り */}
        <line x1="50" y1="3" x2="50" y2="52" stroke="rgba(255,255,255,.80)" strokeWidth="3"/>
      </g>
      {/* 光沢ハイライト */}
      <ellipse cx="32" cy="14" rx="15" ry="7.5" fill="rgba(255,255,255,.55)" transform="rotate(-10,32,14)" clipPath={`url(#${id}cl)`}/>
      <ellipse cx="31" cy="12" rx="7" ry="3.5" fill="rgba(255,255,255,.85)" transform="rotate(-10,31,12)" clipPath={`url(#${id}cl)`}/>
      <ellipse cx="68" cy="14" rx="15" ry="7.5" fill="rgba(255,255,255,.55)" transform="rotate(-10,68,14)" clipPath={`url(#${id}cl)`}/>
      <ellipse cx="67" cy="12" rx="7" ry="3.5" fill="rgba(255,255,255,.85)" transform="rotate(-10,67,12)" clipPath={`url(#${id}cl)`}/>
    </svg>
  )
}

/* ─── ぷっくりブルーハート ─── */
export function PuffyHeartBlue({ size = 24, style = {} }) {
  return <PuffyHeart size={size} colors={{ from:'#D0EEFF', mid:'#2EA8FF', to:'#0060CC' }} style={style}/>
}

/* ─── ぷっくりベル ─── */
export function PuffyBell({ size = 24, style = {} }) {
  const id = useId().replace(/:/g, 'x')
  return (
    <svg width={size} height={size} viewBox="0 0 100 110" style={{ display:'block', overflow:'visible', ...style }}>
      <defs>
        <radialGradient id={`${id}body`} cx="40%" cy="26%" r="74%">
          <stop offset="0%"   stopColor="#FFFDE0"/>
          <stop offset="42%"  stopColor="#FFD800"/>
          <stop offset="100%" stopColor="#D07800"/>
        </radialGradient>
        <radialGradient id={`${id}depth`} cx="50%" cy="88%" r="50%">
          <stop offset="0%"   stopColor="rgba(0,0,0,.18)"/>
          <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
        </radialGradient>
        <radialGradient id={`${id}rim`} cx="50%" cy="28%" r="66%">
          <stop offset="0%"   stopColor="#FFE860"/>
          <stop offset="100%" stopColor="#B06000"/>
        </radialGradient>
        <radialGradient id={`${id}ball`} cx="36%" cy="28%" r="70%">
          <stop offset="0%"   stopColor="#FFF8C0"/>
          <stop offset="100%" stopColor="#C07000"/>
        </radialGradient>
        <filter id={`${id}f`} x="-25%" y="-20%" width="150%" height="160%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#A05000" floodOpacity="0.50"/>
        </filter>
      </defs>
      <g filter={`url(#${id}f)`}>
        {/* 上リング */}
        <ellipse cx="50" cy="17" rx="9" ry="6"
          fill="none" stroke={`url(#${id}rim)`} strokeWidth="6.5"
          strokeLinecap="round"/>
        {/* ベル本体 */}
        <path d="M 38,28 C 22,34 11,52 11,70 L 89,70 C 89,52 78,34 62,28 C 57,14 43,14 38,28 Z"
          fill={`url(#${id}body)`}
          stroke="rgba(255,255,255,.95)" strokeWidth="5" strokeLinejoin="round"/>
        {/* 下リム */}
        <ellipse cx="50" cy="70" rx="39" ry="8.5"
          fill={`url(#${id}rim)`}
          stroke="rgba(255,255,255,.92)" strokeWidth="3.5"/>
        {/* クラッパー */}
        <circle cx="50" cy="84" r="7.5"
          fill={`url(#${id}ball)`}
          stroke="rgba(255,255,255,.90)" strokeWidth="3"/>
      </g>
      {/* 奥行き暗み */}
      <path d="M 38,28 C 22,34 11,52 11,70 L 89,70 C 89,52 78,34 62,28 C 57,14 43,14 38,28 Z"
        fill={`url(#${id}depth)`}/>
      {/* 光沢 ソフト大 */}
      <ellipse cx="37" cy="40" rx="16" ry="9" fill="rgba(255,255,255,.32)" transform="rotate(-15,37,40)"/>
      {/* 光沢 中 */}
      <ellipse cx="36" cy="35" rx="9" ry="5" fill="rgba(255,255,255,.60)" transform="rotate(-15,36,35)"/>
      {/* ハイライト点 */}
      <ellipse cx="34" cy="32" rx="4" ry="2.5" fill="rgba(255,255,255,.90)" transform="rotate(-15,34,32)"/>
    </svg>
  )
}

/* ─── ぷっくり四つ葉クローバー ─── */
export function PuffyClover({ size = 24, style = {} }) {
  const id = useId().replace(/:/g, 'x')
  /* ハート型の葉（上向き） — rotate で4枚展開 */
  const leaf = 'M50,54 C30,46 16,28 24,12 C30,0 42,-2 50,10 C58,-2 70,0 76,12 C84,28 70,46 50,54 Z'
  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 100 112" style={{ display:'block', overflow:'visible', ...style }}>
      <defs>
        <radialGradient id={`${id}lg`} cx="42%" cy="28%" r="72%">
          <stop offset="0%"   stopColor="#DCFCE7"/>
          <stop offset="38%"  stopColor="#4ADE80"/>
          <stop offset="100%" stopColor="#15803D"/>
        </radialGradient>
        <radialGradient id={`${id}cg`} cx="44%" cy="34%" r="65%">
          <stop offset="0%"   stopColor="#BBF7D0"/>
          <stop offset="55%"  stopColor="#22C55E"/>
          <stop offset="100%" stopColor="#166534"/>
        </radialGradient>
        <radialGradient id={`${id}sg`} cx="30%" cy="20%" r="80%">
          <stop offset="0%"   stopColor="#86EFAC"/>
          <stop offset="100%" stopColor="#166534"/>
        </radialGradient>
        <filter id={`${id}f`} x="-28%" y="-28%" width="156%" height="170%">
          <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#14532D" floodOpacity="0.52"/>
        </filter>
      </defs>
      <g filter={`url(#${id}f)`}>
        {/* 茎 */}
        <path d="M50,82 Q55,94 53,108" stroke={`url(#${id}sg)`} strokeWidth="5.5" strokeLinecap="round" fill="none"/>
        {/* 葉4枚（ハート型をrotateで展開） */}
        <path d={leaf} fill={`url(#${id}lg)`} stroke="rgba(255,255,255,.92)" strokeWidth="3.5" transform="rotate(0,50,54)"/>
        <path d={leaf} fill={`url(#${id}lg)`} stroke="rgba(255,255,255,.92)" strokeWidth="3.5" transform="rotate(90,50,54)"/>
        <path d={leaf} fill={`url(#${id}lg)`} stroke="rgba(255,255,255,.92)" strokeWidth="3.5" transform="rotate(180,50,54)"/>
        <path d={leaf} fill={`url(#${id}lg)`} stroke="rgba(255,255,255,.92)" strokeWidth="3.5" transform="rotate(270,50,54)"/>
        {/* 中心ボタン */}
        <circle cx="50" cy="54" r="10" fill={`url(#${id}cg)`} stroke="rgba(255,255,255,.95)" strokeWidth="3.5"/>
      </g>
      {/* 上葉の光沢 */}
      <ellipse cx="43" cy="22" rx="10" ry="6.5" fill="rgba(255,255,255,.42)" transform="rotate(-12,43,22)"/>
      <ellipse cx="42" cy="18" rx="5"  ry="3"   fill="rgba(255,255,255,.78)" transform="rotate(-12,42,18)"/>
      {/* 左葉の光沢 */}
      <ellipse cx="22" cy="48" rx="6.5" ry="4" fill="rgba(255,255,255,.38)" transform="rotate(-25,22,48)"/>
      <ellipse cx="20" cy="46" rx="3"   ry="2" fill="rgba(255,255,255,.72)" transform="rotate(-25,20,46)"/>
      {/* 中心光沢 */}
      <circle cx="47" cy="51" r="3.5" fill="rgba(255,255,255,.68)"/>
    </svg>
  )
}

/* ─── ぷっくり時計 ─── */
export function PuffyClock({ size = 24, style = {} }) {
  const id = useId().replace(/:/g, 'x')
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display:'block', overflow:'visible', ...style }}>
      <defs>
        <radialGradient id={`${id}bg`} cx="42%" cy="28%" r="72%">
          <stop offset="0%"   stopColor="#FFE8F8"/>
          <stop offset="42%"  stopColor="#E870E8"/>
          <stop offset="100%" stopColor="#9010C0"/>
        </radialGradient>
        <radialGradient id={`${id}face`} cx="44%" cy="34%" r="64%">
          <stop offset="0%"   stopColor="#FFFFFF"/>
          <stop offset="100%" stopColor="#F0EAFF"/>
        </radialGradient>
        <radialGradient id={`${id}depth`} cx="50%" cy="92%" r="52%">
          <stop offset="0%"   stopColor="rgba(0,0,0,.15)"/>
          <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
        </radialGradient>
        <filter id={`${id}f`} x="-25%" y="-25%" width="150%" height="160%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#7000A0" floodOpacity="0.55"/>
        </filter>
      </defs>
      {/* 外円 */}
      <circle cx="50" cy="50" r="44"
        fill={`url(#${id}bg)`}
        stroke="rgba(255,255,255,.95)" strokeWidth="5"
        filter={`url(#${id}f)`}
      />
      {/* 奥行き暗み */}
      <circle cx="50" cy="50" r="44" fill={`url(#${id}depth)`}/>
      {/* 文字盤 */}
      <circle cx="50" cy="50" r="33" fill={`url(#${id}face)`} stroke="rgba(200,140,255,.65)" strokeWidth="2.5"/>
      {/* 長針 */}
      <line x1="50" y1="50" x2="50" y2="24"
        stroke="#C020B0" strokeWidth="4.5" strokeLinecap="round"/>
      {/* 短針 */}
      <line x1="50" y1="50" x2="67" y2="38"
        stroke="#9010A0" strokeWidth="4" strokeLinecap="round"/>
      {/* 中心ドット */}
      <circle cx="50" cy="50" r="5" fill="#C020B0" stroke="rgba(255,255,255,.92)" strokeWidth="2.5"/>
      {/* 光沢 大 */}
      <ellipse cx="38" cy="34" rx="15" ry="9" fill="rgba(255,255,255,.32)" transform="rotate(-18,38,34)"/>
      {/* 光沢 中 */}
      <ellipse cx="37" cy="30" rx="8" ry="4.5" fill="rgba(255,255,255,.60)" transform="rotate(-18,37,30)"/>
      {/* ハイライト点 */}
      <ellipse cx="35" cy="27" rx="3.5" ry="2" fill="rgba(255,255,255,.90)" transform="rotate(-18,35,27)"/>
    </svg>
  )
}
