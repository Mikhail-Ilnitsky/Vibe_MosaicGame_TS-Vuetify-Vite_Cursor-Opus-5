<script setup lang="ts">
import { IMAGES } from '../data/images'
import { useI18n } from '../i18n'
import type { PuzzleImage } from '../types'

const emit = defineEmits<{ select: [image: PuzzleImage] }>()

const { locale, t } = useI18n()
</script>

<template>
  <section class="gallery">
    <h2 class="screen-title">{{ t('gallery.title') }}</h2>

    <div class="gallery__grid">
      <button
        v-for="image in IMAGES"
        :key="image.id"
        type="button"
        class="thumb"
        @click="emit('select', image)"
      >
        <img class="thumb__image" :src="image.url" :alt="image.title[locale]" loading="lazy" />
        <span class="thumb__caption">{{ image.title[locale] }}</span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.gallery {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: clamp(10px, 2vh, 24px);
  min-height: 0;
}

.gallery__grid {
  --thumb-height: clamp(96px, 24vh, 240px);
  display: flex;
  flex: 1 1 auto;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
  gap: clamp(14px, 2.4vw, 34px);
  min-height: 0;
  overflow-y: auto;
  padding: 4px;
}

.thumb {
  position: relative;
  display: flex;
  flex: 0 1 auto;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 0;
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  cursor: pointer;
}

.thumb__image {
  width: auto;
  height: var(--thumb-height);
  max-width: 100%;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 2px 18px rgba(28, 28, 30, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.thumb__caption {
  color: var(--mosaic-muted);
  font-size: 0.9rem;
  text-align: center;
}

/* Pointer devices: the title appears over the thumbnail on hover.
   Touch screens and narrow windows keep it visible under the thumbnail. */
@media (hover: hover) and (min-width: 600px) {
  .thumb__caption {
    position: absolute;
    bottom: 10px;
    left: 50%;
    padding: 4px 12px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.92);
    color: var(--mosaic-ink);
    opacity: 0;
    transform: translateX(-50%);
    transition: opacity 0.2s ease;
    pointer-events: none;
  }

  .thumb:hover .thumb__caption,
  .thumb:focus-visible .thumb__caption {
    opacity: 1;
  }

  .thumb:hover .thumb__image {
    transform: translateY(-3px);
    box-shadow: 0 8px 26px rgba(28, 28, 30, 0.16);
  }
}

/* Phones: thumbnails take the full width and scale down to fit it entirely. */
@media (max-width: 599px) {
  .gallery__grid {
    align-content: start;
  }

  .thumb {
    flex: 1 1 100%;
  }

  .thumb__image {
    width: 100%;
    height: auto;
    max-height: var(--thumb-height);
  }
}
</style>
