// @ts-check
/**
 ***********************
 * HELPER FUNCTIONS
 ***********************
 */

const customCursor = {
  LG:
    'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="120" style="font-size: 100px;"><text y="100">REPL</text></svg>\'), auto',
  SM:
    'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="50" height="60" style="font-size: 40px;"><text y="40">REPL</text></svg>\'), auto',
}

/**
 * Canvas, like Images, has 2 sizes
 * - Size the canvas is displayed: set with CSS
 * - Number of pixels displayed inside the canvas
 * @param {HTMLCanvasElement} canvas
 */
export function resize(canvas) {
  // Get the size that the browser is displaying the canvas
  const displayWidth = canvas.clientWidth
  const displayHeight = canvas.clientHeight

  // Check if the canvas is the same size
  if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
    // If not, make it the same
    canvas.width = displayWidth
    canvas.height = displayHeight
  }
}

/**
 * Use with caution, as this makes the WebGL program draw more pixels
 * -> it might be better to let the GPU take over
 * @param {WebGLRenderingContext} gl
 */
export function resizeHD(gl) {
  const realToCSSPixels = window.devicePixelRatio
  const canvas = /** @type {HTMLCanvasElement} */ (gl.canvas)

  // - Get the size that the browser is displaying the canvas in CSS pixels
  // - Compute the size needed to make the drawing buffer match it in device pixels
  const displayWidth = Math.floor(canvas.clientWidth * realToCSSPixels)
  const displayHeight = Math.floor(canvas.clientHeight * realToCSSPixels)

  // Check if the canvas is the same size
  if (gl.canvas.width !== displayWidth || gl.canvas.height !== displayHeight) {
    // If not, make it the same
    gl.canvas.width = displayWidth
    gl.canvas.height = displayHeight
  }
}

// Returns a random integer from 0 to range - 1.
export function randomInt(range) {
  return Math.floor(Math.random() * range)
}

export function updateCursor(htmlElement, emoji, size) {
  htmlElement.style.cursor = customCursor[size].replace('REPL', emoji)
}

export function multiply(characters) {
  console.log(characters)
  return new Array(100) // code from Svelte tutorial confetti
    .fill(0)
    .map((_, i) => {
      return {
        character: characters[i % characters.length],
        x: Math.random() * 100,
        y: -10 - Math.random() * 100,
        radius: 0.1 + Math.random() * 1,
      }
    })
    .sort((a, b) => a.radius - b.radius)
}
