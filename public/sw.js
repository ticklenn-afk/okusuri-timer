const CACHE_NAME = 'okusuri-timer-v1'

self.addEventListener('install', (e) => {
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim())
})

// 通知クリック → アプリをフォーカス or 開く
self.addEventListener('notificationclick', (e) => {
  e.notification.close()
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus()
      }
      return self.clients.openWindow('/')
    })
  )
})

// メッセージ受信 → 通知を表示（ページからスケジュールされた通知）
self.addEventListener('message', (e) => {
  if (e.data?.type === 'SHOW_NOTIFICATION') {
    const { title, body, icon, tag, data } = e.data.payload
    e.waitUntil(
      self.registration.showNotification(title, {
        body,
        icon: icon ?? '/icon-192.png',
        badge: '/icon-192.png',
        tag: tag ?? 'okusuri',
        vibrate: [200, 100, 200],
        data: data ?? {},
        actions: [
          { action: 'taken', title: '✅ 飲んだ！' },
          { action: 'later', title: '⏰ 後で' },
        ],
      })
    )
  }
})

// 通知アクションクリック
self.addEventListener('notificationclick', (e) => {
  const action = e.action
  e.notification.close()

  if (action === 'taken') {
    // 飲んだ場合は記録メッセージをページに送る
    e.waitUntil(
      self.clients.matchAll({ type: 'window' }).then((clients) => {
        clients.forEach(c => c.postMessage({ type: 'MARK_TAKEN', tag: e.notification.tag }))
      })
    )
  }

  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus()
      }
      return self.clients.openWindow('/')
    })
  )
})
