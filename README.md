# Technical Task: Pokémon Explorer Application
Objective
Develop a basic Next.js application that fetches data from the PokéAPI, displays it according to a provided Figma design, and utilizes shadcn/ui components for the user interface.

## 1 Project Setup & Running Instructions
### Prerequisites
- Node.js
- npm 
### Setup
- First, Clone the Repository using `git clone https://github.com/jasperhall477/pokemon-explorer-app.git` or via github browser interface
- Go to project folder `cd pokemon-explorer-app`
- Install packages `npm install`
- Run development server to view the app `npm run dev`
- Wait for it to fully boot (usually 5-10 seconds - it should say Compiled)
- Go to http://localhost:3000 in browser to view dev runtime of app

## 2 Design and Component Decisions
### Component Structure
#### Custom Components
- page.tsx - Main page (Landing page in design) contains the list of all pokemon with search functionality and pagination.
- details\[pokemon]\page.tsx - Details page uses dynamic route to show more detailed overview of individual pokemon.
- components\ui\PokemonCard.tsx - Individual card ui for pokemon on the Landing page, seperate component to help comparmentalise code and make it more readable/maintanable. 
- components\ui\Footer.tsx - Seperate component for the footer thats used across both pages (useful as a component as likely to be re-used on additional pages that may be added in the future)

#### Shadcn Components
The shadcn components used were to match the figma design mock ups.
- Button - Search button (Removed in later versions), Pagination buttons
- Input - Search input bar
- Badge - Types and weakness badges, slightly altered to allow coloured backgorunds
- Card - Used as foundation for PokemonCard.txs

### Deviations from Design
- One small interpretation I made from the design was to have the cards highlight slightly and change to a pointer when hovered over. This was to help show the user each card is selectable to navigate to the details page but not explicitly shown in designs.
- Another change was the removal of the search button. Although I implemented this and made it functional, after implementing the automatic search start from typing it became redundant and so was removed even though it was in the figma design.
- I also changed the badges used for the types and weaknesses to have colour coordination depending on the type (e.g water = blue) which wasn't in the design.
- Added the actual value to the stats section to allow more specific understanding of each pokemons stats.
- Removed user select from to make the ui more user friendly and professional although not mentioned specifically in the figma designs.

## 3 State Management Approach
I made use of useState and useEffect to manage application state. useState allows me to store dynamic data and user inputs such as pokemonList and position, and useEffect provides a way of triggering code upon loading as well as when a dependency changes such as getPokemonInfo when the page (position) changes. A more extensive list of useStates used and what for include:
- pokemonList - Stores pokemon data used to populate cards on the Landing page.
- allPokemon - Stores all pokemone names to allow searching.
- loading - This useState is used to decide if we should dispaly a loading spinner or not and is updated mainly during api calls.
- position - Tracks the current page position so we tell the getPokemonInfo function what pokemon to get info on.
- searchPosition - The same as position but for the search pagination instead.
- matches - Store the list of pokemon that match the search results
- filteredList - Stores the current list of pokemon to display on the current page only, either same as pokemonList 
- search - Stores the search input
- error - Similar to loading, but decides if we display an error message or not (used if api call fails)

My particular approach was chosen because it is lightweight and simple, being built in functionality with React, and allows a simple way of storing, and updating dynamic data. There is plenty of documentation which made it easy to understand and implement for a small project like this. 

## 4 API Interaction Strategy
### Main Page 
- Fetches basic info on all pokemon on initial load to allow searching functionality.
- Fetches slightly more detailed info on 12 pokemon at a time to populate a page, occurs during initial load, and during pagination to get fresh pokemon details for each page. 
- Async calls to API to allow page to continue with background functions during the calls we make.

### Details Page
- This page uses a single async fetch for the specific pokemon on the page.
- Then has to use multiple seperate fetches to more specific API endpoints to get additional details (e.g pokemon-species, abilities).

### Hooks
- Small debounce on the search input lib\debounce.tsx.
- Used to improve performance by preventing too many searches being made when quickly typing a pokemon by adding a 300ms delay.
- useEffect react hook used to allow triggering certain functions under specific conditions such as retrieving a new list of pokemon details on page change.


