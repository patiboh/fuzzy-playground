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
