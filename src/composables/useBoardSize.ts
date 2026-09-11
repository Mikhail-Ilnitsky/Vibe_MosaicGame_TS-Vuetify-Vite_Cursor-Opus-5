import { computed, onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'
import type { GridSpec } from '../types'

/**
 * Fits the mosaic into the area left by the header and controls: the board keeps
 * square fragments, never scrolls and is never upscaled above the 1:1 crop.
 */
export function useBoardSize(host: Ref<HTMLElement | null>, grid: Ref<GridSpec | null>) {
  const available = ref({ width: 0, height: 0 })
  let observer: ResizeObserver | null = null

  function measure(): void {
    const element = host.value
    if (!element) return
    available.value = { width: element.clientWidth, height: element.clientHeight }
  }

  function observe(element: HTMLElement | null): void {
    observer?.disconnect()
    if (!element) return
    observer = new ResizeObserver(measure)
    observer.observe(element)
    measure()
  }

  onMounted(() => observe(host.value))
  watch(host, (element) => observe(element))
  onBeforeUnmount(() => observer?.disconnect())

  const tileSize = computed(() => {
    const spec = grid.value
    const { width, height } = available.value
    if (!spec || width <= 0 || height <= 0) return 0
    const fitted = Math.min(width / spec.cols, height / spec.rows, spec.tileSize)
    // Whole pixels keep the seams between fragments even and crisp.
    return Math.max(1, Math.floor(fitted))
  })

  return {
    tileSize,
    boardWidth: computed(() => tileSize.value * (grid.value?.cols ?? 0)),
    boardHeight: computed(() => tileSize.value * (grid.value?.rows ?? 0)),
    remeasure: measure,
  }
}
