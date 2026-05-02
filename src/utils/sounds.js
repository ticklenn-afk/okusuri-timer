/**
 * 🔊 かわいい効果音ユーティリティ
 * Web Audio API でその場で音を生成 — ファイル不要！
 */

let ctx = null

// iOS Safari/PWA: タッチのたびにAudioContextを解除しておく
function unlockAudio() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (ctx.state === 'suspended') ctx.resume()
}
if (typeof document !== 'undefined') {
  document.addEventListener('touchstart', unlockAudio, { passive: true })
  document.addEventListener('touchend',   unlockAudio, { passive: true })
  document.addEventListener('click',      unlockAudio, { passive: true })
}

async function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (ctx.state === 'suspended') await ctx.resume()
  return ctx
}

/** 音符ひとつ鳴らすヘルパー */
function note(freq, startAt, duration, vol = 0.28, type = 'sine', ctx) {
  const osc  = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.type = type
  osc.frequency.setValueAtTime(freq, startAt)
  gain.gain.setValueAtTime(0, startAt)
  gain.gain.linearRampToValueAtTime(vol, startAt + 0.018)
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration)
  osc.start(startAt)
  osc.stop(startAt + duration + 0.05)
}

// ──────────────────────────────────────────
// ✨ きらーん（服薬完了・メインお祝い）
// ──────────────────────────────────────────
export async function playKiran() {
  try {
    const c = await getCtx()
    const t = c.currentTime
    // 上昇アルペジオ C5 → E5 → G5 → C6 → E6
    const freqs = [523, 659, 784, 1047, 1319]
    freqs.forEach((f, i) => note(f, t + i * 0.09, 0.55, 0.26, 'sine', c))
    // 最後に高音のきらめき
    note(2093, t + freqs.length * 0.09,      0.35, 0.15, 'sine', c)
    note(2637, t + freqs.length * 0.09 + 0.05, 0.3, 0.12, 'sine', c)
  } catch (e) { /* 音声非対応環境は無視 */ }
}

// ──────────────────────────────────────────
// 🔔 しりーん（スケジュールボタンタップ）
// ──────────────────────────────────────────
export async function playShirin() {
  try {
    const c = await getCtx()
    const t = c.currentTime
    // ベル2音
    note(1047, t,       0.45, 0.22, 'sine', c)
    note(1319, t + 0.1, 0.38, 0.18, 'sine', c)
    // 倍音でベルらしさを追加
    note(2093, t,       0.25, 0.08, 'sine', c)
    note(2637, t + 0.1, 0.20, 0.06, 'sine', c)
  } catch (e) {}
}

// ──────────────────────────────────────────
// 🌟 きらきらーん（全部記録したとき）
// ──────────────────────────────────────────
export async function playKiraKiran() {
  try {
    const c = await getCtx()
    const t = c.currentTime
    const freqs = [523, 659, 784, 1047, 1319, 1568, 2093]
    freqs.forEach((f, i) => note(f, t + i * 0.07, 0.6, 0.22, 'sine', c))
    // ちょっと間をおいてもう一回フラッシュ
    ;[1047, 1319, 1568].forEach((f, i) => note(f, t + freqs.length * 0.07 + 0.15 + i * 0.06, 0.4, 0.15, 'sine', c))
  } catch (e) {}
}

// ──────────────────────────────────────────
// 🎭 キャラタブ専用サウンド（キャラごとに個性）
// ──────────────────────────────────────────
export async function playCharSound(id) {
  try {
    const c = await getCtx()
    const t = c.currentTime
    if (id === 'morning') {
      // 🦁 りょう学長 → ぴきーん！元気よく上昇ファンファーレ
      note(523,  t,        0.12, 0.22, 'square', c)
      note(659,  t + 0.08, 0.12, 0.20, 'square', c)
      note(784,  t + 0.16, 0.12, 0.20, 'square', c)
      note(1047, t + 0.24, 0.35, 0.28, 'sine',   c)
      note(1319, t + 0.30, 0.30, 0.18, 'sine',   c)
    } else if (id === 'noon') {
      // 🐦 シマエナガ → ぴよぴよ〜♪ 鳥のさえずりっぽく
      const chirp = (freq, start) => {
        const osc  = c.createOscillator()
        const gain = c.createGain()
        osc.connect(gain); gain.connect(c.destination)
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, start)
        osc.frequency.linearRampToValueAtTime(freq * 1.35, start + 0.06)
        osc.frequency.linearRampToValueAtTime(freq * 0.85, start + 0.12)
        gain.gain.setValueAtTime(0, start)
        gain.gain.linearRampToValueAtTime(0.2, start + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.18)
        osc.start(start); osc.stop(start + 0.22)
      }
      chirp(880, t);  chirp(1100, t + 0.15);  chirp(880, t + 0.30)
      note(1319, t + 0.45, 0.3, 0.12, 'sine', c)
    } else if (id === 'night') {
      // 🐰 うさぎ → ふわ〜ん♡ やわらかいベルの和音
      note(523,  t,        0.7, 0.18, 'sine', c)
      note(659,  t + 0.05, 0.6, 0.15, 'sine', c)
      note(784,  t + 0.10, 0.5, 0.13, 'sine', c)
      note(1047, t + 0.15, 0.5, 0.10, 'sine', c)
    } else {
      // 🐿️ りす → こんこん♪ 木をたたくようなかわいい音
      const knock = (freq, start, vol) => {
        const osc  = c.createOscillator()
        const gain = c.createGain()
        osc.connect(gain); gain.connect(c.destination)
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq * 1.4, start)
        osc.frequency.exponentialRampToValueAtTime(freq, start + 0.04)
        gain.gain.setValueAtTime(vol, start)
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.22)
        osc.start(start); osc.stop(start + 0.25)
      }
      knock(440, t,        0.24)
      knock(550, t + 0.13, 0.20)
      note(659, t + 0.28, 0.35, 0.14, 'sine', c)
    }
  } catch (e) {}
}

