# Countries Explorer

**Internship Task 3: REST API Data Project**
Submitted by: Avinash Kumar | Roll No: 50613302724 | B.Tech CSE 5B, 3rd Year | HMRITM | Alfido Tech

- **Live demo:** https://avinashq2.github.io/countries-explorer/
- **Source code:** https://github.com/avinashq2/countries-explorer

A responsive web app that fetches data about every country from the public **REST Countries API** and displays it dynamically as flag cards.

## Features
- Data fetched with the Fetch API (async/await)
- Loading spinner, error message with "Try again" button, and empty state
- Search by country or capital (debounced)
- Filter by region and sort by name, population or area
- "Load more" paging (24 cards at a time)
- Detail popup with official name, capital, region, population, area, languages and currencies
- Dark mode (remembered with localStorage)
- Fully responsive layout

## API Used
**REST Countries v3.1** (free, no API key): `https://restcountries.com/v3.1/all?fields=name,flags,capital,region,subregion,population,cca3,languages,currencies,area`

## Structure
`index.html` (structure), `style.css` (styling), `script.js` (API and DOM logic), `README.md`
