"""
API routes for the Panini Parser application
"""

from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any

from ..dto.word_dto import (
    ParseWordRequest, ParseWordResponse,
    WordDetailsRequest, WordDetailsResponse,
    CreateWordRequest, UpdateWordRequest,
    WordListRequest, WordListResponse
)
from ..dto.game_dto import (
    StartGameRequest, StartGameResponse,
    SubmitAnswerRequest, SubmitAnswerResponse,
    GetGameStateRequest, GetGameStateResponse,
    EndGameRequest, EndGameResponse,
    GameStatsResponse, LeaderboardRequest, LeaderboardResponse,
    GameHistoryRequest, GameHistoryResponse
)
from ..services.word_service import WordService
from ..services.game_service import GameService
from ..dependencies import get_word_service, get_game_service

router = APIRouter()


@router.get("/health")
async def health_check() -> Dict[str, str]:
    """Health check endpoint"""
    return {"status": "healthy", "service": "panini-parser"}


# Word Management Endpoints

@router.post("/words/parse", response_model=ParseWordResponse)
async def parse_word(
    request: ParseWordRequest,
    word_service: WordService = Depends(get_word_service)
) -> ParseWordResponse:
    """Parse a Sanskrit word using Vidyut engine"""
    try:
        result = await word_service.parse_word(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error parsing word: {str(e)}")


@router.get("/words/{word_id}", response_model=WordDetailsResponse)
async def get_word_details(
    word_id: int,
    include_forms: bool = True,
    word_service: WordService = Depends(get_word_service)
) -> WordDetailsResponse:
    """Get detailed information about a word"""
    try:
        request = WordDetailsRequest(word_id=word_id, include_forms=include_forms)
        result = await word_service.get_word_details(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting word details: {str(e)}")


@router.get("/words", response_model=WordListResponse)
async def list_words(
    request: WordListRequest = Depends(),
    word_service: WordService = Depends(get_word_service)
) -> WordListResponse:
    """List words with optional filtering"""
    try:
        result = await word_service.list_words(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing words: {str(e)}")


@router.post("/words", response_model=WordDetailsResponse)
async def create_word(
    request: CreateWordRequest,
    word_service: WordService = Depends(get_word_service)
) -> WordDetailsResponse:
    """Create a new word"""
    try:
        result = await word_service.create_word(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating word: {str(e)}")


@router.put("/words/{word_id}", response_model=WordDetailsResponse)
async def update_word(
    word_id: int,
    request: UpdateWordRequest,
    word_service: WordService = Depends(get_word_service)
) -> WordDetailsResponse:
    """Update an existing word"""
    try:
        result = await word_service.update_word(word_id, request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating word: {str(e)}")


@router.delete("/words/{word_id}")
async def delete_word(
    word_id: int,
    word_service: WordService = Depends(get_word_service)
) -> Dict[str, str]:
    """Delete a word"""
    try:
        await word_service.delete_word(word_id)
        return {"message": "Word deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting word: {str(e)}")


# Game Management Endpoints

@router.post("/game/start", response_model=StartGameResponse)
async def start_game(
    request: StartGameRequest,
    game_service: GameService = Depends(get_game_service)
) -> StartGameResponse:
    """Start a new parsing game session"""
    try:
        result = await game_service.start_game(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error starting game: {str(e)}")


@router.post("/game/submit-answer", response_model=SubmitAnswerResponse)
async def submit_answer(
    request: SubmitAnswerRequest,
    game_service: GameService = Depends(get_game_service)
) -> SubmitAnswerResponse:
    """Submit an answer for the current game"""
    try:
        result = await game_service.submit_answer(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error submitting answer: {str(e)}")


@router.get("/game/state/{session_id}", response_model=GetGameStateResponse)
async def get_game_state(
    session_id: str,
    game_service: GameService = Depends(get_game_service)
) -> GetGameStateResponse:
    """Get current game state"""
    try:
        result = await game_service.get_game_state(session_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting game state: {str(e)}")


@router.post("/game/end", response_model=EndGameResponse)
async def end_game(
    request: EndGameRequest,
    game_service: GameService = Depends(get_game_service)
) -> EndGameResponse:
    """End a game session"""
    try:
        result = await game_service.end_game(request.session_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error ending game: {str(e)}")


# Statistics and Leaderboard Endpoints

@router.get("/game/stats", response_model=GameStatsResponse)
async def get_game_stats(
    user_id: str = None,
    game_service: GameService = Depends(get_game_service)
) -> GameStatsResponse:
    """Get game statistics"""
    try:
        result = await game_service.get_game_stats(user_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting game stats: {str(e)}")


@router.get("/leaderboard", response_model=LeaderboardResponse)
async def get_leaderboard(
    request: LeaderboardRequest = Depends(),
    game_service: GameService = Depends(get_game_service)
) -> LeaderboardResponse:
    """Get leaderboard"""
    try:
        result = await game_service.get_leaderboard(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting leaderboard: {str(e)}")


@router.get("/game/history", response_model=GameHistoryResponse)
async def get_game_history(
    request: GameHistoryRequest = Depends(),
    game_service: GameService = Depends(get_game_service)
) -> GameHistoryResponse:
    """Get game history"""
    try:
        result = await game_service.get_game_history(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting game history: {str(e)}")