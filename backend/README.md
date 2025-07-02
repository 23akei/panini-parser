# Backend - Panini Parser API

FastAPI backend server for the Panini Parser Sanskrit game.

## Overview

The backend provides a REST API for Sanskrit word parsing and game management. It serves as the bridge between the frontend interface and the Vidyut parser engine.

## Architecture

The backend follows a layered architecture pattern with clear separation of concerns:

```
backend/
├── __init__.py
├── main.py                    # FastAPI app and server startup
├── dependencies.py            # Dependency injection container
├── models/                    # Data models (domain entities)
│   ├── __init__.py
│   ├── word.py               # Sanskrit word models
│   └── game.py               # Game session models
├── dto/                       # Data Transfer Objects (API contracts)
│   ├── __init__.py
│   ├── word_dto.py           # Word-related DTOs
│   └── game_dto.py           # Game-related DTOs
├── repositories/              # Data access layer
│   ├── __init__.py
│   ├── interfaces.py         # Repository interfaces
│   └── memory_repository.py  # In-memory implementations
├── services/                  # Business logic layer
│   ├── __init__.py
│   ├── word_service.py       # Word parsing business logic
│   └── game_service.py       # Game management business logic
├── controllers/               # API controllers (presentation layer)
│   ├── __init__.py
│   ├── word_controller.py    # Word-related endpoints
│   └── game_controller.py    # Game-related endpoints
└── api/                       # Legacy API routes
    ├── __init__.py
    └── routes.py             # Backward compatibility routes
```

### Layer Responsibilities

1. **Controllers (Presentation Layer)**
   - Handle HTTP requests and responses
   - Input validation and serialization
   - Error handling and status codes

2. **Services (Business Logic Layer)**
   - Game rules and logic
   - Word parsing algorithms
   - Score calculation
   - Business validations

3. **Repositories (Data Access Layer)**
   - Data persistence abstraction
   - CRUD operations
   - Query implementations

4. **Models (Domain Layer)**
   - Core business entities
   - Domain rules and constraints
   - Data structure definitions

5. **DTOs (Data Transfer Objects)**
   - API input/output contracts
   - Request/response validation
   - Data transformation

## API Documentation

The backend provides a comprehensive RESTful API for the Panini Parser Sanskrit game. 

### Interactive Documentation

Once the server is running, comprehensive API documentation with interactive testing is available at:

- **Swagger UI**: http://localhost:8000/docs - Interactive API explorer with request/response examples
- **ReDoc**: http://localhost:8000/redoc - Clean, readable API reference documentation
- **OpenAPI Schema**: http://localhost:8000/openapi.json - Machine-readable API specification

### Endpoint Overview

The API provides endpoints for:

- **Game Management** (`/game/*`): Start games, submit answers, track progress, and finish sessions
- **Grammar Rules** (`/rules/*`): Lookup detailed information about Panini grammar rules

All endpoints return JSON responses and follow standard HTTP status codes with detailed error messages.

## Development

### Running the Server
```bash
# From project root
uv run panini-backend

# Server will start on http://localhost:8000
```

### API Documentation
Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Configuration

The server is configured with:
- **Host**: 0.0.0.0 (all interfaces)
- **Port**: 8000
- **CORS**: Enabled for frontend development
- **Auto-reload**: Enabled in development

## Dependencies

Key dependencies managed in `pyproject.toml`:
- **FastAPI**: Web framework
- **Uvicorn**: ASGI server
- **Pydantic**: Data validation
- **Vidyut**: Sanskrit parsing engine (to be integrated)

## Development Notes

### CORS Configuration
CORS is configured to allow requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (Alternative dev port)

### Adding New Endpoints

1. Define DTOs in `dto/` directory with proper Pydantic validation
2. Implement business logic in appropriate service (`services/`)
3. Create controller endpoint in `controllers/`
4. Include router in `main.py` if new controller created
5. Regenerate frontend TypeScript client: `cd frontend && pnpm run generate-api`

### API Documentation & Code Generation

The backend automatically generates OpenAPI documentation that can be used to create type-safe clients:

- **Interactive docs**: http://localhost:8000/docs (Swagger UI)
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

The frontend uses this schema to auto-generate TypeScript clients with full type safety.

### Data Models

#### Core Entities
- **SanskritWord**: Represents a Sanskrit word with grammatical properties
- **ParsedForm**: Represents different inflected forms of a word
- **GameSession**: Represents an active game session
- **GameAnswer**: Records user answers and scoring
- **Leaderboard**: Tracks high scores and rankings

#### Business Logic
- **WordService**: Handles word parsing and management
- **GameService**: Manages game sessions, scoring, and statistics

### Repository Pattern

The backend uses the Repository pattern for data access:

```python
# Interface definition
class IWordRepository(ABC):
    async def get_by_id(self, word_id: int) -> Optional[SanskritWord]:
        pass

# Implementation
class MemoryWordRepository(IWordRepository):
    async def get_by_id(self, word_id: int) -> Optional[SanskritWord]:
        return self._words.get(word_id)
```

This allows easy swapping between different data storage implementations (memory, database, etc.).

### Dependency Injection

Services are injected using FastAPI's dependency system:

```python
@router.post("/parse")
async def parse_word(
    request: ParseWordRequest,
    word_service: WordService = Depends(get_word_service)
):
    return await word_service.parse_word(request)
```

### Future Enhancements

- [ ] Vidyut parser integration
- [ ] Database connection (PostgreSQL/SQLite)
- [ ] User authentication and session management
- [ ] Real-time game multiplayer support
- [ ] Advanced analytics and reporting
- [ ] Caching layer (Redis)
- [ ] Background task processing
- [ ] API rate limiting
- [ ] Comprehensive logging and monitoring