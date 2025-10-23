# Project Structure

## Root Level Organization
```
/
├── backend/           # Node.js Express API server
├── frontend/          # Angular web application
├── .kiro/            # Kiro AI assistant configuration
├── .vscode/          # VS Code workspace settings
└── *.jpg             # Product images and logo assets
```

## Backend Structure (`backend/`)
```
backend/
├── src/
│   ├── config/       # Configuration files (Firebase, etc.)
│   ├── controllers/  # Route handlers and business logic
│   ├── models/       # Data models and schemas
│   ├── routes/       # API route definitions
│   ├── utils/        # Helper functions and utilities
│   └── index.js      # Application entry point
├── .local-data/      # Local development data
├── .env              # Environment variables (Firebase config)
├── package.json      # Dependencies and scripts
└── node_modules/     # Installed packages
```

## Frontend Structure (`frontend/tienda-ropa/`)
```
frontend/tienda-ropa/
├── src/              # Angular source code
├── public/           # Static assets
├── dist/             # Built application output
├── .angular/         # Angular CLI cache
├── angular.json      # Angular CLI configuration
├── package.json      # Dependencies and scripts
├── tsconfig.json     # TypeScript configuration
└── .editorconfig     # Code formatting rules
```

## Architecture Patterns
- **Backend**: MVC pattern with Express.js
  - Controllers handle HTTP requests
  - Models define data structures
  - Routes define API endpoints
  - Utils contain shared functionality
- **Frontend**: Angular component-based architecture
- **Database**: Firebase Firestore (NoSQL document database)
- **Authentication**: Firebase Auth integration

## File Naming Conventions
- Backend: JavaScript files use camelCase
- Frontend: Angular follows kebab-case for files, PascalCase for classes
- Environment files: `.env` for backend configuration