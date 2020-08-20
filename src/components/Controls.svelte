<script>
  // @ts-check
  import {onMount} from 'svelte'

  import * as constants from '../types/constants.js'
  import * as utils from '../libs/utils.js'
  import * as draw from '../libs/draw.js'

  import {uiState, generateCursor} from '../stores.js'

  // Inputs
  let playButton
  let refreshButton
  let clearEmojisButton

  // UI feedback
  let playgroundState
  let emojiCursor

  // Event Handlers
  export let handlePlay = () => {}
  export let handleRefresh = () => {}
  export let handleClearEmojis = () => {}

  const uiStateUnsub = uiState.subscribe((value) => {
    playgroundState = value
  })

  const emojiFeedbackUnsub = generateCursor.subscribe((value) => {
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

<aside class="btn-group">
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
    on:click={handleClearEmojis}
    bind:this={clearEmojisButton}
    class={'btn-jumbo sponge'}
    aria-label="Clear emoji animation" />
  <button
    data-cy="btn-refresh"
    on:click={handleRefresh}
    bind:this={refreshButton}
    class={'btn-jumbo shower'}
    aria-label="Refresh" />
</aside>
