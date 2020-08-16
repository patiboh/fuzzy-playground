<script>
  // @ts-check
  import {onMount} from 'svelte'

  import * as constants from '../types/constants.js'
  import * as utils from '../libs/utils.js'
  import * as draw from '../libs/draw.js'

  let xPosition = 0
  let yPosition = 0
  let animateButton
  let refreshButton
  let feedback
  let stacktrace

  function surprise(characters) {
    return new Array(100)
      .fill(0)
      .map((_, i) => {
        return {
          character: characters[i % characters.length],
          x: Math.random() * 100,
          y: -10 - Math.random() * 100,
          radius: 0.1 + Math.random() * 1,
        }
      })
      .sort((a, b) => a.radius - b.radius)
  }

  function handleAnimate() {
    animateButton.classList.add(constants.uiState.ACTIVE)
    utils.updateCursor(
      animateButton,
      constants.emojis.animate[constants.uiState.ACTIVE],
      constants.size.SM,
    )
    const confetti = document.getElementsByClassName(
      constants.confetti.CONFETTI,
    )
    const poop = document.getElementsByClassName(constants.confetti.POOP)
    Array.from(confetti).map((element) => {
      element.classList.remove(constants.confetti.YAY)
    })
    Array.from(poop).map((element) => {
      element.classList.remove(constants.confetti.NAY)
    })
    try {
      const webGlProps = draw.initScene()
      const webGlAnimation = window.setInterval(() => {
        draw.drawScene(webGlProps)
      }, 1)

      window.setTimeout(() => {
        animateButton.classList.remove(constants.uiState.ACTIVE)
        animateButton.classList.remove(constants.uiState.ERROR)
        animateButton.classList.add(constants.uiState.SUCCESS)
        // this = animate button
        utils.updateCursor(
          document.body,
          constants.emojis.body[constants.uiState.SUCCES],
          constants.size.LG,
        )
        utils.updateCursor(
          animateButton,
          constants.emojis.animate[constants.uiState.SUCCES],
          constants.size.SM,
        )
        Array.from(confetti).map((element) => {
          element.classList.add(constants.confetti.YAY)
        })
        window.clearInterval(webGlAnimation)
      }, 1000)
    } catch (error) {
      animateButton.classList.remove(constants.uiState.ACTIVE)
      animateButton.classList.remove(constants.uiState.SUCCESS)
      animateButton.classList.add(constants.uiState.ERROR)
      document.body.classList.add(constants.uiState.ERROR)
      feedback.classList.add(constants.uiState.ERROR)
      stacktrace.append(`${error}\n`)
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
      Array.from(poop).map((element) => {
        element.classList.add(constants.confetti.NAY)
      })
      console.error(error)
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
    utils.updateCursor(
      refreshButton,
      constants.emojis.refresh[constants.uiState.DEFAULT],
      constants.size.SM,
    )
  })
</script>

<section class="display">
  <canvas id="canvas" />
  <div bind:this={feedback} data-cy="feedback">
    <pre bind:this={stacktrace} />
  </div>
</section>

<aside class="controls">
  <div class="coordinates">
    <label>
      x = {xPosition}
      <input type="range" bind:value={xPosition} />
    </label>
    <label>
      y = {yPosition}
      <input type="range" bind:value={yPosition} />
    </label>
  </div>
  <button
    data-cy="button-animate"
    on:click={handleAnimate}
    bind:this={animateButton}
    class="jumbo fire-starter"
    aria-label="Animate" />
  <button
    data-cy="button-refresh"
    on:click={handleRefresh}
    bind:this={refreshButton}
    class="jumbo shower"
    aria-label="Refresh" />
</aside>
