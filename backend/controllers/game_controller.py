"""
Game-related API controllers
"""

from fastapi import APIRouter, HTTPException, Depends, status
from typing import Optional

from ..dto.game_dto import (
    StartGameRequest, StartGameResponse, SubmitAnswerRequest, SubmitAnswerResponse,
    GetGameStateResponse, EndGameResponse, GameStatsResponse,
    LeaderboardRequest, LeaderboardResponse
)
from ..services.game_service import GameService
from ..dependencies import get_game_service

router = APIRouter(prefix="/game", tags=["game"])


@router.post("/start", response_model=StartGameResponse)
async def start_game(
    request: StartGameRequest,
    game_service: GameService = Depends(get_game_service)
) -> StartGameResponse:
    """
    Start a new game session
    """
    try:
        return await game_service.start_game(request)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error starting game: {str(e)}"
        )


@router.post("/answer", response_model=SubmitAnswerResponse)
async def submit_answer(
    request: SubmitAnswerRequest,
    game_service: GameService = Depends(get_game_service)
) -> SubmitAnswerResponse:
    """
    Submit an answer for the current word
    """
    try:
        return await game_service.submit_answer(request)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error submitting answer: {str(e)}"
        )


@router.get("/state/{session_id}", response_model=GetGameStateResponse)
async def get_game_state(
    session_id: str,
    game_service: GameService = Depends(get_game_service)
) -> GetGameStateResponse:
    """
    Get current game state
    """
    try:
        return await game_service.get_game_state(session_id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting game state: {str(e)}"
        )


@router.post("/end/{session_id}", response_model=EndGameResponse)
async def end_game(
    session_id: str,
    game_service: GameService = Depends(get_game_service)
) -> EndGameResponse:
    """
    End a game session
    """
    try:
        return await game_service.end_game(session_id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error ending game: {str(e)}"
        )


@router.get("/leaderboard", response_model=LeaderboardResponse)
async def get_leaderboard(
    difficulty: Optional[str] = None,
    limit: int = 10,
    page: int = 1,
    game_service: GameService = Depends(get_game_service)
) -> LeaderboardResponse:
    """
    Get leaderboard rankings
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
    
    request = LeaderboardRequest(
        difficulty=difficulty,
        limit=limit,
        page=page
    )
    
    try:
        return await game_service.get_leaderboard(request)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting leaderboard: {str(e)}"
        )


@router.get("/stats", response_model=GameStatsResponse)
async def get_game_stats(
    user_id: Optional[str] = None,
    game_service: GameService = Depends(get_game_service)
) -> GameStatsResponse:
    """
    Get game statistics (user-specific or global)
    """
    try:
        return await game_service.get_game_stats(user_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting game stats: {str(e)}"
        )