import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-quiz-config',
  templateUrl: './quiz-config.component.html',
  styleUrls: ['./quiz-config.component.css'],
})
export class QuizConfigComponent {
  numQuestions: number = 10; // Default number of questions
  totalTime: number = 5; // Default time in minutes

  @Output() configSubmitted = new EventEmitter<{ numQuestions: number; totalTime: number }>();

  isValidConfig(): boolean {
    return this.numQuestions > 0 && this.totalTime > 0;
  }

  startQuiz(): void {
    this.configSubmitted.emit({ numQuestions: this.numQuestions, totalTime: this.totalTime });
  }
}
