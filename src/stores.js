import {writable, derived} from 'svelte/store'

import * as constants from './types/constants.js'

export const uiState = writable(constants.uiState.DEFAULT)
export const emojiFeedback = derived(uiState, ($uiState) =>
  $uiState === constants.uiState.ACTIVE
    ? constants.emojis.confetti
    : constants.emojis.error,
)
