# KeyTrain Static Presentation Website

This repository contains a responsive, single-page KeyTrain presentation website built with plain HTML, CSS, and JavaScript.

## View locally

Open `index.html` directly in a browser, or run a small local server:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Publish with GitHub Pages

### Option A: Deploy from a branch

1. Create a new GitHub repository.
2. Upload all files from this folder to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Choose the `main` branch and `/ (root)`.
6. Click **Save**.
7. GitHub will provide the public URL after deployment.

### Option B: GitHub Actions

The included `.github/workflows/pages.yml` workflow deploys the site automatically.

1. Open **Settings → Pages**.
2. Under **Build and deployment**, select **GitHub Actions**.
3. Push or upload the files to the `main` branch.
4. Open the **Actions** tab and wait for the Pages deployment to finish.

## Presentation mode

Click **Present** in the navigation bar.

- Use the arrow keys, Page Up, Page Down, or Space to change sections.
- Press Escape to exit.
- The meeting-notes field saves only to the current browser using local storage.

## Editing

- Main content: `index.html`
- Styling and branding: `styles.css`
- Animations and presentation controls: `script.js`
- Images: `assets/`

## Important content note

The statistics, incident descriptions, projections, and dates were carried over from the supplied presentation. Verify them against current authoritative sources before using this website publicly.
