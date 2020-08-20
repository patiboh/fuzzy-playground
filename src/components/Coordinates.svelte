<script>
  // @ts-check
  import {onMount, createEventDispatcher} from 'svelte'
  let xPosition = 0
  let yPosition = 0
</script>

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
