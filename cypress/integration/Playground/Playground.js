import {Then, And, Given} from 'cypress-cucumber-preprocessor/steps'
import * as constants from '../../../src/types/constants.js'

const rootUrl = '/'
const playButton = '[data-cy="btn-play"]'
const display = '[data-cy="display"]'
const canvas = '[data-cy="canvas"]'
const stacktrace = '[data-cy="stacktrace"]'
const feedback = '[data-cy="playground-feedback"]'
const buttonRefresh = '[data-cy="btn-clear-emojis"]'

Given('I arrive on the playground for the first time', () => {
  // TODO
  cy.visit(rootUrl)
  cy.get(buttonRefresh).click()
})

describe('Fresh play - success', () => {
  // TODO : fix animation!
  And('The animation is a success', () => {
    cy.get(playButton)
      .click()
      .then(() => {
        cy.get(display).should('have.class', constants.uiState.SUCCESS)
      })
  })
  Then('I can see the confetti', () => {
    // TODO
  })
})

describe('Fresh play - error', () => {
  // TODO : mock error in animation to test that error UI displays correctly (init scene, draw: unit tests there ?)
  And('The animation has an error', () => {
    // Fake invisibility of canvas element : test should fail with TypeError canvas not found
    cy.get(playButton)
      .click()
      .then(() => {
        cy.get(display).should('have.class', constants.uiState.ERROR)
      })
  })
  Then('I can see the poop', () => {
    // TODO
  })
  And('I can see the error', () => {
    cy.get(stacktrace).then(($stacktrace) => expect($stacktrace).to.be.visible)
    cy.get(feedback).then(($feedback) => expect($feedback).to.be.visible)
  })
})
