import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { interval, Subscription } from 'rxjs';
import { QuizService } from './quiz.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  standalone: true,
  selector: 'app-quiz',
  imports:[MatToolbarModule,
    MatCardModule,
    MatRadioModule,
    MatButtonModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    NgIf,
    NgFor, // For structural directives like *ngIf and *ngFor
    FormsModule,
    NgClass,
    MatSlideToggleModule
    ],
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class QuizComponent implements OnInit {

  quizService =  inject(QuizService);
  private snackBar = inject(MatSnackBar);

  confirmQuestionClicked = signal(false);
  nextQuestionClicked = signal(false);
  question = this.quizService.question; // Signal for the current question
  score = this.quizService.score; // Signal for the score
  selectedOption = signal<string | null>(null); // Signal to track selected option
  result = signal<boolean | null>(null); // Signal for the result of the current question
  timerValue = signal(120); // Signal for the timer (in seconds)
  progress = signal(0); // Signal for the progress bar percentage
  timerSubscription: Subscription | null = null; // Subscription for the timer interval

  totalQuestions = 50; // Total number of questions in the quiz
  isDarkMode = signal(false);

  toggleDarkMode(): void {
    this.isDarkMode.update((value) => !value);
    document.body.classList.toggle('dark-theme', this.isDarkMode());
  }

  constructor() {
    effect(() => {
      this.quizService.generateQuestion(); // Generate the first question
      // this.startTimer(); // Start the timer
    });
  }
  ngOnInit(): void {
    this.startTimer();
  }

  // Starts the countdown timer
  startTimer(): void {
    this.timerValue.set(120); // Reset the timer to 10 seconds
    this.timerSubscription = interval(1000).subscribe(() => {
      const currentValue = this.timerValue();
      if (currentValue > 0) {
        this.timerValue.set(currentValue - 1); // Decrement the timer
      } else {
        this.timerSubscription?.unsubscribe();
        this.autoProceed(); // Auto-proceed if time runs out
      }
    });
  }

  // Automatically proceed to the next question if time runs out
  autoProceed(): void {
    this.result.set(false); // Mark the result as incorrect
    this.snackBar.open('Time is up! ❌', 'Close', { duration: 3000 });
    this.nextQuestion();
  }

  // Getter for timer percentage
  get timerPercentage(): number {
    return (this.timerValue() / 120) * 100; // Calculate percentage based on the initial timer value
  }
  // Handles when the user confirms their answer
  confirmAnswer(): void {
    this.confirmQuestionClicked.set(true);
    if (this.selectedOption()) {
      // this.timerSubscription?.unsubscribe(); // Stop the timer
      const isCorrect = this.quizService.checkAnswer(this.selectedOption()!); // Check the answer
      this.result.set(isCorrect); // Update the result signal

      // Display feedback via snack bar
      this.snackBar.open(
        isCorrect ? 'Correct! 🎉' : 'Wrong! ❌',
        'Close',
        {
          duration: 3000,
          panelClass: isCorrect ? 'snack-correct' : 'snack-wrong',
          horizontalPosition: 'end', // Position snack bar at the end (right)
          verticalPosition: 'top', // Position snack bar at the top
        }
      );

      this.updateProgress(); // Update the progress bar
    }
  }

  // Moves to the next question
  nextQuestion(): void {
    this.confirmQuestionClicked.set(false);
    if (this.quizService.currentQuestionIndex() + 1 < this.totalQuestions) {
      this.result.set(null); // Reset the result
      this.selectedOption.set(null); // Reset the selected option
      this.quizService.incrementQuestionIndex(); // Increment the question index
      this.quizService.generateQuestion(); // Generate the next question
      // this.startTimer(); // Restart the timer
    } else {
      this.endQuiz(); // End the quiz if all questions are answered
    }
  }

  // Updates the progress bar percentage
  updateProgress(): void {
    const answeredQuestions = this.quizService.currentQuestionIndex() + 1;
    this.progress.set((answeredQuestions / this.totalQuestions) * 100);
  }

  // Ends the quiz
  endQuiz(): void {
    this.snackBar.open('Quiz Complete! 🎉', 'Close', { duration: 3000 });
    // Optionally, navigate to a summary or results page here
  }

  // Restarts the quiz from the beginning
  restartQuiz(): void {
    this.result.set(null);
    this.selectedOption.set(null);
    this.quizService.resetQuiz(); // Use the resetQuiz method to reset signals
    this.quizService.generateQuestion(); // Generate the first question
    this.startTimer(); // Start the timer
    this.updateProgress(); // Reset the progress bar
  }
}
