<script>
  // @ts-check
  import {onMount} from 'svelte'
  import * as utils from '../libs/utils.js'
  import * as draw from '../libs/draw.js'

  let xPosition = 0
  let yPosition = 0
  const EMOJIS = {
    BODY: {
      DEFAULT: {
        utf8: 0x1f941, // 🥁 drums
      },

      SUCCESS: {
        utf8: 0x2728, // ✨ sparkles
      },

      ERROR: {
        utf8: 0x1f47b, // 👻 ghost
      },
    },
    ANIMATE: {
      DEFAULT: {
        utf8: 0x26a1, // ⚡️ lightning
      },
      SUCCESS: {
        utf8: 0x1f64c, // 🙌 raised handss
      },
      ERROR: {
        utf8: 0x1f52b, // 🔫 water pistol
      },
      ACTIVE: {
        utf8: 0x1f4a5, // 💥 fire spark
      },
    },
    REFRESH: {
      DEFAULT: {
        utf8: 0x1f9fd, // 🧽 sponge
      },
    },
  }
  const CURSOR_SIZE = {
    BODY: 'LG',
    BUTTON: 'SM',
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
    utils.updateCursor(document.body, 0x2728, 'LG') // ✨ sparkles
    utils.updateCursor(this, 0x1f4a5, 'SM') // 💥 fire spark
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
        utils.updateCursor(animateButton, 0x1f64c, 'SM') // 🙌 raised hands
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
      utils.updateCursor(document.body, 0x1f47b, 'LG') // 👻 ghost
      // utils.updateCursor(animate, 0x1f327, 'SM') // 🌧 cloud with rain
      utils.updateCursor(animateButton, 0x1f52b, 'SM') // 🔫 water pistol
      Array.from(poop).map((element) => {
        element.classList.add('nay')
      })
      console.error(error)
    }
  }

  function refresh() {
    utils.updateCursor(document.body, 0x1f941, 'LG') // 🥁 drums
    utils.updateCursor(animateButton, 0x26a1, 'SM') // ⚡️ lightning
    location.reload()
  }
  const handleAnimate = () => animate()
  const handleRefresh = () => refresh()

  onMount(() => {
    utils.updateCursor(document.body, 0x1f941, 'LG') // 🥁 drums
    utils.updateCursor(animateButton, 0x26a1, 'SM') // ⚡️ lightning
    utils.updateCursor(refreshButton, 0x1f9fd, 'SM') // 🧽 sponge
    animateButton.addEventListener('click', animate)
    refreshButton.addEventListener('click', refresh)
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
