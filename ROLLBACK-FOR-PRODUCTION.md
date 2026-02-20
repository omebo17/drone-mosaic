# Base href: no manual switch needed

**`src/index.html`** always has `<base href="/">` so **`ng serve`** works at `http://localhost:4200/`.

**Production (GitHub Pages):** When you run `ng build --configuration production`, Angular uses the **`baseHref`** in `angular.json` (production config) and writes the correct base into the built `index.html`. So the deployed app at `https://omebo17.github.io/drone-mosaic/` gets the right base automatically.

You don’t need to change `index.html` when deploying—the build does it for you.
