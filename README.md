# UC Rangelands County Advisor Map

Dependency-free, responsive replacement for the legacy WordPress/PHP California county map.

## Included
- `index.html` — page
- `styles.css` — responsive SiteFarm-friendly styling
- `app.js` — hover/click/dropdown behavior
- `data.js` — 58 county polygons and directory data
- `sitefarm-embed.html` — iframe snippet

## Test locally
Double-click `index.html`. No local web server or external JavaScript library is required.

## Publish with GitHub Pages
1. Create a GitHub repository.
2. Upload these files to the repository root.
3. Enable GitHub Pages for the repository.
4. Replace `YOUR-ACCOUNT` and `REPOSITORY` in `sitefarm-embed.html` with the published Pages address.
5. Paste the iframe markup into the SiteFarm page using your site's permitted HTML/embed workflow.

## Update directory data
Edit the `directory` objects in `data.js`. Supported fields are `countyPage`, `advisor`, `advisorUrl`, `advisor2`, and `advisor2Url`.

## Sources used for this build
The SVG geometry was reconstructed from the 58 polygon coordinate sets in the supplied legacy `Map.html`. The advisor names and links were copied from the supplied `UC Rangelands directory.xlsx`. The legacy combined “San Francisco and San Mateo Counties” polygon is used as the San Mateo polygon, with the separate San Francisco polygon layered above it.

## Before publication
Review advisor assignments and links. The app intentionally uses the supplied workbook as its directory source rather than a live directory service.
