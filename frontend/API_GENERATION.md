# API Client Generation

This document explains how the frontend automatically generates TypeScript API clients from the FastAPI backend's OpenAPI schema.

## Overview

The frontend uses a hybrid approach:
1. **Generated Client**: Auto-generated TypeScript client from OpenAPI schema (preferred)
2. **Fallback Client**: Manual implementation for backward compatibility

## How It Works

### 1. API Client Wrapper (`src/api/api-client.ts`)

The main API client automatically detects if generated code is available:

```typescript
import { apiClient } from './api/api-client';

// Automatically uses generated client if available, falls back otherwise
const result = await apiClient.parseWord("देवः");
```

### 2. Generation Process

#### Automatic Generation
```bash
# Generate API client (requires backend running)
pnpm run generate-api
```

#### Manual Generation
```bash
# Make sure backend is running
uv run panini-backend

# In another terminal, go to frontend directory
cd frontend

# Run the generation script
./generate-api.sh
```

### 3. Backend Requirements

The backend must be running at `http://localhost:8000` for generation to work:

```bash
# Terminal 1: Start backend
uv run panini-backend

# Terminal 2: Generate API
cd frontend
pnpm run generate-api
```

## Generated Code Structure

```
src/generated-api/
├── api/              # API endpoint functions
├── models/           # TypeScript interfaces
├── base.ts           # Base API functionality  
├── common.ts         # Common utilities
├── configuration.ts  # API configuration
└── index.ts         # Main exports
```

## Development Workflow

### 1. Initial Setup
```bash
cd frontend
pnpm install
```

### 2. Generate API (when backend changes)
```bash
# Start backend first
uv run panini-backend

# Generate API client
pnpm run generate-api
```

### 3. Use in Components
```typescript
import { apiClient } from './api/api-client';

// Works with both generated and fallback clients
const parseResult = await apiClient.parseWordNew({
  word: "देवः",
  include_alternatives: true,
  max_suggestions: 5
});
```

## API Methods Available

### Health & Info
- `healthCheck()` - Check API health

### Word Operations  
- `parseWord(word)` - Parse word (legacy)
- `parseWordNew(request)` - Parse word (new API)
- `getWordDetails(id)` - Get word details
- `getRandomWord(difficulty?)` - Get random word

### Game Operations
- `startGame()` - Start game (legacy)
- `startGameNew(options)` - Start game (new API)
- `submitAnswer(request)` - Submit answer
- `getGameState(sessionId)` - Get game state
- `endGame(sessionId)` - End game
- `getLeaderboard()` - Get leaderboard
- `getGameStats()` - Get statistics

## Benefits

### Type Safety
Generated client provides full TypeScript types:
```typescript
import type { ParseWordRequest, ParseWordResponse } from './api/api-client';

const request: ParseWordRequest = {
  word: "देवः",
  include_alternatives: true
};

const response: ParseWordResponse = await apiClient.parseWordNew(request);
```

### Auto-sync with Backend
- API changes automatically reflected in frontend
- No manual interface updates needed
- Compile-time error detection

### Backward Compatibility
- Fallback client ensures app works without generation
- Gradual migration to generated APIs
- Development flexibility

## Troubleshooting

### Generation Fails
```bash
# Check backend is running
curl http://localhost:8000/health

# Check OpenAPI schema is accessible  
curl http://localhost:8000/openapi.json

# Reinstall generator if needed
pnpm add -D @openapitools/openapi-generator-cli
```

### Client Not Loading
- Check console for import errors
- Verify generated files exist in `src/generated-api/`
- Try regenerating: `pnpm run generate-api`

### Type Errors
- Regenerate after backend API changes
- Check interface compatibility
- Use fallback methods if needed

## Advanced Configuration

### Custom Generation Options
Edit `package.json` scripts or `generate-api.sh` for custom settings:

```bash
openapi-generator-cli generate \
  -i http://localhost:8000/openapi.json \
  -g typescript-axios \
  -o src/generated-api \
  --additional-properties=npmName=custom-name,supportsES6=true
```

### Multiple Environments
```typescript
const config = new Configuration({
  basePath: process.env.REACT_APP_API_URL || '/api/v1'
});
```