# Clean Portfolio CMS Website

A simple, clean, square-edged portfolio website with a grey-to-dark-blue palette and a lightweight browser-based CMS/admin panel.

## What is included

- `index.html` — the public portfolio website
- `admin.html` — the simple CMS/admin panel
- `assets/css/styles.css` — all styling
- `assets/js/defaultContent.js` — default website content
- `assets/js/storage.js` — localStorage, import/export and image helpers
- `assets/js/main.js` — renders the public website
- `assets/js/admin.js` — powers the CMS editor
- `assets/img/` — placeholder SVG images

## How it works

This is a static website. It does not need a database or server.

The admin panel stores changes in your browser using `localStorage`. That means:

- It works directly on GitHub Pages.
- Edits appear on the same browser/device where they were saved.
- To move edits to another device/browser, use **Export JSON** in the CMS, then **Import JSON** on the other browser.
- To make permanent default content changes for everyone, edit `assets/js/defaultContent.js` directly.

## Local testing

You can open `index.html` directly in a browser, but using a local server is better:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/index.html
http://localhost:8000/admin.html
```

## GitHub Pages setup

1. Create a new GitHub repository.
2. Upload all files and folders from this project.
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and `/root` folder.
6. Save.
7. GitHub will provide a public URL for the website.

## Editing content

Use `admin.html` to edit:

- Name
- Role
- About text
- Hero text and image
- Work gallery projects
- Skills
- Experience
- Contact details

Use **Save Changes** to save content to the current browser.

Use **Export JSON** to back up or move your CMS content.

## Image swapping

In the CMS, each project has an image upload control. Uploaded images are converted to base64 and stored in the browser. For small portfolios this is fine. For a larger professional website, replace the SVG files in `assets/img/` and update `defaultContent.js` with normal image paths instead.

## Design rules applied

- Grey to dark blue palette
- No rounded corners
- Responsive desktop and mobile layout
- Simple clean modules
- Easy-to-edit text blocks
- Easy-to-swap gallery placeholders
- Expandable work gallery lightbox with keyboard controls
- GitHub Pages friendly
- No build tools required

## Work gallery lightbox

On the public portfolio page, clicking any project image opens it in an expanded lightbox. Users can close it with the close button, click outside the image, press Escape, or move through projects with the left and right arrow buttons/keyboard keys.
