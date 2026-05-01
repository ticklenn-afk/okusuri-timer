/**
 * generate-icons.mjs
 * SVG から各サイズの PNG アイコンを生成するスクリプト
 * 実行: node scripts/generate-icons.mjs
 */
import sharp from 'sharp'
import { readFileSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT   = resolve(__dirname, '..')
const PUBLIC = resolve(ROOT, 'public')

const svgBuffer = readFileSync(resolve(PUBLIC, 'icon.svg'))

const ICONS = [
  // ── manifest.json 用 ──
  { name: 'icon-192.png',           size: 192 },
  { name: 'icon-512.png',           size: 512 },

  // ── maskable（Androidのアダプティブアイコン用、余白あり） ──
  // safe zone = 80% → padding を 10% ずつ付ける
  { name: 'icon-maskable-192.png',  size: 192, maskable: true },
  { name: 'icon-maskable-512.png',  size: 512, maskable: true },

  // ── iOS apple-touch-icon ──
  { name: 'apple-touch-icon.png',   size: 180 },

  // ── ファビコン ──
  { name: 'favicon-32.png',         size: 32  },
  { name: 'favicon-16.png',         size: 16  },
]

async function generate() {
  for (const icon of ICONS) {
    const outPath = resolve(PUBLIC, icon.name)

    if (icon.maskable) {
      // maskable: 背景のグラデをそのまま使いながら余白を確保
      // SVGを 80% に縮小して中央に配置
      const innerSize = Math.round(icon.size * 0.8)
      const pad       = Math.round(icon.size * 0.1)

      const inner = await sharp(svgBuffer)
        .resize(innerSize, innerSize)
        .toBuffer()

      await sharp({
        create: {
          width:      icon.size,
          height:     icon.size,
          channels:   4,
          // パステルピンクの背景
          background: { r: 255, g: 214, b: 236, alpha: 1 },
        },
      })
        .composite([{ input: inner, top: pad, left: pad }])
        .png()
        .toFile(outPath)
    } else {
      await sharp(svgBuffer)
        .resize(icon.size, icon.size)
        .png()
        .toFile(outPath)
    }

    console.log(`✅ generated: ${icon.name} (${icon.size}px)`)
  }

  // ── favicon.ico (32px PNG を ico として配置) ──
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(resolve(PUBLIC, 'favicon.png'))
  console.log('✅ generated: favicon.png (32px)')

  console.log('\n🎉 全アイコン生成完了！')
}

generate().catch(err => {
  console.error('❌ エラー:', err)
  process.exit(1)
})
