import { computed, ref, watch } from 'vue'
import type { Locale } from '../types'
import { messages, type MessageKey } from './messages'

export const LOCALES: Locale[] = ['ru', 'en']

function detectLocale(): Locale {
  const languages = [navigator.language, ...(navigator.languages ?? [])]
  return languages.some((language) => language?.toLowerCase().includes('ru')) ? 'ru' : 'en'
}

const locale = ref<Locale>(detectLocale())

watch(
  locale,
  (value) => {
    document.documentElement.lang = value
    document.title = resolve(value, 'appTitle')
  },
  { immediate: true },
)

function resolve(currentLocale: Locale, key: MessageKey): string {
  const [section, leaf] = key.split('.') as [string, string | undefined]
  const bundle = messages[currentLocale] as Record<string, unknown>
  const value = leaf === undefined ? bundle[section] : (bundle[section] as Record<string, unknown>)[leaf]
  return typeof value === 'string' ? value : key
}

export function useI18n() {
  const t = (key: MessageKey, params?: Record<string, string | number>): string => {
    const template = resolve(locale.value, key)
    if (!params) return template
    return template.replace(/\{(\w+)\}/g, (match, name: string) =>
      name in params ? String(params[name]) : match,
    )
  }

  return {
    locale,
    isRu: computed(() => locale.value === 'ru'),
    t,
  }
}
