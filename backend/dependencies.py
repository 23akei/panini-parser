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
def get_word_service(
    word_repository: IWordRepository = None
) -> WordService:
    """Get word service instance"""
    if word_repository is None:
        word_repository = get_word_repository()
    return WordService(word_repository)


def get_game_service(
    game_repository: IGameRepository = None,
    word_repository: IWordRepository = None,
    leaderboard_repository: ILeaderboardRepository = None,
    stats_repository: IStatsRepository = None
) -> GameService:
    """Get game service instance"""
    if game_repository is None:
        game_repository = get_game_repository()
    if word_repository is None:
        word_repository = get_word_repository()
    if leaderboard_repository is None:
        leaderboard_repository = get_leaderboard_repository()
    if stats_repository is None:
        stats_repository = get_stats_repository()
    
    return GameService(
        game_repository,
        word_repository,
        leaderboard_repository,
        stats_repository
    )