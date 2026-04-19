# Matchmaker Mayhem

## Description
Matchmaker Mayhem is a browser-based wedding matchmaking game built with vanilla HTML, CSS, and JavaScript. The experience now runs as a multi-step wedding journey wizard where players move through setup, hidden-logic matching, wedding planning, matchmaking, and a final result screen.

## Play Online
Click here to play in web browser: https://215rios.github.io/matchmaker-mayhem/

## Pastel Theme System
The interface uses a dating-sim-inspired pastel palette:
- Creamsicle: `#FFD6A5`, `#FFB86B`
- Lavender: `#CDB4DB`, `#B79ACF`
- Blush: `#FFCAD4`, `#F4A7B9`
- Mint: `#B8E0D2`, `#A2D5C6`
- Soft Denim: `#A7C7E7`, `#89B0D9`

## Features
- Multi-slide wedding journey system with six state-driven steps
- `Next` and `Back` navigation with validation before moving forward
- Pastel card-page layout with progress bar and soft slide transitions
- Emoji partner portrait cards using short personality blurbs instead of visible trait lists
- Hidden trait-based compatibility logic preserved behind the scenes
- Wedding preference system with cake, music, and invitation selections
- Three lightweight wedding minigames that run before the final result
- Random NPC event system that can help or hurt the final outcome
- Weighted compatibility scoring with chemistry randomness and wedding preference bonuses
- Matchmaking animation screen with rotating status messages before results appear
- Result screen with score breakdown, wedding outcome variations, and replay support
- Local background wedding music with a Play/Pause toggle and low default volume

## Slide Flow
1. Person 1 Setup
2. Personality Traits
3. Partner Selection
4. Wedding Preferences
5. Matchmaking
6. Result Screen

Only one slide is visible at a time. State is preserved while moving between slides.

## Hidden Matching Logic
- Partner cards show emoji, name, role, and a short descriptive blurb
- Character trait arrays remain hidden from the player
- Matching still uses the existing trait-based system internally
- Wedding preferences add extra score modifiers:
  - Cake match: `+3`
  - Music match: `+4`
  - Invitation match: `+2`
- A shared `bonusScore` value is added through wedding minigames and one random NPC event before the final score is calculated

## Wedding Gameplay System
- After the matchmaking step begins, the game runs three quick wedding-themed minigames before showing the result
- Cake Timing:
  - Perfect: `+10`
  - Good: `+5`
  - Miss: `-5`
- Bouquet Catch:
  - Success: `+6`
  - Miss: `0`
- Dance Floor Hype:
  - High energy: `+8`
  - Medium: `+4`
  - Low: `0`
- Each minigame displays its feedback in a popup and contributes to the shared `bonusScore`

## Random NPC Event System
- One random NPC event triggers after the minigames and before the final result
- Isabella (Wedding Planner) can boost the celebration with a strong positive bonus
- Your Family can create a warm positive crowd effect
- Andrew (Friend) can create an awkward negative moment
- DJ Marvin can swing positive or negative depending on the event roll
- The NPC event also appears in the popup flow and modifies `bonusScore`

## Play Again Reset Behavior
- The `Play Again` button appears only after a completed result
- Clicking it clears the selected partner, closes the overlay, removes confetti and active result effects, resets result content, and returns the wizard to Slide 1
- Person 1 customization and wedding setup remain available in the same session unless the player changes them manually

## Music System
- The app uses the local file `wedding_music.mp3`
- Music does not autoplay on page load
- Music starts only after the user presses the music button
- The player includes a Play/Pause toggle
- Default volume is set low for subtle ambience

## Music Attribution
Romantic Music for Weddings and Valentine’s Day | Love by Alex-Productions  
Source: https://onsound.eu/  
Music promoted by https://www.chosic.com/free-music/all/  
Licensed under Creative Commons CC BY 3.0  
https://creativecommons.org/licenses/by/3.0/

## How to Run
1. Open the project folder.
2. Open `index.html` in a modern web browser.
3. Move through the six wedding journey slides using `Next` and `Back`.
4. Complete all required selections for Person 1, traits, partner choice, and wedding preferences.
5. Click `Start Matchmaking` on the matchmaking slide.
6. Watch the three wedding minigames and one random NPC event play out in sequence.
7. Review the result on the final slide, then use `Play Again` to start a new match flow.

## File Structure
- `index.html` - Six-slide wizard structure, audio element, navigation, result screen, gameplay popup, and footer attribution
- `styles.css` - Pastel theme system, slide layout, transitions, gameplay popup styling, responsive styling, and animations
- `script.js` - Slide state management, validation, partner rendering, minigames, NPC event flow, compatibility scoring, replay reset logic, music controls, and result effects
- `README.md` - Project overview, wizard flow, gameplay systems, hidden matching logic, and music attribution
