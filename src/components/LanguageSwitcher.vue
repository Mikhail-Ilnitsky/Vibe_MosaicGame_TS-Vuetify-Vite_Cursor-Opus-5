<script setup lang="ts">
import { useI18n } from '../i18n'
import type { Locale } from '../types'

const { locale, t } = useI18n()

function setLocale(value: Locale): void {
  locale.value = value
}
</script>

<template>
  <v-btn-toggle
    :model-value="locale"
    mandatory
    divided
    density="comfortable"
    variant="outlined"
    rounded="lg"
    class="language-switcher"
    :aria-label="t('language')"
    @update:model-value="setLocale($event as Locale)"
  >
    <v-btn value="ru" size="small">RU</v-btn>
    <v-btn value="en" size="small">EN</v-btn>
  </v-btn-toggle>
</template>

<style scoped>
.language-switcher {
  flex: 0 0 auto;
  border-color: var(--mosaic-line);
}

.language-switcher :deep(.v-btn) {
  letter-spacing: 0.08em;
  font-weight: 500;
  min-width: 52px;
}

/* Very narrow screens: the switch spans the full width, halves for RU and EN. */
@media (max-width: 419px) {
  .language-switcher {
    width: 100%;
  }

  .language-switcher :deep(.v-btn) {
    flex: 1 1 0;
    min-width: 0;
  }
}
</style>
