# CLI - Panini Parser Command Line Interface

Terminal-based Sanskrit parsing game using Typer and Rich for beautiful CLI experiences.

## Overview

The CLI provides a command-line interface for playing the Sanskrit parsing game. It offers an interactive terminal experience with rich formatting and colors.

## Architecture

```
cli/
├── __init__.py
└── main.py              # Typer CLI application
```

## Commands

### Available Commands

```bash
# Setup Vidyut data (first time only)
uv run panini-cli setup

# Show project information
uv run panini-cli info

# Start the parsing game with options
uv run panini-cli play --difficulty beginner --rounds 5

# Parse a specific word
uv run panini-cli parse देवः --transliterate

# Search for words
uv run panini-cli search god

# Show database statistics
uv run panini-cli stats

# Show help
uv run panini-cli --help
```

## Features

### Rich Terminal UI
- **Colorful output**: Uses Rich library for beautiful terminal formatting
- **Panels and boxes**: Structured display of game information
- **Sanskrit text display**: Proper rendering of Devanagari script
- **Interactive prompts**: User-friendly input handling
- **Progress indicators**: Spinner animations for data loading
- **Tables**: Formatted word statistics and search results

### Game Features
- **Multiple difficulty levels**: Beginner, Intermediate, Advanced, Expert
- **Configurable rounds**: Play 1-20 rounds per session
- **Real-time scoring**: Points and accuracy tracking
- **Word database**: 17+ curated Sanskrit words with grammatical details
- **Vidyut integration**: Real Sanskrit parsing using Vidyut engine
- **Transliteration support**: IAST romanization display
- **Smart answer checking**: Accepts both meaning and grammatical analysis

## Development

### Running from Source
```bash
# From project root
uv run python -m cli.main info
uv run python -m cli.main play
```

### Adding New Commands

1. Add new command function to `main.py`:
```python
@app.command()
def new_command():
    """Description of the new command"""
    # Implementation here
```

2. Use Rich for formatting:
```python
from rich.console import Console
from rich.panel import Panel

console = Console()
console.print(Panel("Your content", title="Title"))
```

## Dependencies

Key dependencies:
- **Typer**: CLI framework with automatic help generation
- **Rich**: Terminal formatting and colors
- **Click**: Underlying CLI toolkit (via Typer)

## Configuration

The CLI is configured as an entry point in `pyproject.toml`:
```toml
[project.scripts]
panini-cli = "cli.main:app"
```

## Architecture

### Core Components

```
cli/
├── __init__.py
├── main.py              # CLI application with Typer
├── vidyut_service.py    # Vidyut parser integration
└── word_database.py     # Sample word database
```

### Vidyut Integration
- **Service wrapper**: Handles Vidyut initialization and data download
- **Error handling**: Graceful fallbacks when Vidyut modules unavailable
- **Caching**: Local data storage at `~/.panini-parser/vidyut-data/`

### Word Database
- **17+ sample words**: Beginner to expert difficulty levels
- **Rich metadata**: IAST, meanings, grammatical information
- **Search functionality**: Text-based word searching

## Future Enhancements

- [x] ✅ Vidyut parser integration
- [x] ✅ Interactive parsing workflow  
- [x] ✅ Progress tracking and scores
- [x] ✅ Multiple difficulty levels
- [x] ✅ Word database integration
- [ ] 🔄 Configuration file support
- [ ] 🔄 Command history and replay
- [ ] 🔄 Export results to file
- [ ] 🔄 Custom word lists
- [ ] 🔄 Learning progress analytics

## Examples

### Basic Usage
```bash
$ uv run panini-cli info
╭─────────────────────────────────── About ────────────────────────────────────╮
│ Panini Parser                                                                │
│ A Sanskrit parsing game using the Vidyut parser engine                       │
│ Repository: https://github.com/ambuda-org/vidyut                             │
╰──────────────────────────────────────────────────────────────────────────────╯
```

```bash
$ uv run panini-cli play
╭───────────────────────╮
│ 🎮 Panini Parser Game │
╰───────────────────────╯
Welcome to the Sanskrit parsing game!
This is a minimal implementation. Game logic will be added later.

📝 Parse this word: देवः
(This will connect to Vidyut parser engine in future updates)
```