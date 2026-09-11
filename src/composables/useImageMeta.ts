import { ref, watch, type Ref } from 'vue'

export interface ImageMeta {
  width: number
  height: number
}

/** Loads an image just to learn its natural size; needed before slicing the grid. */
export function useImageMeta(url: Ref<string>) {
  const meta = ref<ImageMeta | null>(null)
  const loading = ref(false)
  const failed = ref(false)
  let attempt = 0

  function load(): void {
    const current = ++attempt
    const source = url.value
    meta.value = null
    failed.value = false
    if (!source) {
      loading.value = false
      return
    }

    loading.value = true
    const image = new Image()
    image.onload = () => {
      if (current !== attempt) return
      meta.value = { width: image.naturalWidth, height: image.naturalHeight }
      loading.value = false
    }
    image.onerror = () => {
      if (current !== attempt) return
      failed.value = true
      loading.value = false
    }
    image.src = source
  }

  watch(url, load, { immediate: true })

  return { meta, loading, failed, reload: load }
}
