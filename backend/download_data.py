#!/usr/bin/env python3
"""
Script to download Vidyut data for the Panini Parser game.
"""

import sys
from pathlib import Path

import vidyut
from rich.console import Console
from rich.progress import Progress, SpinnerColumn, TextColumn


def main():
    """Download Vidyut data to the backend directory."""
    console = Console()
    
    # Get the backend directory (where this script is located)
    backend_dir = Path(__file__).parent
    data_path = backend_dir / "vidyut-0.4.0"
    
    console.print(f"[blue]Downloading Vidyut data to: {data_path}[/blue]")
    
    try:
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            console=console,
        ) as progress:
            task = progress.add_task("Downloading Vidyut data...", total=None)
            
            # Download the data
            vidyut.download_data(str(data_path))
            
            progress.update(task, description="Download complete!")
        
        console.print(f"[green]✓ Successfully downloaded Vidyut data to {data_path}[/green]")
        
    except Exception as e:
        console.print(f"[red]✗ Error downloading Vidyut data: {e}[/red]")
        sys.exit(1)


if __name__ == "__main__":
    main()
