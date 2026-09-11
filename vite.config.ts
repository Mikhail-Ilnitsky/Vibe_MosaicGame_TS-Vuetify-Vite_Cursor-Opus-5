import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const REPOSITORY_BASE = '/Vibe_MosaicGame_TS-Vuetify-Vite_Cursor-Opus-5/'

// Dev and local preview run from the site root, the GitHub Pages build lives in
// a repository subdirectory. BASE_PATH lets CI or a fork override the default.
export default defineConfig(({ command }) => ({
  base: process.env.BASE_PATH ?? (command === 'build' ? REPOSITORY_BASE : '/'),
  plugins: [vue()],
}))
