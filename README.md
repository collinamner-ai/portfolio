# Collin Amner | Portfolio Site

A modern, responsive static portfolio site for a Senior Designer specialising in branding, packaging, artwork and digital design. It is designed to work on GitHub Pages or any static host with no build step.

## What is included

- `index.html` — public portfolio page.
- `css/styles.css` — complete responsive styling for the site and editor.
- `js/content.js` — editable portfolio data.
- `js/main.js` — renders the public site and gallery.
- `admin.html` — browser-based static content editor.
- `js/admin.js` — saves local drafts and exports replacement `content.js` files.

## Key improvements in this version

- Fixed broken project gallery click handling.
- Fixed admin styling by using consistent CSS variables.
- Removed the broken admin login lock and replaced it with a working static content editor.
- Added a modern employer-focused layout, responsive navigation, project cards, stats, skills and contact sections.
- Added valid local SVG placeholder images so the site displays properly before real portfolio images are added.
- Added accessible lightbox controls with keyboard support: Escape, left arrow and right arrow.
- Improved SEO meta description and no-indexed the admin page.
- Removed fake phone number from the visible content.

## How to edit content

### Quick edit

Open `js/content.js` and update the text, project details, links and image paths directly.

### Visual editor

1. Open `admin.html` in a browser.
2. Edit the fields.
3. Click **Save draft** to keep a local browser draft.
4. Click **Export content.js** when ready.
5. Replace the existing `js/content.js` file with the exported file.
6. Commit and push the change.

> Note: `admin.html` is a static browser editor, not a secure CMS. If you do not want it online, delete `admin.html` and `js/admin.js` before publishing.

## Adding real portfolio images

1. Create this folder in the project root:

```text
assets/img/
```

2. Add optimised JPG or WEBP files, ideally around `1200 x 900px`.
3. In `js/content.js`, replace placeholder URLs with paths like:

```text
assets/img/premium-packaging-hero.webp
```

## Recommended next content updates

- Replace placeholder project images with real work or carefully anonymised mockups.
- Add a real LinkedIn URL in `socials`.
- Add a downloadable PDF portfolio or CV link if available.
- Rewrite each project description around outcomes: challenge, contribution, result.

## Hosting on GitHub Pages

1. Push the folder contents to a GitHub repository.
2. Go to **Settings → Pages**.
3. Choose the main branch and root folder.
4. Save. The site should publish after GitHub Pages finishes deploying.
