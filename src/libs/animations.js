import * as draw from '../libs/draw.js'

export const animations = [
  {
    id: 'L1',
    name: 'Random rectangles',
    loop: true,
    run(canvas) {
      const webGlProps = draw.initScene(canvas)
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
    run(canvas) {
      const webGlProps = draw.initScene(canvas)
      return setInterval(() => {
        draw.rectanglesScene(webGlProps)
      }, 1)
    },
  },
  {
    id: 'L2',
    name: 'Translation',
    coordinates: true,
    run(canvas, translation, color, width, height) {
      const webGlProps = draw.initScene(canvas)
      draw.translationSceneViaDOM(webGlProps, translation, color, width, height)
    },
  },
  // {
  //   id: 'L3',
  //   name: 'Translation via shader',
  //   coordinates: true,
  //   run(canvas, translation) {
  //     const webGlProps = draw.initScene(canvas)
  //     draw.translationSceneViaWebGL(webGlProps, translation)
  //   },
  // },
]
