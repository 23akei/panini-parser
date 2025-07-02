"""
Game-related API controllers for the Panini Parser Sanskrit game.
Provides RESTful endpoints for game session management and Panini grammar rule lookup.
"""

from fastapi import APIRouter, HTTPException, Depends, status

from ..dto.game_dto import (
    StartGameRequest, StartGameResponse, SubmitAnswerRequest, SubmitAnswerResponse,
    GameStatusResponse, FinishGameResponse
)
from ..services.interfaces import IGameService
from ..dependencies import get_game_service

router = APIRouter(
    prefix="/game", 
    tags=["Game Management"],
    responses={404: {"description": "Game session not found"}}
)


@router.get(
    "/start", 
    response_model=StartGameResponse,
    summary="Start New Game",
    description="Initialize a new game session with customizable difficulty and step count."
)
async def start_game(
    level: str = "beginner",
    length: int = 5,
    game_service: IGameService = Depends(get_game_service)
) -> StartGameResponse:
    """
    Start a new Sanskrit parsing game session.
    
    Creates a new game with a sequence of grammatical transformation steps
    where players identify the Panini grammar rules used in each transformation.
    
    **Parameters:**
    - **level**: Difficulty level affecting word complexity
        - `beginner`: Simple root forms and basic conjugations
        - `intermediate`: Compound words and intermediate grammar
        - `expert`: Complex formations and advanced rules
    - **length**: Number of transformation steps (1-20)
    
    **Returns:**
    - **gameId**: Unique session identifier for subsequent API calls
    - **steps**: Array of transformation challenges with Sanskrit forms
    
    **Example:**
    ```
    GET /game/start?level=beginner&length=3
    ```
    
    **Response:**
    ```json
    {
      "gameId": "game_abc123",
      "steps": [
        {
          "id": 1,
          "from": "गम्",
          "to": "गच्छ",
          "hint": null
        }
      ]
    }
    ```
    """
    try:
        request = StartGameRequest(level=level, length=length)
        return await game_service.start_game(request)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error starting game: {str(e)}"
        )


@router.post(
    "/{game_id}/step/{step_id}/answer", 
    response_model=SubmitAnswerResponse,
    summary="Submit Answer",
    description="Submit a Panini grammar rule number as answer for a transformation step."
)
async def submit_answer(
    game_id: str,
    step_id: int,
    request: SubmitAnswerRequest,
    game_service: IGameService = Depends(get_game_service)
) -> SubmitAnswerResponse:
    """
    Submit a Panini grammar rule as an answer for a specific transformation step.
    
    Players analyze the Sanskrit transformation (from → to) and identify which
    Panini sutra (grammar rule) governs this particular change.
    
    **Path Parameters:**
    - **game_id**: Unique game session identifier
    - **step_id**: Step number within the game sequence
    
    **Request Body:**
    - **sutra**: Panini rule number (e.g., "3.1.68") or rule alias
    
    **Returns:**
    - **correct**: Whether the submitted rule is correct
    - **explanation**: Detailed explanation of the grammar rule and transformation
    - **nextStepId**: ID of the next step (if any remaining)
    
    **Example:**
    ```
    POST /game/abc123/step/1/answer
    {
      "sutra": "3.1.68"
    }
    ```
    
    **Response:**
    ```json
    {
      "correct": true,
      "explanation": "Correct! 3.1.68 (लट् लकारः) governs present tense formations. गम् becomes गच्छ through this rule.",
      "nextStepId": 2
    }
    ```
    """
    try:
        req = SubmitAnswerRequest(
            sutra=request.sutra.strip()
        )
        return await game_service.submit_answer(game_id, step_id, req)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error submitting answer: {str(e)}"
        )


@router.get(
    "/{game_id}/status", 
    response_model=GameStatusResponse,
    summary="Get Game Status",
    description="Retrieve current progress and scoring information for an active game session."
)
async def get_game_status(
    game_id: str,
    game_service: IGameService = Depends(get_game_service)
) -> GameStatusResponse:
    """
    Get the current status and progress of an active game session.
    
    Provides real-time information about the player's progress through
    the grammatical transformation challenges.
    
    **Path Parameters:**
    - **game_id**: Unique game session identifier
    
    **Returns:**
    - **currentStep**: Current step number (1-based)
    - **totalSteps**: Total number of steps in this game
    - **score**: Current score based on correct answers
    - **startTime**: ISO 8601 timestamp when the game began
    
    **Example:**
    ```
    GET /game/abc123/status
    ```
    
    **Response:**
    ```json
    {
      "currentStep": 2,
      "totalSteps": 5,
      "score": 40,
      "startTime": "2025-07-02T10:00:00Z"
    }
    ```
    """
    try:
        return await game_service.get_game_status(game_id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting game status: {str(e)}"
        )


@router.post(
    "/{game_id}/finish", 
    response_model=FinishGameResponse,
    summary="Finish Game",
    description="Complete a game session and receive final results with scoring breakdown."
)
async def finish_game(
    game_id: str,
    game_service: IGameService = Depends(get_game_service)
) -> FinishGameResponse:
    """
    Complete a game session and receive comprehensive final results.
    
    Ends the current game session and provides detailed performance
    metrics including scoring, timing, and achievement ranking.
    
    **Path Parameters:**
    - **game_id**: Unique game session identifier
    
    **Returns:**
    - **score**: Final score based on correct answers and performance
    - **timeTaken**: Total time spent in seconds
    - **correctAnswers**: Number of correctly identified rules
    - **mistakes**: Number of incorrect attempts
    - **rank**: Achievement level (Bronze, Silver, Gold, Platinum)
    
    **Ranking System:**
    - **Platinum**: Perfect score with fast completion
    - **Gold**: 90%+ accuracy with good timing
    - **Silver**: 70%+ accuracy
    - **Bronze**: 50%+ accuracy
    
    **Example:**
    ```
    POST /game/abc123/finish
    ```
    
    **Response:**
    ```json
    {
      "score": 95,
      "timeTaken": 87.2,
      "correctAnswers": 5,
      "mistakes": 1,
      "rank": "Gold"
    }
    ```
    """
    try:
        return await game_service.finish_game(game_id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error finishing game: {str(e)}"
        )