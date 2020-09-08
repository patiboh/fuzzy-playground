<script>
  import {createEventDispatcher} from 'svelte'

  const dispatch = createEventDispatcher()

  // @ts-check
  export let xCoord = 0
  export let yCoord = 0
  export let maxX = undefined
  export let maxY = undefined

  let handleXCoordChange = () => {
    dispatch('updateXCoord', {
      value: xCoord,
    })
  }
  let handleYCoordChange = () => {
    dispatch('updateYCoord', {
      value: yCoord,
    })
  }
</script>

<style lang="scss">
  @import '../styles/coordinates.scss';
</style>

<div class="coordinates">
  <label>
    x = {xCoord}
    <input
      type="range"
      bind:value={xCoord}
      max={maxX}
      on:input={handleXCoordChange} />
  </label>
  <label>
    y = {yCoord}
    <input
      type="range"
      bind:value={yCoord}
      max={maxY}
      on:input={handleYCoordChange} />
  </label>
</div>
