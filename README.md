Technical Task: Pokémon Explorer Application
Objective
Develop a basic Next.js application that fetches data from the PokéAPI, displays it according to a provided Figma design, and utilizes shadcn/ui components for the user interface.


Changes:

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