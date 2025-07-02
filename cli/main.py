#!/usr/bin/env python3
"""
Panini Parser CLI - Sanskrit parsing game using Vidyut
"""

import typer
from typing import Optional
from rich.console import Console
from rich.panel import Panel
from rich.text import Text
from rich.table import Table
from rich.prompt import Prompt, Confirm
from rich.progress import Progress, SpinnerColumn, TextColumn

from .vidyut_service import get_vidyut_service, ParsedWord
from .word_database import get_word_database, Difficulty

app = typer.Typer(help="Panini Parser - A Sanskrit parsing game using Vidyut engine")
console = Console()


@app.command()
def setup():
    """Set up Vidyut data and test the installation"""
    console.print(Panel.fit("🔧 Panini Parser Setup", style="bold blue"))
    
    vidyut = get_vidyut_service()
    
    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        console=console,
    ) as progress:
        task = progress.add_task("Initializing Vidyut...", total=None)
        success = vidyut.initialize()
        progress.remove_task(task)
    
    if success:
        console.print("✅ [green]Vidyut setup completed successfully![/green]")
        
        # Test with a simple word
        console.print("\n🧪 Testing with word 'देवः'...")
        results = vidyut.parse_word("देवः")
        
        if results:
            console.print(f"✅ [green]Found {len(results)} interpretation(s)[/green]")
            for i, result in enumerate(results[:3], 1):
                console.print(f"  {i}. {result.meaning} ({result.part_of_speech})")
        else:
            console.print("⚠️ [yellow]No results found, but service is running[/yellow]")
        
        console.print("\n🎮 You can now use 'panini-cli play' to start the game!")
    else:
        console.print("❌ [red]Setup failed. Please check your installation.[/red]")


@app.command()
def parse(
    word: str = typer.Argument(..., help="Sanskrit word to parse"),
    transliterate: bool = typer.Option(False, "--transliterate", "-t", help="Show transliteration")
):
    """Parse a Sanskrit word using Vidyut"""
    console.print(f"🔍 Parsing: [bold yellow]{word}[/bold yellow]")
    
    vidyut = get_vidyut_service()
    if not vidyut.is_initialized():
        console.print("⚠️ Vidyut not initialized. Initializing now...")
        if not vidyut.initialize():
            console.print("❌ Failed to initialize Vidyut")
            return
    
    # Get comprehensive word info
    info = vidyut.get_word_info(word)
    
    if not info["found"]:
        console.print("❌ [red]Word not found in Vidyut database[/red]")
        
        # Check local database
        db = get_word_database()
        local_word = db.get_word_by_text(word)
        if local_word:
            console.print("\n📚 Found in local database:")
            display_word_info(local_word, transliterate)
        else:
            console.print("\n💡 Suggestions:")
            suggestions = ["देवः", "गच्छति", "सुन्दरः"]
            for suggestion in suggestions:
                console.print(f"  • {suggestion}")
        return
    
    # Display results
    console.print(f"\n📖 Found {info['count']} interpretation(s):")
    
    for i, result in enumerate(info["results"], 1):
        table = Table(title=f"Interpretation {i}", show_header=False, box=None)
        table.add_column("Field", style="cyan")
        table.add_column("Value", style="white")
        
        table.add_row("Meaning", result["meaning"])
        table.add_row("Part of Speech", result["part_of_speech"])
        table.add_row("Lemma", result["lemma"])
        
        if transliterate:
            iast = vidyut.transliterate(word, "devanagari", "iast")
            table.add_row("IAST", iast)
        
        # Add grammatical information
        if result["grammatical_info"]:
            for key, value in result["grammatical_info"].items():
                table.add_row(key.title(), value)
        
        console.print(table)
        console.print()


@app.command()
def play(
    difficulty: str = typer.Option("beginner", help="Difficulty: beginner, intermediate, advanced, expert"),
    rounds: int = typer.Option(5, help="Number of rounds to play")
):
    """Start the Sanskrit parsing game"""
    console.print(Panel.fit("🎮 Panini Parser Game", style="bold blue"))
    
    # Parse difficulty
    try:
        diff_map = {
            "beginner": Difficulty.BEGINNER,
            "intermediate": Difficulty.INTERMEDIATE, 
            "advanced": Difficulty.ADVANCED,
            "expert": Difficulty.EXPERT
        }
        selected_difficulty = diff_map[difficulty.lower()]
    except KeyError:
        console.print(f"❌ Invalid difficulty: {difficulty}")
        return
    
    # Initialize services
    vidyut = get_vidyut_service()
    db = get_word_database()
    
    console.print(f"🎯 Difficulty: [bold]{difficulty.title()}[/bold]")
    console.print(f"🔢 Rounds: [bold]{rounds}[/bold]")
    console.print()
    
    score = 0
    total_rounds = rounds
    
    for round_num in range(1, rounds + 1):
        console.print(f"[bold blue]Round {round_num}/{total_rounds}[/bold blue]")
        
        # Get a word for this round
        word_data = db.get_random_word(selected_difficulty)
        
        # Display the word
        console.print(f"\n📝 Parse this word: [bold yellow]{word_data.devanagari}[/bold yellow]")
        if selected_difficulty == Difficulty.BEGINNER:
            console.print(f"💡 Transliteration: {word_data.iast}")
        
        # Get user's answer
        user_answer = Prompt.ask("\n🤔 What does this word mean? (meaning and/or grammatical analysis)")
        
        # Check answer
        correct = check_answer(user_answer, word_data)
        
        if correct:
            console.print("✅ [green]Correct![/green]")
            score += 1
        else:
            console.print("❌ [red]Incorrect.[/red]")
        
        # Show correct answer
        console.print("\n📚 Correct answer:")
        display_word_info(word_data, show_transliteration=True)
        
        # Show Vidyut analysis if available
        if vidyut.is_initialized():
            vidyut_info = vidyut.get_word_info(word_data.devanagari)
            if vidyut_info["found"]:
                console.print("\n🔍 Vidyut analysis:")
                for result in vidyut_info["results"][:2]:  # Show top 2 results
                    console.print(f"  • {result['meaning']} ({result['part_of_speech']})")
        
        console.print("\n" + "─" * 50 + "\n")
    
    # Final score
    percentage = (score / total_rounds) * 100
    console.print(Panel.fit(
        f"🎉 Game Complete!\n\nScore: {score}/{total_rounds} ({percentage:.1f}%)", 
        style="bold green" if percentage >= 70 else "bold yellow" if percentage >= 50 else "bold red"
    ))


