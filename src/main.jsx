import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

document.getElementById('js-debug')?.remove()

function showError(msg) {
  document.body.innerHTML =
    '<div style="position:fixed;top:0;left:0;right:0;bottom:0;background:white;padding:20px;color:red;font-size:12px;word-break:break-all;overflow:auto;z-index:99999">' +
    '<b>エラー発生:</b><br/>' + msg + '</div>'
}

window.onerror = (msg, src, line, col, err) => {
  showError(msg + '<br/>at ' + src + ':' + line + '<br/>' + (err?.stack || ''))
}

window.onunhandledrejection = (e) => {
  showError('Promise エラー: ' + (e.reason?.message || e.reason) + '<br/>' + (e.reason?.stack || ''))
}

try {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
} catch (e) {
  showError(e.message + '<br/>' + e.stack)
}