## 5 Challenges Encountered & Solutions
- I had not Typescript not used before although my extensive experience with javascript made it very familiar along with very detailed documentation to help bridge the gap.
- Trying out tailwind over pure html/css (not experienced with it but was used in most next.js tutorials so seemed a relevant technology to get experience with). This was easily overcome due to the large number of tutorials and useful sites documentation like https://tailwind.build/classes that helped me to easily convert all my css knowledge into tailwind readable versions.

- Having the searched pokemon pagination seperate to main and reverting to original state when removing search entry. I added two seperate versions of the nav buttons, one set to update the search position, and one to update the standard page position. I could then display the search buttons only if there was an entry in the search input.

- Having the pokemon appear blurry when increasing size to match figma. This was overcome by explicitly stating the image to be rendered as "pixelated" which removes smooth scaling and allows the pixel style to enlarge properly.

- Calculating weaknesses was was a slight challenge, especially after my original solution ended up not working correctly on pokemon that had multiple types. To have it work for all pokemon even with multiple types, I had to combine damage multipliers and calculate the overall value to get the leftover weakness types. I started with an object containing all types with a default multiplier of 1. I then went through each of the pokemons types and get its damage relations. I could then update the object depending on the damage relations and calculate any weakness as being more than 1 after the calculation. This took longer than expected but there were useful posts with similar issues that helped.

## 6 Bonus Features
- Added small debounce to search for performance improvements.
- Replace search button with auto search when typing by using onChange event handler to trigger setSearch function without needing to click search or hit enter.
- Used tailwind css to try to fit with current standards - specifically due to the use of it in most next.js tutorials I found.
- Hover highlight on cards to show they are selectable elements and its not a static page.
- Added colours to the badges depending on type (e.g water blue etc) to improve user friendly-ness and improve ui.
- Scaled the landing page out slightly to allow all important features to fit on the screen without scrolling (Changing pages and having to scroll down each time was a pain)
- For loading states, I used a loading spinner. Not only was it shown in the designs and I wanted to adhere to match the designs closely to fit requirements of this task, but the spinner is also perfect for this app to show the loading states between pages and searches etc. It helps make the app more seamless and prevent pauses when waiting on api call responses.


## 7 Self-Reflection & Potential Improvements
I am most proud of being able to quickly adapt to using tailwind css and typescript, which are technologies I haven't used in a real project before. Normally, I would have attempted to tackle this using pure html, css, and javascript, however the extensive use of tailwind in tutorials for next.js I found made me want to use it, not only because there was lots of documentation and help, but because I wanted to adhere to modern industry standards.

One improvement to be made that I noticed slightly too late, was that the return home button simply returns to the home page in its default state. I would have ideally liked to have saved their current position in the pagination and returned to this state when going back as well as keeping any search input saved. I could achieve this by storing them in session storage and checking if these values exist in session storage when loading up the Landing page.

Another self reflection I have made is to do with modularity of the app. Although I am happy with the features added and how closely the app meets the design mock ups, I think more of it could have been added as seperate components such as the header and joint navigation buttons. Due to my lack of experience with React and specifically Next.js, I wasn't thinking as much in terms of components as a more experienced React developer would during the development, but I would like to improve on this to ensure my code is more reusable and maintainable in future. 

Some more minor improvements I would add to the application include:
- More interactivity (hover over/click badges or stats to show further details).
- Show more details (Which game each pokemon is from, evolution stage/future evolutions).
- Allow searching by ID.


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
- Navigation buttons work within filtered search results
- Added spinner for loading to match figma design closer
- Functional badge generation for pokemon type (replaced filler for testing card layout)
- Zoom to fit app to page without scrolling (was hard to navigate lots of pages with scrolling)

    Version 0.4
- Added colour mapping to badge type
- Added hover ui change to pokemon cards
- Added dynamic details/[pokemon]/page.tsx to display new page for any pokemon clicked 

    version 0.5
- Details page features
- Added details page css to look like figma mock up
- Got all relevant details from pokeAPI and display like in design
- Added weaknesses calculator 
- Return to home functionality 
- small ui changes to main page

  version 0.6
- Added PokemonCard as seperate component to improve code readability and maintainability (after re-reading some of the requirements)
- More ui changes to fit figma closer 
- Created seperate Footer component instead of hard coding#
- Added more comments to code/tidy up of code

version 1.0
- Readme improves
- Code comments
