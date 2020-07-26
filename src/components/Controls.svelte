<script>
  // @ts-check
  import {onMount} from 'svelte'
  import * as utils from '../libs/utils.js'
  import * as draw from '../libs/draw.js'
  onMount(() => {
    const animateButton = document.getElementById('btn-animate')
    const refreshButton = document.getElementById('btn-refresh')
    utils.updateCursor(document.body, 0x1f941, 'LG') // 🥁 drums
    utils.updateCursor(animateButton, 0x26a1, 'SM') // ⚡️ lightning
    utils.updateCursor(refreshButton, 0x1f9fd, 'SM') // 🧽 sponge
    animateButton.addEventListener('click', animate)
    refreshButton.addEventListener('click', refresh)

    // Output
    const feedback = document.getElementById('feedback')
    const stacktrace = document.getElementById('stack-trace')

    // Coordinate Controls
    const xPositionInput = document.getElementById('in-position-x')
    const yPositionInput = document.getElementById('in-position-y')

    function refresh() {
      utils.updateCursor(document.body, 0x1f941, 'LG') // 🥁 drums
      utils.updateCursor(animateButton, 0x26a1, 'SM') // ⚡️ lightning
      location.reload()
    }

    function animate() {
      // this = "Animate" button
      animateButton.classList.add('active')
      utils.updateCursor(document.body, 0x2728, 'LG') // ✨ sparkles
      utils.updateCursor(animateButton, 0x1f4a5, 'SM') // 💥 fire spark
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
          utils.updateCursor(this, 0x1f64c, 'SM') // 🙌 raised hands
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
  })
</script>

<aside class="controls">
  <div class="coordinates">
    <label>
      x
      <span id="x-position-value" class="num-value" />
      <input type="range" name="x position input" id="in-position-x" />
    </label>
    <label>
      y
      <span id="y-position-value" class="num-value" />
      <input type="range" name="y position input" id="in-position-y" />
    </label>
  </div>
  <button
    id="btn-animate"
    type="button"
    class="jumbo fire-starter"
    aria-label="Animate" />
  <button
    id="btn-refresh"
    type="button"
    class="jumbo shower"
    aria-label="Refresh" />
</aside>
