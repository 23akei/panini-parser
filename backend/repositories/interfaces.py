"""
Repository interfaces for data access layer
"""

from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any

from ..models.word import SanskritWord, ParsedForm
from ..models.game import GameSession, GameAnswer, Leaderboard


class IWordRepository(ABC):
    """Interface for word data access"""

    @abstractmethod
    async def get_by_id(self, word_id: int) -> Optional[SanskritWord]:
        """Get a word by ID"""
        pass

    @abstractmethod
    async def get_by_text(self, text: str) -> Optional[SanskritWord]:
        """Get a word by its text"""
        pass

    @abstractmethod
    async def create(self, word: SanskritWord) -> SanskritWord:
        """Create a new word"""
        pass

    @abstractmethod
    async def update(self, word_id: int, updates: Dict[str, Any]) -> Optional[SanskritWord]:
        """Update a word"""
        pass

    @abstractmethod
    async def delete(self, word_id: int) -> bool:
        """Delete a word"""
        pass

    @abstractmethod
    async def list_words(
        self, 
        word_type: Optional[str] = None,
        difficulty_level: Optional[int] = None,
        search: Optional[str] = None,
        page: int = 1,
        limit: int = 20
    ) -> tuple[List[SanskritWord], int]:
        """List words with filters and pagination"""
        pass

    @abstractmethod
    async def get_random_word(self, difficulty_level: Optional[int] = None) -> Optional[SanskritWord]:
        """Get a random word for gameplay"""
        pass

    @abstractmethod
    async def get_forms_by_word_id(self, word_id: int) -> List[ParsedForm]:
        """Get all parsed forms for a word"""
        pass


class IGameRepository(ABC):
    """Interface for game session data access"""

    @abstractmethod
    async def create_session(self, session: GameSession) -> GameSession:
        """Create a new game session"""
        pass

    @abstractmethod
    async def get_session(self, session_id: str) -> Optional[GameSession]:
        """Get a game session by ID"""
        pass

    @abstractmethod
    async def update_session(self, session_id: str, updates: Dict[str, Any]) -> Optional[GameSession]:
        """Update a game session"""
        pass

    @abstractmethod
    async def end_session(self, session_id: str) -> bool:
        """End a game session"""
        pass

    @abstractmethod
    async def save_answer(self, answer: GameAnswer) -> GameAnswer:
        """Save a game answer"""
        pass

    @abstractmethod
    async def get_session_answers(self, session_id: str) -> List[GameAnswer]:
        """Get all answers for a session"""
        pass

    @abstractmethod
    async def get_user_sessions(
        self, 
        user_id: str,
        status: Optional[str] = None,
        page: int = 1,
        limit: int = 20
    ) -> tuple[List[GameSession], int]:
        """Get user's game sessions"""
        pass


class ILeaderboardRepository(ABC):
    """Interface for leaderboard data access"""

    @abstractmethod
    async def update_user_score(self, user_id: str, username: str, score: int) -> None:
        """Update user's high score"""
        pass

    @abstractmethod
    async def get_leaderboard(
        self,
        difficulty: Optional[str] = None,
        limit: int = 10,
        page: int = 1
    ) -> tuple[List[Leaderboard], int]:
        """Get leaderboard entries"""
        pass

    @abstractmethod
    async def get_user_rank(self, user_id: str, difficulty: Optional[str] = None) -> Optional[int]:
        """Get user's rank in leaderboard"""
        pass


class IStatsRepository(ABC):
    """Interface for statistics data access"""

    @abstractmethod
    async def get_user_stats(self, user_id: str) -> Dict[str, Any]:
        """Get aggregated user statistics"""
        pass

    @abstractmethod
    async def get_global_stats(self) -> Dict[str, Any]:
        """Get global game statistics"""
        pass

    @abstractmethod
    async def record_session_stats(self, session: GameSession) -> None:
        """Record statistics for a completed session"""
        pass