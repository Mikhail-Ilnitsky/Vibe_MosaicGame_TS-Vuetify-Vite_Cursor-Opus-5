<script setup lang="ts">
import { ref } from 'vue'
import DifficultyScreen from './components/DifficultyScreen.vue'
import GalleryScreen from './components/GalleryScreen.vue'
import GameScreen from './components/GameScreen.vue'
import LanguageSwitcher from './components/LanguageSwitcher.vue'
import { useI18n } from './i18n'
import type { GridSpec, PuzzleImage, ScreenName } from './types'

const { t } = useI18n()

const screen = ref<ScreenName>('gallery')
const image = ref<PuzzleImage | null>(null)
const grid = ref<GridSpec | null>(null)

function openDifficulty(selected: PuzzleImage): void {
  image.value = selected
  grid.value = null
  screen.value = 'difficulty'
}

function startGame(selected: GridSpec): void {
  grid.value = selected
  screen.value = 'game'
}

/** Both the exit button and the win screen go straight back to the gallery. */
function backToGallery(): void {
  image.value = null
  grid.value = null
  screen.value = 'gallery'
}
</script>

<template>
  <v-app>
    <v-main>
      <div class="app-screen">
        <header class="app-header">
          <div>
            <h1 class="app-header__title">{{ t('appTitle') }}</h1>
            <p class="app-header__subtitle">{{ t('appSubtitle') }}</p>
          </div>
          <LanguageSwitcher />
        </header>

        <GalleryScreen v-if="screen === 'gallery'" @select="openDifficulty" />

        <DifficultyScreen
          v-else-if="screen === 'difficulty' && image"
          :image="image"
          @start="startGame"
          @exit="backToGallery"
        />

        <GameScreen
          v-else-if="screen === 'game' && image && grid"
          :image="image"
          :grid="grid"
          @exit="backToGallery"
          @new-game="backToGallery"
        />
      </div>
    </v-main>
  </v-app>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  min-width: 0;
}

.app-header__title {
  margin: 0;
  font-size: clamp(1.25rem, 3vw, 1.9rem);
  font-weight: 300;
  letter-spacing: 0.02em;
}

.app-header__subtitle {
  margin: 2px 0 0;
  color: var(--mosaic-muted);
  font-size: clamp(0.75rem, 1.7vw, 0.9rem);
}

@media (max-width: 599px) {
  .app-header__subtitle {
    display: none;
  }

  /* Narrow screens: the language switch moves under the game title. */
  .app-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}

@media (max-width: 419px) {
  .app-header {
    align-items: stretch;
  }
}
</style>
