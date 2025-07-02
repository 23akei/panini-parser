#!/usr/bin/env python3
"""
Vidyut Sanskrit parser service wrapper for CLI
"""

import os
import tempfile
from pathlib import Path
from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass
from rich.console import Console

console = Console()

@dataclass
class ParsedWord:
    """Represents a parsed Sanskrit word"""
    word: str
    meaning: str
    lemma: str
    part_of_speech: str
    case: Optional[str] = None
    number: Optional[str] = None
    gender: Optional[str] = None
    person: Optional[str] = None
    tense: Optional[str] = None
    mood: Optional[str] = None
    voice: Optional[str] = None


class VidyutService:
    """Service for interacting with Vidyut Sanskrit parser"""
    
    def __init__(self):
        self.data_path: Optional[Path] = None
        self.kosha = None
        self.cheda = None
        self.lipi = None
        self._initialized = False
        
    def initialize(self) -> bool:
        """Initialize Vidyut with data download"""
        try:
            import vidyut
            
            # Create data directory in user's home
            home_dir = Path.home()
            self.data_path = home_dir / ".panini-parser" / "vidyut-data"
            self.data_path.mkdir(parents=True, exist_ok=True)
            
            # Check if data already exists
            kosha_path = self.data_path / "kosha"
            if not kosha_path.exists():
                console.print("📥 Downloading Vidyut data (first time setup)...")
                try:
                    vidyut.download_data(str(self.data_path))
                    console.print("✅ Vidyut data downloaded successfully!")
                except Exception as e:
                    console.print(f"⚠️ Data download failed: {e}")
                    # Continue anyway, maybe data exists in another location
            
            # Initialize modules with error handling
            try:
                from vidyut.kosha import Kosha
                if kosha_path.exists():
                    self.kosha = Kosha(str(kosha_path))
                    console.print("✅ Kosha (dictionary) initialized")
                else:
                    console.print("⚠️ Kosha data not found, using fallback mode")
            except Exception as e:
                console.print(f"⚠️ Kosha initialization failed: {e}")
            
            # Try to initialize cheda if available
            try:
                from vidyut.cheda import Cheda
                cheda_path = self.data_path / "cheda"
                if cheda_path.exists():
                    self.cheda = Cheda(str(cheda_path))
                    console.print("✅ Cheda (segmentation) initialized")
            except Exception as e:
                console.print(f"⚠️ Cheda module not available: {e}")
            
            # Initialize transliteration
            try:
                from vidyut.lipi import Lipi
                self.lipi = Lipi()
                console.print("✅ Lipi (transliteration) initialized")
            except Exception as e:
                console.print(f"⚠️ Lipi initialization failed: {e}")
            
            self._initialized = True
            return True
            
        except ImportError as e:
            console.print(f"❌ Vidyut library not found: {e}")
            console.print("📦 Installing Vidyut...")
            # Try to install using uv
            try:
                import subprocess
                subprocess.run(["uv", "add", "vidyut>=0.4.0"], check=True)
                console.print("✅ Vidyut installed! Please run setup again.")
            except Exception:
                console.print("❌ Auto-install failed. Please install manually: uv add vidyut")
            return False
        except Exception as e:
            console.print(f"❌ Failed to initialize Vidyut: {e}")
            return False
    
    def is_initialized(self) -> bool:
        """Check if Vidyut is properly initialized"""
        return self._initialized
    
    def parse_word(self, word: str) -> List[ParsedWord]:
        """Parse a Sanskrit word and return possible interpretations"""
        if not self._initialized:
            if not self.initialize():
                return []
        
        try:
            results = []
            
            # Search in kosha (dictionary)
            kosha_entries = list(self.kosha.get(word))
            
            for entry in kosha_entries:
                # Extract information from kosha entry
                parsed = ParsedWord(
                    word=word,
                    meaning=getattr(entry, 'meaning', 'Unknown meaning'),
                    lemma=getattr(entry, 'lemma', word),
                    part_of_speech=getattr(entry, 'pos', 'Unknown'),
                    case=getattr(entry, 'case', None),
                    number=getattr(entry, 'number', None),
                    gender=getattr(entry, 'gender', None),
                    person=getattr(entry, 'person', None),
                    tense=getattr(entry, 'tense', None),
                    mood=getattr(entry, 'mood', None),
                    voice=getattr(entry, 'voice', None)
                )
                results.append(parsed)
            
            # If cheda is available, try word segmentation
            if self.cheda and not results:
                try:
                    cheda_results = self.cheda.run(word)
                    for result in cheda_results:
                        parsed = ParsedWord(
                            word=word,
                            meaning="Segmented word",
                            lemma=word,
                            part_of_speech="Compound"
                        )
                        results.append(parsed)
                except Exception as e:
                    console.print(f"⚠️ Cheda parsing failed: {e}")
            
            return results
            
        except Exception as e:
            console.print(f"❌ Error parsing word '{word}': {e}")
            return []
    
    def transliterate(self, text: str, source_script: str = "devanagari", target_script: str = "iast") -> str:
        """Transliterate text between scripts"""
        if not self._initialized or not self.lipi:
            return text
        
        try:
            return self.lipi.transliterate(text, source_script, target_script)
        except Exception as e:
            console.print(f"⚠️ Transliteration failed: {e}")
            return text
    
    def get_word_info(self, word: str) -> Dict[str, any]:
        """Get comprehensive information about a word"""
        parsed_results = self.parse_word(word)
        
        info = {
            "word": word,
            "found": len(parsed_results) > 0,
            "count": len(parsed_results),
            "results": []
        }
        
        for parsed in parsed_results:
            result = {
                "meaning": parsed.meaning,
                "lemma": parsed.lemma,
                "part_of_speech": parsed.part_of_speech,
                "grammatical_info": {}
            }
            
            # Add grammatical information if available
            if parsed.case:
                result["grammatical_info"]["case"] = parsed.case
            if parsed.number:
                result["grammatical_info"]["number"] = parsed.number
            if parsed.gender:
                result["grammatical_info"]["gender"] = parsed.gender
            if parsed.person:
                result["grammatical_info"]["person"] = parsed.person
            if parsed.tense:
                result["grammatical_info"]["tense"] = parsed.tense
            if parsed.mood:
                result["grammatical_info"]["mood"] = parsed.mood
            if parsed.voice:
                result["grammatical_info"]["voice"] = parsed.voice
            
            info["results"].append(result)
        
        return info
    
    def search_words(self, pattern: str, limit: int = 10) -> List[str]:
        """Search for words matching a pattern"""
        if not self._initialized:
            return []
        
        try:
            # Simple search implementation
            # In a full implementation, this would use more sophisticated search
            results = []
            
            # For now, try exact and prefix matches
            exact_results = list(self.kosha.get(pattern))
            if exact_results:
                results.append(pattern)
            
            # Add some common Sanskrit words as examples
            sample_words = [
                "देवः", "गच्छति", "सुन्दरः", "ब्राह्मणः", "राजा", 
                "गुरुः", "शिष्यः", "ग्रामः", "नगरम्", "वनम्"
            ]
            
            for word in sample_words:
                if pattern.lower() in word.lower() and word not in results:
                    results.append(word)
                    if len(results) >= limit:
                        break
            
            return results[:limit]
            
        except Exception as e:
            console.print(f"⚠️ Search failed: {e}")
            return []


# Global service instance
_vidyut_service = None

def get_vidyut_service() -> VidyutService:
    """Get the global Vidyut service instance"""
    global _vidyut_service
    if _vidyut_service is None:
        _vidyut_service = VidyutService()
    return _vidyut_service