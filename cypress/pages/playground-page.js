// PLayground controls
const BTN_PLAY = '[data-cy="btn-play"]'
const BTN_RESET = '[data-cy="btn-reset"]'
const BTN_REFRESH = '[data-cy="btn-refresh"]'
const DRUMROLL = '[data-cy="drumroll"]'
const OUTPUT = '[data-cy="output"]'
// const CANVAS = '[data-cy="canvas"]'

// Animations menu
const ANIMATIONS_MENU = '[data-cy="animations-menu"]'
const BTN_RANDOM_RECTS = '[data-cy="L1"]'
const BTN_WITH_DRUMS = '[data-cy="L1-2"]'
const BTN_TRANSLATE = '[data-cy="L2"]'
const CONFETTI = '[data-cy="emoji-🥳"]'
const POOP = '[data-cy="emoji-💩"]'
const ANIMATION_RANDOM_RECTS = 'Random rectangles'
const ANIMATION_WITH_DRUMS = '... with drums'
const ANIMATION_TRANSLATION = 'Translation'

// Animation controls
const COORDINATES = '[data-cy="coordinates"]'
const COORD_X = '[data-cy="coord-x"]'
const COORD_Y = '[data-cy="coord-y"]'
const rootUrl = '/'
export function visit() {
  cy.visit(rootUrl)
}

export function findAnimationsMenu() {
  cy.get(ANIMATIONS_MENU).find(BTN_RANDOM_RECTS)
  cy.get(ANIMATIONS_MENU).find(BTN_WITH_DRUMS)
  cy.get(ANIMATIONS_MENU).find(BTN_TRANSLATE)
}

export function findCoordinates() {
  cy.get(COORDINATES).then(() => {
    cy.get(OUTPUT).then(() => {
      const outputHeight = 580 // TODO : fix value: should match canvas width (test on resize ?)
      const outputWidth = 536 // TODO : fix value: should match canvas width (test on resize ?)

      cy.get(COORD_X).then(($coord) => {
        expect($coord).to.have.attr('max', outputHeight)
      })
      cy.get(COORD_Y).then(($coord) => {
        expect($coord).to.have.attr('max', outputWidth)
      })
    })
  })
}

export function pressPlay() {
  cy.get(BTN_PLAY).click()
}

export function pressReset() {
  cy.get(BTN_RESET).click()
}

export function pressRefresh() {
  cy.get(BTN_REFRESH).click()
}

export function playAnimation(animation) {
  if (animation === ANIMATION_RANDOM_RECTS) {
    cy.get(BTN_RANDOM_RECTS).contains(ANIMATION_RANDOM_RECTS).click()
  }
  if (animation === ANIMATION_WITH_DRUMS) {
    cy.get(BTN_WITH_DRUMS).contains(ANIMATION_WITH_DRUMS).click()
  }
  if (animation === ANIMATION_TRANSLATION) {
    cy.get(BTN_TRANSLATE).contains(ANIMATION_TRANSLATION).click()
  }
}

export function findTheConfetti() {
  cy.get(CONFETTI)
}

export function findThePoop() {
  cy.get(POOP)
}

export function listenToDrumroll() {
  cy.get(DRUMROLL)
  // TODO: test playback ?
}
