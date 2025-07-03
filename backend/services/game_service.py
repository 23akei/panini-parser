"""
Service layer for game-related business logic
"""

import uuid
from datetime import datetime
from typing import Optional, Dict
import random

from .interfaces import IGameService
from .word_service import WordService
from ..models.game import GameSession
from ..dto.game_dto import (
    StartGameRequest, StartGameResponse, SubmitAnswerRequest, SubmitAnswerResponse,
    GameStatusResponse, FinishGameResponse, RuleDetailsResponse, GameStep, 
    GetChoicesResponse, SutraChoice
)
from vidyut.kosha import Kosha
from vidyut.lipi import transliterate, Scheme


class GameService(IGameService):
    """Service for game-related operations"""

    def __init__(
        self,
        kosha: Kosha,
        sutras: Optional[list[str]] = None,
        sessions: Optional[Dict[str, GameSession]] = None,
    ):
        self.sessions = sessions if sessions is not None else {}
        self._word_service = WordService(kosha)
        self.sutras = sutras if sutras is not None else []
        self.sutra_codes = list(set([sutra.code for sutra in sutras])) if sutras is not None else []

    async def start_game(self, request: StartGameRequest) -> StartGameResponse:
        """Start a new game session"""
        # Generate unique game ID
        game_id = str(uuid.uuid4())
        dhatu = self._word_service.get_random_dhatu(level=request.level)
        prakriya = self._word_service.get_random_prakriya(dhatu, level=request.level)

        steps = []
        from_word = dhatu.aupadeshika
        for i, step in enumerate(prakriya.history):
            print(f"Step {i + 1}: {step}, Code: {step.code}, Result: {step.result}")
                  
            to_word = ''.join(step.result)
            steps.append(
                GameStep(
                    id=i + 1,
                    from_word=self._convert(from_word, level=request.level),
                    to_word=self._convert(to_word, level=request.level),
                    hint=None,
                )
            )
            from_word = to_word  # Update from_word for next step
        session= GameSession(
            id=game_id,
            root=self._convert(dhatu.aupadeshika, level=request.level),
            objective=self._convert(prakriya.text, level=request.level),
            history=prakriya.history,
            current_step=1,  # Start at the first step
            started_at=datetime.now()
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
            return SubmitAnswerResponse(
                correct=False,
                explanation="You can only submit an answer for the current step.",
                next_step_id=session.current_step
            )
        is_correct = session.history[step_id-1].code == request.sutra
        next_step_id = step_id + 1 if is_correct and step_id < len(session.history) else step_id
        self.sessions[game_id].current_step = next_step_id
        self.sessions[game_id].score += 10 if is_correct else 0  # Increment score for correct answer
        
        # Track correct answers and mistakes
        if is_correct:
            self.sessions[game_id].correct_answers += 1
        else:
            self.sessions[game_id].mistakes += 1

        # Simple evaluation for demonstration

        return SubmitAnswerResponse(
            correct=is_correct,
            explanation=f"The rule {request.sutra} {'is' if is_correct else 'is not'} applicable to the transformation.",
            next_step_id=step_id + 1 if is_correct and step_id < len(session.history) else step_id
        )

    async def get_game_status(self, game_id: str) -> GameStatusResponse:
        """Get current game status"""
        # Validate game exists (simplified for demo)
        session = self.sessions.get(game_id, None)
        if not session:
            raise ValueError("Game session not found")
        

        return GameStatusResponse(
            current_step=session.current_step,  # Sample current step
            total_steps=len(session.history),   # Sample total steps
            score=session.score,        # Sample score
            start_time=session.started_at.isoformat()
        )

    async def finish_game(self, game_id: str) -> FinishGameResponse:
        """Finish a game session"""
        # Validate game exists
        session = self.sessions.get(game_id, None)
        if not session:
            raise ValueError("Game session not found")

        # Calculate time taken in seconds
        time_taken = (datetime.now() - session.started_at).total_seconds()
        
        # Calculate rank based on performance
        total_steps = len(session.history)
        accuracy = session.correct_answers / total_steps if total_steps > 0 else 0
        
        rank = self._calculate_rank(accuracy, time_taken, total_steps)
        del self.sessions[game_id]  # Remove session after finishing
        
        return FinishGameResponse(
            score=session.score,
            time_taken=time_taken,
            correct_answers=session.correct_answers,
            mistakes=session.mistakes,
            rank=rank
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
    async def get_choices(self, game_id: str, step_id: int) -> GetChoicesResponse:
        """Get multiple choice options for a specific game step"""
        # Validate game exists
        session = self.sessions.get(game_id, None)
        if not session:
            raise ValueError("Game session not found")
        if step_id < 1 or step_id > len(session.history):
            raise ValueError("Invalid step ID")
        
        # Get the correct answer
        correct_code = session.history[step_id-1].code
        correct_sutras = [sutra for sutra in self.sutras if sutra.code == correct_code]
        print(f"Correct code: {correct_code}, Sutras: {correct_sutras}")
        if not correct_sutras:
            raise ValueError(f"No sutra found for code {correct_code}")
        correct_sutra  = correct_sutras[0]  # Use the first match if multiple found
        choices = []
        choices.append(SutraChoice(sutra=correct_sutra.code, description=self._convert(correct_sutra.text, level='beginner' ), answer=True))
        
        # Get 3 random wrong choices
        print(f"Correct sutra: {correct_sutra}")
        wrong_choices = random.sample([sutra for sutra in self.sutras if sutra.code != correct_code], 3)
        for sutra in wrong_choices:
            print(f"Wrong choice: {sutra.code}, Description: {sutra.text}")
            choices.append(SutraChoice(sutra=sutra.code, description=self._convert(sutra.text, level='beginner'), answer=False))
        
        # Combine and shuffle choices
        random.shuffle(choices)
        
        return GetChoicesResponse(choices=choices)

    async def get_sutra_candidate(self, game_id: str, step_id: int) -> str:
        """Get a random sutra candidate for the current step"""
        # Validate game exists
        session = self.sessions.get(game_id, None)
        if not session:
            raise ValueError("Game session not found")
        if step_id < 1 or step_id > len(session.history):
            raise ValueError("Invalid step ID")
        codes = [session.history[step_id-1].code]
        codes.append(random.sample(self.sutra_codes,3))
        
        # Return a random sutra from the available sutras
        return codes

    def _get_difficulty_level(self, difficulty: str) -> int:
        """Convert difficulty string to numeric level"""
        mapping = {
            "beginner": 1,
            "intermediate": 2,
            "expert": 3
        }
        return mapping.get(difficulty, 1)

    def _calculate_rank(self, accuracy: float, time_taken: float, total_steps: int) -> str:
        """Calculate achievement rank based on performance metrics"""
        # Perfect accuracy and fast completion (< 30 seconds per step)
        if accuracy == 1.0 and time_taken < (total_steps * 30):
            return "Platinum"
        # High accuracy (90%+) with reasonable timing (< 60 seconds per step)
        elif accuracy >= 0.9 and time_taken < (total_steps * 60):
            return "Gold"
        # Good accuracy (70%+) with moderate timing (< 120 seconds per step)
        elif accuracy >= 0.7 and time_taken < (total_steps * 120):
            return "Silver"
        # Basic completion
        else:
            return "Bronze"
    
    def _convert(self, txt: str, level: str) -> str:
        """Convert Sanskrit text to Devanagari script"""
        # Placeholder for actual conversion logic
        # This could use a library or custom mapping
        if level == 'expert':
            to_scheme = Scheme.Devanagari
        else:
            to_scheme = Scheme.HarvardKyoto
            
        return transliterate(txt, Scheme.Slp1, to_scheme)