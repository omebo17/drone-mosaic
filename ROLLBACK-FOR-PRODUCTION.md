# Rollback for production (when local dev is done)

Use this when you want the repo to be production-ready again.

## 1. `src/index.html` – base href

**Current (for local):**  
`<base href="/">`

**Rollback to (for production source):**  
`<base href="/drone-mosaic/">`  
or  
`<base href="https://omebo17.github.io/drone-mosaic/">`

You can remove the comment line that says `<!-- LOCAL: base / ... | ROLLBACK ... -->` when you roll back.

---

**Note:** `ng build --configuration production` already sets the base via `angular.json` (`baseHref` in the production config), so the **built** `index.html` in `dist/` and on GitHub Pages is correct either way. This rollback only affects the **source** `src/index.html` (and any build that doesn’t use the production config).
