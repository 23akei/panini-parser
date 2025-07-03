/**
 * React Query hooks for game operations
 * Provides type-safe, cached API interactions with loading states and error handling
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiClient } from '../api/client';
import type { 
  StartGameResponse, 
  SubmitAnswerRequest, 
  SubmitAnswerResponse,
  GameStatusResponse,
  FinishGameResponse
} from '../api/client';

// Query keys for React Query cache management
export const gameQueryKeys = {
  all: ['game'] as const,
  status: (gameId: string) => ['game', 'status', gameId] as const,
  games: () => ['game', 'list'] as const,
};

/**
 * Hook to start a new game
 */
export const useStartGame = () => {
  const queryClient = useQueryClient();
  
  return useMutation<StartGameResponse, Error, { level: string; length: number }>({
    mutationFn: ({ level, length }) => ApiClient.startGame(level, length),
    onSuccess: (data) => {
      // Cache the game status
      queryClient.setQueryData(
        gameQueryKeys.status(data.game_id), 
        {
          current_step: 1,
          total_steps: data.steps.length,
          score: 0,
          start_time: new Date().toISOString()
        }
      );
    },
    onError: (error) => {
      console.error('Start game error:', error);
    }
  });
};

/**
 * Hook to submit an answer for a game step
 */
export const useSubmitAnswer = () => {
  const queryClient = useQueryClient();
  
  return useMutation<
    SubmitAnswerResponse, 
    Error, 
    { gameId: string; stepId: number; request: SubmitAnswerRequest }
  >({
    mutationFn: ({ gameId, stepId, request }) => 
      ApiClient.submitAnswer(gameId, stepId, request),
    onSuccess: (_, variables) => {
      // Invalidate game status to refresh the current state
      queryClient.invalidateQueries({
        queryKey: gameQueryKeys.status(variables.gameId)
      });
    },
    onError: (error) => {
      console.error('Submit answer error:', error);
    }
  });
};

/**
 * Hook to get current game status
 */
export const useGameStatus = (gameId: string | null, enabled: boolean = true) => {
  return useQuery<GameStatusResponse, Error>({
    queryKey: gameQueryKeys.status(gameId || ''),
    queryFn: () => {
      if (!gameId) throw new Error('Game ID is required');
      return ApiClient.getGameStatus(gameId);
    },
    enabled: enabled && !!gameId,
    refetchInterval: 5000, // Refresh every 5 seconds during active game
    staleTime: 2000, // Consider data stale after 2 seconds
  });
};

/**
 * Hook to finish a game
 */
export const useFinishGame = () => {
  const queryClient = useQueryClient();
  
  return useMutation<FinishGameResponse, Error, string>({
    mutationFn: (gameId: string) => ApiClient.finishGame(gameId),
    onSuccess: (data, gameId) => {
      // Clear the game status cache
      queryClient.removeQueries({
        queryKey: gameQueryKeys.status(gameId)
      });
      
      // Could cache final results if needed
      console.log('Game finished:', data);
    },
    onError: (error) => {
      console.error('Finish game error:', error);
    }
  });
};

/**
 * Hook to get rule details
 */
export const useRuleDetails = (sutra: string | null) => {
  return useQuery({
    queryKey: ['rules', sutra],
    queryFn: () => {
      if (!sutra) throw new Error('Sutra is required');
      return ApiClient.getRuleDetails(sutra);
    },
    enabled: !!sutra,
    staleTime: 10 * 60 * 1000, // Rule details are stable for 10 minutes
  });
};

/**
 * Custom hook that combines game operations for easy use in components
 */
export const useGameOperations = () => {
  const startGame = useStartGame();
  const submitAnswer = useSubmitAnswer();
  const finishGame = useFinishGame();
  
  return {
    startGame,
    submitAnswer,
    finishGame,
    isLoading: startGame.isPending || submitAnswer.isPending || finishGame.isPending,
    error: startGame.error || submitAnswer.error || finishGame.error,
  };
};