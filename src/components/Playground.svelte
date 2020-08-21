<script>
  // @ts-check
  import {onMount} from 'svelte'

  import * as constants from '../types/constants.js'
  import * as utils from '../libs/utils.js'
  import * as draw from '../libs/draw.js'

  import {uiState, feedbackEmoji} from '../stores.js'
  import Feedback from './Feedback.svelte'
  import Controls from './Controls.svelte'
  import Coordinates from './Coordinates.svelte'

  // UI feedback
  let playgroundState
  let stacktrace = ''
  let emojis

  // Audio
  let drumroll
  let duration = 6.017687
  let playbackRate = 1.5
  let playbackDuration = 4200 / playbackRate

  // WebGL
  let canvas
  let frame
  let webGlProps
  let webGlAnimation
  let xPosition
  let yPosition
  let xCoord = 0
  let yCoord = 0

  $: xPosition = xCoord
  $: yPosition = yCoord

  const uiStateUnsub = uiState.subscribe((value) => {
    playgroundState = value
  })
  const emojiFeedbackUnsub = feedbackEmoji.subscribe((value) => {
    emojis = utils.multiply(Object.values(value))
  })

  function handlePlay() {
    if (frame) {
      cancelAnimationFrame(frame)
      frame = null
    }
    uiState.set(constants.uiState.ACTIVE)
    // drumroll.playbackRate = playbackRate
    // drumroll.play() // keep it warm for later
    function loop() {
      frame = requestAnimationFrame(loop)

      emojis = emojis.map((emoji) => {
        emoji.y += 0.7 * emoji.ratio
        if (emoji.y > 100) emoji.y = -20
        return emoji
      })
    }
    try {
      webGlProps = draw.initScene(canvas)
      webGlAnimation = setInterval(() => {
        draw.drawScene(webGlProps)
      }, 1)
      // don't go on forever just yet
      setTimeout(() => {
        uiState.set(constants.uiState.SUCCESS)
        clearInterval(webGlAnimation)
        loop()
      }, playbackDuration) // duration of drumroll, for now
    } catch (error) {
      uiState.set(constants.uiState.ERROR)
      stacktrace = `${error}\n${stacktrace}`
      loop()
    }
  }
  function handleRefresh(event) {
    location.reload() // TODO - reload gl code only ?
  }
  function handleClearEmojis(event) {
    if (frame) {
      cancelAnimationFrame(frame)
      frame = null
    }
    emojis = []
  }
</script>

<style lang="scss" global>
  @import '../styles/variables.scss';
  @import '../styles/playground.scss';
</style>

<section class={`output ${playgroundState}`} data-cy="output">
  <span>{xPosition}</span>
  <span>{yPosition}</span>
  <canvas bind:this={canvas} data-cy="canvas" />
  <audio bind:this={drumroll}>
    <source src="drumroll.mp4" type="audio/mpeg" />
    <source src="drumroll.ogg" type="audio/ogg" />
    <track kind="captions" src="drumrolls.vtt" srclang="en" />
  </audio>
  <Feedback {stacktrace} />
</section>
<Coordinates bind:xCoord bind:yCoord />
<Controls {handlePlay} {handleRefresh} {handleClearEmojis} />

{#each emojis as emoji}
  <span
    class="emoji"
    style="left: {emoji.x}%; top: {emoji.y}%; transform: scale({emoji.ratio})">
    {emoji.character}
  </span>
{/each}
