import * as draw from '../libs/draw.js'

import {frag} from '../gl/fragment-shader-2d'
import {vert} from '../gl/vertex-shader-2d'
import {vert as vertTranslateGl} from '../gl/vertex-shader-translate-gl-2d'
import {vert as vertRotate2d} from '../gl/vertex-shader-rotate-2d'

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
    requestAnimationFrame: true,
    run(canvas, translation, rotation, color, width, height) {
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
    id: 'L2-2',
    name: 'Translation via shader',
    coordinates: true,
    webGlProps: null,
    vert: vertTranslateGl,
    frag,
    color: null,
    run(canvas, translation, rotation, color) {
      this.color = color
      this.webGlProps = draw.initScene(canvas, this.vert, this.frag)
      const drawOptions = {
        webGlProps: this.webGlProps,
        translation,
        rotation,
        color,
      }
      draw.translationSceneViaWebGL(drawOptions)
    },
    update(translation, rotation) {
      const drawOptions = {
        webGlProps: this.webGlProps,
        translation,
        rotation,
        color: this.color,
      }
      draw.drawSceneT2DGL(drawOptions)
    },
  },
  {
    id: 'L3',
    name: 'Rotation',
    coordinates: true,
    radialCoordinates: true,
    angleRange: true,
    webGlProps: null,
    vert: vertRotate2d,
    frag,
    color: null,
    run(canvas, translation, rotation, color) {
      this.color = color
      this.webGlProps = draw.initScene(canvas, this.vert, this.frag)
      const drawOptions = {
        webGlProps: this.webGlProps,
        translation,
        rotation,
        color,
      }
      draw.translationSceneViaWebGL(drawOptions)
    },
    update(translation, rotation) {
      const drawOptions = {
        webGlProps: this.webGlProps,
        translation,
        rotation,
        color: this.color,
      }
      draw.drawSceneT2DGL(drawOptions)
    },
  },
]
