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
  border-color: var(--mosaic-line);
}

.language-switcher :deep(.v-btn) {
  letter-spacing: 0.08em;
  font-weight: 500;
  min-width: 52px;
}
</style>
