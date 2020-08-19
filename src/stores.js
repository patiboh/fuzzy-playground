import {writable, derived} from 'svelte/store'

import * as constants from './types/constants.js'

export const uiState = writable(constants.uiState.DEFAULT)
export const feedbackEmoji = derived(uiState, ($uiState) =>
  $uiState === constants.uiState.SUCCESS
    ? constants.emojis.confetti
    : constants.emojis.error,
)
export const splashEmoji = derived(uiState, ($uiState) =>
  $uiState === constants.uiState.SUCCESS
    ? constants.emojis.confetti
    : constants.emojis.error,
)

// Use small cursor only for now
export const generateCursor = derived(uiState, ($uiState) => {
  const emoji = constants.emojis.animate[$uiState]
  return constants.customCursor[constants.size.SM].replace('REPL', emoji)
})
