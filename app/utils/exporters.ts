/** Client-only export helpers. Both exports rasterise the ACTUAL on-screen DOM
 *  (via modern-screenshot) so the downloaded file matches the preview exactly.
 *  Heavy libs are dynamically imported so they only load on export. */

/** Trigger a browser download of a Blob without any print dialog. */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}

/** Never let a rasterise hang the UI forever. */
function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Export timed out — please try again')), ms),
    ),
  ])
}

/** Wait for self-hosted fonts so text rasterises in the right face. */
async function fontsReady() {
  if (document.fonts?.ready) {
    try {
      await withTimeout(document.fonts.ready, 4000)
    } catch {
      /* proceed with whatever is loaded */
    }
  }
}

/** Rasterise a DOM node to a PNG file — pixel-for-pixel what's on screen. */
export async function elementToPng(node: HTMLElement, filename: string, bg = '#f4ead7') {
  await fontsReady()
  const { domToBlob } = await import('modern-screenshot')
  const blob = await withTimeout(domToBlob(node, { scale: 2, backgroundColor: bg }), 20000)
  downloadBlob(blob, filename)
}

/**
 * Rasterise the summary DOM into a multi-page PDF. Rather than slicing the tall
 * image at fixed A4 heights (which cuts through rows), it reads the positions of
 * elements marked `[data-pdf-block]` and only ever cuts BETWEEN them — so no row,
 * heading or person block is ever split across a page boundary. A `[data-pdf-
 * heading]` is kept with the block that follows it. The PDF therefore matches the
 * preview and breaks cleanly.
 */
export async function elementToPdf(node: HTMLElement, filename: string) {
  await fontsReady()
  const scale = 2
  const { domToCanvas } = await import('modern-screenshot')
  const canvas = await withTimeout(domToCanvas(node, { scale, backgroundColor: '#fffdf7' }), 25000)

  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const pageWpt = doc.internal.pageSize.getWidth()
  const pageHpt = doc.internal.pageSize.getHeight()

  // uniform page margin — content is inset on every side of every page (so
  // continuation pages get a top margin too, not just page 1)
  const M = 32
  const contentWpt = pageWpt - 2 * M
  const availHpt = pageHpt - 2 * M

  const nodeRect = node.getBoundingClientRect()
  const pxToPt = contentWpt / nodeRect.width
  const pageHcss = availHpt / pxToPt // usable content height per page, in CSS px
  const totalCss = canvas.height / scale

  // breakable boundaries, top/bottom offsets within the node (CSS px)
  const blocks = [...node.querySelectorAll<HTMLElement>('[data-pdf-block]')]
    .map((el) => {
      const r = el.getBoundingClientRect()
      return {
        top: r.top - nodeRect.top,
        bottom: r.bottom - nodeRect.top,
        heading: el.hasAttribute('data-pdf-heading'),
      }
    })
    .filter((b) => b.bottom > b.top)
    .sort((a, b) => a.top - b.top)

  // choose page cut points that never fall inside a block
  const cuts = [0]
  let start = 0
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i]!
    if (b.bottom - start > pageHcss + 0.5) {
      let cut = b.top
      const prev = blocks[i - 1]
      if (prev && prev.heading && prev.top > start) cut = prev.top // keep heading with its block
      if (cut - start < 1) cut = start + pageHcss // a single block taller than a page → hard cut
      cut = Math.min(cut, start + pageHcss)
      if (cut > start + 1) {
        cuts.push(cut)
        start = cut
      }
    }
  }
  if (totalCss - cuts[cuts.length - 1]! > 1) cuts.push(totalCss)

  // render each segment onto its own page (JPEG keeps the file small)
  for (let p = 0; p < cuts.length - 1; p++) {
    const y0 = Math.max(0, Math.round(cuts[p]! * scale))
    const y1 = Math.min(canvas.height, Math.round(cuts[p + 1]! * scale))
    const h = y1 - y0
    if (h <= 0) continue

    const seg = document.createElement('canvas')
    seg.width = canvas.width
    seg.height = h
    const ctx = seg.getContext('2d')!
    ctx.fillStyle = '#fffdf7'
    ctx.fillRect(0, 0, seg.width, h)
    ctx.drawImage(canvas, 0, y0, canvas.width, h, 0, 0, canvas.width, h)

    const img = seg.toDataURL('image/jpeg', 0.92)
    const segHpt = (h / scale) * pxToPt
    if (p > 0) doc.addPage()
    // parchment fill so the margin band matches the content, then inset content
    doc.setFillColor(255, 253, 247)
    doc.rect(0, 0, pageWpt, pageHpt, 'F')
    doc.addImage(img, 'JPEG', M, M, contentWpt, segHpt)
  }

  doc.save(filename)
}
