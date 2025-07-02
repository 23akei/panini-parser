"""
Legacy API routes for backward compatibility
"""

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Dict, Any

from ..dto.word_dto import ParseWordRequest
from ..dto.game_dto import StartGameRequest
from ..services.word_service import WordService
from ..services.game_service import GameService
from ..dependencies import get_word_service, get_game_service

router = APIRouter()


class ParseRequest(BaseModel):
    word: str


class ParseResponse(BaseModel):
    word: str
    parsed: bool
    analysis: str
    message: str


@router.get("/health")
async def health_check() -> Dict[str, str]:
    """Health check endpoint"""
    return {"status": "healthy", "service": "panini-parser"}


@router.post("/parse", response_model=ParseResponse)
async def parse_word(
    request: ParseRequest,
    word_service: WordService = Depends(get_word_service)
) -> ParseResponse:
    """
    Parse a Sanskrit word using Vidyut engine (legacy endpoint)
    """
    # Convert to new DTO format
    parse_request = ParseWordRequest(word=request.word)
    result = await word_service.parse_word(parse_request)
    
    # Convert back to legacy format
    return ParseResponse(
        word=result.word,
        parsed=result.success,
        analysis=result.analysis,
        message=result.error_message or "Parse completed"
    )


@router.get("/game/start")
async def start_game(
    game_service: GameService = Depends(get_game_service)
) -> Dict[str, Any]:
    """Start a new parsing game session (legacy endpoint)"""
    start_request = StartGameRequest()
    result = await game_service.start_game(start_request)
    
    return {
        "session_id": result.session_id,
        "message": result.message,
        "current_word": result.current_word,
        "instructions": result.instructions
    }