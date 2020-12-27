import * as draw from '../libs/draw.js'

import {frag} from '../gl/fragment-shader-2d'
import {vert} from '../gl/vertex-shader-2d'
import {vert as vertTranslateGl} from '../gl/vertex-shader-translate-gl-2d'

export const animations = [
  {
    id: 'L1',
    name: 'Random rectangles',
    loop: true,
    vert,
    frag,
    run(canvas) {
      const webGlProps = draw.initScene(canvas, this.vert, this.frag)
      return setInterval(() => {
        draw.rectanglesScene(webGlProps)
      }, 1)
    },
  },

  {
    id: 'L1-2',
    name: '... with drums',
    loop: true,
    audio: true,
    vert,
    frag,
    run(canvas) {
      const webGlProps = draw.initScene(canvas, this.vert, this.frag)
      return setInterval(() => {
        draw.rectanglesScene(webGlProps)
      }, 1)
    },
  },
  {
    id: 'L2',
    name: 'Translation',
    coordinates: true,
    webGlProps: null,
    vert,
    frag,
    run(canvas, translation, color, width, height) {
      this.webGlProps = draw.initScene(canvas, this.vert, this.frag)
      draw.translationSceneViaDOM(
        this.webGlProps,
        translation,
        color,
        width,
        height,
      )
    },
    update(translation) {
      draw.drawScene(this.webGlProps, translation)
    },
  },
  {
    id: 'L3',
    name: 'Translation via shader',
    coordinates: true,
    webGlProps: null,
    vert: vertTranslateGl,
    frag,
    run(canvas, translation, color) {
      console.log('color')
      console.log(color)
      this.webGlProps = draw.initScene(canvas, this.vert, this.frag)
      draw.translationSceneViaWebGL(this.webGlProps, translation, color)
    },
    update(translation) {
      draw.drawScene(this.webGlProps, translation)
    },
  },
]
