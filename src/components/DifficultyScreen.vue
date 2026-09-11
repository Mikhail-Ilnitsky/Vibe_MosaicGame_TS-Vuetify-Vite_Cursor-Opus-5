<script setup lang="ts">
import { computed, toRef } from 'vue'
import { useImageMeta } from '../composables/useImageMeta'
import { useI18n } from '../i18n'
import type { GridSpec, PuzzleImage } from '../types'
import { availableGrids } from '../utils/grid'

const props = defineProps<{ image: PuzzleImage }>()
const emit = defineEmits<{ start: [grid: GridSpec]; exit: [] }>()

const { locale, t } = useI18n()
const { meta, loading, failed, reload } = useImageMeta(toRef(() => props.image.url))

const grids = computed(() =>
  meta.value ? availableGrids(meta.value.width, meta.value.height) : [],
)
</script>

<template>
  <section class="difficulty">
    <div class="difficulty__head">
      <div>
        <h2 class="screen-title">{{ t('difficulty.title') }}</h2>
        <p class="screen-subtitle">
          {{ t('difficulty.subtitle', { title: props.image.title[locale] }) }}
        </p>
      </div>
      <v-btn variant="text" size="large" @click="emit('exit')">{{ t('exit') }}</v-btn>
    </div>

    <div class="difficulty__body">
      <div v-if="loading" class="difficulty__status">
        <v-progress-circular indeterminate color="primary" size="32" width="2" />
        <span class="text-muted">{{ t('difficulty.loading') }}</span>
      </div>

      <div v-else-if="failed" class="difficulty__status">
        <span class="text-muted">{{ t('difficulty.error') }}</span>
        <v-btn variant="tonal" size="large" @click="reload()">{{ t('difficulty.retry') }}</v-btn>
      </div>

      <div v-else class="difficulty__choice">
        <img
          class="difficulty__preview"
          :src="props.image.url"
          :alt="props.image.title[locale]"
        />
        <div class="difficulty__options">
          <v-btn
            v-for="grid in grids"
            :key="grid.minParts"
            class="difficulty__option"
            variant="outlined"
            size="x-large"
            @click="emit('start', grid)"
          >
            <span class="difficulty__option-grid">{{ grid.cols }} × {{ grid.rows }}</span>
            <span class="difficulty__option-hint">
              {{ t('difficulty.tiles', { count: grid.cols * grid.rows }) }}
            </span>
          </v-btn>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.difficulty {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: clamp(10px, 2vh, 24px);
  min-height: 0;
}

.difficulty__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.difficulty__body {
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  justify-content: center;
  min-height: 0;
  overflow-y: auto;
}

.difficulty__status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}

.difficulty__choice {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(16px, 3vh, 34px);
  min-height: 0;
}

.difficulty__preview {
  max-width: min(100%, 420px);
  max-height: 26vh;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 2px 18px rgba(28, 28, 30, 0.1);
}

.difficulty__options {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: clamp(12px, 1.8vw, 22px);
  max-width: 760px;
}

.difficulty__option {
  display: flex;
  flex-direction: column;
  height: auto;
  min-width: 132px;
  padding: 16px 22px;
  border-color: var(--mosaic-line);
  text-transform: none;
}

.difficulty__option :deep(.v-btn__content) {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.difficulty__option-grid {
  font-size: 1.25rem;
  font-weight: 500;
  letter-spacing: 0.02em;
}

.difficulty__option-hint {
  color: var(--mosaic-muted);
  font-size: 0.78rem;
  letter-spacing: 0.01em;
}
</style>
