import {Then, And, Given} from 'cypress-cucumber-preprocessor/steps'
import * as constants from '../../../src/types/constants.js'

const rootUrl = '/'
const buttonAnimate = '[data-cy="button-animate"]'
const sectionDisplay = '[data-cy="display"]'
const stacktrace = '[data-cy="stacktrace"]'
const feedback = '[data-cy="feedback"]'
const canvas = '[data-cy="canvas"]'

Given('I arrive on the playground for the first time', () => {
  // TODO
  cy.visit(rootUrl)
})

describe('Fresh play - success', () => {
  // TODO : fix animation!
  And('The animation is a success', () => {
    cy.get(buttonAnimate)
      .click()
      .then(() => {
        cy.get(sectionDisplay).should('have.class', constants.uiState.SUCCESS)
      })
  })
  Then('I can see the confetti', () => {
    // TODO
  })
})

describe('Fresh play - error', () => {
  // TODO : mock error in animation to test that error UI displays correctly (init scene, draw: unit tests there ?)
  And('The animation has an error', () => {
    cy.get(buttonAnimate)
      .click()
      .then(() => {
        cy.get(sectionDisplay).should('have.class', constants.uiState.ERROR)
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
