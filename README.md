# React Frontend Skeleton

A boilerplate React frontend application set up with modern tools and best practices.

## Project Structure

```
src/
├── pages/          # Page components
│   ├── Home.js
│   └── NotFound.js
├── styles/         # CSS stylesheets
│   ├── Home.css
│   └── NotFound.css
├── App.tsx         # Main App component
├── App.css         # App styles
├── index.tsx        # React entry point
└── index.css       # Global styles
public/
├── index.html      # HTML entry point
package.json        # Dependencies and scripts
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd react-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000` in your default browser.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (irreversible)

## Features

- ✅ React 18
- ✅ React Router v6 for client-side routing
- ✅ Modern CSS styling
- ✅ Component-based architecture
- ✅ ESLint configuration

## Technologies Used

- React 18.2.0
- React Router DOM 6.20.0
- React Scripts 5.0.1

## Notes

This is a skeleton project. Expand it by:
- Adding more page components in `src/pages/`
- Creating reusable components in `src/components/`
- Adding services/utilities in `src/services/`
- Implementing state management (Context API, Redux, etc.)

## License

MIT
