# Humans vs Zombies web app


## Description

Humans vs. Zombies (HvZ) is a game of tag played at schools, camps, neighborhoods,
libraries, and conventions around the world. The game simulates the exponential spread
of a fictional zombie infection through a population.

## Contributors
- [Mussa Banjai](https://gitlab.com/MoBanju)
- [Eivind Bertelsen](https://gitlab.com/eivindTB)
- [Øyvind Reitan](https://gitlab.com/hindrance)
- [Vebjørn Sundal](https://gitlab.com/vebsun95)
- [Synne Sævik](https://gitlab.com/Synnems)

## Usage
1. Clone the project and `cd` into it. 
2. Install the dependencies using the npm command `npm i --legacy-peer-deps`.
3. Set the node environment variables by creating a .env file in the root of the directory and filling in the values:
~~~
REACT_APP_API_URL="[BACKEND_ENDPOINT]"
REACT_APP_MAP_TILER_API_KEY="[MAPTILER_API_KEY]"
~~~
4. Run `npm run dev`.
5. The web app will open in your browser of choice.

## Future Work
Write something here 😎
## Style-guide
### Casing
 - React : 
     - Pascal-Case:
       - Components
     - kebab-case
       - html/xml tags inside components
       - css

### Git
https://www.conventionalcommits.org/en/v1.0.0/
 - commit-message:
   - feat: new feature, code added
   - fix: bugfix usually
   - style: no functional changes
   - docs: documentation

## Packages used
- npx create-react-app --ts
- redux
- react-redux
- @reduxjs/toolkit
- react-router-dom
- react-icons
- react-hook-form
- bootstrap
- react-bootstrap
- leaflet
- react-leaflet
- react-leaflet-draw
- express
- keycloak-js

