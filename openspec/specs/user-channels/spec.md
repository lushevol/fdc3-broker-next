# User Channels

## ADDED Requirements

### Requirement: User Channel Membership

The system MUST provide mechanisms for tiles to join and leave user channels.

#### Scenario: Join User Channel

Given a tile "Tile A"
When "Tile A" joins channel "red"
Then "Tile A" current channel should be "red"

#### Scenario: Leave User Channel

Given a tile "Tile A" on channel "red"
When "Tile A" leaves the current channel
Then "Tile A" current channel should be null

#### Scenario: Switch Channels

Given a tile "Tile A" on channel "red"
When "Tile A" joins channel "blue"
Then "Tile A" current channel should be "blue"
And "Tile A" should not receive broadcasts from "red"

### Requirement: Channel Broadcasting

The system MUST support context broadcasting isolated to the current user channel.

#### Scenario: Broadcast works on channel

Given a tile "Tile A" on channel "red"
And a tile "Tile B" on channel "red"
And a tile "Tile C" on channel "blue"
When "Tile A" broadcasts context "ctx1"
Then "Tile B" should receive "ctx1"
And "Tile C" should not receive "ctx1"
