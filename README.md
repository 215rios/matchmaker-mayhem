# Matchmaker Mayhem

## Description
Matchmaker Mayhem is a browser-based wedding matchmaking game built with vanilla HTML, CSS, and JavaScript. Players customize Person 1, define preferred partner traits, choose a fixed character for Person 2, and reveal a playful wedding result with animated feedback.

## Pastel Theme System
The interface uses a dating-sim-inspired pastel palette:
- Creamsicle: `#FFD6A5`, `#FFB86B`
- Lavender: `#CDB4DB`, `#B79ACF`
- Blush: `#FFCAD4`, `#F4A7B9`
- Mint: `#B8E0D2`, `#A2D5C6`
- Soft Denim: `#A7C7E7`, `#89B0D9`

## Features
- Card-based pastel UI with improved spacing, hierarchy, hover states, and selected states
- Emoji character portrait cards for the existing fixed characters
- Styled Person 1 player card with trait summary, desired partner summary, and vibe emoji
- Matchmaking animation screen with rotating status messages before results appear
- Weighted compatibility scoring with a small chemistry factor for variation
- Score breakdown cards and varied wedding outcome descriptions
- Visual feedback effects including confetti, sparkle accents, and runaway-result shake
- Local background wedding music with a Play/Pause toggle and low default volume

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
3. Customize Person 1's role, style, vibe emoji, traits, and desired partner traits.
4. Choose Person 2's role and select one of the fixed character cards.
5. Optionally start the background music with the `Play Music` button.
6. Click `Matchmake` to view the matchmaking animation and final result.

## File Structure
- `index.html` - App structure, audio element, matchmaking overlay, and footer attribution
- `styles.css` - Pastel theme system, card-based layout, responsive styling, and animations
- `script.js` - Character rendering, compatibility scoring, matchmaking flow, music controls, and result effects
- `README.md` - Project overview, feature summary, and music attribution
