<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch, type CSSProperties } from 'vue'
import { usePuzzle } from '../composables/usePuzzle'
import type { GridSpec, Tile } from '../types'
import { backgroundSize } from '../utils/grid'

const props = defineProps<{
  imageUrl: string
  grid: GridSpec
  /** Displayed side of one fragment, in CSS pixels. */
  tileSize: number
}>()

const emit = defineEmits<{ 'update:moves': [moves: number]; solved: [] }>()

const FLASH_DURATION = 500

const puzzle = usePuzzle(props.grid)
const boardEl = ref<HTMLElement | null>(null)
const flashing = ref(false)

/** Pointer drag in progress: the fragment follows the cursor or finger. */
const drag = ref<{ tileId: number; position: number; dx: number; dy: number } | null>(null)
let gesture: { pointerId: number; tileId: number; position: number; x: number; y: number } | null =
  null
let flashTimer: number | undefined

const gridBackgroundSize = computed(() => backgroundSize(props.grid.cols, props.grid.rows))

watch(puzzle.moves, (value) => emit('update:moves', value), { immediate: true })

watch(puzzle.solved, (isSolved) => {
  if (!isSolved) return
  flashing.value = true
  flashTimer = window.setTimeout(() => {
    flashing.value = false
  }, FLASH_DURATION)
  emit('solved')
})

onBeforeUnmount(() => window.clearTimeout(flashTimer))

function tileStyle(tile: Tile): CSSProperties {
  const position = puzzle.positionByTile.value[tile.id] ?? tile.id
  const col = position % props.grid.cols
  const row = Math.floor(position / props.grid.cols)
  const active = drag.value?.tileId === tile.id
  const x = col * props.tileSize + (active ? drag.value!.dx : 0)
  const y = row * props.tileSize + (active ? drag.value!.dy : 0)

  return {
    width: `${props.tileSize}px`,
    height: `${props.tileSize}px`,
    transform: `translate3d(${x}px, ${y}px, 0)${active ? ' scale(1.04)' : ''}`,
    backgroundImage: `url("${props.imageUrl}")`,
    backgroundSize: gridBackgroundSize.value,
    backgroundPosition: tile.backgroundPosition,
  }
}

function positionOfTile(tile: Tile): number {
  return puzzle.positionByTile.value[tile.id] ?? tile.id
}

/** Board position under the pointer, or null outside the mosaic. */
function positionAtPoint(clientX: number, clientY: number): number | null {
  const element = boardEl.value
  if (!element || props.tileSize <= 0) return null
  const rect = element.getBoundingClientRect()
  const col = Math.floor((clientX - rect.left) / props.tileSize)
  const row = Math.floor((clientY - rect.top) / props.tileSize)
  if (col < 0 || row < 0 || col >= props.grid.cols || row >= props.grid.rows) return null
  return row * props.grid.cols + col
}

function endGesture(): void {
  gesture = null
  drag.value = null
}

function onPointerDown(event: PointerEvent, tile: Tile): void {
  if (puzzle.solved.value || gesture || !event.isPrimary) return
  gesture = {
    pointerId: event.pointerId,
    tileId: tile.id,
    position: positionOfTile(tile),
    x: event.clientX,
    y: event.clientY,
  }
  ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
}

function onPointerMove(event: PointerEvent): void {
  if (!gesture || gesture.pointerId !== event.pointerId) return
  const dx = event.clientX - gesture.x
  const dy = event.clientY - gesture.y
  // Anything shorter than half a fragment stays a click, longer becomes a drag.
  const threshold = props.tileSize / 2
  if (!drag.value && Math.hypot(dx, dy) < threshold) return
  drag.value = { tileId: gesture.tileId, position: gesture.position, dx, dy }
}

function onPointerUp(event: PointerEvent): void {
  if (!gesture || gesture.pointerId !== event.pointerId) return
  const { position } = gesture
  const dragged = drag.value !== null
  endGesture()

  if (!dragged) {
    puzzle.selectPosition(position)
    return
  }

  const target = positionAtPoint(event.clientX, event.clientY)
  puzzle.clearSelection()
  if (target !== null) puzzle.swap(position, target)
}

function onPointerCancel(event: PointerEvent): void {
  if (gesture?.pointerId === event.pointerId) endGesture()
}

defineExpose({ moves: puzzle.moves, solved: puzzle.solved })
</script>

<template>
  <div
    ref="boardEl"
    class="board"
    :class="{ 'board--solved': puzzle.solved.value }"
    :style="{
      width: `${tileSize * grid.cols}px`,
      height: `${tileSize * grid.rows}px`,
    }"
  >
    <div
      v-for="tile in puzzle.tiles.value"
      :key="tile.id"
      class="tile"
      :class="{
        'tile--selected': puzzle.selectedPosition.value === positionOfTile(tile),
        'tile--dragging': drag?.tileId === tile.id,
      }"
      :style="tileStyle(tile)"
      role="button"
      :aria-label="`${tile.col + 1}, ${tile.row + 1}`"
      @pointerdown="onPointerDown($event, tile)"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerCancel"
      @contextmenu.prevent
    />

    <div v-if="flashing" class="board__flash" />
  </div>
</template>

<style scoped>
.board {
  position: relative;
  background: rgba(28, 28, 30, 0.04);
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
}

.tile {
  position: absolute;
  top: 0;
  left: 0;
  box-sizing: border-box;
  box-shadow: inset 0 0 0 0.5px rgba(255, 255, 255, 0.55);
  cursor: pointer;
  transition: transform 0.18s ease;
}

.tile--selected {
  z-index: 3;
  box-shadow: inset 0 0 0 2px var(--mosaic-ink);
}

.tile--dragging {
  z-index: 6;
  box-shadow: 0 10px 26px rgba(28, 28, 30, 0.32);
  cursor: grabbing;
  transition: none;
}

.board--solved .tile {
  box-shadow: none;
  cursor: default;
}

.board__flash {
  position: absolute;
  inset: 0;
  z-index: 8;
  background: var(--mosaic-accent);
  animation: mosaic-flash 500ms ease-out;
  pointer-events: none;
}

@keyframes mosaic-flash {
  0% {
    opacity: 0;
  }
  30% {
    opacity: 0.9;
  }
  100% {
    opacity: 0;
  }
}
</style>
