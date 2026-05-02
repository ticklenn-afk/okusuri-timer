import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

document.getElementById('js-debug')?.remove()

try {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
} catch (e) {
  document.getElementById('root').innerHTML =
    '<div style="padding:20px;color:red;font-size:14px;word-break:break-all">' +
    'エラー: ' + e.message + '<br/><br/>' + e.stack + '</div>'
}
