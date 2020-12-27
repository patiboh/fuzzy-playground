<script context="module">
  import * as constants from '../types/constants.js'
  import * as utils from '../libs/utils.js'
  import {
    uiState,
    emojiFeedback,
    animations,
    currentAnimationId,
  } from '../stores.js'
  import Feedback from './Feedback.svelte'
  import Coordinates from './Coordinates.svelte'
  import AngleRange from './AngleRange.svelte'
  import AnimationsMenu from './AnimationsMenu.svelte'
  import Controls from './Controls.svelte'
</script>

<script>
  // Canvas
  let canvas
  let canvasWidth = 300
  let canvasHeight = 150
  let animationFrame

  // Audio
  let drumroll
  let ended
  let duration
  let playbackRate = 2

  // WebGL Geometry
  let color = [Math.random(), Math.random(), Math.random(), 1]
  const width = 100 // of geometry
  const height = 30 // of geometry

  // animation controls
  let xCoord = 0
  let yCoord = 0
  let angle = 0
  let xRadCoord = 0 // radial coordinate x = cos(O)
  let yRadCoord = 0 // radial coordinate y = sin(O)
  let translation = [0, 0]
  let rotation = [0, 0]
  let showCoordinates = false
  let showAngleRange = false

  // animations
  let animationLoop
  let animationTimeout
  const animationDuration = 4200 / playbackRate

  // UI feedback
  let playgroundState
  let emojiFrame
  let emojis
  let stacktrace = ''
  let animationId = $currentAnimationId
  let animation = $animations.find((animation) => animation.id === animationId)

  $: showCoordinates = animation.coordinates
  $: showAngleRange = animation.angleRange
  $: translation = [xCoord, yCoord]
  $: xRadCoord = Math.cos(degToRad(angle)) // radial coordinate x = cos(O)
  $: yRadCoord = Math.sin(degToRad(angle)) // radial coordinate y = sin(O)
  $: rotation = [xRadCoord, yRadCoord]
  $: maxX = canvasWidth - width
  $: maxY = canvasHeight - height

  uiState.subscribe((value) => {
    playgroundState = value
    if (value === constants.uiState.DEFAULT) {
      xCoord = 0
      yCoord = 0
    }
  })
  emojiFeedback.subscribe((value) => {
    emojis = utils.multiply(Object.values(value))
  })
  currentAnimationId.subscribe((value) => {
    animationId = value
  })

  function degToRad(degrees) {
    return degrees * (Math.PI / 180)
  }

  function loopEmojis() {
    emojiFrame = requestAnimationFrame(loopEmojis)

    emojis = emojis.map((emoji) => {
      emoji.y += 0.7 * emoji.ratio
      if (emoji.y > 100) emoji.y = -20
      return emoji
    })
  }

  function clearEmojis() {
    cancelAnimationFrame(emojiFrame)
    emojis = []
  }

  function resetColor() {
    color = [Math.random(), Math.random(), Math.random(), 1]
  }

  function resetAudio() {
    drumroll.pause()
    drumroll.currentTime = 0
  }

  function startAnimation() {
    uiState.set(constants.uiState.ACTIVE)
    if (animation.audio) {
      drumroll.play()
    }
    if (animation.loop) {
      animationLoop = animation.run(canvas)
      animationTimeout = setTimeout(() => {
        uiState.set(constants.uiState.SUCCESS)
        clearInterval(animationLoop)
        loopEmojis()
      }, animationDuration) // duration of drumroll, for now
    } else {
      if (animation.coordinates) {
        animation.run(canvas, translation, rotation, color, width, height)
      } else {
        animation.run(canvas)
      }
      if (animation.requestAnimationFrame) {
        animationFrame = requestAnimationFrame(startAnimation)
      }
    }
  }

  function resetPlayground() {
    uiState.set(constants.uiState.DEFAULT)
    clearEmojis()
    resetColor()
    resetAudio()
    clearInterval(animationLoop)
    clearTimeout(animationTimeout)
  }

  function handleError(error) {
    uiState.set(constants.uiState.ERROR)
    stacktrace = `${error}\n${stacktrace}`
    loopEmojis()
  }

  function handlePlay() {
    cancelAnimationFrame(animationFrame)
    resetPlayground()
    try {
      startAnimation()
    } catch (error) {
      handleError(error)
    }
  }

  function handleRefresh() {
    resetPlayground()
    location.reload() // TODO - reload gl code only ?
  }

  function handleReset() {
    resetPlayground()
  }

  function handleLoadAnimation(event) {
    currentAnimationId.set(event.detail.animationId)
    animation = $animations.find((animation) => animation.id === animationId)
    handlePlay()
  }
  function updateXCoord() {
    animation.update(translation, rotation)
  }

  function updateYCoord() {
    animation.update(translation, rotation)
  }

  function updatePosition() {
    animation.update(translation, rotation)
  }
</script>

<style lang="scss">
  @import '../styles/playground.scss';
</style>

<section
  class={`output ${playgroundState}`}
  bind:offsetWidth={canvasWidth}
  bind:offsetHeight={canvasHeight}
  data-cy="output">
  <canvas bind:this={canvas} data-cy="canvas" />
  <Feedback {stacktrace} />
  <audio
    bind:this={drumroll}
    bind:duration
    bind:ended
    bind:playbackRate
    data-cy="drumroll">
    <source src="drumroll.ogg" type="audio/ogg" />
    <track kind="captions" srclang="en" />
    <!-- TODO: fix caption src -->
  </audio>
</section>

<aside class="sidebar">
  <AnimationsMenu on:loadAnimation={handleLoadAnimation} />
  {#if showCoordinates}
    <Coordinates
      bind:xCoord
      bind:yCoord
      bind:maxX
      bind:maxY
      on:updateXCoord={updateXCoord}
      on:updateYCoord={updateYCoord} />
    {#if showAngleRange}
      <AngleRange bind:angle on:updateAngle={updatePosition} />
    {/if}
  {/if}
  <Controls {handlePlay} {handleReset} {handleRefresh} />
</aside>
{#each emojis as emoji}
  <span
    data-cy="emoji-{emoji.character}"
    class="emoji"
    style="left: {emoji.x}%; top: {emoji.y}%; transform: scale({emoji.ratio})">
    {emoji.character}
  </span>
{/each}
