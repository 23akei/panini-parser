# OpenAPI Generator Integration

This document describes the OpenAPI Generator integration implemented for the Panini Parser frontend.

## Overview

The frontend now uses automatically generated TypeScript API clients to communicate with the FastAPI backend. This ensures type safety and keeps the frontend synchronized with backend API changes.

## Architecture

```
src/
├── api/
│   ├── generated/          # Auto-generated OpenAPI client code (git ignored)
│   │   ├── api.ts          # API endpoint implementations
│   │   ├── base.ts         # Base HTTP client functionality
│   │   ├── configuration.ts # Configuration interfaces
│   │   └── index.ts        # Main exports
│   └── client.ts           # Custom wrapper with error handling
├── hooks/
│   └── useGame.ts          # React Query hooks for API operations
├── components/             # Updated components using API data
└── App.tsx                 # Main app using real API integration
```

## Key Features

### 1. Type-Safe API Client
- **Generated Types**: All request/response types are auto-generated from OpenAPI schema
- **Error Handling**: Centralized error handling with user-friendly messages
- **Configuration**: Environment-based API URL configuration

### 2. React Query Integration
- **Caching**: Intelligent caching of API responses
- **Loading States**: Built-in loading and error state management
- **Real-time Updates**: Automatic data invalidation and refetching

### 3. Environment Configuration
- **Development**: API proxy for seamless local development
- **Production**: Configurable API base URL via environment variables

## Usage

### API Generation

```bash
# Download OpenAPI schema and generate TypeScript client
pnpm run api:download-and-generate

# Generate directly from running backend
pnpm run generate-api:direct

# Download schema only
pnpm run download-schema
```

### Development Workflow

1. **Start Backend**: Ensure FastAPI backend is running on `localhost:8000`
2. **Generate API**: Run `pnpm run api:download-and-generate` 
3. **Start Frontend**: Run `pnpm dev`

### Using API Hooks

```typescript
import { useGameOperations, useGameStatus } from './hooks/useGame';

const GameComponent = () => {
  const { startGame, submitAnswer, isLoading, error } = useGameOperations();
  const { data: gameStatus } = useGameStatus(gameId, enabled);

  const handleStart = async () => {
    const game = await startGame.mutateAsync({ 
      level: 'beginner', 
      length: 5 
    });
  };
};
```

## API Client Examples

### Starting a Game
```typescript
import { ApiClient } from './api/client';

const gameData = await ApiClient.startGame('beginner', 5);
// Returns: { game_id: string, steps: GameStep[] }
```

### Submitting an Answer
```typescript
const response = await ApiClient.submitAnswer(gameId, stepId, {
  sutra: '3.1.68'
});
// Returns: { correct: boolean, explanation: string, next_step_id?: number }
```

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_DEV_MODE=true
```

## Development Features

### Hot Reloading
- Frontend automatically reloads when API schema changes
- Type errors appear immediately in development

### Proxy Configuration
- API requests are proxied through Vite development server
- No CORS issues during development

### Error Handling
- Network errors are caught and displayed to users
- API validation errors show specific field issues
- Loading states prevent multiple submissions

## Best Practices

### 1. Schema Synchronization
- Regenerate API client whenever backend schema changes
- Use version control to track schema evolution

### 2. Error Handling
- Always handle loading and error states in components
- Provide user-friendly error messages
- Implement retry mechanisms for failed requests

### 3. Performance
- Use React Query's caching to minimize API calls
- Implement optimistic updates for better UX
- Prefetch data when possible

## Troubleshooting

### Build Errors
If you encounter TypeScript errors after API generation:
1. Ensure backend is running and accessible
2. Regenerate API client: `pnpm run api:download-and-generate`
3. Restart TypeScript service in your editor

### Network Issues
- Check that backend is running on correct port
- Verify CORS configuration in backend
- Check browser network tab for failed requests

### Type Issues
- Ensure generated types are properly exported in `src/api/client.ts`
- Check that OpenAPI schema includes all required types
- Verify component props match API response structure

## Schema Evolution

When the backend API changes:
1. Update backend OpenAPI schema
2. Regenerate frontend client: `pnpm run api:download-and-generate`  
3. Update components to handle new data structures
4. Test thoroughly with new API changes
5. Update API integration tests if needed

This integration provides a robust, type-safe foundation for frontend-backend communication while maintaining developer productivity and code quality.