# Prism Clothing

An aesthetic, high-end clothing brand website with smooth animations, shop functionality, and an advanced admin panel.

## Features
- **Modern UI:** Built with React, Tailwind CSS, and Motion.
- **Shop:** Browse collections, view product details, and add to cart.
- **Checkout:** Smooth checkout process with delivery area selection.
- **Admin Panel:** Manage products, stock, and view orders.
- **Spectrum Series:** Special reactive product effects.

## Local Development
1. Clone the repository.
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`

## Deploying to GitHub Pages
This project is configured for easy deployment to GitHub Pages.

1. **Export to GitHub:** Use the "Export to GitHub" feature in the AI Studio Settings menu.
2. **Configure GitHub Pages:**
   - Go to your repository settings on GitHub.
   - Navigate to **Pages**.
   - Under **Build and deployment**, set **Source** to **GitHub Actions** (recommended) or **Deploy from a branch**.
3. **Manual Deployment:**
   - Run `npm run deploy` from your local terminal. This will build the project and push the `dist` folder to a `gh-pages` branch.
   - In GitHub settings, set the branch to `gh-pages`.

## SPA Routing on GitHub Pages
To handle React Router's SPA routing, the build process automatically copies `index.html` to `404.html`. This ensures that refreshing the page on a sub-route (like `/shop`) works correctly.
