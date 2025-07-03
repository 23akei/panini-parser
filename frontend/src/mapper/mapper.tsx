import type { StartGameResponse, GameStep } from '../api/generated/api';
import type { Question } from '../types/interfaces';

export function mapStepsToQuestions(response: StartGameResponse): Question[] {
  return response.steps.map((step: GameStep) => ({
    id: step.id,
    from_word: step.from_word,
    to_word: step.to_word,
    hint: step.hint,
  }));
}
