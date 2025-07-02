"""
Dependency injection for FastAPI
"""

from functools import lru_cache

from .repositories.memory_repository import (
    MemoryWordRepository, MemoryGameRepository, 
    MemoryLeaderboardRepository, MemoryStatsRepository
)
from .repositories.interfaces import (
    IWordRepository, IGameRepository, 
    ILeaderboardRepository, IStatsRepository
)
from .services.interfaces import IGameService, IWordService
from .services.word_service import WordService
from .services.game_service import GameService


# Repository instances (singletons for memory repositories)
@lru_cache()
def get_word_repository() -> IWordRepository:
    """Get word repository instance"""
    return MemoryWordRepository()


@lru_cache()
def get_game_repository() -> IGameRepository:
    """Get game repository instance"""
    return MemoryGameRepository()


@lru_cache()
def get_leaderboard_repository() -> ILeaderboardRepository:
    """Get leaderboard repository instance"""
    return MemoryLeaderboardRepository()


@lru_cache()
def get_stats_repository() -> IStatsRepository:
    """Get stats repository instance"""
    return MemoryStatsRepository()


# Service instances
def get_word_service() -> WordService:
    """Get word service instance"""
    word_repository = get_word_repository()
    return WordService(word_repository)

sessions = {}

@lru_cache()
def get_game_service() -> IGameService:
    """Get game service instance"""
    return GameService(sessions=sessions)