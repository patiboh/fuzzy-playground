<script>
  import {onMount} from 'svelte'

  import * as constants from '../types/constants.js'
  import * as utils from '../libs/utils.js'

  import {
    uiState,
    feedbackEmoji,
    currentAnimation,
    currentAnimationId,
  } from '../stores.js'
  import Feedback from './Feedback.svelte'
  import Coordinates from './Coordinates.svelte'
  import AnimationsMenu from './AnimationsMenu.svelte'
  import EmojiButton from './EmojiButton.svelte'

  // Canvas
  let canvas
  let canvasWidth = 300
  let canvasHeight = 150

  // Audio
  let drumroll
  let duration = 6.017687
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
  let stopInterval = () => {}
  let animationInterval
  let animationTimeout
  let animationDuration = 4200 / playbackRate

  // UI feedback
  let playgroundState
  let emojiCursor
  let emojiFrame
  let emojis
  let output
  let stacktrace = ''
  let animation

  $: translation = [xCoord, yCoord]
  $: showCoordinates = animation.hasCoordinates
  $: playAudio = animation.hasAudio
  $: maxX = canvasWidth
  $: maxY = canvasHeight

  const uiStateUnsub = uiState.subscribe((value) => {
    playgroundState = value
  })
  const emojiFeedbackUnsub = feedbackEmoji.subscribe((value) => {
    emojis = utils.multiply(Object.values(value))
  })

  const currentAnimationUnsub = currentAnimation.subscribe((value) => {
    animation = value
  })

  function setCoordinates() {
    canvasWidth = output.getBoundingClientRect().width - width
    canvasHeight = output.getBoundingClientRect().height - height
    xCoord = 0
    yCoord = 0
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
    if (emojiFrame) {
      cancelAnimationFrame(emojiFrame)
      emojiFrame = null
    }
    emojis = []
  }

  function startAnimation() {
    if (playAudio) {
      drumroll.playbackRate = playbackRate
      drumroll.play()
    }
    if (animation.hasInterval) {
      stopInterval = animation.run(canvas)
      // don't go on forever just yet
      animationTimeout = setTimeout(() => {
        uiState.set(constants.uiState.SUCCESS)
        stopInterval()
        loopEmojis() // get this out of here: make reactive to store change ?
      }, animationDuration) // duration of drumroll, for now
    }
    if (showCoordinates) {
      setCoordinates()
      animation.run(canvas, translation, color)
    }
  }

  function stopAnimation() {
    if (animation.hasInterval) {
      stopInterval()
    }
    if (animationTimeout) {
      clearTimeout(animationTimeout)
      animationTimeout = null
    }
  }

  function resetPlayground() {
    clearEmojis()
    stopAnimation()
    setCoordinates()
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

  function handlePlayButtonFocus() {
    if (playgroundState === constants.uiState.DEFAULT) {
      uiState.set(constants.uiState.FOCUS)
    }
  }

  function handlePlayButtonBlur() {
    if (playgroundState === constants.uiState.FOCUS) {
      uiState.set(constants.uiState.DEFAULT)
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
    currentAnimationId.set(event.detail.animation)
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
      currentAnimationUnsub()
    }
  })
</script>

<style lang="scss">
  @import '../styles/playground.scss';
</style>

<section
  class={`output ${playgroundState}`}
  bind:this={output}
  data-cy="output">
  <canvas bind:this={canvas} data-cy="canvas" />
  <Feedback {stacktrace} />
  <audio bind:this={drumroll} data-cy="drumroll">
    <source src="drumroll.ogg" type="audio/ogg" />
    <track kind="captions" srclang="en" />
    <!-- TODO: fix caption src -->
  </audio>
</section>

<section class="controls">
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
  <div class="btn-group ui-controls">
    <EmojiButton
      dataCy="btn-play"
      buttonClass="firestarter"
      buttonLabel="Play"
      handleClick={handlePlay}
      handleFocus={handlePlayButtonFocus}
      handleBlur={handlePlayButtonBlur} />
    <EmojiButton
      dataCy="btn-reset"
      buttonClass="sponge"
      buttonLabel="Reset playground"
      handleClick={handleReset} />
    <EmojiButton
      dataCy="btn-refresh"
      buttonClass="shower"
      buttonLabel="Refresh page"
      handleClick={handleRefresh} />
  </div>
</section>
{#each emojis as emoji}
  <span
    data-cy="emoji-{emoji.character}"
    class="emoji"
    style="left: {emoji.x}%; top: {emoji.y}%; transform: scale({emoji.ratio})">
    {emoji.character}
  </span>
{/each}