// ──────────────────────────────────────────
// 🎺 ファンファーレ（全部飲んだで！）
// ──────────────────────────────────────────
export async function playFanfare() {
  try {
    const c = await getCtx()
    const t = c.currentTime

    // === 第1波: ファンファーレ上昇アルペジオ ===
    const fanfare = [523, 659, 784, 1047, 1319, 1568, 2093]
    fanfare.forEach((f, i) => note(f, t + 0.10 + i * 0.085, 0.55, 0.24, 'sine', c))

    // === 第3波: ジャーン！パワーコード ===
    ;[262, 330, 392, 523, 659, 784, 1047].forEach(f => note(f, t + 0.72, 1.0, 0.16, 'sine', c))

    // === 第4波: 勝利メロディ ===
    const victory = [784,784,784,659,784, 1047,1047, 880,880,880,784,880, 1047,1319]
    const vTimes  = [1.0,1.15,1.3,1.4,1.5, 1.65,1.8, 1.95,2.1,2.25,2.35,2.45, 2.6,2.8]
    victory.forEach((f, i) => note(f, t + vTimes[i], 0.4, 0.22, 'sine', c))

    // === 第5波: きらきらスパークル ===
    const sp = [1568, 2093, 2637, 2093, 3136, 2637, 2093, 1568]
    sp.forEach((f, i) => note(f, t + 2.90 + i * 0.06, 0.38, 0.12, 'sine', c))

    // === 第6波: 締めの大コード ===
    ;[262, 330, 392, 523, 659, 784, 1047, 1319].forEach(f =>
      note(f, t + 3.38, 1.0, 0.14, 'sine', c))

    // === 第7波: 最後の超高音きらめきシャワー ===
    ;[1568, 2093, 2637, 3136, 2637, 2093, 3136].forEach((f, i) =>
      note(f, t + 3.50 + i * 0.065, 0.5, 0.09, 'sine', c))

  } catch (e) {}
}

// ──────────────────────────────────────────
// 💊 シュワーン！（今すぐ服薬を記録するボタン）
// ──────────────────────────────────────────
export async function playPowan() {
  try {
    const c = await getCtx()
    const t = c.currentTime

    // === ① 低音インパクト「ドン！」 ===
    ;[110, 165, 220].forEach((f, i) => {
      const osc = c.createOscillator(); const gain = c.createGain()
      osc.connect(gain); gain.connect(c.destination)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(f, t)
      osc.frequency.exponentialRampToValueAtTime(f * 0.6, t + 0.18)
      gain.gain.setValueAtTime(0.28 - i * 0.06, t)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22)
      osc.start(t); osc.stop(t + 0.25)
    })

    // === ② 急上昇スウィープ「シュワーン」 ===
    const sweep = c.createOscillator(); const sweepGain = c.createGain()
    sweep.connect(sweepGain); sweepGain.connect(c.destination)
    sweep.type = 'sine'
    sweep.frequency.setValueAtTime(200, t + 0.05)
    sweep.frequency.exponentialRampToValueAtTime(1600, t + 0.32)
    sweepGain.gain.setValueAtTime(0, t + 0.05)
    sweepGain.gain.linearRampToValueAtTime(0.22, t + 0.10)
    sweepGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.38)
    sweep.start(t + 0.05); sweep.stop(t + 0.42)

    // === ③ 明るい3和音「ジャン！」 ===
    ;[523, 659, 784, 1047].forEach((f, i) =>
      note(f, t + 0.28, 0.55, 0.18, 'sine', c))

    // === ④ きらきらスパークル ===
    ;[1319, 1568, 2093, 2637].forEach((f, i) =>
      note(f, t + 0.36 + i * 0.055, 0.35, 0.11, 'sine', c))

  } catch (e) {}
}
