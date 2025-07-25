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
from vidyut.kosha import Kosha
from vidyut.prakriya import Data, Source


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
kosha = Kosha("backend/vidyut-0.4.0/kosha")
data = Data('backend/vidyut-0.4.0/prakriya')
sutras = [sutra for sutra in data.load_sutras() if sutra.source == Source.Ashtadhyayi]


@lru_cache()
def get_game_service() -> IGameService:
    """Get game service instance"""
    return GameService(kosha=kosha,sessions=sessions, sutras=sutras) 