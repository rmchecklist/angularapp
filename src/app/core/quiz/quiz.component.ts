import { Component, inject, input, Input, OnInit, signal } from '@angular/core';
import { STATES_AND_CAPITALS, StatesAndCapitals } from './quiz.model';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { QuizService } from './quiz.service';

@Component({
  selector: 'app-quiz-demo',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatRadioModule,
    FormsModule,
    MatToolbarModule,
    CommonModule,
  ],
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
})
export class QuizComponent1 implements OnInit {
  quizService = inject(QuizService);
  questions = input.required<StatesAndCapitals[]>();
  noOfQuestions = input<number>(10);

  router = inject(Router);
  route = inject(ActivatedRoute);

  disabledInputSelection = signal(false);
  numQuestions: number = 0;
  totalTime: number = 0;

  // questions = [...STATES_AND_CAPITALS];
  selectedQuestions: any[] = [];
  answers: (string | null)[] = []; // Track answers for each question
  currentIndex: number = 0;

  get currentQuestion() {
    return this.quizService.selectedQuestions[this.currentIndex];
  }

  ngOnInit(): void {
    this.quizService.initializeQuiz(this.questions(), this.noOfQuestions());
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
    }
  }

  submitQuiz(): void {
    // clearInterval(this.timer);
    this.calculateResults();
  }

  calculateResults(): void {
    const endTime = Date.now();
    // const timeTaken = Math.floor((endTime - this.startTime) / 1000); // Time in seconds

    const results = this.selectedQuestions.map((question, index) => ({
      question: question.state,
      correct: question.capital,
      selected: this.answers[index],
      isCorrect: this.answers[index] === question.capital,
    }));

    const score = results.filter((result) => result.isCorrect).length;
    const correctAnswers = results.filter((result) => result.isCorrect).length;
    const incorrectAnswers = results.filter(
      (result) => !result.isCorrect
    ).length;

    // this.router.navigate(['/results'], {
    //   state: { results: {results, correctAnswers, incorrectAnswers, score, timeTaken, totalTime: this.totalTime} },
    // });
    console.log('Results:', results); // Pass results to the results screen or process them
  }
}
