# Collin Amner | Portfolio

A premium, highly-responsive, statically hosted portfolio for a Senior Designer. Built purely with HTML, CSS, and Vanilla JavaScript to ensure zero-maintenance hosting on GitHub Pages.

## Features
- **Editorial Design System**: High-contrast, premium typography, light/dark modes.
- **Dynamic Content rendering**: `js/content.js` acts as a lightweight database.
- **Static Admin Panel**: An in-browser content editor (`admin.html`) that allows non-devs to update text, rearrange projects, and export a new `content.js` file.
- **Vanilla JS Lightbox**: fully keyboard-accessible gallery.

## How to Edit Content (For the User)
1. Open the project folder in your browser.
2. Navigate to `admin.html`.
3. Make changes to your text, replace image URLs, and add/remove projects.
4. Click **"Export content.js"**. This downloads a file.
5. Replace the existing `js/content.js` in your local project folder with the newly downloaded file.
6. Push changes to GitHub.

## Adding Real Images
1. Create a folder named `assets/img/` in the root directory.
2. Save your optimized JPG/WEBP files there (Recommended size: `1200x900px` or `4:3` ratio).
3. In `admin.html`, replace the placeholder URLs with relative paths like: `assets/img/my-project.jpg`.

## Hosting on GitHub Pages
1. Push this repository to GitHub.
2. Go to **Settings > Pages**.
3. Under "Source", select `main` or `master` branch and the `/ (root)` folder.
4. Click Save. Your site will be live in a few minutes.
