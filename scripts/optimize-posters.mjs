/**
 * Convertit les posters d'événements en WebP à deux largeurs.
 * Les PNG d'origine (~1,8 Mo pièce) restent dans `mockup stich/images/`
 * comme source ; seuls les WebP produits ici sont servis par l'application.
 *
 * Usage : npm run posters
 */
import { mkdir, readdir, stat } from 'node:fs/promises'
import { basename, extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'

const root = fileURLToPath(new URL('..', import.meta.url))
const source = join(root, 'mockup stich', 'images')
const destination = join(root, 'src', 'assets', 'posters')

/** Largeurs servies : carte de liste, puis bandeau de la page détail. */
const WIDTHS = [640, 1280]
const QUALITY = 78

await mkdir(destination, { recursive: true })

const posters = (await readdir(source)).filter((file) => file.startsWith('poster-'))

for (const file of posters) {
  const name = basename(file, extname(file))
  const original = await stat(join(source, file))

  for (const width of WIDTHS) {
    const output = join(destination, `${name}-${width}.webp`)
    await sharp(join(source, file)).resize({ width }).webp({ quality: QUALITY }).toFile(output)
    const optimized = await stat(output)
    const ratio = Math.round((1 - optimized.size / original.size) * 100)
    console.log(`${name}-${width}.webp — ${Math.round(optimized.size / 1024)} ko (-${ratio} %)`)
  }
}
