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

## Deploying to Vercel
This project is optimized for Vercel deployment with a `vercel.json` configuration.

1. **Export to GitHub:** Use the "Export to GitHub" feature in the AI Studio Settings menu.
2. **Connect to Vercel:**
   - Go to [Vercel.com](https://vercel.com).
   - Log in with GitHub.
   - Click **"Add New Project"** and select your `prism-clothing` repository.
3. **Deploy:** Click **"Deploy"**. Vercel will automatically detect the Vite project and use the `vercel.json` for SPA routing and caching.

## Deploying to GitHub Pages
This project is also configured for GitHub Pages.
...

## SPA Routing on GitHub Pages
To handle React Router's SPA routing, the build process automatically copies `index.html` to `404.html`. This ensures that refreshing the page on a sub-route (like `/shop`) works correctly.
