<script>
  // @ts-check
  import {onMount, createEventDispatcher} from 'svelte'

  import * as constants from '../types/constants.js'
  import * as utils from '../libs/utils.js'
  import * as draw from '../libs/draw.js'
  let xPosition = 0
  let yPosition = 0
  let animateButton
  let refreshButton
  const dispatch = createEventDispatcher()
  function animate(event) {
    event.preventDefault()
    dispatch('animate', event)
  }
  function refresh(event) {
    event.preventDefault()
    dispatch('refresh', event)
  }

  onMount(() => {})
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
    data-cy="button-animate"
    on:click={animate}
    bind:this={animateButton}
    class="jumbo fire-starter"
    aria-label="Animate" />
  <button
    data-cy="button-refresh"
    on:click={refresh}
    bind:this={refreshButton}
    class="jumbo shower"
    aria-label="Refresh" />
</aside>
