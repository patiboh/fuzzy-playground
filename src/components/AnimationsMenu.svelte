<script>
  // @ts-check
  import {onMount, createEventDispatcher} from 'svelte'

  import {animations} from '../stores.js'

  const dispatch = createEventDispatcher()

  let menumItems = []

  const animationsUnsub = animations.subscribe((value) => {
    menumItems = value
  })

  let handleClick = (event) => {
    const element = event.target
    dispatch('loadAnimation', {
      animationId: element.getAttribute('data-animation'),
    })
  }

  onMount(() => {
    return () => {
      animationsUnsub()
    }
  })
</script>

<style lang="scss">
  @import '../styles/animation-menu.scss';
</style>

<div class="btn-group animation-menu" data-cy="animations-menu">
  {#each menumItems as {name, id} (id)}
    <button
      class="btn-menu"
      on:click={handleClick}
      data-animation={id}
      data-cy={id}>
      {name}
    </button>
  {/each}
</div>
