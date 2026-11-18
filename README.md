# Olveraa

A skincare shop built with React, Vite and Tailwind CSS.

## Setup

1. Install dependencies: `npm install`
2. Start the app and local API: `npm run dev`
3. Open the Vite address shown in the terminal (usually http://localhost:5173)

## Tech stack

- React + Vite
- Tailwind CSS
- React Router
- json-server
- Vitest and Testing Library

## Architecture

- `src/pages/`: Home, Products, ProductDetails, AddProduct, and Cart pages
- `src/components/` may hold reusable UI components
- `src/CartContext.jsx`: shared shopping cart state
- `src/App.jsx`: application layout and routes
- `src/main.jsx`: application entry point
- `db.json`: local product data

## Routes

- `/`: Home
- `/products`: Product catalog
- `/products/:id`: Product details
- `/add-product`: Add a product
- `/cart`: Shopping cart

## Scripts

- `npm run dev`: Start Vite and json-server
- `npm run build`: Create a production build
- `npm run lint`: Run Oxlint
- `npm test`: Run the Vitest suite