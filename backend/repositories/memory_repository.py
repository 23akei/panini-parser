"""
In-memory repository implementations for development and testing
"""

import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any

from .interfaces import IWordRepository, IGameRepository, ILeaderboardRepository, IStatsRepository
from ..models.word import SanskritWord, ParsedForm, WordType
from ..models.game import GameSession, GameAnswer, Leaderboard, GameDifficulty, GameStatus


class MemoryWordRepository(IWordRepository):
    """In-memory implementation of word repository"""

    def __init__(self):
        self._words: Dict[int, SanskritWord] = {}
        self._forms: Dict[int, List[ParsedForm]] = {}
        self._next_id = 1
        self._init_sample_data()

    def _init_sample_data(self):
        """Initialize with sample Sanskrit words"""
        sample_words = [
            SanskritWord(
                id=1,
                text="देवः",
                transliteration="devaḥ",
                meaning="god, deity",
                word_type=WordType.NOUN,
                stem="deva",
                difficulty_level=1,
                created_at=datetime.now()
            ),
            SanskritWord(
                id=2,
                text="गच्छति",
                transliteration="gacchati",
                meaning="goes, walks",
                word_type=WordType.VERB,
                root="gam",
                difficulty_level=2,
                created_at=datetime.now()
            ),
            SanskritWord(
                id=3,
                text="सुन्दरः",
                transliteration="sundaraḥ",
                meaning="beautiful",
                word_type=WordType.ADJECTIVE,
                stem="sundara",
                difficulty_level=2,
                created_at=datetime.now()
            )
        ]
        
        for word in sample_words:
            self._words[word.id] = word
        
        self._next_id = len(sample_words) + 1

    async def get_by_id(self, word_id: int) -> Optional[SanskritWord]:
        return self._words.get(word_id)

    async def get_by_text(self, text: str) -> Optional[SanskritWord]:
        for word in self._words.values():
            if word.text == text:
                return word
        return None

    async def create(self, word: SanskritWord) -> SanskritWord:
        word.id = self._next_id
        word.created_at = datetime.now()
        self._words[word.id] = word
        self._next_id += 1
        return word

    async def update(self, word_id: int, updates: Dict[str, Any]) -> Optional[SanskritWord]:
        if word_id not in self._words:
            return None
        
        word = self._words[word_id]
        for key, value in updates.items():
            if hasattr(word, key):
                setattr(word, key, value)
        word.updated_at = datetime.now()
        
        return word

    async def delete(self, word_id: int) -> bool:
        if word_id in self._words:
            del self._words[word_id]
            if word_id in self._forms:
                del self._forms[word_id]
            return True
        return False

    async def list_words(
        self, 
        word_type: Optional[str] = None,
        difficulty_level: Optional[int] = None,
        search: Optional[str] = None,
        page: int = 1,
        limit: int = 20
    ) -> tuple[List[SanskritWord], int]:
        filtered_words = list(self._words.values())
        
        # Apply filters
        if word_type:
            filtered_words = [w for w in filtered_words if w.word_type == word_type]
        if difficulty_level:
            filtered_words = [w for w in filtered_words if w.difficulty_level == difficulty_level]
        if search:
            search = search.lower()
            filtered_words = [
                w for w in filtered_words 
                if search in w.text.lower() or search in w.transliteration.lower() or search in w.meaning.lower()
            ]
        
        total = len(filtered_words)
        
        # Apply pagination
        start = (page - 1) * limit
        end = start + limit
        paginated_words = filtered_words[start:end]
        
        return paginated_words, total

    async def get_random_word(self, difficulty_level: Optional[int] = None) -> Optional[SanskritWord]:
        import random
        
        words = list(self._words.values())
        if difficulty_level:
            words = [w for w in words if w.difficulty_level == difficulty_level]
        
        return random.choice(words) if words else None

    async def get_forms_by_word_id(self, word_id: int) -> List[ParsedForm]:
        return self._forms.get(word_id, [])


