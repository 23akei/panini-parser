#!/bin/bash

# Script to generate API client from FastAPI OpenAPI schema

set -e

echo "🚀 Generating API client from FastAPI OpenAPI schema..."

# Check if backend is running
if ! curl -s http://localhost:8000/health > /dev/null; then
    echo "❌ Backend server not running. Starting backend..."
    echo "Please run 'uv run panini-backend' in another terminal first."
    echo "Then run this script again."
    exit 1
fi

echo "✅ Backend server is running"

# Install OpenAPI Generator CLI if not present
if ! command -v openapi-generator-cli &> /dev/null; then
    echo "📦 Installing OpenAPI Generator CLI..."
    pnpm add -D @openapitools/openapi-generator-cli
fi

# Remove existing generated API
echo "🧹 Cleaning existing generated API..."
rm -rf src/generated-api

# Generate new API client
echo "⚙️ Generating TypeScript client..."
pnpm exec openapi-generator-cli generate \
    -i http://localhost:8000/openapi.json \
    -g typescript-axios \
    -o src/generated-api \
    --additional-properties=npmName=panini-parser-api,supportsES6=true,withInterfaces=true,apiPackage=api,modelPackage=models

# Install any new dependencies
echo "📦 Installing dependencies..."
pnpm install

# Create index file for easier imports
echo "📝 Creating index file..."
cat > src/generated-api/index.ts << 'EOF'
// Generated API client exports
export * from './api';
export * from './models';
export * from './base';
export * from './common';
export * from './configuration';

// Main API class
export { DefaultApi as PaniniParserApi } from './api';
export { Configuration } from './configuration';
EOF

echo "✅ API client generated successfully!"
echo ""
echo "🎯 Next steps:"
echo "1. The new API client is available in src/generated-api/"
echo "2. Your app will automatically use the generated client"
echo "3. You can import types from 'src/generated-api'"
echo ""
echo "📋 Example usage:"
echo "import { PaniniParserApi, Configuration } from './generated-api';"
echo ""
echo "🔄 To regenerate after backend changes:"
echo "pnpm run generate-api"