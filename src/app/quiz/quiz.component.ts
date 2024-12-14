import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { STATES_AND_CAPITALS } from './quiz.model';
import { MatCardModule } from '@angular/material/card';
import {MatRadioModule} from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import {MatToolbarModule} from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-quiz',
  imports: [MatCardModule, MatButtonModule, MatRadioModule, FormsModule, MatToolbarModule, CommonModule ],
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
})
export class QuizComponent implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);
  
  disabledInputSelection = signal(false);
  numQuestions: number = 0;
  totalTime: number = 0;

  questions = [...STATES_AND_CAPITALS];
  selectedQuestions: any[] = [];
  answers: (string | null)[] = []; // Track answers for each question
  currentIndex: number = 0;

  timeLeft: number = 0; // Total time left in seconds
  timer: any;
  startTime: number = 0;
  feedback: { isCorrect: boolean; message: string } | null = null;

  get currentQuestion() {
    return this.selectedQuestions[this.currentIndex];
  }

  get timerMinutes(): number {
    return Math.floor(this.timeLeft / 60);
  }

  get timerSeconds(): number {
    return this.timeLeft % 60;
  }

  ngOnInit(): void {
    const state = history.state as { numQuestions: number; totalTime: number };

    if (state && state.numQuestions && state.totalTime) {


      this.numQuestions = state.numQuestions;
      this.totalTime = state.totalTime;
      this.initializeQuiz();
    } else {
      this.router.navigate(['/config']); // Redirect to config if no state is provided
    }
    this.startTimer();
  }

  initializeQuiz(): void {
    this.startTime = Date.now(); // Record the start time
    // Shuffle and pick the required number of unique questions
    this.selectedQuestions = this.shuffleArray(this.questions)
      .slice(0, this.numQuestions)
      .map((question) => {
        // Generate options: Include the correct answer and random incorrect answers
        const incorrectOptions = this.questions
          .filter((q) => q.capital !== question.capital) // Exclude the correct answer
          .map((q) => q.capital); // Get only the incorrect capitals

        const randomIncorrects = this.shuffleArray(incorrectOptions).slice(0, 3); // Pick 3 random incorrect options

        return {
          ...question,
          options: this.shuffleArray([question.capital, ...randomIncorrects]), // Shuffle correct and incorrect answers
        };
      });

    // Initialize answers array
    this.answers = Array(this.numQuestions).fill(null);

    // Calculate total time in seconds
    this.timeLeft = this.totalTime * 60;
  }


  startTimer(): void {
    this.timer = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        clearInterval(this.timer);
        this.submitQuiz();
      }
    }, 1000);
  }

  shuffleArray(array: any[]): any[] {
    return array.sort(() => Math.random() - 0.5);
  }

  previousQuestion(): void {
    this.disabledInputSelection.set(false);
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  nextQuestion(): void {
    this.disabledInputSelection.set(false);
    if (this.currentIndex < this.numQuestions - 1) {
      this.currentIndex++;
    }
  }

  checkAnswer(selectedOption: string | null): void {
    this.disabledInputSelection.set(true);
    if (selectedOption) {
      const isCorrect = selectedOption === this.currentQuestion.capital;
      this.answers[this.currentIndex] = selectedOption;

      // Set feedback
      this.feedback = {
        isCorrect,
        message: isCorrect
          ? 'Correct! 🎉'
          : `Wrong! You selected "${this.currentQuestion.capital}".`,
      };
    }
  }

  submitQuiz(): void {
    clearInterval(this.timer);
    this.calculateResults();
  }

  calculateResults(): void {
    const endTime = Date.now();
    const timeTaken = Math.floor((endTime - this.startTime) / 1000); // Time in seconds

    const results = this.selectedQuestions.map((question, index) => ({
      question: question.state,
      correct: question.capital,
      selected: this.answers[index],
      isCorrect: this.answers[index] === question.capital,
    }));

    const score = results.filter((result) => result.isCorrect).length;
    const correctAnswers = results.filter(result => result.isCorrect).length;
    const incorrectAnswers = results.filter(result => !result.isCorrect).length;

    this.router.navigate(['/results'], {
      state: { results: {results, correctAnswers, incorrectAnswers, score, timeTaken, totalTime: this.totalTime} },
    });
    console.log('Results:', results); // Pass results to the results screen or process them
  }
}
