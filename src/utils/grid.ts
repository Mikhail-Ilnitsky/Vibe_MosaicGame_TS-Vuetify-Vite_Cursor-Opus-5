import type { GridSpec, Tile } from '../types'

export const MIN_PARTS = 5
export const MAX_PARTS = 11

export const PARTS_OPTIONS: number[] = Array.from(
  { length: MAX_PARTS - MIN_PARTS + 1 },
  (_, index) => MIN_PARTS + index,
)

/**
 * Splits an image into strictly square fragments: the shorter side is always cut
 * into `minParts` pieces, the longer side takes as many whole fragments as fit.
 * The remainder of the source is cropped, the grid stays centred on the picture.
 */
export function computeGrid(
  naturalWidth: number,
  naturalHeight: number,
  minParts: number,
): GridSpec | null {
  if (naturalWidth <= 0 || naturalHeight <= 0) return null

  const shorterSide = Math.min(naturalWidth, naturalHeight)
  const longerSide = Math.max(naturalWidth, naturalHeight)
  const tileSize = Math.floor(shorterSide / minParts)
  if (tileSize < 1) return null

  const longerParts = Math.floor(longerSide / tileSize)
  const isPortrait = naturalWidth <= naturalHeight
  const cols = isPortrait ? minParts : longerParts
  const rows = isPortrait ? longerParts : minParts

  return {
    minParts,
    cols,
    rows,
    tileSize,
    cropWidth: cols * tileSize,
    cropHeight: rows * tileSize,
  }
}

export function availableGrids(naturalWidth: number, naturalHeight: number): GridSpec[] {
  return PARTS_OPTIONS.map((parts) => computeGrid(naturalWidth, naturalHeight, parts)).filter(
    (grid): grid is GridSpec => grid !== null,
  )
}

/**
 * Percentage offset of a fragment inside a background scaled to the whole grid.
 * With `background-size: cols*100% rows*100%` the position percentage maps the
 * fragment at (col, row) of the solved picture onto the element exactly.
 */
export function backgroundPosition(col: number, row: number, cols: number, rows: number): string {
  const x = cols > 1 ? (col / (cols - 1)) * 100 : 0
  const y = rows > 1 ? (row / (rows - 1)) * 100 : 0
  return `${x}% ${y}%`
}

export function backgroundSize(cols: number, rows: number): string {
  return `${cols * 100}% ${rows * 100}%`
}

/** Fragments in solved order; each one keeps its own background offset forever. */
export function buildTiles(grid: GridSpec): Tile[] {
  const tiles: Tile[] = []
  for (let row = 0; row < grid.rows; row += 1) {
    for (let col = 0; col < grid.cols; col += 1) {
      tiles.push({
        id: row * grid.cols + col,
        col,
        row,
        backgroundPosition: backgroundPosition(col, row, grid.cols, grid.rows),
      })
    }
  }
  return tiles
}

/** `count` random pair swaps for a puzzle of `count` tiles, never leaving it solved. */
export function shuffleOrder(count: number): number[] {
  if (count < 2) return [0]

  for (let attempt = 0; attempt < 20; attempt += 1) {
    const order = Array.from({ length: count }, (_, index) => index)
    for (let swap = 0; swap < count; swap += 1) {
      const a = Math.floor(Math.random() * count)
      const b = Math.floor(Math.random() * count)
      ;[order[a], order[b]] = [order[b]!, order[a]!]
    }
    if (order.some((tileId, position) => tileId !== position)) return order
  }

  const fallback = Array.from({ length: count }, (_, index) => index)
  ;[fallback[0], fallback[1]] = [fallback[1]!, fallback[0]!]
  return fallback
}
