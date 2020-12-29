<script>
  import {createEventDispatcher} from 'svelte'

  const dispatch = createEventDispatcher()

  // @ts-check
  export let label = ''
  export let value = 0
  export let max = 0
  export let step = '0.01'

  const handleInput = () => {
    dispatch('input', {
      value,
    })
  }
</script>

<style lang="scss">
  @import '../styles/input-range.scss';
</style>

<label>
  {label}:
  {value}
  <input
    data-cy={`${label}-range`}
    type="range"
    bind:value
    {max}
    {step}
    on:input={handleInput} />
</label>
