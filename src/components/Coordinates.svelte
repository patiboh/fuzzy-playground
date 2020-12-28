<script>
  import {createEventDispatcher} from 'svelte'

  const dispatch = createEventDispatcher()

  // @ts-check
  export let xCoord = 0
  export let yCoord = 0
  export let maxX
  export let maxY

  const handleXCoordChange = () => {
    dispatch('updateXCoord', {
      value: xCoord,
    })
  }
  const handleYCoordChange = () => {
    dispatch('updateYCoord', {
      value: yCoord,
    })
  }
</script>

<style lang="scss">
  @import '../styles/input-range.scss';
</style>

<label>
  x =
  {xCoord}
  <input
    data-cy="coord-x"
    type="range"
    bind:value={xCoord}
    max={maxX}
    on:input={handleXCoordChange} />
</label>
<label>
  y =
  {yCoord}
  <input
    data-cy="coord-y"
    type="range"
    bind:value={yCoord}
    max={maxY}
    on:input={handleYCoordChange} />
</label>
