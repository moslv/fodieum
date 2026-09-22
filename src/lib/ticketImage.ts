/**
 * Le billet, dessiné au canvas pour être enregistré.
 *
 * Sans backend, il n'y a pas de PDF à télécharger : on redessine le billet
 * dans un canvas et on rend un PNG. Ce n'est pas une capture de l'écran —
 * c'est le même objet redessiné à une taille d'impression, entailles et
 * code-barres compris, lisible hors de l'application.
 */
import type { FodiumEvent, PickupPoint } from '@/data/types'
import { formatDateBadge, formatEventTime, formatTicketDate } from '@/lib/format'
import { posterMonogram, posterScheme } from '@/lib/poster'
import { barcodePattern, shuttleSeat } from '@/lib/ticket'

export interface TicketImageInput {
  event: FodiumEvent
  pickupPoint: PickupPoint | null
  reference: string
  holder: string
  quantity: number
}

/** Les tokens de la palette, en valeurs littérales : le canvas ignore Tailwind. */
const ink = {
  paper: '#ffffff',
  text: '#1c1b1b',
  muted: '#8a7263',
  rule: 'rgba(0, 0, 0, 0.15)',
  primary: '#f07e00',
  tertiary: '#006c49',
}

const WIDTH = 1080
/** Largeur du talon illustré, dans les proportions de l'écran. */
const RAIL = 300
const PAD = 40
const RADIUS = 20
const NOTCH = 30
/** Deux fois la taille d'affichage : le PNG reste net sur un écran dense. */
const SCALE = 2

const BODY_X = RAIL + PAD
const BODY_WIDTH = WIDTH - RAIL - PAD * 2
const COLUMN = BODY_WIDTH / 3

const TITLE_LINE = 52
/** Pas d'une rangée de champs : intitulé, valeur 32 px plus bas, puis l'air. */
const ROW_HEIGHT = 74
/** Le bloc navette : son filet de séparation, puis sa rangée. */
const SHUTTLE_RULE = 46
const SHUTTLE_BLOCK = SHUTTLE_RULE + 44
const BARCODE_HEIGHT = 76

const mono = (size: number, weight = 700) => `${weight} ${size}px "Space Mono", monospace`
const sans = (size: number, weight = 800) =>
  `${weight} ${size}px "Plus Jakarta Sans", system-ui, sans-serif`

/** Rend un PNG du billet. */
export async function renderTicketImage(input: TicketImageInput): Promise<Blob> {
  // Les deux familles sont chargées par `@fontsource` : sans cette attente, le
  // canvas dessinerait le billet dans la police de repli du système.
  await document.fonts.ready

  const poster = input.event.poster ? await loadImage(input.event.poster.large) : null

  const titleLines = wrapText(input.event.title.toUpperCase(), sans(46), BODY_WIDTH, 2)
  const height = measureHeight(titleLines.length, input.pickupPoint !== null)

  const canvas = document.createElement('canvas')
  canvas.width = WIDTH * SCALE
  canvas.height = height * SCALE

  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas indisponible')

  context.scale(SCALE, SCALE)

  clipToTicket(context, height)
  context.fillStyle = ink.paper
  context.fillRect(0, 0, WIDTH, height)

  drawRail(context, input, poster, height)
  drawBody(context, input, titleLines, height)

  return toBlob(canvas)
}

/** Enregistre le billet dans les téléchargements de l'appareil. */
export async function downloadTicketImage(input: TicketImageInput): Promise<void> {
  const blob = await renderTicketImage(input)
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = `billet-fodium-${input.reference}.png`
  link.click()

  URL.revokeObjectURL(url)
}

/** La hauteur du billet, calculée sur la même grille que `drawBody`. */
function measureHeight(titleLines: number, hasShuttle: boolean): number {
  const header = PAD + 22 + 54
  const heading = titleLines * TITLE_LINE + 30
  const rows = ROW_HEIGHT * 2 + (hasShuttle ? SHUTTLE_BLOCK : 0)

  return header + heading + 44 + rows + 24 + BARCODE_HEIGHT + PAD
}

