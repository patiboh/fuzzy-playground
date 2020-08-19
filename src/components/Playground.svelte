<script>
  // @ts-check
  import {onMount} from 'svelte'
  import {uiState, feedbackEmoji, generateCursor} from '../stores.js'

  import * as constants from '../types/constants.js'
  import * as utils from '../libs/utils.js'
  import * as draw from '../libs/draw.js'

  // UI controls
  let xPosition = 0
  let yPosition = 0
  let playButton
  let refreshButton
  let clearEmojisButton

  // UI feedback
  let playgroundState
  let feedback
  let stacktrace = ''
  let emojis
  let emojiCursor

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

  const emojiCursorUnsub = generateCursor.subscribe((value) => {
    emojiCursor = value
  })

  function handlePlay() {
    $uiState = constants.uiState.ACTIVE
    playButton.style.cursor = emojiCursor

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
      $uiState = constants.uiState.SUCCESS

      // don't go on forever just yet
      setTimeout(() => {
        clearInterval(webGlAnimation)
        playButton.style.cursor = emojiCursor
        loop()
      }, 1000)
    } catch (error) {
      $uiState = constants.uiState.ERROR
      playButton.style.cursor = emojiCursor
      stacktrace = `${error}\n${stacktrace}`
      loop()
    }
  }

  function handlePlayButtonFocus() {
    if ($uiState === constants.uiState.DEFAULT) {
      $uiState = constants.uiState.FOCUS
    }
  }

  function handlePlayButtonBlur() {
    if ($uiState === constants.uiState.FOCUS) {
      $uiState = constants.uiState.DEFAULT
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

  onMount(() => {
    playButton.style.cursor = emojiCursor
    return () => {
      uiStateUnsub()
      emojiFeedbackUnsub()
    }
  })
</script>

<section class={`display ${playgroundState}`} data-cy="display">
  <canvas bind:this={canvas} data-cy="canvas" />
  <div
    class="playground-feedback"
    bind:this={feedback}
    data-cy="playground-feedback">
    <pre class="stacktrace" data-cy="stacktrace">{stacktrace}</pre>
  </div>
</section>
<aside class="coordinates">
  <label>
    x = {xPosition}
    <input type="range" bind:value={xPosition} />
  </label>
  <label>
    y = {yPosition}
    <input type="range" bind:value={yPosition} />
  </label>
</aside>
<aside class="btn-group">
  <button
    data-cy="btn-play"
    on:focus={handlePlayButtonFocus}
    on:mouseover={handlePlayButtonFocus}
    on:mouseleave={handlePlayButtonBlur}
    on:click={handlePlay}
    bind:this={playButton}
    class={`btn-jumbo fire-starter ${playgroundState}`}
    aria-label="Play" />
  <button
    data-cy="btn-clear-emojis"
    on:click={handleClearEmojis}
    bind:this={clearEmojisButton}
    class={'btn-jumbo sponge'}
    aria-label="Clear emoji animation" />
  <button
    data-cy="btn-refresh"
    on:click={handleRefresh}
    bind:this={refreshButton}
    class={'btn-jumbo shower'}
    aria-label="Refresh" />
</aside>
{#each emojis as emoji}
  <span
    class="emoji"
    style="left: {emoji.x}%; top: {emoji.y}%; transform: scale({emoji.ratio})">
    {emoji.character}
  </span>
{/each}
