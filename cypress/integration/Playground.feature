Feature: Playground
  Background:
    Given I arrive on the playground for the first time

  Scenario: Fresh play - success
    And The animation is a success
    Then I can see the confetti

# Scenario: Fresh play - error
#   And The animation has an error
#   Then I can see the poop
#   And I can see the error
