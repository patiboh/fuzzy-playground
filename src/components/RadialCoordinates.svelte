<script>
  import {createEventDispatcher} from 'svelte'

  const dispatch = createEventDispatcher()

  // @ts-check
  export let xRad = 0
  export let yRad = 0
  export let maxX
  export let maxY

  const handleXRadChange = () => {
    dispatch('updateXRad', {
      value: xRad,
    })
  }
  const handleYRadChange = () => {
    dispatch('updateYRad', {
      value: yRad,
    })
  }
</script>

<style lang="scss">
  @import '../styles/radial-coordinates.scss';
</style>

<div class="radial-coordinates" data-cy="radial-coordinates">
  <!-- <label>
     // TODO
    x =
    {xRad}
    <input
      data-cy="coord-x"
      type="range"
      bind:value={xRad}
      max={maxX}
      on:input={handleXRadChange} />
  </label>
  <label>
    y =
    {yRad}
    <input
      data-cy="coord-y"
      type="range"
      bind:value={yRad}
      max={maxY}
      on:input={handleYRadChange} />
  </label> -->
</div>
