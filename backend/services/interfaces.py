"""
Service layer interfaces for the Panini Parser backend.
These interfaces define the contracts for business logic services.
"""

from abc import ABC, abstractmethod
from typing import Optional

from ..dto.game_dto import (
    StartGameRequest, StartGameResponse, SubmitAnswerRequest, SubmitAnswerResponse,
    GameStatusResponse, FinishGameResponse, RuleDetailsResponse
)


class IGameService(ABC):
    """
    Interface for game-related business logic operations.
    
    Defines the contract for managing Sanskrit parsing game sessions,
    including game lifecycle, answer evaluation, and progress tracking.
    """

    @abstractmethod
    async def start_game(self, request: StartGameRequest) -> StartGameResponse:
        """
        Start a new Sanskrit parsing game session.
        
        Creates a new game with a sequence of grammatical transformation steps
        based on the specified difficulty level and length.
        
        Args:
            request: Game configuration including difficulty and step count
            
        Returns:
            Game session with unique ID and transformation steps
            
        Raises:
            ValueError: If no words available for the difficulty level
        """
        pass

    @abstractmethod
    async def submit_answer(self, game_id: str, step_id: int, request: SubmitAnswerRequest) -> SubmitAnswerResponse:
        """
        Submit a Panini grammar rule as answer for a transformation step.
        
        Evaluates the submitted rule against the correct transformation,
        provides detailed explanation, and advances to next step if available.
        
        Args:
            game_id: Unique game session identifier
            step_id: Step number within the game sequence
            request: Answer containing the Panini sutra number
            
        Returns:
            Answer evaluation with correctness and explanation
            
        Raises:
            ValueError: If game not found or not in active state
        """
        pass

    @abstractmethod
    async def get_game_status(self, game_id: str) -> GameStatusResponse:
        """
        Get current status and progress of an active game session.
        
        Provides real-time information about player progress through
        the grammatical transformation challenges.
        
        Args:
            game_id: Unique game session identifier
            
        Returns:
            Current progress including step number, score, and timing
            
        Raises:
            ValueError: If game session not found
        """
        pass

    @abstractmethod
    async def finish_game(self, game_id: str) -> FinishGameResponse:
        """
        Complete a game session and provide final results.
        
        Ends the current session and returns comprehensive performance
        metrics including scoring, timing, and achievement ranking.
        
        Args:
            game_id: Unique game session identifier
            
        Returns:
            Final results with score, timing, and achievement rank
            
        Raises:
            ValueError: If game session not found
        """
        pass

    @abstractmethod
    async def get_rule_details(self, sutra: str) -> RuleDetailsResponse:
        """
        Get comprehensive information about a Panini grammar rule.
        
        Provides detailed reference information for Sanskrit grammar rules,
        including descriptions, examples, and related rules.
        
        Args:
            sutra: Panini rule number (e.g., "3.1.68")
            
        Returns:
            Rule information with description, examples, and related rules
            
        Raises:
            ValueError: If rule not found in the grammar database
        """
        pass


class IWordService(ABC):
    """
    Interface for word-related operations.
    
    Defines the contract for Sanskrit word parsing and management
    using the Vidyut parser engine.
    """

    @abstractmethod
    async def parse_word(self, word: str) -> dict:
        """
        Parse a Sanskrit word using the Vidyut engine.
        
        Args:
            word: Sanskrit word to parse
            
        Returns:
            Parsing results with grammatical analysis
        """
        pass

    @abstractmethod
    async def get_word_details(self, word_id: int, include_forms: bool = True) -> Optional[dict]:
        """
        Get detailed information about a specific word.
        
        Args:
            word_id: Unique word identifier
            include_forms: Whether to include inflected forms
            
        Returns:
            Word details or None if not found
        """
        pass

    @abstractmethod
    async def get_random_word(self, difficulty_level: Optional[int] = None) -> Optional[dict]:
        """
        Get a random word for gameplay.
        
        Args:
            difficulty_level: Optional difficulty filter
            
        Returns:
            Random word or None if none available
        """
        pass