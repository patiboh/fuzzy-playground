<script>
  // @ts-check
  import {createEventDispatcher} from 'svelte'

  const dispatch = createEventDispatcher()

  export let animations = undefined
  
  let handleClick = (event) => {
    const element = event.target
    dispatch('loadAnimation', {
      animation: element.getAttribute('data-animation'),
    })
  }
</script>

<style lang="scss">
  @import '../styles/buttons.scss';
  @import '../styles/animation-menu.scss';
</style>

<div class="btn-group animation-menu">
  {#each animations as animation}
    <button
      class="btn-menu"
      on:click={handleClick}
      data-animation={animation.id}>
      {animation.name}
    </button>
  {/each}
</div>
