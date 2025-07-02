"""
Word-related API controllers
"""

from fastapi import APIRouter, HTTPException, Depends, status
from typing import Optional

from ..dto.word_dto import (
    ParseWordRequest, ParseWordResponse, WordDetailsResponse,
    CreateWordRequest, UpdateWordRequest, WordListRequest, WordListResponse
)
from ..services.word_service import WordService
from ..dependencies import get_word_service

router = APIRouter(prefix="/words", tags=["words"])


@router.post("/parse", response_model=ParseWordResponse)
async def parse_word(
    request: ParseWordRequest,
    word_service: WordService = Depends(get_word_service)
) -> ParseWordResponse:
    """
    Parse a Sanskrit word using the Vidyut engine
    """
    try:
        return await word_service.parse_word(request)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error parsing word: {str(e)}"
        )


@router.get("/{word_id}", response_model=WordDetailsResponse)
async def get_word_details(
    word_id: int,
    include_forms: bool = True,
    word_service: WordService = Depends(get_word_service)
) -> WordDetailsResponse:
    """
    Get detailed information about a specific word
    """
    word = await word_service.get_word_details(word_id, include_forms)
    if not word:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Word with ID {word_id} not found"
        )
    return word


@router.get("/", response_model=WordListResponse)
async def list_words(
    word_type: Optional[str] = None,
    difficulty_level: Optional[int] = None,
    search: Optional[str] = None,
    page: int = 1,
    limit: int = 20,
    word_service: WordService = Depends(get_word_service)
) -> WordListResponse:
    """
    List words with optional filtering and pagination
    """
    if limit > 100:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Limit cannot exceed 100"
        )
    
    if page < 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Page must be >= 1"
        )
    
    request = WordListRequest(
        word_type=word_type,
        difficulty_level=difficulty_level,
        search=search,
        page=page,
        limit=limit
    )
    
    return await word_service.list_words(request)


@router.get("/random/word", response_model=WordDetailsResponse)
async def get_random_word(
    difficulty_level: Optional[int] = None,
    word_service: WordService = Depends(get_word_service)
) -> WordDetailsResponse:
    """
    Get a random word for gameplay
    """
    word = await word_service.get_random_word(difficulty_level)
    if not word:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No words available for the specified difficulty level"
        )
    return word


@router.post("/", response_model=WordDetailsResponse, status_code=status.HTTP_201_CREATED)
async def create_word(
    request: CreateWordRequest,
    word_service: WordService = Depends(get_word_service)
) -> WordDetailsResponse:
    """
    Create a new word
    """
    try:
        return await word_service.create_word(request)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating word: {str(e)}"
        )


@router.put("/{word_id}", response_model=WordDetailsResponse)
async def update_word(
    word_id: int,
    request: UpdateWordRequest,
    word_service: WordService = Depends(get_word_service)
) -> WordDetailsResponse:
    """
    Update an existing word
    """
    word = await word_service.update_word(word_id, request)
    if not word:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Word with ID {word_id} not found"
        )
    return word


@router.delete("/{word_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_word(
    word_id: int,
    word_service: WordService = Depends(get_word_service)
):
    """
    Delete a word
    """
    deleted = await word_service.delete_word(word_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Word with ID {word_id} not found"
        )
    return None