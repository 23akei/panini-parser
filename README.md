# Panini Parser

A Sanskrit parsing game using the Vidyut parser engine.

## Project Description

This project is a Sanskrit parsing game that allows users to learn and practice Sanskrit grammar through interactive parsing exercises. The game uses the [Vidyut parser engine](https://github.com/ambuda-org/vidyut) for accurate Sanskrit word analysis.

The project provides multiple interfaces:
- **CLI Tool**: Command-line interface for terminal-based gameplay
- **Web UI**: Modern React-based web interface with FastAPI backend
- **Future**: Gamepad support via Arduino/Raspberry Pi

## Project Structure

```
panini-parser/
├── cli/                    # CLI component (Python + Typer)
├── backend/               # FastAPI backend server
├── frontend/              # React + TypeScript frontend
├── pyproject.toml         # Python dependencies and configuration
└── README.md             # This file
```

## Quick Start

### Prerequisites
- Python 3.12+
- [uv](https://docs.astral.sh/uv/getting-started/installation/) (Python package manager)
- [pnpm](https://pnpm.io/installation) (Node.js package manager)

### Setup
```bash
# Install Python dependencies (includes Vidyut parser)
uv sync

# Download Vidyut data (required for Sanskrit parsing)
uv run panini-download-data

# Install frontend dependencies
cd frontend && pnpm install
```

### Running the Components

#### CLI Game with Vidyut Integration
```bash
# Setup Vidyut data (first time only)
uv run panini-cli setup

# Show available commands
uv run panini-cli info

# Play the game (multiple difficulty levels)
uv run panini-cli play --difficulty beginner --rounds 5

# Parse specific words
uv run panini-cli parse देवः --transliterate

# Search word database
uv run panini-cli search god

# Show statistics
uv run panini-cli stats
```

#### Web Application with Auto-Generated API
```bash
# Terminal 1: Start backend server
uv run panini-backend

# Terminal 2: Generate TypeScript API client (optional)
cd frontend && pnpm run generate-api

# Terminal 3: Start frontend dev server
cd frontend && pnpm dev
```

Then open http://localhost:5173 in your browser.

## Implementation Status

- [x] ✅ CLI tool with Vidyut integration and game features
- [x] ✅ FastAPI backend with layered architecture
- [x] ✅ React frontend with auto-generated API client
- [x] ✅ Vidyut parser engine integration
- [x] ✅ Sample Sanskrit word database (17+ words)
- [x] ✅ Game logic and scoring system
- [x] ✅ Multiple difficulty levels (beginner to expert)
- [x] ✅ TypeScript API generation from OpenAPI
- [ ] 🔄 User authentication and progress tracking
- [ ] 🔄 Extended word database
- [ ] 🔄 Gamepad support (Arduino/Raspberry Pi)
- [ ] 🔄 Real-time multiplayer features

## Development

Each component has its own README with detailed development instructions:
- [CLI Documentation](cli/README.md)
- [Backend Documentation](backend/README.md)
- [Frontend Documentation](frontend/README.md)

## API Documentation

When the backend is running, visit http://localhost:8000/docs for interactive API documentation.
