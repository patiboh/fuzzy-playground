<script>
  // @ts-check
  import {onMount} from 'svelte'

  import * as constants from '../types/constants.js'
  import * as utils from '../libs/utils.js'
  import * as draw from '../libs/draw.js'

  import {uiState, feedbackEmoji} from '../stores.js'
  import Feedback from './Feedback.svelte'
  import Controls from './Controls.svelte'

  // UI feedback
  let playgroundState
  let stacktrace = ''
  let emojis

  // WebGL
  let canvas
  let frame
  let webGlProps
  let webGlAnimation

  const uiStateUnsub = uiState.subscribe((value) => {
    playgroundState = value
  })
  const emojiFeedbackUnsub = feedbackEmoji.subscribe((value) => {
    emojis = utils.multiply(Object.values(value))
  })

  function handlePlay() {
    uiState.set(constants.uiState.ACTIVE)
    function loop() {
      if (frame) {
        cancelAnimationFrame(frame)
        frame = null
      }
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
        // playButton.style.cursor = emojiCursor
        loop()
      }, 1000)
    } catch (error) {
      uiState.set(constants.uiState.ERROR)
      // playButton.style.cursor = emojiCursor
      stacktrace = `${error}\n${stacktrace}`
      loop()
    }
  }
  function handleRefresh(event) {
    location.reload() // TODO - reload gl code only ?
  }
  function handleClearEmojis(event) {
    cancelAnimationFrame(frame)
    frame = null
    emojis = []
    // $uiState = constants.uiState.DEFAULT
  }
</script>

<style lang="scss" global>
  @import '../styles/variables.scss';
  @import '../styles/playground.scss';
</style>

<section class={`output ${playgroundState}`} data-cy="output">
  <canvas bind:this={canvas} data-cy="canvas" />
  <Feedback {stacktrace} />
</section>

<Controls {handlePlay} {handleRefresh} {handleClearEmojis} />

{#each emojis as emoji}
  <span
    class="emoji"
    style="left: {emoji.x}%; top: {emoji.y}%; transform: scale({emoji.ratio})">
    {emoji.character}
  </span>
{/each}
