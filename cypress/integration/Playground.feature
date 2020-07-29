Feature: Playground

  Scenario: Fresh play - success
    Given I arrive on the playground for the first time
    When I launch an animation
    And The animation is a success
    Then I can see the confetti

  Scenario: Fresh play - error
    Given I arrive on the playground for the first time
    When I launch an animation
    And The animation has an error
    Then I can see the poop
    And I can see the error