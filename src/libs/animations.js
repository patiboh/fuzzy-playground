import * as draw from '../libs/draw.js'

export const types = {
  interval: 'interval',
  test: 'test',
  coordinates: 'coordinates',
}

export const animations = [
  {
    id: 'L1',
    name: 'Random rectangles',
    type: 'interval',
    run(canvas) {
      const webGlProps = draw.initScene(canvas)
      return setInterval(() => {
        draw.rectanglesScene(webGlProps)
      }, 1)
    },
  },
  // {
  //   id: 'L1-2',
  //   name: '... with drums',
  //   hasInterval: true,
  //   hasAudio: true,
  //   run(canvas) {
  //     const webGlProps = draw.initScene(canvas)
  //     return setInterval(() => {
  //       draw.rectanglesScene(webGlProps)
  //     }, 1)
  //   },
  // },
  {
    id: 'L2',
    name: 'Translation',
    type: 'coordinates',
    run(canvas, translation, color, width, height) {
      const webGlProps = draw.initScene(canvas)
      draw.translationSceneViaDOM(webGlProps, translation, color, width, height)
    },
  },
  // {
  //   id: 'L3',
  //   name: 'Translation via shader',
  //   hasCoordinates: true,
  //   run(canvas, translation) {
  //     const webGlProps = draw.initScene(canvas)
  //     draw.translationSceneViaWebGL(webGlProps, translation)
  //   },
  // },
  // {
  //   id: 'test-poop',
  //   name: 'Error',
  //   type: 'test',
  //   run() {
  //     throw Error('Test 💩')
  //   },
  // },
]
