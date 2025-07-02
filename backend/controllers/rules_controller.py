"""
Grammar rules API controllers for Panini grammar rule lookup.
Provides endpoints for retrieving detailed information about Sanskrit grammar rules.
"""

from fastapi import APIRouter, HTTPException, Depends, status

from ..dto.game_dto import RuleDetailsResponse
from ..services.interfaces import IGameService
from ..dependencies import get_game_service

router = APIRouter(
    prefix="/rules", 
    tags=["Grammar Rules"],
    responses={404: {"description": "Rule not found"}}
)


@router.get(
    "/{sutra}", 
    response_model=RuleDetailsResponse,
    summary="Get Rule Details",
    description="Retrieve comprehensive information about a specific Panini grammar rule."
)
async def get_rule_details(
    sutra: str,
    game_service: IGameService = Depends(get_game_service)
) -> RuleDetailsResponse:
    """
    Get detailed information about a specific Panini grammar rule (sutra).
    
    Provides comprehensive reference information for Sanskrit grammar rules,
    including descriptions, examples, and related rules for study and verification.
    
    **Path Parameters:**
    - **sutra**: Panini rule number (e.g., "3.1.68", "1.4.14")
    
    **Returns:**
    - **sutra**: The rule number as requested
    - **description**: Sanskrit and English explanation of the rule
    - **example**: Sample transformations demonstrating the rule
    - **category**: Grammatical category (Lakara, Vibhakti, Sandhi, etc.)
    - **next**: Related rule numbers for further study
    
    **Rule Categories:**
    - **Lakara**: Tense and mood formations
    - **Vibhakti**: Case endings and declensions
    - **Sandhi**: Sound combination rules
    - **Kridanta**: Verbal derivatives
    - **Taddhita**: Nominal derivatives
    
    **Example:**
    ```
    GET /rules/3.1.68
    ```
    
    **Response:**
    ```json
    {
      "sutra": "3.1.68",
      "description": "लट् लकारः — Present tense verbal endings",
      "example": "गम् → गच्छति (he/she goes)",
      "category": "Lakara",
      "next": ["3.4.78", "3.1.69"]
    }
    ```
    """
    try:
        return await game_service.get_rule_details(sutra)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting rule details: {str(e)}"
        )