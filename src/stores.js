import {writable, derived, readable} from 'svelte/store'

import * as constants from './types/constants.js'
import * as draw from './libs/draw.js'

export const uiState = writable(constants.uiState.DEFAULT)

export const emojiFeedback = derived(uiState, ($uiState) => {
  return constants.emojis[$uiState] ? constants.emojis[$uiState] : []
})

// Use small cursor only for now
export const currentCursor = derived(uiState, ($uiState) => {
  if (Object.keys(constants.emojis.animate).includes($uiState)) {
    return constants.cursor[$uiState]
  }
})

const _animations = [
  {
    id: 'L1',
    name: 'Random rectangles',
    hasInterval: true,
    run(canvas) {
      const webGlProps = draw.initScene(canvas)
      const interval = setInterval(() => {
        draw.rectanglesScene(webGlProps)
      }, 1)

      return function stop() {
        clearInterval(interval)
      }
    },
  },
  {
    id: 'L1-2',
    name: '... with drums',
    hasInterval: true,
    hasAudio: true,
    run(canvas) {
      const webGlProps = draw.initScene(canvas)
      const interval = setInterval(() => {
        draw.rectanglesScene(webGlProps)
      }, 1)

      return function stop() {
        clearInterval(interval)
      }
    },
  },
  {
    id: 'L2',
    name: 'Translation',
    hasCoordinates: true,
    run(canvas, translation, color, width, height) {
      const webGlProps = draw.initScene(canvas)
      draw.translationSceneViaDOM(webGlProps, translation, color, width, height)
    },
  },
  {
    id: 'L3',
    name: 'Translation via shader',
    hasCoordinates: true,
    run(canvas, translation) {
      const webGlProps = draw.initScene(canvas)
      draw.translationSceneViaWebGL(webGlProps, translation)
    },
  },
]

export const animations = readable(_animations)

export const currentAnimationId = writable('L1')
