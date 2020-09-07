<script>
  import {onMount} from 'svelte'

  import * as constants from '../types/constants.js'
  import * as utils from '../libs/utils.js'
  import * as draw from '../libs/draw.js'

  import {uiState, feedbackEmoji} from '../stores.js'
  import Feedback from './Feedback.svelte'
  import Coordinates from './Coordinates.svelte'
  import AnimationsMenu from './AnimationsMenu.svelte'
  import EmojiButton from './EmojiButton.svelte'

  // Canvas
  let canvas
  let canvasWidth = 300
  let canvasHeight = 150

  // Audio
  // let drumroll
  // let duration = 6.017687
  let playbackRate = 1.5

  // WebGL
  let webGlProps
  let translation = [0, 0]
  let color = [Math.random(), Math.random(), Math.random(), 1]
  let width = 100 // of geometry
  let height = 30 // of geometry

  // animation controls
  let xCoord = 0
  let yCoord = 0
  let showCoordinates = false

  // animation loops
  let animationInterval
  let animationTimeout
  let animationDuration = 4200 / playbackRate

  const animations = [
    {
      id: 'L1',
      name: 'Random rectangles',
      hasCoordinates: false,
      setInterval: true,
      run(
        webGLProps,
        translation = null,
        color = null,
        width = null,
        height = null,
      ) {
        return setInterval(() => {
          draw.rectanglesScene(webGlProps)
        }, 1)
      },
    },
    {
      id: 'L2',
      name: 'Translation',
      hasCoordinates: true,
      setInterval: false,
      run(webGlProps, translation, color, width, height) {
        draw.translationSceneViaDOM(
          webGlProps,
          translation,
          color,
          width,
          height,
        )
      },
    },
    {
      id: 'L3',
      name: 'Translation via shader',
      hasCoordinates: true,
      setInterval: false,
      run(webGlProps, translation, color, width = null, height = null) {
        draw.translationSceneViaWebGL(webGlProps, translation)
      },
    },
  ]

  let currentAnimation = animations[0]

  // UI feedback
  let playgroundState
  let emojiCursor
  let emojiFrame
  let emojis
  let output
  let stacktrace = ''

  $: translation = [xCoord, yCoord]
  $: showCoordinates = currentAnimation.hasCoordinates
  $: maxX = canvasWidth
  $: maxY = canvasHeight

  const uiStateUnsub = uiState.subscribe((value) => {
    playgroundState = value
  })
  const emojiFeedbackUnsub = feedbackEmoji.subscribe((value) => {
    emojis = utils.multiply(Object.values(value))
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

  function stopAnimation() {
    if (animationInterval) {
      clearInterval(animationInterval)
      animationInterval = null
    }
    if (animationTimeout) {
      clearTimeout(animationTimeout)
      animationTimeout = null
    }
  }

  function startAnimation() {
    webGlProps = draw.initScene(canvas)
    if (currentAnimation.setInterval) {
      animationInterval = currentAnimation.run(webGlProps)
      // don't go on forever just yet
      animationTimeout = setTimeout(() => {
        uiState.set(constants.uiState.SUCCESS)
        clearInterval(animationInterval)
        loopEmojis() // get this out of here: make reactive to store change ?
      }, animationDuration) // duration of drumroll, for now
    }
    if (currentAnimation.hasCoordinates) {
      setCoordinates(canvas)
      currentAnimation.run(webGlProps, translation, color)
    }
  }

  function clearEmojis() {
    if (emojiFrame) {
      cancelAnimationFrame(emojiFrame)
      emojiFrame = null
    }
    emojis = []
  }

  function handleError() {
    uiState.set(constants.uiState.ERROR)
    stacktrace = `${error}\n${stacktrace}`
    loopEmojis()
  }

  function handlePlay() {
    try {
      uiState.set(constants.uiState.ACTIVE)
      startAnimation()
    } catch (error) {
      handleError()
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
    clearEmojis()
    stopAnimation()
    setCoordinates()
    location.reload() // TODO - reload gl code only ?
  }

  function handleReset() {
    clearEmojis()
    stopAnimation()
    setCoordinates()
    uiState.set(constants.uiState.DEFAULT)
    if (!currentAnimation.setInterval) {
      handlePlay()
    }
  }

  function handleLoadAnimation(event) {
    clearEmojis()
    stopAnimation()
    setCoordinates()
    const animationId = event.detail.animation
    currentAnimation = animations.find(
      (animation) => animation.id === animationId,
    )
    showCoordinates = currentAnimation.hasCoordinates
    handlePlay()
  }

  function updateXCoord() {
    currentAnimation.run(webGlProps, translation, color, width, height)
  }

  function updateYCoord() {
    currentAnimation.run(webGlProps, translation, color, width, height)
  }

  onMount(() => {
    return () => {
      uiStateUnsub()
      emojiFeedbackUnsub()
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
  <!-- <audio bind:this={drumroll}>
    <source src="drumroll.mp4" type="audio/mpeg" />
    <source src="drumroll.ogg" type="audio/ogg" />
    <track kind="captions" src="drumrolls.vtt" srclang="en" />
  </audio> -->
  <Feedback {stacktrace} />
</section>
<section class="controls">
  <AnimationsMenu on:loadAnimation={handleLoadAnimation} {animations} />
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
    class="emoji"
    style="left: {emoji.x}%; top: {emoji.y}%; transform: scale({emoji.ratio})">
    {emoji.character}
  </span>
{/each}
