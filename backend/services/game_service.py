"""
Service layer for game-related business logic
"""

import uuid
from datetime import datetime
from typing import Optional

from ..repositories.interfaces import IGameRepository, IWordRepository, ILeaderboardRepository, IStatsRepository
from ..models.game import GameSession, GameAnswer, GameDifficulty, GameStatus, AnswerStatus
from ..dto.game_dto import *


class GameService:
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
        # Get a random word based on difficulty
        difficulty_level = self._get_difficulty_level(request.difficulty)
        current_word = await self._word_repository.get_random_word(difficulty_level)

        if not current_word:
            raise ValueError("No words available for the selected difficulty")

        # Create game session
        session = GameSession(
            user_id=request.user_id,
            difficulty=request.difficulty,
            status=GameStatus.ACTIVE,
            score=0,
            max_score=0,
            words_attempted=0,
            words_correct=0,
            current_word_id=current_word.id,
            started_at=datetime.now()
        )

        created_session = await self._game_repository.create_session(session)

        return StartGameResponse(
            game_id=str(created_session.id),
            steps=[]
        )

    async def submit_answer(self, request: SubmitAnswerRequest) -> SubmitAnswerResponse:
        """Submit an answer for the current word"""
        # Get session
        session = await self._game_repository.get_session(request.session_id)
        if not session:
            raise ValueError("Game session not found")

        if session.status != GameStatus.ACTIVE:
            raise ValueError("Game session is not active")

        # Get the word
        word = await self._word_repository.get_by_id(request.word_id)
        if not word:
            raise ValueError("Word not found")

        # Evaluate answer (placeholder implementation)
        is_correct, status, points, explanation = await self._evaluate_answer(
            request.answer, word, request.hint_used
        )

        # Save answer
        answer = GameAnswer(
            session_id=request.session_id,
            word_id=request.word_id,
            user_answer=request.answer,
            correct_answer=f"{word.text} ({word.transliteration}) - {word.meaning}",
            status=status,
            points_earned=points,
            time_taken_seconds=request.time_taken_seconds,
            hint_used=request.hint_used,
            submitted_at=datetime.now()
        )

        await self._game_repository.save_answer(answer)

        # Update session
        session.words_attempted += 1
        if is_correct:
            session.words_correct += 1
        session.score += points
        session.max_score += self._get_max_points_for_difficulty(session.difficulty)

        # Get next word
        next_word = await self._word_repository.get_random_word(
            self._get_difficulty_level(session.difficulty)
        )

        session_complete = False
        if not next_word or session.words_attempted >= 10:  # Max 10 words per session
            session_complete = True
            session.status = GameStatus.COMPLETED
            session.completed_at = datetime.now()

            # Calculate total time
            if session.started_at:
                total_time = datetime.now() - session.started_at
                session.total_time_seconds = int(total_time.total_seconds())
        else:
            session.current_word_id = next_word.id

        # Update session in repository
        await self._game_repository.update_session(
            request.session_id,
            {
                "words_attempted": session.words_attempted,
                "words_correct": session.words_correct,
                "score": session.score,
                "max_score": session.max_score,
                "current_word_id": session.current_word_id,
                "status": session.status,
                "completed_at": session.completed_at,
                "total_time_seconds": session.total_time_seconds
            }
        )

        # Update leaderboard if session is complete
        if session_complete and session.user_id:
            await self._leaderboard_repository.update_user_score(
                session.user_id, session.user_id, session.score
            )
            await self._stats_repository.record_session_stats(session)

        return SubmitAnswerResponse(
            explanation=explanation,
            correct=is_correct,
            next_step_id=None
        )

    async def get_game_state(self, session_id: str) -> GameStatusResponse:
        """Get current game state"""
        session = await self._game_repository.get_session(session_id)
        if not session:
            raise ValueError("Game session not found")

        # Calculate time elapsed
        time_elapsed = 0
        if session.started_at:
            if session.completed_at:
                time_elapsed = int((session.completed_at - session.started_at).total_seconds())
            else:
                time_elapsed = int((datetime.now() - session.started_at).total_seconds())

        # Calculate accuracy
        accuracy = 0.0
        if session.words_attempted > 0:
            accuracy = (session.words_correct / session.words_attempted) * 100

        # Get current word
        current_word = None
        if session.current_word_id:
            word = await self._word_repository.get_by_id(session.current_word_id)
            current_word = word.text if word else None

        return GameStatusResponse(
            current_step = session.words_attempted + 1,
            total_steps = 10,  # Assuming max 10 words per session
            score = session.score,
            start_time = "",
        )

    async def end_game(self, session_id: str) -> FinishGameResponse:
        """End a game session"""
        session = await self._game_repository.get_session(session_id)
        if not session:
            raise ValueError("Game session not found")

        # End the session
        await self._game_repository.end_session(session_id)

        # Calculate final stats
        accuracy = 0.0
        if session.words_attempted > 0:
            accuracy = (session.words_correct / session.words_attempted) * 100

        total_time = 0
        if session.started_at:
            end_time = session.completed_at or datetime.now()
            total_time = int((end_time - session.started_at).total_seconds())

        # Update leaderboard and stats
        user_rank = None
        is_high_score = False
        if session.user_id:
            await self._leaderboard_repository.update_user_score(
                session.user_id, session.user_id, session.score
            )
            user_rank = await self._leaderboard_repository.get_user_rank(session.user_id)

            # Check if it's a high score
            user_stats = await self._stats_repository.get_user_stats(session.user_id)
            is_high_score = session.score > user_stats.get("best_score", 0)

            await self._stats_repository.record_session_stats(session)

        return FinishGameResponse(
            score=session.score,
            time_taken=total_time,
            correct_answers=session.words_correct,
            mistakes=session.words_attempted - session.words_correct,
            rank=str(user_rank),
        )


    async def get_game_stats(self, user_id: Optional[str] = None) -> GameStatsResponse:
        """Get game statistics"""
        if user_id:
            stats = await self._stats_repository.get_user_stats(user_id)
        else:
            stats = await self._stats_repository.get_global_stats()

        return GameStatusResponse(
            current_step=stats.get("current_step", 0),
            total_steps=stats.get("total_steps", 0),
            score=stats.get("score", 0),
            start_time=stats.get("start_time", ""),
        )

    def _get_difficulty_level(self, difficulty: GameDifficulty) -> int:
        """Convert difficulty enum to numeric level"""
        mapping = {
            GameDifficulty.BEGINNER: 1,
            GameDifficulty.INTERMEDIATE: 2,
            GameDifficulty.ADVANCED: 3,
            GameDifficulty.EXPERT: 4
        }
        return mapping.get(difficulty, 1)

    def _get_max_points_for_difficulty(self, difficulty: GameDifficulty) -> int:
        """Get maximum points possible for a difficulty level"""
        mapping = {
            GameDifficulty.BEGINNER: 10,
            GameDifficulty.INTERMEDIATE: 20,
            GameDifficulty.ADVANCED: 30,
            GameDifficulty.EXPERT: 50
        }
        return mapping.get(difficulty, 10)

    async def _evaluate_answer(self, user_answer: str, word, hint_used: bool) -> tuple[bool, AnswerStatus, int, str]:
        """Evaluate user's answer (placeholder implementation)"""
        # TODO: Implement proper answer evaluation logic
        # This would involve comparing the user's parse with the correct grammatical analysis

        correct_answer = f"{word.text} ({word.transliteration}) - {word.meaning}"
        user_answer_lower = user_answer.lower().strip()

        # Simple matching for now
        if (word.meaning.lower() in user_answer_lower or
            word.transliteration.lower() in user_answer_lower or
            any(meaning.strip().lower() in user_answer_lower for meaning in word.meaning.split(','))):

            points = self._get_max_points_for_difficulty(GameDifficulty.BEGINNER)
            if hint_used:
                points = points // 2

            return True, AnswerStatus.CORRECT, points, f"Correct! {correct_answer}"

        # Partial credit for related terms
        if any(term in user_answer_lower for term in ['god', 'deity', 'divine', 'goes', 'walk', 'beautiful']):
            points = self._get_max_points_for_difficulty(GameDifficulty.BEGINNER) // 3
            return False, AnswerStatus.PARTIAL, points, f"Partially correct. Full answer: {correct_answer}"

        return False, AnswerStatus.INCORRECT, 0, f"Incorrect. Correct answer: {correct_answer}"

    def _generate_feedback(self, is_correct: bool, status: AnswerStatus, correct_count: int, total_count: int) -> str:
        """Generate encouraging feedback"""
        if is_correct:
            feedback_options = [
                "Excellent work!",
                "Well done!",
                "Perfect!",
                "Outstanding!",
                "Great job!"
            ]
        elif status == AnswerStatus.PARTIAL:
            feedback_options = [
                "Good effort! You're on the right track.",
                "Close! Keep trying.",
                "Partially correct. You're learning!"
            ]
        else:
            feedback_options = [
                "Don't worry, Sanskrit grammar is challenging!",
                "Keep practicing, you'll get it!",
                "Learning opportunity!"
            ]

        import random
        base_feedback = random.choice(feedback_options)

        if total_count > 0:
            accuracy = (correct_count / total_count) * 100
            base_feedback += f" Current accuracy: {accuracy:.1f}%"

        return base_feedback