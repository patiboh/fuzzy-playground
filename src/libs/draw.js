// @ts-check
/**
 ***********************
 * DRAW FUNCTIONS
 ***********************
 */

import * as utils from './utils.js'
import * as utilsWebGl from './utilsWebGL.js'

/**
 * Write data to draw a rectangle into the last thing bound to gl.ARRAY_BUFFER (in this context positionBuffer)
 * @param {WebGLRenderingContext} gl
 * @param {number} x coordinate
 * @param {number} y coordinate
 * @param {number} width
 * @param {number} height
 */
function setRectangle(gl, x, y, width, height) {
  // // Positions in clip space
  // // const positions = [
  // //   0,0,
  // //   0,0.5,
  // //   0.7, 0,
  // // ]

  // // Positions in pixels
  // // prettier-ignore
  // const positions = [
  //     20, 20,
  //     200, 20,
  //     20, 100,
  //     20, 100,
  //     200, 20,
  //     200, 100,
  //   ]
  // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

  const x1 = x
  const x2 = x + width
  const y1 = y
  const y2 = y + height

  // prettier-ignore
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    x1, y1,
    x2, y1,
    x1, y2,
    x1, y2,
    x2, y1,
    x2, y2,
  ]), gl.STATIC_DRAW)
}

/**
 * @param {WebGLRenderingContext} gl
 * @param {any} colorUniformLocation
 */
function drawRectangle(gl, colorUniformLocation) {
  // Setup a random rectangle
  setRectangle(
    gl,
    utils.randomInt(300),
    utils.randomInt(300),
    utils.randomInt(300),
    utils.randomInt(300),
  )

  // Set a random color.
  gl.uniform4f(
    colorUniformLocation,
    Math.random(),
    Math.random(),
    Math.random(),
    1,
  )

  // Draw the rectangle.
  // WebGL has 3 types of primitives: points, lines, and triangles
  // const primitiveType = gl.TRIANGLES // each iteration, WebGL will draw a triangle based on the values set in gl_Position
  // const count = 6 // number of times the shader will execute: 3
  // 1st Iteration: a_position.x & a_position.y of the vertex shader will be set to the first 2 values in the positionBuffer
  // 2nd Iteration: a_position.x & a_position.y => next pair of values of positionBuffer
  // 3rd Iteration: a_position.x & a_position.y => next (last) pair of values of positionBuffer
  // offset = 0
  // gl.drawArrays(primitiveType, offset, count)
  gl.drawArrays(gl.TRIANGLES, 0, 6)
}

/**
 * TRANSLATIONS
 * @param {WebGLRenderingContext} gl
 */
function renderTranslation(gl) {
  const translation = [0, 0]
  const width = 100
  const height = 30
  const color = [Math.random(), Math.random(), Math.random(), 1]
  setRectangle(gl, translation[0], translation[1], width, height)
}
/**
 * @param {WebGLRenderingContext} gl
 * @param {number} count number of rectangles to draw
 */
function drawRectangles(gl, colorUniformLocation, count) {
  for (let index = 0; index < count; ++index) {
    drawRectangle(gl, colorUniformLocation)
  }
}

/**
 * INITIALIZATION CODE
 * Code that gets executed once before the program runs
 */
export function initScene() {
  // 1. Get A WebGL context
  const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById(
    'canvas',
  ))
  const gl = canvas.getContext('webgl')

  if (!gl) {
    alert("Sorry buddy, can't find WebGL in your browser ")
  }

  // 2. Initialize shaders : 2 programs that are executed each time a pixel is rendered
  // - Vertex Shader = returns pixel position
  // - Fragment Shader = returns pixel color
  const vertexShaderSrc = /** @type {HTMLScriptElement} */ (document.getElementById(
    'vertex-shader-2d',
  )).text
  const fragmentShaderSrc = /** @type {HTMLScriptElement} */ (document.getElementById(
    'fragment-shader-2d',
  )).text

  const vertexShader = utilsWebGl.createShader(
    gl,
    gl.VERTEX_SHADER,
    vertexShaderSrc,
  )
  const fragmentShader = utilsWebGl.createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSrc,
  )
  // 3. Create WebGL program w and tell WebGL to use our shaders
  const program = utilsWebGl.createProgram(gl, vertexShader, fragmentShader)
  gl.useProgram(program)

  // 4. Bind resources / data
  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position')
  const positionBuffer = gl.createBuffer()

  // bind our resource (the positions buffer) to a BIND_POINT on the GPU
  // so that we can pass data to it
  // always set this up before rendering loop
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

  // 5. Set up Uniforms (~ globals)
  //  - sets uniforms to be bound to the current program
  // bind u_color
  const colorUniformLocation = gl.getUniformLocation(program, 'u_color')
  // gl.uniform4f(
  //   colorUniformLocation,
  //   Math.random(),
  //   Math.random(),
  //   Math.random(),
  //   1,
  // )

  // bind u_translation
  const translationUniformLocation = gl.getUniformLocation(
    program,
    'u_translation',
  )

  // bind u_resolution
  const resolutionUniformLocation = gl.getUniformLocation(
    program,
    'u_resolution',
  )

  return {
    gl,
    resolutionUniformLocation,
    colorUniformLocation,
    translationUniformLocation,
    positionAttributeLocation,
    positionBuffer,
  }
}

/* ++*
 * @param {WebGLRenderingContext} gl
 * @param {WebGLUniformLocation} resolutionUniformLocation
 * @param {WebGLUniformLocation} colorUniformLocation
 * @param {number} positionAttributeLocation
 * @param {WebGLBuffer} positionBuffer
 */
export function drawScene(webGlProps) {
  const {
    gl,
    resolutionUniformLocation,
    colorUniformLocation,
    translationUniformLocation,
    positionAttributeLocation,
    positionBuffer,
  } = webGlProps
  /************************
   * RENDERING CODE
   * Code that gets executed every time we draw
   ************************/
  const canvas = /** @type {HTMLCanvasElement} */ (gl.canvas)
  // 1. Setup canvas
  // - resize canvas to fit screen display
  utils.resize(canvas)
  // - tell WebGL how to covert clip space values for gl_Position back into screen space (pixels)
  // -> use gl.viewport
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
  // set the resolution
  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height)

  // Clear the canvas
  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  // 2. Bind Position
  // - Enable data supply into vertex shader a_position attribute
  gl.enableVertexAttribArray(positionAttributeLocation)
  // - Bind data retrieval to position buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  /**
   *  Tell the a_position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
   * - vec4 a_position is a 4 float vector. We only need 2 values for 2D (points x,y)
   * - default values are:  0, 0, 0, 1
   * - we will set the first two (x, y), and the remaining two (z, w) will remain with default values (0,1)
   */
  const size = 2 // 2 components per iteration
  const type = gl.FLOAT // the data is in 32bit floats
  const normalize = false // don't normalize the data
  const stride = 0 // 0: move forward (size * sizeof(type)) each iteration to get to the next position
  const offset = 0 // start at the beginning of the buffer
  gl.vertexAttribPointer(
    positionAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset,
  )

  // 3. Draw!!
  // - Draw 3 random rectangles
  drawRectangles(gl, colorUniformLocation, 1)
  // - Translate
  renderTranslation(gl)
}