class MemoryGameRepository(IGameRepository):
    """In-memory implementation of game repository"""

    def __init__(self):
        self._sessions: Dict[str, GameSession] = {}
        self._answers: Dict[str, List[GameAnswer]] = {}

    async def create_session(self, session: GameSession) -> GameSession:
        session.id = str(uuid.uuid4())
        session.started_at = datetime.now()
        self._sessions[session.id] = session
        self._answers[session.id] = []
        return session

    async def get_session(self, session_id: str) -> Optional[GameSession]:
        return self._sessions.get(session_id)

    async def update_session(self, session_id: str, updates: Dict[str, Any]) -> Optional[GameSession]:
        if session_id not in self._sessions:
            return None
        
        session = self._sessions[session_id]
        for key, value in updates.items():
            if hasattr(session, key):
                setattr(session, key, value)
        
        return session

    async def end_session(self, session_id: str) -> bool:
        if session_id in self._sessions:
            session = self._sessions[session_id]
            session.status = GameStatus.COMPLETED
            session.completed_at = datetime.now()
            return True
        return False

    async def save_answer(self, answer: GameAnswer) -> GameAnswer:
        answer.id = len(self._answers.get(answer.session_id, [])) + 1
        answer.submitted_at = datetime.now()
        
        if answer.session_id not in self._answers:
            self._answers[answer.session_id] = []
        
        self._answers[answer.session_id].append(answer)
        return answer

    async def get_session_answers(self, session_id: str) -> List[GameAnswer]:
        return self._answers.get(session_id, [])

    async def get_user_sessions(
        self, 
        user_id: str,
        status: Optional[str] = None,
        page: int = 1,
        limit: int = 20
    ) -> tuple[List[GameSession], int]:
        user_sessions = [s for s in self._sessions.values() if s.user_id == user_id]
        
        if status:
            user_sessions = [s for s in user_sessions if s.status == status]
        
        total = len(user_sessions)
        
        # Apply pagination
        start = (page - 1) * limit
        end = start + limit
        paginated_sessions = user_sessions[start:end]
        
        return paginated_sessions, total


class MemoryLeaderboardRepository(ILeaderboardRepository):
    """In-memory implementation of leaderboard repository"""

    def __init__(self):
        self._leaderboard: List[Leaderboard] = []

    async def update_user_score(self, user_id: str, username: str, score: int) -> None:
        # Find existing entry
        entry = None
        for lb in self._leaderboard:
            if lb.user_id == user_id:
                entry = lb
                break
        
        if entry:
            if score > entry.high_score:
                entry.high_score = score
            entry.total_score += score
            entry.sessions_played += 1
            entry.updated_at = datetime.now()
        else:
            # Create new entry
            new_entry = Leaderboard(
                user_id=user_id,
                username=username,
                high_score=score,
                total_score=score,
                accuracy_percentage=100.0,  # Will be calculated properly in real implementation
                sessions_played=1,
                updated_at=datetime.now()
            )
            self._leaderboard.append(new_entry)

    async def get_leaderboard(
        self,
        difficulty: Optional[str] = None,
        limit: int = 10,
        page: int = 1
    ) -> tuple[List[Leaderboard], int]:
        # Sort by high score descending
        sorted_leaderboard = sorted(self._leaderboard, key=lambda x: x.high_score, reverse=True)
        
        # Add ranks
        for i, entry in enumerate(sorted_leaderboard):
            entry.rank = i + 1
        
        total = len(sorted_leaderboard)
        
        # Apply pagination
        start = (page - 1) * limit
        end = start + limit
        paginated_entries = sorted_leaderboard[start:end]
        
        return paginated_entries, total

    async def get_user_rank(self, user_id: str, difficulty: Optional[str] = None) -> Optional[int]:
        sorted_leaderboard = sorted(self._leaderboard, key=lambda x: x.high_score, reverse=True)
        
        for i, entry in enumerate(sorted_leaderboard):
            if entry.user_id == user_id:
                return i + 1
        
        return None


class MemoryStatsRepository(IStatsRepository):
    """In-memory implementation of stats repository"""

    def __init__(self):
        self._user_stats: Dict[str, Dict[str, Any]] = {}
        self._global_stats: Dict[str, Any] = {
            "total_sessions": 0,
            "total_players": 0,
            "total_words_parsed": 0,
            "average_accuracy": 0.0
        }

    async def get_user_stats(self, user_id: str) -> Dict[str, Any]:
        return self._user_stats.get(user_id, {
            "total_sessions": 0,
            "total_words_attempted": 0,
            "total_words_correct": 0,
            "average_accuracy": 0.0,
            "best_score": 0,
            "total_play_time_minutes": 0
        })

    async def get_global_stats(self) -> Dict[str, Any]:
        return self._global_stats.copy()

    async def record_session_stats(self, session: GameSession) -> None:
        # Update user stats
        user_id = session.user_id or "anonymous"
        if user_id not in self._user_stats:
            self._user_stats[user_id] = {
                "total_sessions": 0,
                "total_words_attempted": 0,
                "total_words_correct": 0,
                "average_accuracy": 0.0,
                "best_score": 0,
                "total_play_time_minutes": 0
            }
        
        user_stats = self._user_stats[user_id]
        user_stats["total_sessions"] += 1
        user_stats["total_words_attempted"] += session.words_attempted
        user_stats["total_words_correct"] += session.words_correct
        
        if session.words_attempted > 0:
            user_stats["average_accuracy"] = (user_stats["total_words_correct"] / user_stats["total_words_attempted"]) * 100
        
        if session.score > user_stats["best_score"]:
            user_stats["best_score"] = session.score
        
        if session.total_time_seconds:
            user_stats["total_play_time_minutes"] += session.total_time_seconds // 60
        
        # Update global stats
        self._global_stats["total_sessions"] += 1
        self._global_stats["total_words_parsed"] += session.words_attempted