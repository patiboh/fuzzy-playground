import {And, Then} from 'cypress-cucumber-preprocessor/steps'
import * as PlaygroundPage from '../../../pages/playground-page'

And(/^I play the 'Translation' animation$/, () => {
  PlaygroundPage.playAnimation('Translation')
})

Then(/^I can see coordinates handles for X and Y$/, () => {
  PlaygroundPage.findCoordinates()
})

And(/^I can translate a rectangle in the canvas$/, () => {
  // TODO
})
