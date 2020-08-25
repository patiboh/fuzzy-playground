<script>
  import {onMount} from 'svelte'

  import * as constants from '../types/constants.js'

  import {uiState, currentCursor} from '../stores.js'

  // Inputs
  let playButton
  let refreshButton
  let resetButton

  // UI feedback
  let playgroundState
  let emojiCursor

  // Event Handlers
  export let handlePlay = () => {}
  export let handleRefresh = () => {}
  export let handleReset = () => {}

  const uiStateUnsub = uiState.subscribe((value) => {
    playgroundState = value
  })

  const emojiFeedbackUnsub = currentCursor.subscribe((value) => {
    if (value !== emojiCursor) {
      emojiCursor = value
    }
  })

  function handlePlayButtonFocus(event) {
    if (playgroundState === constants.uiState.DEFAULT) {
      uiState.set(constants.uiState.FOCUS)
    }
  }

  function handlePlayButtonBlur(event) {
    if (playgroundState === constants.uiState.FOCUS) {
      uiState.set(constants.uiState.DEFAULT)
    }
  }
  onMount(() => {
    return () => {
      uiStateUnsub()
      emojiFeedbackUnsub()
    }
  })
</script>

<style lang="scss">
  @import '../styles/buttons.scss';
  @import '../styles/ui-controls.scss';
</style>

<div class="btn-group ui-controls">
  <button
    data-cy="btn-play"
    on:focus={handlePlayButtonFocus}
    on:mouseover={handlePlayButtonFocus}
    on:mouseleave={handlePlayButtonBlur}
    on:click={handlePlay}
    bind:this={playButton}
    class={`btn-jumbo fire-starter ${playgroundState}`}
    style={`cursor: ${emojiCursor}`}
    aria-label="Play" />
  <button
    data-cy="btn-clear-emojis"
    on:click={handleReset}
    bind:this={resetButton}
    class={'btn-jumbo sponge'}
    aria-label="Reset playground" />
  <button
    data-cy="btn-refresh"
    on:click={handleRefresh}
    bind:this={refreshButton}
    class={'btn-jumbo shower'}
    aria-label="Refresh page" />
</div>
