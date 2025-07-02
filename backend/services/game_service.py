"""
Service layer for game-related business logic
"""

import uuid
from datetime import datetime
from typing import Optional, Dict

from .interfaces import IGameService
from .word_service import WordService
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
        sessions: Optional[Dict[str, GameSession]] = None,
    ):
        self.sessions = sessions if sessions is not None else {}
        self._word_service = WordService()

    async def start_game(self, request: StartGameRequest) -> StartGameResponse:
        """Start a new game session"""
        # Generate unique game ID
        game_id = str(uuid.uuid4())
        dhatu = self._word_service.get_random_dhatu()
        prakriya = self._word_service.get_random_prakriya(dhatu)

        steps = []
        from_word = dhatu.aupadeshika
        for i, step in enumerate(prakriya.history):
            print(f"Step {i + 1}: {step}, Code: {step.code}, Result: {step.result}")
                  
            to_word = ''.join(step.result)
            steps.append(
                GameStep(
                    id=i + 1,
                    from_word=from_word,
                    to_word=to_word,
                    hint=None,
                )
            )
            from_word = to_word  # Update from_word for next step
        session= GameSession(
            id=game_id,
            root=dhatu.aupadeshika,
            objective=prakriya.text,
            history=prakriya.history,
            current_step=1  # Start at the first step
        )
        self.sessions[game_id] = session
        

        return StartGameResponse(
            game_id=game_id,
            steps=steps
        )

    async def submit_answer(self, game_id: str, step_id: int, request: SubmitAnswerRequest) -> SubmitAnswerResponse:
        """Submit an answer for the current word"""
        # Validate game exists (simplified for demo)
        session = self.sessions.get(game_id, None)
        if not session:
            raise ValueError("Game session not found")
        if step_id < 1 or step_id > len(session.history):
            raise ValueError("Invalid step ID")
        if session.current_step != step_id:
            raise ValueError("Not the current step")
        is_correct = session.history[step_id-1].code == request.sutra
        next_step_id = step_id + 1 if is_correct and step_id < len(session.history) else step_id
        self.sessions[game_id].current_step = next_step_id

        # Simple evaluation for demonstration

        return SubmitAnswerResponse(
            correct=is_correct,
            explanation=f"The rule {request.sutra} {'is' if is_correct else 'is not'} applicable to the transformation.",
            next_step_id=step_id + 1 if is_correct and step_id < len(session.history) else step_id
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