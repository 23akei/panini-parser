#!/bin/bash
set -e

# Script to export OpenAPI schema from backend and optionally regenerate client

BACKEND_URL="${BACKEND_URL:-http://localhost:8000}"
OUTPUT_FILE="${OUTPUT_FILE:-openapi.json}"
REGENERATE="${REGENERATE:-false}"

echo "🔄 Exporting OpenAPI schema from $BACKEND_URL..."

# Check if backend is running
if ! curl -f -s "$BACKEND_URL/docs" > /dev/null; then
    echo "❌ Backend not accessible at $BACKEND_URL"
    echo "💡 Make sure the backend is running with: cd ../backend && python -m backend.main"
    exit 1
fi

# Export the schema
curl -f -s "$BACKEND_URL/openapi.json" -o "$OUTPUT_FILE"

if [ $? -eq 0 ]; then
    echo "✅ OpenAPI schema exported to $OUTPUT_FILE"
    
    # Show schema info
    if command -v jq &> /dev/null; then
        echo "📋 Schema info:"
        echo "   Title: $(jq -r '.info.title' "$OUTPUT_FILE")"
        echo "   Version: $(jq -r '.info.version' "$OUTPUT_FILE")"
        echo "   Paths: $(jq '.paths | keys | length' "$OUTPUT_FILE")"
    fi
    
    # Optionally regenerate client
    if [ "$REGENERATE" = "true" ]; then
        echo "🔧 Regenerating TypeScript client..."
        pnpm run generate-api
        echo "✅ Client regenerated"
    fi
else
    echo "❌ Failed to export OpenAPI schema"
    exit 1
fi