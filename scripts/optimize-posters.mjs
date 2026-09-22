/**
 * Convertit les posters d'événements en WebP à deux largeurs, recadrés au
 * format commun des affiches (4:3).
 *
 * Deux sources : les PNG des maquettes Stitch et les photographies sous
 * licence Pexels (voir `photos/SOURCES.md`). Les originaux restent hors du
 * bundle ; seuls les WebP produits ici sont servis par l'application.
 *
 * Usage : npm run posters
 */
import { mkdir, readdir, stat } from 'node:fs/promises'
import { basename, extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'

const root = fileURLToPath(new URL('..', import.meta.url))
const sources = [join(root, 'mockup stich', 'images'), join(root, 'photos')]
const destination = join(root, 'src', 'assets', 'posters')

/** Largeurs servies : carte de liste, puis bandeau de la page détail. */
const WIDTHS = [640, 1280]
/** Toutes les affiches partagent ce rapport : une photo plus haute est recadrée. */
const RATIO = 4 / 3
const QUALITY = 78

await mkdir(destination, { recursive: true })

for (const source of sources) {
  const posters = (await readdir(source)).filter((file) => file.startsWith('poster-'))

  for (const file of posters) {
    const name = basename(file, extname(file))
    const original = await stat(join(source, file))

    for (const width of WIDTHS) {
      const output = join(destination, `${name}-${width}.webp`)
      await sharp(join(source, file))
        .resize({ width, height: Math.round(width / RATIO), fit: 'cover' })
        .webp({ quality: QUALITY })
        .toFile(output)

      const optimized = await stat(output)
      const ratio = Math.round((1 - optimized.size / original.size) * 100)
      console.log(`${name}-${width}.webp — ${Math.round(optimized.size / 1024)} ko (-${ratio} %)`)
    }
  }
}