@app.command()
def search(
    query: str = typer.Argument(..., help="Search term"),
    limit: int = typer.Option(10, help="Maximum results to show")
):
    """Search for Sanskrit words"""
    console.print(f"🔍 Searching for: [bold]{query}[/bold]")
    
    db = get_word_database()
    results = db.search_words(query)
    
    if not results:
        console.print("❌ No words found")
        return
    
    console.print(f"\n📚 Found {len(results)} word(s):")
    
    table = Table()
    table.add_column("Devanagari", style="yellow")
    table.add_column("IAST", style="cyan")
    table.add_column("Meaning", style="white")
    table.add_column("Difficulty", style="green")
    
    for word in results[:limit]:
        table.add_row(
            word.devanagari,
            word.iast,
            word.meaning,
            word.difficulty.name.lower()
        )
    
    console.print(table)


@app.command()
def stats():
    """Show word database statistics"""
    db = get_word_database()
    stats = db.get_stats()
    
    table = Table(title="📊 Word Database Statistics")
    table.add_column("Difficulty Level", style="cyan")
    table.add_column("Word Count", style="yellow", justify="right")
    
    table.add_row("Total", str(stats["total_words"]))
    table.add_row("Beginner", str(stats["beginner"]))
    table.add_row("Intermediate", str(stats["intermediate"])) 
    table.add_row("Advanced", str(stats["advanced"]))
    table.add_row("Expert", str(stats["expert"]))
    
    console.print(table)


@app.command()
def info():
    """Show information about Panini Parser"""
    info_text = Text()
    info_text.append("Panini Parser\n", style="bold blue")
    info_text.append("A Sanskrit parsing game using the Vidyut parser engine\n\n")
    info_text.append("Commands:\n", style="bold")
    info_text.append("  setup     - Initialize Vidyut data\n")
    info_text.append("  play      - Start the parsing game\n")
    info_text.append("  parse     - Parse a specific word\n")
    info_text.append("  search    - Search for words\n")
    info_text.append("  stats     - Show database statistics\n\n")
    info_text.append("Vidyut Repository: https://github.com/ambuda-org/vidyut\n", style="dim")
    
    console.print(Panel(info_text, title="About Panini Parser", border_style="green"))


def display_word_info(word_data, show_transliteration: bool = False):
    """Display detailed word information"""
    table = Table(show_header=False, box=None)
    table.add_column("Field", style="cyan")
    table.add_column("Value", style="white")
    
    table.add_row("Word", word_data.devanagari)
    if show_transliteration:
        table.add_row("IAST", word_data.iast)
    table.add_row("Meaning", word_data.meaning)
    table.add_row("Part of Speech", word_data.part_of_speech)
    
    if word_data.gender:
        table.add_row("Gender", word_data.gender)
    if word_data.case_info:
        table.add_row("Case Info", word_data.case_info)
    if word_data.root:
        table.add_row("Root", word_data.root)
    if word_data.additional_info:
        table.add_row("Notes", word_data.additional_info)
    
    console.print(table)


def check_answer(user_answer: str, word_data) -> bool:
    """Check if user's answer is correct"""
    user_answer = user_answer.lower().strip()
    
    # Check for meaning keywords
    meaning_words = word_data.meaning.lower().split()
    meaning_match = any(word in user_answer for word in meaning_words)
    
    # Check for grammatical terms
    grammatical_terms = [
        word_data.part_of_speech.lower(),
        word_data.gender.lower() if word_data.gender else "",
        "masculine", "feminine", "neuter",
        "noun", "verb", "adjective", "pronoun"
    ]
    
    grammatical_match = any(term in user_answer for term in grammatical_terms if term)
    
    # Accept if either meaning or grammatical analysis is correct
    return meaning_match or grammatical_match


if __name__ == "__main__":
    app()