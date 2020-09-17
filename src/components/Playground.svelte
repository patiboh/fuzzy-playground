<script>
  import {onMount} from 'svelte'

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
  import AnimationsMenu from './AnimationsMenu.svelte'
  import Controls from './Controls.svelte'

  // Canvas
  let canvas
  let canvasWidth = 300
  let canvasHeight = 150

  // Audio
  let drumroll
  let ended
  let duration
  let playbackRate = 1.5

  // WebGL
  let translation = [0, 0]
  let color = [Math.random(), Math.random(), Math.random(), 1]
  let width = 100 // of geometry
  let height = 30 // of geometry

  // animation controls
  let xCoord = 0
  let yCoord = 0
  let showCoordinates = false

  // animation loops
  let stopInterval
  let animationTimeout
  let animationDuration = 4200 / playbackRate

  // UI feedback
  let playgroundState
  let emojiFrame
  let emojis
  let stacktrace = ''
  let animationId = $currentAnimationId
  let animation = $animations.find((animation) => animation.id === animationId)

  $: showCoordinates = animation.hasCoordinates
  $: playAudio = animation.hasAudio
  $: translation = [xCoord, yCoord]
  $: maxX = canvasWidth - width
  $: maxY = canvasHeight - height

  const uiStateUnsub = uiState.subscribe((value) => {
    playgroundState = value
  })
  const emojiFeedbackUnsub = emojiFeedback.subscribe((value) => {
    emojis = utils.multiply(Object.values(value))
  })
  const currentAnimationIdUnsub = currentAnimationId.subscribe((value) => {
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
    if (emojiFrame) {
      cancelAnimationFrame(emojiFrame)
      emojiFrame = null
    }
    emojis = []
  }

  function startAnimation() {
    if (playAudio) {
      drumroll.play()
    }
    if (animation.hasInterval) {
      stopInterval = animation.run(canvas)
      // don't go on forever just yet
      animationTimeout = setTimeout(() => {
        uiState.set(constants.uiState.SUCCESS)
        stopAnimation()
        loopEmojis() // get this out of here: make reactive to store change ?
      }, animationDuration) // duration of drumroll, for now
    }
    if (showCoordinates) {
      animation.run(canvas, translation, color, width, height)
    }
  }

  function stopAnimation() {
    if (stopInterval) {
      stopInterval()
      stopInterval = null
    }
    if (animationTimeout) {
      clearTimeout(animationTimeout)
      animationTimeout = null
    }
  }

  function resetPlayground() {
    clearEmojis()
    stopAnimation()
  }

  function handleError(error) {
    resetPlayground()
    uiState.set(constants.uiState.ERROR)
    stacktrace = `${error}\n${stacktrace}`
    loopEmojis()
  }

  function handlePlay() {
    try {
      uiState.set(constants.uiState.ACTIVE)
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
    uiState.set(constants.uiState.DEFAULT)
    if (!animation.hasInterval) {
      handlePlay()
    }
  }

  function handleLoadAnimation(event) {
    resetPlayground()
    currentAnimationId.set(event.detail.animationId)
    animation = $animations.find((animation) => animation.id === animationId)
    handlePlay()
  }

  function updateXCoord() {
    animation.run(canvas, translation, color, width, height)
  }

  function updateYCoord() {
    animation.run(canvas, translation, color, width, height)
  }

  onMount(() => {
    return () => {
      uiStateUnsub()
      emojiFeedbackUnsub()
      currentAnimationIdUnsub()
    }
  })
</script>

<style lang="scss">
  @import '../styles/playground.scss';
</style>

<section class="sidebar">
  <AnimationsMenu on:loadAnimation={handleLoadAnimation} />
  {#if showCoordinates}
    <Coordinates
      bind:xCoord
      bind:yCoord
      bind:maxX
      bind:maxY
      on:updateXCoord={updateXCoord}
      on:updateYCoord={updateYCoord} />
  {/if}
  <Controls {handlePlay} {handleReset} {handleRefresh} />
</section>

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

{#each emojis as emoji}
  <span
    data-cy="emoji-{emoji.character}"
    class="emoji"
    style="left: {emoji.x}%; top: {emoji.y}%; transform: scale({emoji.ratio})">
    {emoji.character}
  </span>
{/each}
