<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useBoardSize } from '../composables/useBoardSize'
import { useI18n } from '../i18n'
import type { GridSpec, PuzzleImage } from '../types'
import PuzzleBoard from './PuzzleBoard.vue'

const props = defineProps<{ image: PuzzleImage; grid: GridSpec }>()
const emit = defineEmits<{ exit: []; newGame: [] }>()

const REVEAL_DELAY = 500

const { locale, t } = useI18n()

const boardArea = ref<HTMLElement | null>(null)
const grid = computed(() => props.grid)
const { tileSize, boardWidth, boardHeight } = useBoardSize(boardArea, grid)

const moves = ref(0)
const solved = ref(false)
const showOriginal = ref(false)
/** After the winning flash the grid is replaced by the same cropped picture. */
const revealed = ref(false)
let revealTimer: number | undefined

const hasBoard = computed(() => tileSize.value > 0)

/** The framing of the crop used by the puzzle, as a single background. */
const croppedImageStyle = computed(() => ({
  width: `${boardWidth.value}px`,
  height: `${boardHeight.value}px`,
  backgroundImage: `url("${props.image.url}")`,
  backgroundSize: '100% 100%',
}))

function onSolved(): void {
  solved.value = true
  showOriginal.value = false
  revealTimer = window.setTimeout(() => {
    revealed.value = true
  }, REVEAL_DELAY)
}

watch(
  () => props.grid,
  () => {
    window.clearTimeout(revealTimer)
    moves.value = 0
    solved.value = false
    showOriginal.value = false
    revealed.value = false
  },
)

onBeforeUnmount(() => window.clearTimeout(revealTimer))
</script>

<template>
  <section class="game">
    <div class="game__bar">
      <span class="game__moves">{{ t('game.moves', { count: moves }) }}</span>
      <div class="game__actions">
        <v-btn
          variant="tonal"
          size="large"
          class="game__action"
          :disabled="solved"
          @click="showOriginal = !showOriginal"
        >
          <span class="game__action-label">
            {{ showOriginal ? t('game.hideOriginal') : t('game.showOriginal') }}
          </span>
        </v-btn>
        <v-btn variant="text" size="large" class="game__action" @click="emit('exit')">
          <span class="game__action-label">{{ t('exit') }}</span>
        </v-btn>
      </div>
    </div>

    <div ref="boardArea" class="game__area">
      <div v-if="hasBoard" class="game__stage">
        <PuzzleBoard
          v-show="!showOriginal && !revealed"
          :key="`${props.image.id}-${props.grid.minParts}`"
          :image-url="props.image.url"
          :grid="props.grid"
          :tile-size="tileSize"
          @update:moves="moves = $event"
          @solved="onSolved"
        />

        <div
          v-if="showOriginal || revealed"
          class="game__original"
          :style="croppedImageStyle"
          role="img"
          :aria-label="props.image.title[locale]"
        />
      </div>
    </div>

    <v-fade-transition>
      <div v-if="solved" class="game__win">
        <p class="game__win-title">{{ t('game.win') }}</p>
        <p class="game__win-moves">{{ t('game.winMoves', { count: moves }) }}</p>
        <v-btn
          color="primary"
          size="x-large"
          class="game__win-btn game__action"
          @click="emit('newGame')"
        >
          <span class="game__action-label">{{ t('game.newGame') }}</span>
        </v-btn>
      </div>
      <p v-else class="game__hint text-muted">{{ t('game.hint') }}</p>
    </v-fade-transition>
  </section>
</template>

<style scoped>
.game {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: clamp(6px, 1.2vh, 16px);
  min-height: 0;
}

.game__bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.game__moves {
  font-size: clamp(0.95rem, 2vw, 1.1rem);
  font-variant-numeric: tabular-nums;
}

.game__actions {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.game__action {
  min-width: 0;
}

.game__action :deep(.v-btn__content) {
  min-width: 0;
}

/* Long labels are cut instead of pushing the button off the screen. */
.game__action-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.game__area {
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  justify-content: center;
  min-height: 0;
  overflow: hidden;
}

.game__stage {
  position: relative;
}

.game__original {
  border-radius: 2px;
}

.game__win,
.game__hint {
  text-align: center;
}

.game__win {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.game__win-title {
  margin: 0;
  font-size: clamp(1.2rem, 3vw, 1.7rem);
  font-weight: 500;
}

.game__win-moves {
  margin: 0;
  color: var(--mosaic-muted);
}

.game__win-btn {
  margin-top: 6px;
  padding-inline: 28px;
}

.game__hint {
  margin: 0;
  font-size: 0.85rem;
}

@media (max-width: 599px) {
  .game__hint {
    display: none;
  }

  /* Narrow screens: exit sits centred above the original toggle. */
  .game__bar {
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }

  .game__actions {
    flex-direction: column-reverse;
    width: 100%;
    gap: 6px;
  }
}

@media (max-width: 419px) {
  .game__actions {
    align-items: stretch;
  }

  .game__action {
    width: 100%;
  }

  .game__win-btn {
    width: 100%;
  }
}
</style>
