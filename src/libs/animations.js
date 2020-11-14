import * as draw from '../libs/draw.js'

export const animations = [
  {
    id: 'L1',
    name: 'Random rectangles',
    animationFrame: null,
    webGlProps: null,
    interval: null,
    run(canvas) {
      this.webGlProps = draw.initScene(canvas)
      this.interval = setInterval(() => {
        draw.rectanglesScene(this.webGlProps)
      }, 1)
      this.animationFrame = requestAnimationFrame(this.run)
    },
    draw(canvas) {},
    stop() {
      clearInterval(this.interval)
      cancelAnimationFrame(this.animationFrame)
    },
  },

  {
    id: 'L1-2',
    name: '... with drums',
    loop: true,
    audio: true,
    animationFrame: null,
    run(canvas) {
      const webGlProps = draw.initScene(canvas)
      draw.rectanglesScene(webGlProps)
      this.animationFrame = requestAnimationFrame(this.run)
    },
    stop() {
      clearInterval(this.interval)
      cancelAnimationFrame(this.animationFrame)
    },
  },
  {
    id: 'L2',
    name: 'Translation',
    coordinates: true,
    animationFrame: null,
    run(canvas, translation, color, width, height) {
      const webGlProps = draw.initScene(canvas)
      draw.translationSceneViaDOM(webGlProps, translation, color, width, height)
      this.animationFrame = requestAnimationFrame(this.run)
    },
    stop() {
      clearInterval(this.interval)
      cancelAnimationFrame(this.animationFrame)
    },
  },

  {
    id: 'L3',
    name: 'Translation via shader',
    coordinates: true,
    animationFrame: null,
    run(canvas, translation) {
      const webGlProps = draw.initScene(canvas)
      draw.translationSceneViaWebGL(webGlProps, translation)
      this.animationFrame = requestAnimationFrame(this.run)
    },
    stop() {
      clearInterval(this.interval)
      cancelAnimationFrame(this.animationFrame)
    },
  },
]
