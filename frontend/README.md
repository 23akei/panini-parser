# Frontend - Panini Parser Web Interface

Modern React-based web interface for the Sanskrit parsing game, built with Vite and TypeScript.

## Overview

The frontend provides a user-friendly web interface for playing the Sanskrit parsing game. It features an auto-generated TypeScript API client that communicates with the FastAPI backend to provide real-time parsing feedback and game management with full type safety.

## Architecture

```
frontend/
├── public/
│   └── index.html       # HTML template
├── src/
│   ├── main.tsx         # React entry point
│   ├── App.tsx          # Main game component
│   ├── App.css          # Game styling
│   ├── index.css        # Global styles
│   ├── api/
│   │   ├── api-client.ts     # Smart API client wrapper
│   │   └── client.ts         # Legacy API client
│   └── generated-api/        # Auto-generated from OpenAPI (ignored in git)
├── generate-api.sh           # API generation script
├── API_GENERATION.md         # API generation documentation
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
└── README.md               # This file
```

## Technology Stack

- **React 18**: Component-based UI framework
- **TypeScript**: Type-safe JavaScript  
- **Vite**: Fast build tool and dev server
- **OpenAPI Generator**: Auto-generated API client
- **Axios**: HTTP client for API calls
- **CSS3**: Modern styling with dark/light theme support

## Development

### Setup
```bash
# Install dependencies
pnpm install

# Generate API client (optional, requires backend running)
pnpm run generate-api

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Development Server
- **URL**: http://localhost:5173
- **Hot reload**: Enabled
- **API proxy**: Configured to proxy `/api` to backend at `localhost:8000`

## Features

### Game Interface
- **Sanskrit word display**: Proper Devanagari font rendering
- **Input field**: For user parsing attempts
- **Real-time feedback**: API integration for parsing results
- **Game session management**: Start new games and track progress
- **Responsive design**: Works on desktop and mobile

### UI Components
- **Game container**: Centered layout with rounded corners
- **Word display**: Highlighted Sanskrit text with golden color
- **Input section**: Flexible input with parse button
- **Result display**: Structured feedback from parser
- **Loading states**: User feedback during API calls

### Theming
- **Dark mode**: Default dark theme
- **Light mode**: Automatic light mode support via CSS media query
- **Custom colors**: Consistent color scheme across components

### API Generation System
- **Auto-generated client**: TypeScript client from FastAPI OpenAPI schema
- **Fallback support**: Manual implementation for backward compatibility  
- **Type safety**: Full TypeScript interfaces for all endpoints
- **Hot reloading**: Regenerate API client when backend changes

## API Integration

### Client Configuration
The API client (`src/api/client.ts`) provides:
- **Base URL**: `/api/v1` (proxied to backend)
- **Type safety**: TypeScript interfaces for all API calls
- **Error handling**: Axios-based HTTP client

### Available API Methods
```typescript
// Health check
await apiClient.healthCheck()

// Parse Sanskrit word
await apiClient.parseWord("देवः")

// Start new game session
await apiClient.startGame()
```

### OpenAPI Code Generation

The project can use OpenAPI Generator to automatically generate TypeScript client code from the FastAPI backend's OpenAPI schema.

#### Setup OpenAPI Generator
```bash
# Install OpenAPI Generator CLI
npm install -g @openapitools/openapi-generator-cli

# Or use pnpm
pnpm add -g @openapitools/openapi-generator-cli
```

#### Generate Client Code
```bash
# 1. Start the backend server
uv run panini-backend

# 2. Generate TypeScript client (from frontend directory)
cd frontend
openapi-generator-cli generate \
  -i http://localhost:8000/openapi.json \
  -g typescript-axios \
  -o src/generated-api \
  --additional-properties=npmName=panini-parser-api,supportsES6=true

# 3. Install generated client dependencies
pnpm install
```

#### Using Generated Client
```typescript
// src/api/generated-client.ts
import { DefaultApi, Configuration } from '../generated-api';

const config = new Configuration({
  basePath: '/api/v1'
});

export const generatedApiClient = new DefaultApi(config);

// Usage in components
import { generatedApiClient } from './api/generated-client';

const result = await generatedApiClient.parseWordApiV1ParsePost({
  word: "देवः"
});
```

#### Automation Script
Add to `package.json`:
```json
{
  "scripts": {
    "generate-api": "openapi-generator-cli generate -i http://localhost:8000/openapi.json -g typescript-axios -o src/generated-api --additional-properties=npmName=panini-parser-api,supportsES6=true"
  }
}
```

Then run: `pnpm generate-api`

## Configuration

### Vite Configuration
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
```

### TypeScript Configuration
- **Strict mode**: Enabled for type safety
- **Modern target**: ES2020 with DOM types
- **JSX**: React JSX transform

## Scripts

```bash
# Development
pnpm dev              # Start dev server with hot reload
pnpm build            # Build for production
pnpm preview          # Preview production build locally
pnpm lint             # Run ESLint

# API Generation
pnpm run generate-api # Generate TypeScript client from backend
pnpm run clean-api    # Remove generated API files

# Package management
pnpm install          # Install dependencies
pnpm add [package]    # Add new dependency
pnpm update           # Update dependencies
```

## Dependencies

### Production Dependencies
- `react` & `react-dom`: Core React libraries
- `axios`: HTTP client for API calls

### Development Dependencies
- `@vitejs/plugin-react`: Vite React plugin
- `@openapitools/openapi-generator-cli`: API client generation
- `typescript`: TypeScript compiler
- `@types/react` & `@types/react-dom`: React type definitions
- `eslint`: Code linting
- `vite`: Build tool and dev server

## Future Enhancements

- [x] ✅ Auto-generated TypeScript API client
- [x] ✅ Type-safe API integration
- [x] ✅ Fallback API client support
- [ ] 🔄 Advanced Sanskrit font support
- [ ] 🔄 Game progress visualization
- [ ] 🔄 User authentication
- [ ] 🔄 Score tracking and leaderboards
- [ ] 🔄 Multiple game modes
- [ ] 🔄 Offline mode support
- [ ] 🔄 Progressive Web App (PWA) features
- [ ] 🔄 Accessibility improvements
- [ ] 🔄 Mobile-first responsive design
- [ ] 🔄 Internationalization (i18n)

## Deployment

### Production Build
```bash
# Build static files
pnpm build

# Output directory: dist/
# Deploy dist/ contents to web server
```

### Environment Variables
Create `.env.local` for local overrides:
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```