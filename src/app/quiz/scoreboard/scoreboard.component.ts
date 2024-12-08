import { Component, inject, signal } from '@angular/core';
import { QuizService } from '../quiz.service';

@Component({
  standalone: true,
  selector: 'app-scoreboard',
  template: `<h1>Score: {{ score() }}</h1>`,
  styles: [`h1 { text-align: center; font-size: 2rem; }`],
})
export class ScoreboardComponent {
  private quizService = inject(QuizService);
  score = this.quizService.score;
}
