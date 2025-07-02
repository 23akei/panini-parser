# OpenAPI Export and Generation Guide

This guide explains how to export the OpenAPI schema from the backend and regenerate the TypeScript client.

## Prerequisites

1. **Backend running**: Make sure the FastAPI backend is running at `http://localhost:8000`
   ```bash
   cd ../backend
   python -m backend.main
   ```

2. **Docker available**: For the client generation (or use the direct method with `@openapitools/openapi-generator-cli`)

## Available Commands

### 🔄 Export OpenAPI Schema Only
```bash
pnpm run export-openapi
```
- Downloads `openapi.json` from the backend
- Checks backend availability first
- Shows schema information if `jq` is available

### 🔧 Generate TypeScript Client Only
```bash
pnpm run generate-api
```
- Uses existing `openapi.json` to generate TypeScript client
- Outputs to `src/api/generated/`

### ⚡ Export + Generate (Complete Workflow)
```bash
pnpm run generate-openapi
```
- Exports schema AND regenerates TypeScript client
- This is the main command you'll use

### 🚀 One-Step Export and Generate
```bash
pnpm run export-and-generate
```
- Uses the shell script with automatic regeneration
- Includes backend availability checks

## Manual Export Methods

### Using curl directly:
```bash
curl http://localhost:8000/openapi.json -o openapi.json
```

### Using the shell script with custom options:
```bash
# Export only
./scripts/export-openapi.sh

# Export and regenerate
REGENERATE=true ./scripts/export-openapi.sh

# Custom backend URL
BACKEND_URL=http://mybackend:8000 ./scripts/export-openapi.sh
```

## Troubleshooting

### Backend not accessible
```
❌ Backend not accessible at http://localhost:8000
💡 Make sure the backend is running with: cd ../backend && python -m backend.main
```
**Solution**: Start the backend server first.

### Docker issues with generation
If Docker isn't available, use the direct method:
```bash
pnpm run generate-api:direct
```

### Permission denied on script
```bash
chmod +x ./scripts/export-openapi.sh
```

## Generated Files

- `openapi.json` - The exported OpenAPI schema
- `src/api/generated/` - Generated TypeScript client files
  - `api.ts` - Main API interfaces and types
  - `base.ts` - Base API functionality
  - `configuration.ts` - API configuration
  - `index.ts` - Exports

## Integration

The generated client is already integrated into the app:
- Import from: `import { ApiClient } from './api/client'`
- React Query hooks: `import { useGameOperations } from './hooks/useGame'`