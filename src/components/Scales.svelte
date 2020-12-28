<script>
  import {createEventDispatcher} from 'svelte'

  const dispatch = createEventDispatcher()

  // @ts-check
  export let xScale
  export let yScale
  export let maxScaleX
  export let minScaleX
  export let maxScaleY
  export let minScaleY

  const handleXScaleChange = () => {
    dispatch('updateXScale', {
      value: xScale,
    })
  }
  const handleYScaleChange = () => {
    dispatch('updateYScale', {
      value: yScale,
    })
  }
</script>

<style lang="scss">
  @import '../styles/input-range.scss';
</style>

<label>
  scale X:
  {xScale}
  <input
    data-cy="coord-x"
    type="range"
    bind:value={xScale}
    min={minScaleX}
    max={maxScaleX}
    step="0.01"
    on:input={handleXScaleChange} />
</label>
<label>
  scale Y:
  {yScale}
  <input
    data-cy="coord-y"
    type="range"
    bind:value={yScale}
    min={minScaleY}
    max={maxScaleY}
    step="0.01"
    on:input={handleYScaleChange} />
</label>
