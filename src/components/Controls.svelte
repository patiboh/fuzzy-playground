<script>
  import * as constants from '../types/constants.js'
  import {uiState} from '../stores.js'
  import EmojiButton from './EmojiButton.svelte'

  // UI feedback
  let playgroundState

  uiState.subscribe((value) => {
    playgroundState = value
  })

  export let handlePlay = () => {}

  function handlePlayButtonFocus() {
    if (playgroundState === constants.uiState.DEFAULT) {
      uiState.set(constants.uiState.FOCUS)
    }
  }

  function handlePlayButtonBlur() {
    if (playgroundState === constants.uiState.FOCUS) {
      uiState.set(constants.uiState.DEFAULT)
    }
  }
</script>

<style lang="scss">
  @import '../styles/controls.scss';
</style>

<div class="btn-group ui-controls">
  <EmojiButton
    dataCy="btn-play"
    buttonClass="firestarter"
    buttonLabel="Play"
    handleClick={handlePlay}
    handleFocus={handlePlayButtonFocus}
    handleBlur={handlePlayButtonBlur} />
</div>
