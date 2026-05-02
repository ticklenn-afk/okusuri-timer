import { useEffect, useRef, useCallback } from 'react'

// キャラクターごとの通知メッセージ（複数ランダム）
const CHARACTER_MESSAGES = {
  morning: {
    title: '🦁 マッチョライオンからや！',
    lines: [
      '今日がいちばん若い日やでー！\nお薬忘れたらあかんでー！💪',
      '朝のお薬の時間やで！\n飲んでから今日も全力でいこうや！🔥',
      'おはようさん！\nお薬飲んで最高の一日にしようぜ！💪✨',
      '起きたか！？\n今日も絶好調で行くで！まずお薬やで！🦁',
    ],
  },
  noon: {
    title: '🐦 シマエナガだよ〜！',
    lines: [
      'お昼もかわいく頑張ろう♪\nお薬飲んでね〜！✨',
      'ぽわ〜ん♪ お薬の時間だよ！\nちゃんと飲んでね💙',
      'お昼ごはん食べた？\nお薬もセットで忘れないでね🐦',
      'ふわふわ〜♪ \nお薬飲んだら午後も元気だよ！',
    ],
  },
  night: {
    title: '🐰 うさぎより',
    lines: [
      '今日もお疲れ様。\n一日頑張ったね❤️ お薬飲もうね',
      'ゆっくり休む前に\nお薬飲んでね🌙 大好きだよ❤️',
      'お疲れ様でした。\n夜のお薬の時間だよ。無理しないでね🐰',
      '今日もよく頑張ったね。\nお薬飲んで、ゆっくり休んでね🌙',
    ],
  },
  prn: {
    title: '🐿️ りすより',
    lines: [
      '大丈夫かなぁ。\n無理しちゃだめよ… お薬飲んでね',
      'つらいときは無理しないで。\nりすがそばにいるよ🌿',
      'お薬の時間だよ。\nゆっくり、焦らなくていいからね🐿️',
    ],
  },
}

// スケジュール定義（時間帯 → キャラID）
export const NOTIFICATION_SCHEDULE = [
  { label: '朝', hour: 8, minute: 0, timingId: 'morning', scheduleLabel: '朝' },
  { label: '昼', hour: 12, minute: 0, timingId: 'noon', scheduleLabel: '昼' },
  { label: '夜', hour: 18, minute: 0, timingId: 'night', scheduleLabel: '夜' },
  { label: '頓服', hour: 22, minute: 0, timingId: 'prn', scheduleLabel: '頓服' },
]

function getRandomMessage(timingId) {
  const msgs = CHARACTER_MESSAGES[timingId] ?? CHARACTER_MESSAGES.morning
  const body = msgs.lines[Math.floor(Math.random() * msgs.lines.length)]
  return { title: msgs.title, body }
}

function msUntil(hour, minute) {
  const now = new Date()
  const target = new Date()
  target.setHours(hour, minute, 0, 0)
  if (target <= now) target.setDate(target.getDate() + 1) // 翌日
  return target.getTime() - now.getTime()
}

export function useNotifications({ onPopup }) {
  const timerRefs = useRef([])
  const swRegRef = useRef(null)

  // Service Worker 登録
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    navigator.serviceWorker.register('/sw.js').then((reg) => {
      swRegRef.current = reg
    }).catch(console.error)

    // SW からのメッセージ受信（通知アクション「飲んだ！」）
    const handler = (e) => {
      if (e.data?.type === 'MARK_TAKEN') {
        onPopup?.({ ...e.data, fromNotification: true })
      }
    }
    navigator.serviceWorker.addEventListener('message', handler)
    return () => navigator.serviceWorker.removeEventListener('message', handler)
  }, [])

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return 'unsupported'
    if (window.Notification.permission === 'granted') return 'granted'
    const result = await window.Notification.requestPermission()
    return result
  }, [])

  const scheduleAll = useCallback((overrideTimes = null) => {
    // 既存タイマーをクリア
    timerRefs.current.forEach(clearTimeout)
    timerRefs.current = []

    const schedule = overrideTimes ?? NOTIFICATION_SCHEDULE

    schedule.forEach((slot) => {
      const delay = msUntil(slot.hour, slot.minute)
      const id = setTimeout(async () => {
        const { title, body } = getRandomMessage(slot.timingId)

        // ① アプリが開いているならポップアップ
        onPopup?.({ timingId: slot.timingId, title, body, label: slot.label })

        // ② ブラウザ通知（SW 経由）
        if (window.Notification?.permission === 'granted' && swRegRef.current) {
          swRegRef.current.active?.postMessage({
            type: 'SHOW_NOTIFICATION',
            payload: { title, body, tag: `okusuri-${slot.timingId}` },
          })
          // fallback: SW がまだアクティブでない場合は直接表示
          try {
            await swRegRef.current.showNotification(title, {
              body,
              icon: '/icon-192.png',
              tag: `okusuri-${slot.timingId}`,
              vibrate: [200, 100, 200],
            })
          } catch (_) { /* SW 経由で既に表示済みの場合は無視 */ }
        }

        // 翌日の同じ時刻のために再スケジュール
        scheduleAll(overrideTimes)
      }, delay)

      timerRefs.current.push(id)
    })
  }, [onPopup])

  const clearAll = useCallback(() => {
    timerRefs.current.forEach(clearTimeout)
    timerRefs.current = []
  }, [])

  // コンポーネントアンマウント時にクリア
  useEffect(() => () => clearAll(), [])

  return { requestPermission, scheduleAll, clearAll }
}
