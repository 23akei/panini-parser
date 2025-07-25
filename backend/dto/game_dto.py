"""
Data Transfer Objects for game-related API endpoints
Based on API specification in backend/README.md
"""

from typing import List, Optional, Literal
from pydantic import BaseModel, Field


class StartGameRequest(BaseModel):
    """Request DTO for GET /game/start"""
    level: Literal["beginner", "expert"] = Field(default="beginner", description="Difficulty level: beginner, expert")
    length: int = Field(default=5, ge=1, le=20, description="Number of steps in the game")


class GameStep(BaseModel):
    """Individual game step"""
    id: int
    from_word: str = Field( description="Starting Sanskrit form")
    to_word: str = Field(description="Target Sanskrit form")
    hint: Optional[str] = None


class StartGameResponse(BaseModel):
    """Response DTO for GET /game/start"""
    gameId: str = Field(alias="game_id")
    steps: List[GameStep]


class SubmitAnswerRequest(BaseModel):
    """Request DTO for POST /game/:gameId/step/:stepId/answer"""
    sutra: str = Field(..., min_length=1, description="Panini grammar rule number or alias")


class SubmitAnswerResponse(BaseModel):
    """Response DTO for POST /game/:gameId/step/:stepId/answer"""
    correct: bool
    explanation: str
    nextStepId: Optional[int] = Field(None, alias="next_step_id")


class GameStatusResponse(BaseModel):
    """Response DTO for GET /game/:gameId/status"""
    currentStep: int = Field(alias="current_step")
    totalSteps: int = Field(alias="total_steps")
    score: int
    startTime: str = Field(alias="start_time", description="ISO 8601 timestamp")


class FinishGameResponse(BaseModel):
    """Response DTO for POST /game/:gameId/finish"""
    score: int
    timeTaken: float = Field(alias="time_taken", description="Time taken in seconds")
    correctAnswers: int = Field(alias="correct_answers")
    mistakes: int
    rank: str = Field(description="Achievement rank: Bronze, Silver, Gold, etc.")


class RuleDetailsResponse(BaseModel):
    """Response DTO for GET /rules/:sutra"""
    sutra: str
    description: str
    example: str
    category: str
    next: List[str] = Field(description="Related rule numbers")


class SutraChoice(BaseModel):
    """Individual sutra choice option"""
    sutra: str = Field(description="Panini rule number")
    description: str = Field(description="Rule description")
    answer: bool = Field(default=False, description="Indicates if this is the correct answer (optional)")


class GetChoicesResponse(BaseModel):
    """Response DTO for GET /game/:gameId/step/:stepId/choices"""
    choices: List[SutraChoice] = Field(description="4 multiple choice options")