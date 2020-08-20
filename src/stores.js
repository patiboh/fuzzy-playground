import {writable, derived} from 'svelte/store'

import * as constants from './types/constants.js'

export const uiState = writable(constants.uiState.DEFAULT)

export const feedbackEmoji = derived(uiState, ($uiState) => {
  return constants.emojis[$uiState] ? constants.emojis[$uiState] : []
})

// Use small cursor only for now
export const generateCursor = derived(uiState, ($uiState) => {
  if (Object.keys(constants.emojis.animate).includes($uiState)) {
    const emoji = constants.emojis.animate[$uiState]
    return constants.customCursor[constants.size.SM].replace('REPL', emoji)
  }
})
