"""
Data models for Sanskrit words and parsing results
"""

from datetime import datetime
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel


class WordType(str, Enum):
    """Types of Sanskrit words"""
    NOUN = "noun"
    VERB = "verb"
    ADJECTIVE = "adjective"
    PRONOUN = "pronoun"
    ADVERB = "adverb"
    PREPOSITION = "preposition"
    CONJUNCTION = "conjunction"
    INTERJECTION = "interjection"


class Gender(str, Enum):
    """Grammatical gender in Sanskrit"""
    MASCULINE = "masculine"
    FEMININE = "feminine"
    NEUTER = "neuter"


class Number(str, Enum):
    """Grammatical number in Sanskrit"""
    SINGULAR = "singular"
    DUAL = "dual"
    PLURAL = "plural"


class Case(str, Enum):
    """Sanskrit cases (vibhakti)"""
    NOMINATIVE = "nominative"      # प्रथमा
    ACCUSATIVE = "accusative"      # द्वितीया
    INSTRUMENTAL = "instrumental"   # तृतीया
    DATIVE = "dative"              # चतुर्थी
    ABLATIVE = "ablative"          # पञ्चमी
    GENITIVE = "genitive"          # षष्ठी
    LOCATIVE = "locative"          # सप्तमी
    VOCATIVE = "vocative"          # संबोधन


class SanskritWord(BaseModel):
    """Model representing a Sanskrit word with its properties"""
    id: Optional[int] = None
    text: str                      # Devanagari text
    transliteration: str           # Roman transliteration
    meaning: str                   # English meaning
    word_type: WordType
    root: Optional[str] = None     # Dhatu (root) for verbs
    stem: Optional[str] = None     # Pratipadika (stem) for nouns
    difficulty_level: int = 1      # 1-5 difficulty scale
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ParsedForm(BaseModel):
    """Model representing a parsed form of a Sanskrit word"""
    id: Optional[int] = None
    word_id: int
    form: str                      # The actual inflected form
    gender: Optional[Gender] = None
    number: Optional[Number] = None
    case: Optional[Case] = None
    person: Optional[int] = None   # 1st, 2nd, 3rd person (for verbs)
    tense: Optional[str] = None    # For verbs
    mood: Optional[str] = None     # For verbs
    voice: Optional[str] = None    # Active/passive (for verbs)
    analysis: str                  # Detailed grammatical analysis
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ParseResult(BaseModel):
    """Model representing the result of parsing a Sanskrit word"""
    word: str
    success: bool
    confidence: float              # 0.0 to 1.0
    forms: List[ParsedForm]        # Possible parsed forms
    analysis: str                  # Human-readable analysis
    suggestions: List[str] = []    # Alternative suggestions
    error_message: Optional[str] = None
    processing_time_ms: Optional[int] = None