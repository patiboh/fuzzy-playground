<script>
  // @ts-check
  import {onMount, createEventDispatcher} from 'svelte'
  import * as utils from '../libs/utils.js'
  import * as draw from '../libs/draw.js'

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
  let xPosition = 0
  let yPosition = 0
  let animateButton
  let refreshButton
  const dispatch = createEventDispatcher()
  function animate() {
    dispatch('animate')
  }
  function refresh() {
    dispatch('refresh')
  }

  onMount(() => {
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
    on:click={animate}
    bind:this={animateButton}
    class="jumbo fire-starter"
    aria-label="Animate" />
  <button
    on:click={refresh}
    bind:this={refreshButton}
    class="jumbo shower"
    aria-label="Refresh" />
</aside>
