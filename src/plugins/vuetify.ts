import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import {
  VApp,
  VBtn,
  VBtnToggle,
  VFadeTransition,
  VMain,
  VProgressCircular,
  VSheet,
} from 'vuetify/components'
import { Ripple } from 'vuetify/directives'

// Components are imported explicitly instead of globally, so the bundle only
// carries what the game actually renders.
export const vuetify = createVuetify({
  components: { VApp, VBtn, VBtnToggle, VFadeTransition, VMain, VProgressCircular, VSheet },
  directives: { Ripple },
  theme: {
    defaultTheme: 'mosaic',
    themes: {
      mosaic: {
        dark: false,
        colors: {
          background: '#ffffff',
          surface: '#ffffff',
          primary: '#1c1c1e',
          secondary: '#6b7280',
        },
      },
    },
  },
  defaults: {
    VBtn: {
      rounded: 'lg',
      variant: 'flat',
      elevation: 0,
    },
  },
})
