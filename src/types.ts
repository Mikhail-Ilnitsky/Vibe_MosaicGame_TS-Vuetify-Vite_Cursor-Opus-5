export type Locale = 'ru' | 'en'

export type Orientation = 'landscape' | 'portrait' | 'square'

export interface PuzzleImage {
  id: string
  url: string
  orientation: Orientation
  title: Record<Locale, string>
}

export type ScreenName = 'gallery' | 'difficulty' | 'game'

/** Result of slicing an image into strictly square fragments. */
export interface GridSpec {
  /** Number of parts along the shorter side of the image (5..11). */
  minParts: number
  cols: number
  rows: number
  /** Fragment side in source pixels. */
  tileSize: number
  /** Size of the centred crop of the source image, in source pixels. */
  cropWidth: number
  cropHeight: number
}

/** A fragment of the mosaic: its place in the solved picture stays with the tile. */
export interface Tile {
  id: number
  col: number
  row: number
  backgroundPosition: string
}
