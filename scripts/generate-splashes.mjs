/**
 * generate-splashes.mjs
 * iPhoneのスプラッシュスクリーン（起動画面）を生成するスクリプト
 * 実行: node scripts/generate-splashes.mjs
 */
import sharp from 'sharp'
import { readFileSync, mkdirSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT    = resolve(__dirname, '..')
const PUBLIC  = resolve(ROOT, 'public')
const SPLASH_DIR = resolve(PUBLIC, 'splashes')

if (!existsSync(SPLASH_DIR)) mkdirSync(SPLASH_DIR, { recursive: true })

const svgBuffer = readFileSync(resolve(PUBLIC, 'icon.svg'))

// パステルピンク背景色（theme_color と合わせる）
const BG = { r: 255, g: 214, b: 236, alpha: 1 }

// グラデ風背景を SVG で作成
function makeBgSvg(w, h) {
  return Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stop-color="#FFD6EC"/>
          <stop offset="50%"  stop-color="#EEE0FF"/>
          <stop offset="100%" stop-color="#C8E8FF"/>
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#g)"/>
      <!-- 装飾オーブ -->
      <ellipse cx="${w*0.15}" cy="${h*0.12}" rx="${w*0.28}" ry="${w*0.28}"
        fill="rgba(255,180,220,0.22)"/>
      <ellipse cx="${w*0.85}" cy="${h*0.88}" rx="${w*0.24}" ry="${w*0.24}"
        fill="rgba(180,200,255,0.2)"/>
      <!-- 星 -->
      <text x="${w*0.12}" y="${h*0.22}" font-size="${w*0.08}" fill="rgba(255,200,220,0.6)"
        font-family="serif" text-anchor="middle">✦</text>
      <text x="${w*0.88}" y="${h*0.15}" font-size="${w*0.05}" fill="rgba(200,180,255,0.5)"
        font-family="serif" text-anchor="middle">✦</text>
      <text x="${w*0.9}"  y="${h*0.82}" font-size="${w*0.06}" fill="rgba(180,220,255,0.5)"
        font-family="serif" text-anchor="middle">✦</text>
    </svg>
  `)
}

const SPLASH_SIZES = [
  { name: 'splash-1290x2796.png', w: 1290, h: 2796 }, // iPhone 16 Pro Max
  { name: 'splash-1179x2556.png', w: 1179, h: 2556 }, // iPhone 16 Pro
  { name: 'splash-1170x2532.png', w: 1170, h: 2532 }, // iPhone 15/14/13/12
  { name: 'splash-750x1334.png',  w: 750,  h: 1334 }, // iPhone SE
]

async function generate() {
  for (const s of SPLASH_SIZES) {
    const iconSize = Math.round(Math.min(s.w, s.h) * 0.28) // 画面短辺の28%
    const outPath  = resolve(SPLASH_DIR, s.name)

    // ① グラデ背景を生成
    const bg = await sharp(makeBgSvg(s.w, s.h))
      .resize(s.w, s.h)
      .png()
      .toBuffer()

    // ② アイコンを中央配置
    const icon = await sharp(svgBuffer)
      .resize(iconSize, iconSize)
      .png()
      .toBuffer()

    const left = Math.round((s.w - iconSize) / 2)
    const top  = Math.round(s.h * 0.38)  // 画面の38%の位置（上寄りに配置）

    // ③ アプリ名テキスト用 SVG
    const textSvg = Buffer.from(`
      <svg xmlns="http://www.w3.org/2000/svg" width="${s.w}" height="${s.h}">
        <text
          x="${s.w / 2}" y="${top + iconSize + Math.round(s.h * 0.07)}"
          font-size="${Math.round(s.w * 0.072)}"
          font-family="'M PLUS Rounded 1c', 'Hiragino Maru Gothic Pro', sans-serif"
          font-weight="900"
          fill="rgba(180,100,200,0.85)"
          text-anchor="middle"
          dominant-baseline="middle"
        >おくすりタイマー</text>
        <text
          x="${s.w / 2}" y="${top + iconSize + Math.round(s.h * 0.115)}"
          font-size="${Math.round(s.w * 0.038)}"
          font-family="'M PLUS Rounded 1c', 'Hiragino Maru Gothic Pro', sans-serif"
          font-weight="500"
          fill="rgba(180,130,200,0.65)"
          text-anchor="middle"
          dominant-baseline="middle"
        >💊 キャラクターと一緒にお薬管理 ✨</text>
      </svg>
    `)

    await sharp(bg)
      .composite([
        { input: icon,    top,  left },
        { input: textSvg, top: 0, left: 0 },
      ])
      .png()
      .toFile(outPath)

    console.log(`✅ generated: ${s.name} (${s.w}×${s.h})`)
  }

  console.log('\n🌸 スプラッシュスクリーン生成完了！')
}

generate().catch(err => {
  console.error('❌ エラー:', err)
  process.exit(1)
})
