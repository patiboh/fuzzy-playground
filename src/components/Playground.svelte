<script>
  // @ts-check
  import {onMount} from 'svelte'
  import {uiState, emojiFeedback} from '../stores.js'

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

  let animateButtonState
  let emojis
  let canvas
  let frame

  const uiStateSubscription = uiState.subscribe((value) => {
    animateButtonState = value
  })

  const emojiFeedbackSubscription = emojiFeedback.subscribe((value) => {
    emojis = utils.multiply(Object.values(value))
  })

  function handleAnimate() {
    utils.updateCursor(
      animateButton,
      constants.emojis.animate[$uiState],
      constants.size.SM,
    )
    try {
      const webGlProps = draw.initScene()
      const webGlAnimation = window.setInterval(() => {
        draw.drawScene(webGlProps)
      }, 1)
      $uiState = constants.uiState.SUCCESS
    } catch (error) {
      $uiState = constants.uiState.ERROR
      document.body.classList.add(constants.uiState.ERROR)
      feedback.classList.add(constants.uiState.ERROR)
      stacktrace = `${error}\n${stacktrace}`
      utils.updateCursor(
        document.body,
        constants.emojis.body[constants.uiState.ERROR],
        constants.size.LG,
      )
      utils.updateCursor(
        animateButton,
        constants.emojis.animate[constants.uiState.ERROR],
        constants.size.SM,
      )
    } finally {
      function loop() {
        frame = window.requestAnimationFrame(loop)

        emojis = emojis.map((emoji) => {
          emoji.y += 0.7 * emoji.ratio
          if (emoji.y > 100) emoji.y = -20
          return emoji
        })
      }
      loop()
    }
  }

  function handleRefresh(event) {
    utils.updateCursor(
      document.body,
      constants.emojis.body[constants.uiState.DEFAULT],
      constants.size.LG,
    )
    utils.updateCursor(
      animateButton,
      constants.emojis.animate[constants.uiState.DEFAULT],
      constants.size.SM,
    )
    location.reload()
  }

  function handleClearEmojis(event) {
    window.cancelAnimationFrame(frame)
    emojis = []
  }

  onMount(() => {
    utils.updateCursor(
      document.body,
      constants.emojis.body[constants.uiState.DEFAULT],
      constants.size.LG,
    )
    utils.updateCursor(
      animateButton,
      constants.emojis.animate[constants.uiState.DEFAULT],
      constants.size.SM,
    )
    // utils.updateCursor(
    //   refreshButton,
    //   constants.emojis.refresh[constants.uiState.DEFAULT],
    //   constants.size.SM,
    // )
    // utils.updateCursor(
    //   refreshButton,
    //   constants.emojis.refresh[constants.uiState.DEFAULT],
    //   constants.size.SM,
    // )
    return () => window.cancelAnimationFrame(frame)
  })
</script>

<section class={`display ${$uiState}`} data-cy="display">
  <canvas bind:this={canvas} data-cy="canvas" />
  <div class="feedback" bind:this={feedback} data-cy="feedback">
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
    on:click={handleAnimate}
    bind:this={animateButton}
    class={`btn-jumbo fire-starter ${animateButtonState}`}
    aria-label="Animate" />
  <button
    data-cy="btn-clear-emojis"
    on:click={handleClearEmojis}
    bind:this={clearEmojisButton}
    class={'btn-jumbo sponge'}
    aria-label="Clear emoji feedback" />
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
