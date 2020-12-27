<script>
  import {createEventDispatcher} from 'svelte'

  const dispatch = createEventDispatcher()

  // @ts-check
  export let angle = 0
  const angleMax = 360

  const handleAngleChange = () => {
    dispatch('updateAngle', {
      value: angle,
    })
  }
</script>

<style lang="scss">
  @import '../styles/input-range.scss';
</style>

<label>
  angle:
  {angle}
  <input
    data-cy="angle-range"
    type="range"
    bind:value={angle}
    max={angleMax}
    on:input={handleAngleChange} />
</label>
