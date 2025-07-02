"""
Service layer for word-related business logic
"""

import time
from typing import List, Optional

from ..repositories.interfaces import IWordRepository
from ..models.word import SanskritWord, ParseResult, ParsedForm
from ..dto.word_dto import (
    ParseWordRequest, ParseWordResponse, ParsedFormResponse,
    WordDetailsResponse, CreateWordRequest, UpdateWordRequest,
    WordListRequest, WordListResponse
)


class WordService:
    """Service for word-related operations"""

    def __init__(self, word_repository: IWordRepository):
        self._word_repository = word_repository

    async def parse_word(self, request: ParseWordRequest) -> ParseWordResponse:
        """Parse a Sanskrit word using Vidyut engine (placeholder implementation)"""
        start_time = time.time()
        
        # Check if word exists in database
        existing_word = await self._word_repository.get_by_text(request.word)
        
        if existing_word:
            # Get known forms from database
            forms = await self._word_repository.get_forms_by_word_id(existing_word.id)
            
            parsed_forms = [
                ParsedFormResponse(
                    form=form.form,
                    gender=form.gender,
                    number=form.number,
                    case=form.case,
                    person=form.person,
                    analysis=form.analysis,
                    confidence=0.95
                )
                for form in forms
            ]
            
            # If no specific forms, create a default analysis
            if not parsed_forms:
                parsed_forms = [
                    ParsedFormResponse(
                        form=request.word,
                        analysis=f"Word: {existing_word.text} ({existing_word.transliteration}) - {existing_word.meaning}",
                        confidence=0.9
                    )
                ]
            
            processing_time = int((time.time() - start_time) * 1000)
            
            return ParseWordResponse(
                word=request.word,
                success=True,
                confidence=0.9,
                forms=parsed_forms,
                analysis=f"Found in database: {existing_word.meaning}",
                suggestions=[],
                processing_time_ms=processing_time
            )
        
        else:
            # Placeholder for Vidyut parser integration
            # TODO: Integrate with actual Vidyut parser engine
            processing_time = int((time.time() - start_time) * 1000)
            
            return ParseWordResponse(
                word=request.word,
                success=False,
                confidence=0.1,
                forms=[],
                analysis=f"Word '{request.word}' not found in database. Vidyut parser integration pending.",
                suggestions=self._get_similar_words(request.word),
                error_message="Vidyut parser not yet integrated",
                processing_time_ms=processing_time
            )

    async def get_word_details(self, word_id: int, include_forms: bool = True) -> Optional[WordDetailsResponse]:
        """Get detailed information about a word"""
        word = await self._word_repository.get_by_id(word_id)
        if not word:
            return None
        
        forms = None
        if include_forms:
            forms_data = await self._word_repository.get_forms_by_word_id(word_id)
            forms = [
                ParsedFormResponse(
                    form=form.form,
                    gender=form.gender,
                    number=form.number,
                    case=form.case,
                    person=form.person,
                    analysis=form.analysis,
                    confidence=0.95
                )
                for form in forms_data
            ]
        
        return WordDetailsResponse(
            id=word.id,
            text=word.text,
            transliteration=word.transliteration,
            meaning=word.meaning,
            word_type=word.word_type,
            root=word.root,
            stem=word.stem,
            difficulty_level=word.difficulty_level,
            forms=forms
        )

    async def create_word(self, request: CreateWordRequest) -> WordDetailsResponse:
        """Create a new word"""
        # Check if word already exists
        existing = await self._word_repository.get_by_text(request.text)
        if existing:
            raise ValueError(f"Word '{request.text}' already exists")
        
        word = SanskritWord(
            text=request.text,
            transliteration=request.transliteration,
            meaning=request.meaning,
            word_type=request.word_type,
            root=request.root,
            stem=request.stem,
            difficulty_level=request.difficulty_level
        )
        
        created_word = await self._word_repository.create(word)
        
        return WordDetailsResponse(
            id=created_word.id,
            text=created_word.text,
            transliteration=created_word.transliteration,
            meaning=created_word.meaning,
            word_type=created_word.word_type,
            root=created_word.root,
            stem=created_word.stem,
            difficulty_level=created_word.difficulty_level
        )

    async def update_word(self, word_id: int, request: UpdateWordRequest) -> Optional[WordDetailsResponse]:
        """Update an existing word"""
        # Check if word exists
        existing = await self._word_repository.get_by_id(word_id)
        if not existing:
            return None
        
        # Prepare updates
        updates = {}
        for field, value in request.model_dump(exclude_unset=True).items():
            if value is not None:
                updates[field] = value
        
        if not updates:
            # No updates provided, return current word
            return await self.get_word_details(word_id, include_forms=False)
        
        updated_word = await self._word_repository.update(word_id, updates)
        if not updated_word:
            return None
        
        return WordDetailsResponse(
            id=updated_word.id,
            text=updated_word.text,
            transliteration=updated_word.transliteration,
            meaning=updated_word.meaning,
            word_type=updated_word.word_type,
            root=updated_word.root,
            stem=updated_word.stem,
            difficulty_level=updated_word.difficulty_level
        )

    async def list_words(self, request: WordListRequest) -> WordListResponse:
        """List words with filtering and pagination"""
        words, total = await self._word_repository.list_words(
            word_type=request.word_type,
            difficulty_level=request.difficulty_level,
            search=request.search,
            page=request.page,
            limit=request.limit
        )
        
        word_responses = [
            WordDetailsResponse(
                id=word.id,
                text=word.text,
                transliteration=word.transliteration,
                meaning=word.meaning,
                word_type=word.word_type,
                root=word.root,
                stem=word.stem,
                difficulty_level=word.difficulty_level
            )
            for word in words
        ]
        
        has_next = (request.page * request.limit) < total
        has_prev = request.page > 1
        
        return WordListResponse(
            words=word_responses,
            total=total,
            page=request.page,
            limit=request.limit,
            has_next=has_next,
            has_prev=has_prev
        )

    async def get_random_word(self, difficulty_level: Optional[int] = None) -> Optional[WordDetailsResponse]:
        """Get a random word for gameplay"""
        word = await self._word_repository.get_random_word(difficulty_level)
        if not word:
            return None
        
        return WordDetailsResponse(
            id=word.id,
            text=word.text,
            transliteration=word.transliteration,
            meaning=word.meaning,
            word_type=word.word_type,
            root=word.root,
            stem=word.stem,
            difficulty_level=word.difficulty_level
        )

    def _get_similar_words(self, word: str) -> List[str]:
        """Get similar words for suggestions (placeholder implementation)"""
        # TODO: Implement proper similarity matching
        # This could use edit distance, phonetic similarity, etc.
        return [
            "देवः (devaḥ) - god",
            "देवी (devī) - goddess", 
            "देव (deva) - divine"
        ]

    async def delete_word(self, word_id: int) -> bool:
        """Delete a word"""
        return await self._word_repository.delete(word_id)