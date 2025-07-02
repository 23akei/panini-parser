"""
Data models for game sessions and user progress
"""

from datetime import datetime
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, ConfigDict
from vidyut.prakriya import Step,Prakriya, Dhatu, Pada, Prayoga, Lakara, Purusha, Vacana, Linga, Vibhakti, Gana


class GameDifficulty(str, Enum):
    """Game difficulty levels"""
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"


class GameStatus(str, Enum):
    """Game session status"""
    ACTIVE = "active"
    COMPLETED = "completed"
    PAUSED = "paused"
    ABANDONED = "abandoned"


class AnswerStatus(str, Enum):
    """Status of a user's answer"""
    CORRECT = "correct"
    PARTIAL = "partial"
    INCORRECT = "incorrect"
    SKIPPED = "skipped"


class GameSession(BaseModel):
    """Model representing a game session"""
    id: Optional[str] = None       # UUID string
    root: str
    objective: str
    history: list[Step] = []
    current_step: int = 1
    model_config = ConfigDict(arbitrary_types_allowed = True)


class GameAnswer(BaseModel):
    """Model representing a user's answer to a parsing question"""
    id: Optional[int] = None
    session_id: str
    word_id: int
    user_answer: str               # User's parsing attempt
    correct_answer: str            # Correct parsing
    status: AnswerStatus
    points_earned: int = 0
    time_taken_seconds: int
    hint_used: bool = False
    submitted_at: datetime

    class Config:
        from_attributes = True


class GameStats(BaseModel):
    """Model for aggregated game statistics"""
    total_sessions: int = 0
    total_words_attempted: int = 0
    total_words_correct: int = 0
    average_accuracy: float = 0.0
    average_session_time: Optional[float] = None
    best_score: int = 0
    favorite_difficulty: Optional[GameDifficulty] = None
    total_play_time_minutes: int = 0


class Leaderboard(BaseModel):
    """Model for leaderboard entries"""
    id: Optional[int] = None
    user_id: str
    username: str
    high_score: int
    total_score: int
    accuracy_percentage: float
    sessions_played: int
    rank: Optional[int] = None
    updated_at: datetime

    class Config:
        from_attributes = True