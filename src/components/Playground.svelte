<script context="module">
  import * as constants from '../types/constants.js'
  import {
    uiState,
    emojiFeedback,
    animations,
    currentAnimationId,
  } from '../stores.js'
  import Feedback from './Feedback.svelte'
  import Geometry from './Geometry.svelte'
  import AnimationsMenu from './AnimationsMenu.svelte'
  import Controls from './Controls.svelte'
</script>

<script>
  import * as utils from '../libs/utils.js'
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
  const width = 100 // of geometry
  const height = 30 // of geometry

  /**
   * Geometry controls
   */
  let geometryState = {
    color: [Math.random(), Math.random(), Math.random(), 1],
    translation: [canvasWidth / 2, canvasHeight / 2],
    rotation: [0, 0],
    scale: [1, 1],
  }

  // animations
  let animationStartTime
  const animationDuration = 4179 / playbackRate

  // UI feedback
  let playgroundState
  let emojiFrame
  let emojis
  let stacktrace = ''
  let animationId = $currentAnimationId
  let animation = $animations.find((animation) => animation.id === animationId)

  uiState.subscribe((value) => {
    playgroundState = value
  })
  emojiFeedback.subscribe((value) => {
    emojis = utils.multiply(Object.values(value))
  })
  currentAnimationId.subscribe((value) => {
    animationId = value
  })

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

  function resetAudio() {
    drumroll.pause()
    drumroll.currentTime = 0
  }

  function runLoop(timestamp, duration) {
    const runtime = timestamp - animationStartTime
    if (runtime >= duration) {
      celebrate()
    } else {
      // if duration not met yet
      animation.run(canvas)
      animationFrame = requestAnimationFrame(function (timestamp) {
        // call requestAnimationFrame again with parameters
        runLoop(timestamp, duration)
      })
    }
  }

  function startAnimation(timestamp, duration) {
    uiState.set(constants.uiState.ACTIVE)
    if (animation.audio) {
      drumroll.play()
    }
    if (animation.loop && duration) {
      runLoop(timestamp, duration)
    } else {
      if (animation.coordinates) {
        animation.run(
          canvas,
          geometryState.translation,
          geometryState.rotation,
          geometryState.scale,
          geometryState.color,
          width,
          height,
        )
      } else {
        animation.run(canvas)
      }
      animationFrame = requestAnimationFrame(function (timestamp) {
        // call requestAnimationFrame again with parameters
        startAnimation(timestamp, duration)
      })
    }
  }

  function celebrate() {
    cancelAnimationFrame(animationFrame)
    clearEmojis()
    uiState.set(constants.uiState.SUCCESS)
    loopEmojis()
  }

  function resetPlayground() {
    uiState.set(constants.uiState.DEFAULT)
    resetAudio()
    cancelAnimationFrame(animationFrame)
    clearEmojis()
  }

  function handleError(error) {
    uiState.set(constants.uiState.ERROR)
    stacktrace = `${error}\n${stacktrace}`
    loopEmojis()
  }

  function handlePlay() {
    try {
      resetPlayground()
      animationFrame = requestAnimationFrame(function (timestamp) {
        animationStartTime = timestamp || new Date().getTime()
        if (animation.loop) {
          startAnimation(timestamp, animationDuration)
        } else {
          startAnimation(timestamp)
        }
      })
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

  function updateGeometry(event) {
    const {color, translation, rotation, scale} = event.detail.value
    geometryState = {...geometryState, color, translation, rotation, scale}
    if (animation.webGlProps) {
      animation.update(translation, rotation, scale)
    } else {
      handlePlay()
    }
  }
</script>

<section
  class={`output ${playgroundState}`}
  bind:offsetWidth={canvasWidth}
  bind:offsetHeight={canvasHeight}
  data-cy="output"
>
  <canvas bind:this={canvas} data-cy="canvas" />
  <Feedback {stacktrace} />
  <audio
    bind:this={drumroll}
    bind:duration
    bind:ended
    bind:playbackRate
    data-cy="drumroll"
  >
    <source src="drumroll.ogg" type="audio/ogg" />
    <track kind="captions" srclang="en" />
    <!-- TODO: fix caption src -->
  </audio>
</section>

<aside class="sidebar">
  <AnimationsMenu on:loadAnimation={handleLoadAnimation} />
  <div class="coordinates" data-cy="coordinates">
    <Geometry
      on:change={updateGeometry}
      {canvasWidth}
      {canvasHeight}
      {animation}
    />
  </div>
  <Controls {handlePlay} {handleReset} {handleRefresh} />
</aside>
{#each emojis as emoji}
  <span
    data-cy="emoji-{emoji.character}"
    class="emoji"
    style="left: {emoji.x}%; top: {emoji.y}%; transform: scale({emoji.ratio})"
  >
    {emoji.character}
  </span>
{/each}

<style lang="scss">
  @import '../styles/playground.scss';
</style>
