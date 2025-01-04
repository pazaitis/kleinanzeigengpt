import sharp from 'sharp'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function generateFavicon() {
  const svgBuffer = fs.readFileSync(join(__dirname, '..', 'public', 'favicon.svg'))
  
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(join(__dirname, '..', 'public', 'favicon.png'))
  
  console.log('Favicon PNG generated successfully!')
}

generateFavicon() 