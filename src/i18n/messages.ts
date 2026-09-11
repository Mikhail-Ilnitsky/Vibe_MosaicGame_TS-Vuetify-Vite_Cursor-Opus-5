import type { Locale } from '../types'

const ru = {
  appTitle: 'Игра-мозаика',
  appSubtitle: 'Соберите картинку из квадратных фрагментов',
  language: 'Язык',
  exit: 'Выход',
  gallery: {
    title: 'Выберите картинку',
  },
  difficulty: {
    title: 'Выберите сложность',
    subtitle: 'Картинка: {title}',
    loading: 'Загружаем картинку…',
    error: 'Не удалось загрузить картинку. Проверьте соединение и попробуйте снова.',
    retry: 'Повторить',
    tiles: '{count} фрагментов',
    parts: '{count} по меньшей стороне',
  },
  game: {
    moves: 'Ходы: {count}',
    showOriginal: 'Показать оригинал',
    hideOriginal: 'Скрыть оригинал',
    hint: 'Клик по двум фрагментам или перетаскивание меняет их местами',
    win: 'У вас получилось!',
    winMoves: 'Ходов: {count}',
    newGame: 'Начать новую игру',
  },
}

type Messages = typeof ru

const en: Messages = {
  appTitle: 'Mosaic Game',
  appSubtitle: 'Restore the picture from square fragments',
  language: 'Language',
  exit: 'Exit',
  gallery: {
    title: 'Choose a picture',
  },
  difficulty: {
    title: 'Choose difficulty',
    subtitle: 'Picture: {title}',
    loading: 'Loading the picture…',
    error: 'Could not load the picture. Check your connection and try again.',
    retry: 'Retry',
    tiles: '{count} fragments',
    parts: '{count} along the shorter side',
  },
  game: {
    moves: 'Moves: {count}',
    showOriginal: 'Show original',
    hideOriginal: 'Hide original',
    hint: 'Click two fragments or drag one onto another to swap them',
    win: 'You did it!',
    winMoves: 'Moves: {count}',
    newGame: 'Start a new game',
  },
}

export const messages: Record<Locale, Messages> = { ru, en }

/** Dot-separated paths of all leaf (string) message keys. */
export type MessageKey =
  | {
      [Section in keyof Messages]: Messages[Section] extends string
        ? Section
        : `${Section & string}.${keyof Messages[Section] & string}`
    }[keyof Messages]
