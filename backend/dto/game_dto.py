"""
Data Transfer Objects for game-related API endpoints
"""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

from ..models.game import GameDifficulty, GameStatus, AnswerStatus


class StartGameRequest(BaseModel):
    """Request DTO for starting a new game session"""
    difficulty: GameDifficulty = Field(default=GameDifficulty.BEGINNER)
    user_id: Optional[str] = Field(None, max_length=100)


class StartGameResponse(BaseModel):
    """Response DTO for starting a game session"""
    session_id: str
    difficulty: GameDifficulty
    message: str
    current_word: str
    current_word_id: int
    instructions: str
    max_time_seconds: Optional[int] = None


class SubmitAnswerRequest(BaseModel):
    """Request DTO for submitting an answer"""
    session_id: str = Field(..., min_length=1)
    word_id: int = Field(..., gt=0)
    answer: str = Field(..., min_length=1, max_length=500)
    time_taken_seconds: int = Field(..., ge=0)
    hint_used: bool = Field(default=False)


class SubmitAnswerResponse(BaseModel):
    """Response DTO for answer submission"""
    correct: bool
    status: AnswerStatus
    points_earned: int
    correct_answer: str
    explanation: str
    next_word: Optional[str] = None
    next_word_id: Optional[int] = None
    session_complete: bool = False
    current_score: int
    feedback: str


class GetGameStateRequest(BaseModel):
    """Request DTO for getting current game state"""
    session_id: str = Field(..., min_length=1)


class GetGameStateResponse(BaseModel):
    """Response DTO for game state"""
    session_id: str
    status: GameStatus
    difficulty: GameDifficulty
    score: int
    max_score: int
    words_attempted: int
    words_correct: int
    current_word: Optional[str] = None
    current_word_id: Optional[int] = None
    time_elapsed_seconds: int
    accuracy_percentage: float


class EndGameRequest(BaseModel):
    """Request DTO for ending a game session"""
    session_id: str = Field(..., min_length=1)


class EndGameResponse(BaseModel):
    """Response DTO for ending a game session"""
    session_id: str
    final_score: int
    words_attempted: int
    words_correct: int
    accuracy_percentage: float
    total_time_seconds: int
    rank: Optional[int] = None
    is_high_score: bool = False
    summary: str


class GameStatsResponse(BaseModel):
    """Response DTO for game statistics"""
    total_sessions: int
    total_words_attempted: int
    total_words_correct: int
    average_accuracy: float
    average_session_time_minutes: Optional[float] = None
    best_score: int
    favorite_difficulty: Optional[GameDifficulty] = None
    total_play_time_minutes: int


class LeaderboardRequest(BaseModel):
    """Request DTO for leaderboard"""
    difficulty: Optional[GameDifficulty] = None
    limit: int = Field(default=10, ge=1, le=100)
    page: int = Field(default=1, ge=1)


class LeaderboardEntry(BaseModel):
    """Individual leaderboard entry"""
    rank: int
    username: str
    high_score: int
    accuracy_percentage: float
    sessions_played: int


class LeaderboardResponse(BaseModel):
    """Response DTO for leaderboard"""
    entries: List[LeaderboardEntry]
    total: int
    page: int
    limit: int
    user_rank: Optional[int] = None


class GameHistoryRequest(BaseModel):
    """Request DTO for game history"""
    user_id: Optional[str] = None
    difficulty: Optional[GameDifficulty] = None
    status: Optional[GameStatus] = None
    limit: int = Field(default=20, ge=1, le=100)
    page: int = Field(default=1, ge=1)


class GameHistoryEntry(BaseModel):
    """Individual game history entry"""
    session_id: str
    difficulty: GameDifficulty
    status: GameStatus
    score: int
    words_attempted: int
    words_correct: int
    accuracy_percentage: float
    total_time_seconds: int
    started_at: datetime
    completed_at: Optional[datetime] = None


class GameHistoryResponse(BaseModel):
    """Response DTO for game history"""
    sessions: List[GameHistoryEntry]
    total: int
    page: int
    limit: int
    has_next: bool
    has_prev: bool