/**
 * La silhouette : rectangle aux angles adoucis, entaillé d'un disque à
 * mi-hauteur sur chaque flanc. Les disques sont retranchés par la règle
 * `evenodd`, comme les masques radiaux le font à l'écran.
 */
function clipToTicket(context: CanvasRenderingContext2D, height: number) {
  context.beginPath()
  context.roundRect(0, 0, WIDTH, height, RADIUS)
  context.moveTo(NOTCH, height / 2)
  context.arc(0, height / 2, NOTCH, 0, Math.PI * 2)
  context.moveTo(WIDTH + NOTCH, height / 2)
  context.arc(WIDTH, height / 2, NOTCH, 0, Math.PI * 2)
  context.clip('evenodd')
}

/** Talon illustré : l'affiche de l'événement, ou son tirage d'encres. */
function drawRail(
  context: CanvasRenderingContext2D,
  { event, reference }: TicketImageInput,
  poster: HTMLImageElement | null,
  height: number,
) {
  if (poster) {
    drawCover(context, poster, RAIL, height)
  } else {
    drawArtwork(context, event, height)
  }

  const veil = context.createLinearGradient(0, height - 120, 0, height)
  veil.addColorStop(0, 'rgba(0, 0, 0, 0)')
  veil.addColorStop(1, 'rgba(0, 0, 0, 0.78)')
  context.fillStyle = veil
  context.fillRect(0, height - 120, RAIL, 120)

  context.font = mono(20)
  context.fillStyle = '#ffffff'
  context.textAlign = 'center'
  context.fillText(`N°${reference.replace('FOD-', '')}`, RAIL / 2, height - 34)
  context.textAlign = 'left'

  dashedLine(context, RAIL, PAD / 2, RAIL, height - PAD / 2)
}

/** Le tirage d'encres des fiches sans photo, réduit à son sigle et sa date. */
function drawArtwork(context: CanvasRenderingContext2D, event: FodiumEvent, height: number) {
  const scheme = posterScheme(event)
  const badge = formatDateBadge(event.startsAt)

  context.fillStyle = scheme.paper
  context.fillRect(0, 0, RAIL, height)

  // Trame : des filets obliques, l'équivalent au canvas du motif SVG.
  context.save()
  context.strokeStyle = scheme.ink
  context.lineWidth = 14
  for (let x = -height; x < RAIL + height; x += 42) {
    context.beginPath()
    context.moveTo(x, 0)
    context.lineTo(x + height, height)
    context.stroke()
  }
  context.restore()

  context.textAlign = 'center'
  context.font = sans(58)
  context.fillStyle = scheme.type
  context.fillText(posterMonogram(event.title), RAIL / 2, height / 2)

  context.fillStyle = scheme.accent
  context.beginPath()
  context.roundRect(RAIL / 2 - 66, height / 2 + 24, 132, 40, 6)
  context.fill()

  context.font = mono(18)
  context.fillStyle = scheme.paper
  context.fillText(`${badge.day} ${badge.month}`, RAIL / 2, height / 2 + 51)
  context.textAlign = 'left'
}

