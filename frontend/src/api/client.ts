/**
 * API Client wrapper for Panini Parser
 * Provides centralized configuration and error handling for all API calls
 */

import { Configuration, GameManagementApi, GrammarRulesApi } from './generated';
import type {
  StartGameResponse,
  SubmitAnswerRequest,
  SubmitAnswerResponse,
  GameStatusResponse,
  FinishGameResponse,
  RuleDetailsResponse
} from './generated';

// API Configuration
const getApiConfig = () => {
  const basePath = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  
  return new Configuration({
    basePath,
    // Add default headers if needed
    baseOptions: {
      headers: {
        'Content-Type': 'application/json',
      }
    }
  });
};

// Initialize API instances
const config = getApiConfig();
export const gameApi = new GameManagementApi(config);
export const rulesApi = new GrammarRulesApi(config);

/**
 * Centralized API client with error handling and type safety
 */
export class ApiClient {
  /**
   * Start a new game session
   */
  static async startGame(level: string = 'beginner', length: number = 5): Promise<StartGameResponse> {
    try {
      const response = await gameApi.startGameApiV1GameStartGet(level, length);
      return response.data;
    } catch (error) {
      console.error('Failed to start game:', error);
      throw new Error('Failed to start game. Please check your connection and try again.');
    }
  }

  /**
   * Submit an answer for a game step
   */
  static async submitAnswer(
    gameId: string, 
    stepId: number, 
    request: SubmitAnswerRequest
  ): Promise<SubmitAnswerResponse> {
    try {
      const response = await gameApi.submitAnswerApiV1GameGameIdStepStepIdAnswerPost(
        gameId, 
        stepId, 
        request
      );
      return response.data;
    } catch (error) {
      console.error('Failed to submit answer:', error);
      throw new Error('Failed to submit answer. Please try again.');
    }
  }

  /**
   * Get current game status
   */
  static async getGameStatus(gameId: string): Promise<GameStatusResponse> {
    try {
      const response = await gameApi.getGameStatusApiV1GameGameIdStatusGet(gameId);
      return response.data;
    } catch (error) {
      console.error('Failed to get game status:', error);
      throw new Error('Failed to get game status. Please try again.');
    }
  }

  /**
   * Finish a game session
   */
  static async finishGame(gameId: string): Promise<FinishGameResponse> {
    try {
      const response = await gameApi.finishGameApiV1GameGameIdFinishPost(gameId);
      return response.data;
    } catch (error) {
      console.error('Failed to finish game:', error);
      throw new Error('Failed to finish game. Please try again.');
    }
  }

  /**
   * Get details about a specific Panini rule
   */
  static async getRuleDetails(sutra: string): Promise<RuleDetailsResponse> {
    try {
      const response = await rulesApi.getRuleDetailsApiV1RulesSutraGet(sutra);
      return response.data;
    } catch (error) {
      console.error('Failed to get rule details:', error);
      throw new Error('Failed to get rule details. Please try again.');
    }
  }
}

// Re-export types for convenience
export type {
  StartGameResponse,
  SubmitAnswerRequest,
  SubmitAnswerResponse,
  GameStatusResponse,
  FinishGameResponse,
  RuleDetailsResponse,
  GameStep
} from './generated';