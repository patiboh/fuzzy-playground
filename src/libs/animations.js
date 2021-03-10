import * as draw from '../libs/draw.js'

import {frag} from '../gl/fragment-shader-2d'
import {vert} from '../gl/vertex-shader-2d'
import {vert as vertTranslateGl} from '../gl/vertex-shader-translate-gl-2d'
import {vert as vertRotate2d} from '../gl/vertex-shader-rotate-2d'
import {vert as vertScale2d} from '../gl/vertex-shader-scale-2d'

export const animations = [
  {
    id: 'L1',
    name: 'Random rectangles',
    loop: true,
    vert,
    frag,
    init(canvas) {
      this.webGlProps = draw.initScene(canvas, this.vert, this.frag)
    },
    run(canvas) {
      if (!this.webGlProps) {
        this.init(canvas)
      }
      draw.rectanglesScene(this.webGlProps)
    },
  },
  {
    id: 'L1-2',
    name: '... with drums',
    loop: true,
    audio: true,
    vert,
    frag,
    init(canvas) {
      this.webGlProps = draw.initScene(canvas, this.vert, this.frag)
    },
    run(canvas) {
      if (!this.webGlProps) {
        this.init(canvas)
      }
      draw.rectanglesScene(this.webGlProps)
    },
  },
  {
    id: 'L2',
    name: 'Translation',
    ui: ['position'],
    coordinates: true,
    webGlProps: null,
    vert,
    frag,
    requestAnimationFrame: true,
    init(canvas) {
      this.webGlProps = draw.initScene(canvas, this.vert, this.frag)
    },
    run(canvas, translation, rotation, scale, color, width, height) {
      if (!this.webGlProps) {
        this.init(canvas)
      }
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
    ui: ['position'],
    coordinates: true,
    webGlProps: null,
    vert: vertTranslateGl,
    frag,
    color: null,
    run(canvas, translation, rotation, scale, color) {
      this.color = color
      this.webGlProps = draw.initScene(canvas, this.vert, this.frag)
      const drawOptions = {
        webGlProps: this.webGlProps,
        translation,
        rotation,
        scale,
        color,
      }
      draw.translationSceneViaWebGL(drawOptions)
    },
    update(translation, rotation, scale) {
      const drawOptions = {
        webGlProps: this.webGlProps,
        translation,
        rotation,
        scale,
        color: this.color,
      }
      draw.drawSceneT2DGL(drawOptions)
    },
  },
  {
    id: 'L3',
    name: 'Rotation',
    ui: ['position', 'angle'],
    coordinates: true,
    radialCoordinates: true,
    rotation: true,
    webGlProps: null,
    vert: vertRotate2d,
    frag,
    color: null,
    run(canvas, translation, rotation, scale, color) {
      this.color = color
      this.webGlProps = draw.initScene(canvas, this.vert, this.frag)
      const drawOptions = {
        webGlProps: this.webGlProps,
        translation,
        rotation,
        scale,
        color,
      }
      draw.translationSceneViaWebGL(drawOptions)
    },
    update(translation, rotation, scale) {
      const drawOptions = {
        webGlProps: this.webGlProps,
        translation,
        rotation,
        scale,
        color: this.color,
      }
      draw.drawSceneT2DGL(drawOptions)
    },
  },
  {
    id: 'L4',
    name: 'Scale',
    ui: ['position', 'angle', 'scale'],
    coordinates: true,
    rotation: true,
    scale: true,
    webGlProps: null,
    vert: vertScale2d,
    frag,
    color: null,
    run(canvas, translation, rotation, scale, color) {
      this.color = color
      this.webGlProps = draw.initScene(canvas, this.vert, this.frag)
      const drawOptions = {
        webGlProps: this.webGlProps,
        translation,
        rotation,
        scale,
        color,
      }
      draw.translationSceneViaWebGL(drawOptions)
    },
    update(translation, rotation, scale) {
      const drawOptions = {
        webGlProps: this.webGlProps,
        translation,
        rotation,
        scale,
        color: this.color,
      }
      draw.drawSceneT2DGL(drawOptions)
    },
  },
]
