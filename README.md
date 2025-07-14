# Technical Task: Pokémon Explorer Application
Objective
Develop a basic Next.js application that fetches data from the PokéAPI, displays it according to a provided Figma design, and utilizes shadcn/ui components for the user interface.

## Project Setup & Running Instructions
- First, Clone the Repository using `git clone https://github.com/jasperhall477/pokemon-browser.git` or via github browser interface)
- Go to project folder in command prompt `cd pokemon-browser`
- Use Node.js to install packages
- Run development server to view the app `npm run dev`
- Wait for it to fully boot (5-10 seconds should say Compiled)
- Go to http://localhost:3000 in browser to view dev runtime of app

## Design and Component Decisions
o	Briefly explain your rationale for structuring your React components.
o	Discuss any specific shadcn/ui components you chose for particular parts of the UI and why they were suitable.
o	If you had to make any interpretations or minor deviations from the Figma design, please note them here and explain your reasoning.

## State Management Approach
o	Describe how you managed application state (e.g., Pokémon list, current page for pagination, selected Pokémon details).
o	Explain why you chose your particular approach (e.g., useState, useReducer, Context API, or a library if you felt it necessary, though simple solutions are fine for this scale).

## API Interaction Strategy
o	Outline how you handled fetching data from the PokéAPI.
o	Did you create helper functions, custom hooks, or use a library? Explain your choices.

## Challenges Encountered & Solutions
o	Describe at least one technical challenge you faced during development.
o	This could be anything from a tricky CSS layout, an unexpected API response, a Next.js specific issue, or a problem with state management.
o	Explain the steps you took to understand and resolve the challenge.

- Typescript not used before
- Trying out tailwind over pure html/css (not experienced with it but was used in the next.js tutorial seemed relevant technology to get experience with)
- Having the searched pokemon pagination seperate to main and reverting to original state when removing search
- Having the pokemon appear blurry when increasing size to match figma (you can explicitly state an image to be rendered as pixelated which removes smooth scaling and allows the pixel style to enlarge proportionaly.)

## Bonus Features
o	If you implemented any bonus features, briefly describe your approach for each.
o	For example, for search, did you consider debouncing?
o	For loading states, what kind of indicators did you choose and why?

- Added small debounce to search
- Replace search button with auto search when typing
- Used tailwind css
- Hover highlight on cards to show selectable
- Added colours to the badges depending on type (e.g water blue etc)

## Self-Reflection & Potential Improvements
o	What part of your solution are you most proud of, and why?
o	If you had more time, what would you refactor, improve, or add to the application?


## Changes Log:

    Version 0.1
- Added relevant shadcn components 
- Created layout to match figma mock up for main landing page
- Created example card

    Version 0.2
- Async call to pokeAPI to populate cards with actual pokemon
- working navigation buttons to view other pages of pokemon
- Added loading useState to display loading message
- Error useState for API call issues
- Small ui changes/fixes to look more identical to figma mock ups

    version 0.3
- Added fix for blurry scaling up of pokemon images
- SMall debounce to search and search begins from typing instead of button click
- Functionality added to search bar
- Navigation buttons work within searches
- Added spinner for loading to match figma design closer
- Functional badge generation for pokemon type (replaced filler for testing card layout)
- Zoom to fit app to page without scrolling (was hard to navigate lots of pages with scrolling)

    Version 0.4
- Added colour mapping to badge type
- Added hover ui change to pokemon cards
- Added dynamic details/[pokemon]/page.tsx to display new page for any pokemon clicked 