import { Injectable, Signal, signal } from '@angular/core';
import { STATES_AND_CAPITALS, StatesAndCapitals } from './quiz.model';

@Injectable({ providedIn: 'root' })
export class QuizService {

  selectedQuestions: StatesAndCapitals[] = [];
  answers: (string | null)[] = []; // Track answers for each question

  private _question = signal<{
    state: string;
    options: string[];
    correct: string;
  } | null>(null);
  private _score = signal(0);
  private _currentQuestionIndex = signal(0);

  get question(): Signal<{
    state: string;
    options: string[];
    correct: string;
  } | null> {
    return this._question;
  }

  get score(): Signal<number> {
    return this._score;
  }

  get currentQuestionIndex(): Signal<number> {
    return this._currentQuestionIndex;
  }

  generateQuestion(): void {
    const randomState =
      STATES_AND_CAPITALS[
        Math.floor(Math.random() * STATES_AND_CAPITALS.length)
      ];
    const options = [randomState.capital];

    while (options.length < 4) {
      const randomOption =
        STATES_AND_CAPITALS[
          Math.floor(Math.random() * STATES_AND_CAPITALS.length)
        ].capital;
      if (!options.includes(randomOption)) {
        options.push(randomOption);
      }
    }

    this._question.set({
      state: randomState.state,
      options: this.shuffle(options),
      correct: randomState.capital,
    });
  }

  checkAnswer(selected: string): boolean {
    const isCorrect = selected === this._question()?.correct;
    if (isCorrect) {
      this._score.update((score) => score + 1);
    }
    return isCorrect;
  }

  incrementQuestionIndex(): void {
    this._currentQuestionIndex.update((index) => index + 1);
  }

  private shuffle(array: string[]): string[] {
    return array.sort(() => Math.random() - 0.5);
  }

  incrementScore(): void {
    this._score.update((score) => score + 1); // Update score
  }

  resetQuiz(): void {
    this._currentQuestionIndex.set(0); // Reset index
    this._score.set(0); // Reset score
  }

  initializeQuiz(questions: StatesAndCapitals[], noOfQuestions: number): void {
    this.selectedQuestions = this.shuffleArray(questions)
      .slice(0, noOfQuestions)
      .map((question) => {
        // Generate options: Include the correct answer and random incorrect answers
        const incorrectOptions = questions
          .filter((q) => q.capital !== question.capital) // Exclude the correct answer
          .map((q) => q.capital); // Get only the incorrect capitals

        const randomIncorrects = this.shuffleArray(incorrectOptions).slice(0, 3); // Pick 3 random incorrect options

        return {
          ...question,
          options: this.shuffleArray([question.capital, ...randomIncorrects]), // Shuffle correct and incorrect answers
        };
      });

    // Initialize answers array
    this.answers = Array(noOfQuestions).fill(null);
  }

  shuffleArray(array: any[]): any[] {
    return array.sort(() => Math.random() - 0.5);
  }
}
