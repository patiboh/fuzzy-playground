import {Then, And, Given, When} from 'cypress-cucumber-preprocessor/steps'

const rootUrl = '/'
Given('I arrive on the playground for the first time', () => {
  // TODO
  cy.visit(rootUrl)
})
When('I launch an animation', () => {
  // TODO
})

describe('Fresh play - success', () => {
  And('The animation is a success', () => {
    // TODO
  })
  Then('I can see the confetti', () => {
    // TODO
  })
})

describe('Fresh play - error', () => {
  And('The animation has an error', () => {
    // TODO
  })
  Then('I can see the poop', () => {
    // TODO
  })
  And('I can see the error', () => {
    // TODO
  })
})
