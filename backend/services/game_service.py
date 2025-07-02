"""
Service layer for game-related business logic
"""

import uuid
from datetime import datetime
from typing import Optional

from .interfaces import IGameService
from ..repositories.interfaces import IGameRepository, IWordRepository, ILeaderboardRepository, IStatsRepository
from ..models.game import GameSession, GameAnswer, GameDifficulty, GameStatus, AnswerStatus
from ..dto.game_dto import (
    StartGameRequest, StartGameResponse, SubmitAnswerRequest, SubmitAnswerResponse,
    GameStatusResponse, FinishGameResponse, RuleDetailsResponse, GameStep
)


class GameService(IGameService):
    """Service for game-related operations"""

    def __init__(
        self,
        game_repository: IGameRepository,
        word_repository: IWordRepository,
        leaderboard_repository: ILeaderboardRepository,
        stats_repository: IStatsRepository
    ):
        self._game_repository = game_repository
        self._word_repository = word_repository
        self._leaderboard_repository = leaderboard_repository
        self._stats_repository = stats_repository

    async def start_game(self, request: StartGameRequest) -> StartGameResponse:
        """Start a new game session"""
        # Generate unique game ID
        game_id = str(uuid.uuid4())

        # Generate sample steps for demonstration
        steps = [
            GameStep(id=1, from_="गम्", to="गच्छ", hint=None),
            GameStep(id=2, from_="गच्छ", to="गच्छति", hint=None)
        ]
        
        return StartGameResponse(
            game_id=game_id,
            steps=steps
        )

    async def submit_answer(self, game_id: str, step_id: int, request: SubmitAnswerRequest) -> SubmitAnswerResponse:
        """Submit an answer for the current word"""
        # Validate game exists (simplified for demo)
        if not game_id:
            raise ValueError("Game session not found")

        # Simple evaluation for demonstration
        correct_sutras = {"3.1.68", "1.4.14", "3.2.123"}  # Sample correct answers
        is_correct = request.sutra in correct_sutras
        
        explanation = (
            f"Correct! Rule {request.sutra} applies to this transformation." 
            if is_correct 
            else f"Incorrect. The correct rule for this transformation is 3.1.68."
        )
        
        next_step_id = step_id + 1 if step_id < 5 else None  # Assume max 5 steps

        return SubmitAnswerResponse(
            correct=is_correct,
            explanation=explanation,
            next_step_id=next_step_id
        )

    async def get_game_status(self, game_id: str) -> GameStatusResponse:
        """Get current game status"""
        # Validate game exists (simplified for demo)
        if not game_id:
            raise ValueError("Game session not found")

        return GameStatusResponse(
            current_step=2,  # Sample current step
            total_steps=5,   # Sample total steps
            score=40,        # Sample score
            start_time="2025-07-02T10:00:00Z"  # Sample start time
        )

    async def finish_game(self, game_id: str) -> FinishGameResponse:
        """Finish a game session"""
        # Validate game exists (simplified for demo)
        if not game_id:
            raise ValueError("Game session not found")

        return FinishGameResponse(
            score=95,
            time_taken=87.2,
            correct_answers=5,
            mistakes=1,
            rank="Gold"
        )

    async def get_rule_details(self, sutra: str) -> RuleDetailsResponse:
        """Get details for a specific Panini grammar rule"""
        # Sample rule details for demonstration
        sample_rules = {
            "3.1.68": {
                "description": "लट् लकारः — Present tense verbal endings",
                "example": "गम् → गच्छति (he/she goes)",
                "category": "Lakara",
                "next": ["3.4.78", "3.1.69"]
            },
            "1.4.14": {
                "description": "सुप्तिङन्तं पदम् — A word ending in सुप् or तिङ् is called पद",
                "example": "देवः, गच्छति",
                "category": "Paribhasha",
                "next": ["1.4.15", "1.4.16"]
            }
        }
        
        if sutra not in sample_rules:
            raise ValueError(f"Rule {sutra} not found")
            
        rule_data = sample_rules[sutra]
        return RuleDetailsResponse(
            sutra=sutra,
            description=rule_data["description"],
            example=rule_data["example"],
            category=rule_data["category"],
            next=rule_data["next"]
        )

    def _get_difficulty_level(self, difficulty: str) -> int:
        """Convert difficulty string to numeric level"""
        mapping = {
            "beginner": 1,
            "intermediate": 2,
            "expert": 3
        }
        return mapping.get(difficulty, 1)