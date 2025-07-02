"""
Data Transfer Objects for word-related API endpoints
"""

from typing import List, Optional
from pydantic import BaseModel, Field

from ..models.word import WordType, Gender, Number, Case


class ParseWordRequest(BaseModel):
    """Request DTO for parsing a Sanskrit word"""
    word: str = Field(..., min_length=1, max_length=100, description="Sanskrit word to parse")
    include_alternatives: bool = Field(default=True, description="Include alternative parse suggestions")
    max_suggestions: int = Field(default=5, ge=1, le=10, description="Maximum number of suggestions to return")


class ParsedFormResponse(BaseModel):
    """Response DTO for a parsed form"""
    form: str
    gender: Optional[Gender] = None
    number: Optional[Number] = None
    case: Optional[Case] = None
    person: Optional[int] = None
    analysis: str
    confidence: float = Field(ge=0.0, le=1.0)


class ParseWordResponse(BaseModel):
    """Response DTO for word parsing results"""
    word: str
    success: bool
    confidence: float = Field(ge=0.0, le=1.0)
    forms: List[ParsedFormResponse]
    analysis: str
    suggestions: List[str] = []
    error_message: Optional[str] = None
    processing_time_ms: Optional[int] = None


class WordDetailsRequest(BaseModel):
    """Request DTO for getting word details"""
    word_id: int = Field(..., gt=0)
    include_forms: bool = Field(default=True)


class WordDetailsResponse(BaseModel):
    """Response DTO for word details"""
    id: int
    text: str
    transliteration: str
    meaning: str
    word_type: WordType
    root: Optional[str] = None
    stem: Optional[str] = None
    difficulty_level: int = Field(ge=1, le=5)
    forms: Optional[List[ParsedFormResponse]] = None


class CreateWordRequest(BaseModel):
    """Request DTO for creating a new word"""
    text: str = Field(..., min_length=1, max_length=50)
    transliteration: str = Field(..., min_length=1, max_length=100)
    meaning: str = Field(..., min_length=1, max_length=500)
    word_type: WordType
    root: Optional[str] = Field(None, max_length=50)
    stem: Optional[str] = Field(None, max_length=50)
    difficulty_level: int = Field(default=1, ge=1, le=5)


class UpdateWordRequest(BaseModel):
    """Request DTO for updating a word"""
    text: Optional[str] = Field(None, min_length=1, max_length=50)
    transliteration: Optional[str] = Field(None, min_length=1, max_length=100)
    meaning: Optional[str] = Field(None, min_length=1, max_length=500)
    word_type: Optional[WordType] = None
    root: Optional[str] = Field(None, max_length=50)
    stem: Optional[str] = Field(None, max_length=50)
    difficulty_level: Optional[int] = Field(None, ge=1, le=5)


class WordListRequest(BaseModel):
    """Request DTO for listing words with filters"""
    word_type: Optional[WordType] = None
    difficulty_level: Optional[int] = Field(None, ge=1, le=5)
    search: Optional[str] = Field(None, max_length=100)
    page: int = Field(default=1, ge=1)
    limit: int = Field(default=20, ge=1, le=100)


class WordListResponse(BaseModel):
    """Response DTO for word listing"""
    words: List[WordDetailsResponse]
    total: int
    page: int
    limit: int
    has_next: bool
    has_prev: bool