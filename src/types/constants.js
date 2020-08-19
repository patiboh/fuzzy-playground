export const uiState = {
  DEFAULT: 'default',
  SUCCESS: 'success',
  FOCUS: 'focus',
  HOVER: 'hover',
  ACTIVE: 'active',
  ERROR: 'error',
}

// TODO : use typescript for these things
// export type playgroundState = uiState.DEFAULT | uiState.SUCCESS | uiState.ERROR
export const size = {
  LG: 'LG',
  SM: 'SM',
}
export const emojis = {
  splash: {
    default: '🥁', // 🥁 drums
    success: '✨', // ✨ sparkles
    error: '👻', // 👻 ghost
  },
  animate: {
    default: '⚡️', // ⚡️ lightning
    success: '🙌', // 🙌 raised hands
    error: '🌧', // 🌧 cloud with rain
    active: '💥', // 💥 fire spark
  },
  confetti: {
    tada: '🎉', // 🎉 party-popper
    star: '🌟', // 🌟 glowing star
    balloon: '🎈', // 🎈 balloon
    partyFace: '🥳', // 🥳 party-face
    confettiBall: '🎊', // 🎊 confetti-ball
  },
  error: {
    poop: '💩', // 💩 poop
    // typeScript: '🍱', // 🍱 bento box
    // lint: '🚨', // 🚨 rotating beacon
  },
  refresh: {
    default: '🧽', // 🧽 sponge
  },
}

export const customCursor = {
  LG:
    'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="120" style="font-size: 100px;"><text y="100">REPL</text></svg>\'), auto',
  SM:
    'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="50" height="60" style="font-size: 40px;"><text y="40">REPL</text></svg>\'), auto',
}
