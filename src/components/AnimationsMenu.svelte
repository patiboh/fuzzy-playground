<script>
  // @ts-check
  import {onMount, createEventDispatcher} from 'svelte'

  import {animations, currentAnimationId} from '../stores.js'

  const dispatch = createEventDispatcher()

  let menumItems = []

  const animationsUnsub = animations.subscribe((value) => {
    menumItems = value
  })

  let handleClick = (event) => {
    const element = event.target
    currentAnimationId.set(element.getAttribute('data-animation'))
    dispatch('loadAnimation')
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
  {#each menumItems as animation}
    <button
      class="btn-menu"
      on:click={handleClick}
      data-animation={animation.id}
      data-cy={animation.id}>
      {animation.name}
    </button>
  {/each}
</div>
