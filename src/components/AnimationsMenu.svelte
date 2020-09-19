<script>
  import {createEventDispatcher} from 'svelte'
  import {animations} from '../stores.js'

  const dispatch = createEventDispatcher()
  let menumItems = []

  animations.subscribe((value) => {
    menumItems = value
  })

  const handleClick = (event) => {
    const element = event.target
    dispatch('loadAnimation', {
      animationId: element.getAttribute('data-id'),
    })
  }
</script>

<style lang="scss">
  @import '../styles/animations-menu.scss';
</style>

<div class="animations-menu" data-cy="animations-menu">
  {#each menumItems as {name, id, type}}
    <button
      class="btn-menu {type}"
      on:click={handleClick}
      data-id={id}
      data-cy={id}>
      {name}
    </button>
  {/each}
</div>
