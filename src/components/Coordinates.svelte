<script>
  // @ts-check
  import {onMount} from 'svelte'
  export let xCoord = 0
  export let yCoord = 0
</script>

<style lang="scss">
  @import '../styles/coordinates.scss';
</style>

<aside class="coordinates">
  <label>
    x = {xCoord}
    <input type="range" bind:value={xCoord} />
  </label>
  <label>
    y = {yCoord}
    <input type="range" bind:value={yCoord} />
  </label>
</aside>