/** Corps imprimé : mentions, titre, champs poinçonnés, code-barres. */
function drawBody(
  context: CanvasRenderingContext2D,
  { event, pickupPoint, reference, holder, quantity }: TicketImageInput,
  titleLines: string[],
  height: number,
) {
  const admits = String(quantity).padStart(2, '0')
  const columns = [BODY_X, BODY_X + COLUMN, BODY_X + COLUMN * 2] as const
  let y = PAD + 22

  context.font = mono(18)
  context.fillStyle = ink.muted
  context.fillText(pickupPoint ? 'BILLET + NAVETTE' : 'ENTRÉE SEULE', BODY_X, y)

  context.textAlign = 'right'
  context.fillStyle = ink.text
  context.fillText(`ADMET ${admits}`, WIDTH - PAD, y)
  context.textAlign = 'left'

  y += 54
  context.font = sans(46)
  context.fillStyle = ink.text
  for (const line of titleLines) {
    context.fillText(line, BODY_X, y)
    y += TITLE_LINE
  }

  context.font = mono(18)
  context.fillStyle = ink.muted
  context.fillText(fit(context, `${event.venue} · ${event.city}`.toUpperCase(), BODY_WIDTH), BODY_X, y)

  y += 30
  dashedLine(context, BODY_X, y, WIDTH - PAD, y)

  y += 44
  drawField(context, columns[0], y, 'DATE', formatTicketDate(event.startsAt))
  drawField(context, columns[1], y, 'HEURE', `${formatEventTime(event.startsAt)} GMT`)
  drawField(context, columns[2], y, 'PLACES', admits)

  y += ROW_HEIGHT
  drawField(context, columns[0], y, 'TITULAIRE', holder)
  drawField(context, columns[1], y, 'RÉFÉRENCE', reference)
  drawField(context, columns[2], y, 'STATUT', 'VALIDE', ink.tertiary)

  if (pickupPoint) {
    y += SHUTTLE_RULE
    dashedLine(context, BODY_X, y, WIDTH - PAD, y)
    y += 44
    drawField(context, columns[0], y, 'NAVETTE', pickupPoint.name)
    drawField(context, columns[1], y, 'ALLER', pickupPoint.departureTime)
    drawField(context, columns[2], y, 'SIÈGE', `N°${shuttleSeat(reference)}`, ink.primary)
  }

  const baseline = height - PAD
  dashedLine(context, BODY_X, baseline - BARCODE_HEIGHT, WIDTH - PAD, baseline - BARCODE_HEIGHT)

  context.font = mono(18)
  context.fillStyle = ink.tertiary
  context.textAlign = 'right'
  context.fillText('VÉRIFIÉ', WIDTH - PAD, baseline - 6)
  context.textAlign = 'left'

  drawBarcode(context, reference, BODY_X, baseline - 56, BODY_WIDTH - 140)
}

function drawField(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  label: string,
  value: string,
  color = ink.text,
) {
  context.font = mono(14)
  context.fillStyle = ink.muted
  context.fillText(label, x, y)

  context.font = mono(24)
  context.fillStyle = color
  context.fillText(fit(context, value.toUpperCase(), COLUMN - 20), x, y + 32)
}

function drawBarcode(
  context: CanvasRenderingContext2D,
  reference: string,
  x: number,
  y: number,
  maxWidth: number,
) {
  const bars = barcodePattern(reference)
  const unit = maxWidth / bars.reduce((total, width) => total + width + 1.6, 0)

  context.fillStyle = ink.text
  let cursor = x

  for (const width of bars) {
    context.fillRect(cursor, y, width * unit, 44)
    cursor += (width + 1.6) * unit
  }
}

function dashedLine(
  context: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
) {
  context.save()
  context.strokeStyle = ink.rule
  context.lineWidth = 2
  context.setLineDash([8, 8])
  context.beginPath()
  context.moveTo(x1, y1)
  context.lineTo(x2, y2)
  context.stroke()
  context.restore()
}

/** Recadre l'affiche dans le talon sans la déformer. */
function drawCover(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
) {
  const ratio = Math.max(width / image.width, height / image.height)
  const drawWidth = image.width * ratio
  const drawHeight = image.height * ratio

  context.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight)
}

/** Découpe un titre en lignes, sans dépasser le nombre de lignes admis. */
function wrapText(text: string, font: string, maxWidth: number, maxLines: number): string[] {
  const context = document.createElement('canvas').getContext('2d')
  if (!context) return [text]

  context.font = font
  const lines: string[] = []
  let current = ''

  for (const word of text.split(' ')) {
    const candidate = current ? `${current} ${word}` : word

    if (context.measureText(candidate).width <= maxWidth || !current) {
      current = candidate
      continue
    }

    if (lines.length === maxLines - 1) break

    lines.push(current)
    current = word
  }

  lines.push(fit(context, current, maxWidth))
  return lines
}

/** Tronque au caractère près, avec des points de suite. */
function fit(context: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  if (context.measureText(text).width <= maxWidth) return text

  let cut = text
  while (cut.length > 1 && context.measureText(`${cut}…`).width > maxWidth) {
    cut = cut.slice(0, -1)
  }

  return `${cut.trimEnd()}…`
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.decoding = 'async'
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error(`Affiche illisible : ${src}`))
    image.src = src
  })
}

function toBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Billet non encodé'))
    }, 'image/png')
  })
}
