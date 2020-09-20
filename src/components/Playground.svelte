<script>
  import * as draw from '../libs/draw.js'
  import * as utils from '../libs/utils.js'

  let canvas
  let width
  let height
  let frame

  let emojis = utils.multiply(['😘'])
  // Audio
  let drumroll
  let playbackRate = 2 // augmente la vitesse d'écoute
  let interval
  let timeout
  // 4200 ~= point d'inflexion
  // du roulement de tambours à cymbale
  let animationDuration = 4200 / playbackRate

  function startAnimation() {
    drumroll.play()
    const webGlProps = draw.initScene(canvas)
    interval = setInterval(() => {
      draw.rectanglesScene(webGlProps)
    }, 1)
    // Arrête l'animation au point d'inflexion
    timeout = setTimeout(() => {
      // arrête l'animation
      clearInterval(interval)
      clearTimeout(timeout)
      loopEmojis() // 🎉
    }, animationDuration)
  }

  function loopEmojis() {
    frame = requestAnimationFrame(loopEmojis)
    emojis = emojis.map((emoji) => {
      emoji.y += 0.7 * emoji.ratio
      if (emoji.y > 100) emoji.y = -20
      return emoji
    })
  }
</script>

<section class="output">
  <button on:click={startAnimation}>Play</button>
  <canvas bind:this={canvas} {width} {height} />

  <audio bind:this={drumroll} bind:playbackRate>
    <source src="drumroll.ogg" type="audio/ogg" />
    <track kind="captions" />
  </audio>
</section>

{#each emojis as emoji}
  <span
    data-cy="emoji-{emoji.character}"
    class="emoji"
    style="left: {emoji.x}%; top: {emoji.y}%; transform: scale({emoji.ratio})">
    {emoji.character}
  </span>
{/each}
