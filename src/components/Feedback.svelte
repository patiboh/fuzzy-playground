<script>
  // @ts-check
  import {uiState} from '../stores.js'
  // UI feedback
  export let stacktrace = ''

  let playgroundState

  const uiStateUnsub = uiState.subscribe((value) => {
    playgroundState = value
  })
</script>

<style lang="scss">
  @import '../styles/feedback.scss';
</style>

<div class={`feedback ${playgroundState}`} data-cy="feedback">
  <pre class="stacktrace" data-cy="stacktrace">{stacktrace}</pre>
</div>
