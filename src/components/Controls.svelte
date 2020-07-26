<script>
  // @ts-check
  import {onMount} from 'svelte'
  import * as utils from '../libs/utils.js'
  import * as draw from '../libs/draw.js'

  let xPosition = 0
  let yPosition = 0
  const state = {
    DEFAULT: 'default',
    SUCCESS: 'success',
    FOCUS: 'focus',
    HOVER: 'hover',
    ACTIVE: 'active',
    ERROR: 'error',
  }
  const size = {
    LG: 'LG',
    SM: 'SM',
  }
  const emojis = {
    body: {
      default: 0x1f941, // 🥁 drums
      success: 0x2728, // ✨ sparkles
      error: 0x1f47b, // 👻 ghost
    },
    animate: {
      default: 0x26a1, // ⚡️ lightning
      success: 0x1f64c, // 🙌 raised handss
      error: 0x1f52b, // 🔫 water pistol // OR 0x1f327 // 🌧 cloud with rain
      active: 0x1f4a5, // 💥 fire spark
    },
    refresh: {
      default: 0x1f9fd, // 🧽 sponge
    },
  }
  let animateButton
  let refreshButton

  function animate() {
    // Output
    const feedback = document.getElementById('feedback')
    const stacktrace = document.getElementById('stack-trace')

    // Coordinate Controls
    const xPositionInput = document.getElementById('input-x')
    const yPositionInput = document.getElementById('input-y')
    animateButton.classList.add('active')
    utils.updateCursor(animateButton, emojis.animate[state.ACTIVE], size.SM)
    const confetti = document.getElementsByClassName('confetti')
    const poop = document.getElementsByClassName('poop')
    Array.from(confetti).map((element) => {
      element.classList.remove('yay')
    })
    Array.from(poop).map((element) => {
      element.classList.remove('nay')
    })
    try {
      const webGlProps = draw.initScene()
      const webGlAnimation = window.setInterval(() => {
        draw.drawScene(webGlProps)
      }, 1)

      window.setTimeout(() => {
        animateButton.classList.remove('active')
        animateButton.classList.remove('error')
        animateButton.classList.add('success')
        // this = animate button
        utils.updateCursor(document.body, emojis.body[state.SUCCES], size.LG)
        utils.updateCursor(animateButton, emojis.animate[state.SUCCES], size.SM)
        Array.from(confetti).map((element) => {
          element.classList.add('yay')
        })
        window.clearInterval(webGlAnimation)
      }, 1000)
    } catch (error) {
      animateButton.classList.remove('active')
      animateButton.classList.remove('success')
      animateButton.classList.add('error')
      document.body.classList.add('error')
      feedback.classList.add('error')
      stacktrace.append(`${error}\n`)
      utils.updateCursor(document.body, emojis.body[state.ERROR], size.LG)
      utils.updateCursor(animateButton, emojis.animate[state.ERROR], size.SM)
      Array.from(poop).map((element) => {
        element.classList.add('nay')
      })
      console.error(error)
    }
  }

  function refresh() {
    utils.updateCursor(document.body, emojis.body[state.DEFAULT], size.LG)
    utils.updateCursor(animateButton, emojis.animate[state.DEFAULT], size.SM)
    location.reload()
  }
  const handleAnimate = () => animate()
  const handleRefresh = () => refresh()

  onMount(() => {
    utils.updateCursor(document.body, emojis.body[state.DEFAULT], size.LG)
    utils.updateCursor(animateButton, emojis.animate[state.DEFAULT], size.SM)
    utils.updateCursor(refreshButton, emojis.refresh[state.DEFAULT], size.SM)
  })
</script>

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
    on:click={handleAnimate}
    bind:this={animateButton}
    class="jumbo fire-starter"
    aria-label="Animate" />
  <button
    on:click={handleRefresh}
    bind:this={refreshButton}
    class="jumbo shower"
    aria-label="Refresh" />
</aside>
