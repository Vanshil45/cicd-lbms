# PageTurn — React Library Management Demo

A responsive frontend-only library management dashboard built with React .
 
## Features
- Dashboard overview with inventory, borrowed books, members, and overdue metrics
- Search books by title, author, or ISBN
- Filter by category  
- Add books with a modal form
- Issue available books from the inventory
- Mark loans as returned and update available copy counts
- Recent activity and due-soon panels
- Responsive desktop and mobile layouts

## Run locally
Requires Node.js 18+.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually http://localhost:5173).

## Production build
```bash
npm run build
npm run preview
```

## Demo notes
- This is a frontend demo. Data is held in React state and resets when the page is refreshed.
- Authentication, backend APIs, database persistence, member management, and real reporting are not connected.
- Google Fonts are loaded from Google Fonts; the app otherwise runs locally after dependencies are installed.
