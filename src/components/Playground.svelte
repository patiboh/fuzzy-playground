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

  // WebGL
  let canvas
  let frame
  let webGlProps
  let webGlAnimation
  let xCoord = 0
  let yCoord = 0
  let showCoordinates = false
  let translation = [0, 0]
  let color = [Math.random(), Math.random(), Math.random(), 1]
  let width = 100
  let height = 30

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

  // UI feedback
  let playgroundState
  let stacktrace = ''
  let emojiCursor
  let emojis
  let currentAnimation = animations[0]
  let canvasWidth = 300
  let canvasHeight = 150
  let output

  // Audio
  // let drumroll
  // let duration = 6.017687
  let playbackRate = 1.5
  let playbackDuration = 4200 / playbackRate
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
  }

  function loop() {
    frame = requestAnimationFrame(loop)

    emojis = emojis.map((emoji) => {
      emoji.y += 0.7 * emoji.ratio
      if (emoji.y > 100) emoji.y = -20
      return emoji
    })
  }

  function handlePlay() {
    if (frame) {
      cancelAnimationFrame(frame)
      frame = null
    }
    try {
      uiState.set(constants.uiState.ACTIVE)
      webGlProps = draw.initScene(canvas)
      if (currentAnimation.setInterval) {
        webGlAnimation = currentAnimation.run(webGlProps)
        // don't go on forever just yet
        setTimeout(() => {
          uiState.set(constants.uiState.SUCCESS)
          clearInterval(webGlAnimation)
          loop()
        }, playbackDuration) // duration of drumroll, for now
      }
      if (currentAnimation.hasCoordinates) {
        setCoordinates(canvas)
        currentAnimation.run(webGlProps, translation, color)
      }
    } catch (error) {
      uiState.set(constants.uiState.ERROR)
      stacktrace = `${error}\n${stacktrace}`
      loop()
    }
  }

  function handlePlayButtonFocus(event) {
    if (playgroundState === constants.uiState.DEFAULT) {
      uiState.set(constants.uiState.FOCUS)
    }
  }

  function handlePlayButtonBlur(event) {
    if (playgroundState === constants.uiState.FOCUS) {
      uiState.set(constants.uiState.DEFAULT)
    }
  }

  function handleRefresh() {
    location.reload() // TODO - reload gl code only ?
  }

  function handleReset() {
    if (frame) {
      cancelAnimationFrame(frame)
      frame = null
    }
    emojis = []
    xCoord = 0
    yCoord = 0
    uiState.set(constants.uiState.DEFAULT)
  }

  function handleLoadAnimation(event) {
    handleReset()
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
