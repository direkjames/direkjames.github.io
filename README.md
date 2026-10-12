# Kitly

direkjames's hub: every app in one place, at https://direkjames.github.io/.

## Adding or changing an app

Everything is in `assets/data.js`. Copy an entry, change it, and save. The comment at the top of that file explains each field.

Apps with downloads read the repo's latest GitHub release, so there's nothing to change here when you publish a new version. Name the files so Kitly can find them:

- Windows installer: `setup` in the name, ending in `.exe` (for example `Grabbit-Setup-1.1.2.exe`)
- Windows portable: `portable` in the name, ending in `.exe`
- Android: ending in `.apk`

## Files

- `index.html` – the home page
- `kite.html` – the Kite suite page
- `404.html` – shown for addresses that don't exist
- `assets/data.js` – the app list
- `assets/site.js` – builds the cards and reads GitHub releases
- `assets/style.css` – the look
