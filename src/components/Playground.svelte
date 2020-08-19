<script>
  // @ts-check
  import {onMount} from 'svelte'
  import {uiState, feedbackEmoji} from '../stores.js'

  import * as constants from '../types/constants.js'
  import * as utils from '../libs/utils.js'
  import * as draw from '../libs/draw.js'

  let xPosition = 0
  let yPosition = 0
  let animateButton
  let refreshButton
  let clearEmojisButton
  let feedback
  let stacktrace = ''

  let playgroundState
  let emojis
  let canvas
  let frame

  let uiStateUnsub
  let emojiFeedbackUnsub

  const uiStateSubscription = uiState.subscribe((value) => {
    playgroundState = value
  })

  const emojiFeedbackSubscription = feedbackEmoji.subscribe((value) => {
    emojis = utils.multiply(Object.values(value))
  })

  function subscribe() {
    uiStateUnsub = uiState.subscribe((value) => {
      playgroundState = value
    })
    emojiFeedbackUnsub = feedbackEmoji.subscribe((value) => {
      emojis = utils.multiply(Object.values(value))
    })
  }

  function handleAnimate() {
    utils.generateCursor(
      animateButton,
      constants.emojis.animate[$uiState],
      constants.size.SM,
    )
    try {
      const webGlProps = draw.initScene()
      const webGlAnimation = setInterval(() => {
        draw.drawScene(webGlProps)
      }, 1)
      $uiState = constants.uiState.SUCCESS
    } catch (error) {
      $uiState = constants.uiState.ERROR
      stacktrace = `${error}\n${stacktrace}`
      utils.updateCursor(document.body, 'auto')
      utils.generateCursor(
        animateButton,
        constants.emojis.animate[$uiState],
        constants.size.SM,
      )
    } finally {
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
      loop()
    }
  }

  function handleAnimateFocus() {
    if ($uiState === constants.uiState.DEFAULT) {
      $uiState = constants.uiState.FOCUS
    }
  }

  function handleAnimateBlur() {
    if ($uiState === constants.uiState.FOCUS) {
      $uiState = constants.uiState.DEFAULT
    }
  }

  function handleRefresh(event) {
    utils.generateCursor(
      animateButton,
      constants.emojis.animate[$uiState],
      constants.size.SM,
    )
    location.reload() // TODO - reload gl code only ?
  }

  function handleClearEmojis(event) {
    cancelAnimationFrame(frame)
    frame = null
    emojis = []
    // $uiState = constants.uiState.DEFAULT
  }

  onMount(() => {
    utils.generateCursor(
      animateButton,
      constants.emojis.animate[$uiState],
      constants.size.SM,
    )
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
    data-cy="btn-animate"
    on:focus={handleAnimateFocus}
    on:mouseover={handleAnimateFocus}
    on:mouseleave={handleAnimateBlur}
    on:click={handleAnimate}
    bind:this={animateButton}
    class={`btn-jumbo fire-starter ${playgroundState}`}
    aria-label="Animate" />
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
