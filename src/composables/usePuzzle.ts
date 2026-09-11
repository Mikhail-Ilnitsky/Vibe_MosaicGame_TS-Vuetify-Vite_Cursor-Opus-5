import { computed, ref, shallowRef } from 'vue'
import type { GridSpec } from '../types'
import { buildTiles, shuffleOrder } from '../utils/grid'

/**
 * Game state of one puzzle. `order` maps a board position to the fragment that
 * currently sits there, so shuffling never touches the fragment's background.
 */
export function usePuzzle(grid: GridSpec) {
  const tiles = shallowRef(buildTiles(grid))
  const tileCount = grid.cols * grid.rows
  const order = ref<number[]>(shuffleOrder(tileCount))
  const selectedPosition = ref<number | null>(null)
  const moves = ref(0)

  const positionByTile = computed(() => {
    const positions = new Array<number>(tileCount)
    order.value.forEach((tileId, position) => {
      positions[tileId] = position
    })
    return positions
  })

  const solved = computed(() => order.value.every((tileId, position) => tileId === position))

  function swap(from: number, to: number): void {
    if (from === to || solved.value) return
    const next = order.value.slice()
    ;[next[from], next[to]] = [next[to]!, next[from]!]
    order.value = next
    moves.value += 1
  }

  /** Click-click control: first tap selects, second tap swaps. */
  function selectPosition(position: number): void {
    if (solved.value) return
    const selected = selectedPosition.value
    if (selected === null) {
      selectedPosition.value = position
      return
    }
    selectedPosition.value = null
    if (selected !== position) swap(selected, position)
  }

  function clearSelection(): void {
    selectedPosition.value = null
  }

  return {
    tiles,
    tileCount,
    order,
    positionByTile,
    selectedPosition,
    moves,
    solved,
    swap,
    selectPosition,
    clearSelection,
  }
}
