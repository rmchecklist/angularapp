import { Component } from '@angular/core';
import { QuizComponent1 } from '../core/quiz/quiz.component';
import { STATES_AND_CAPITALS } from '../quiz/quiz.model';

@Component({
  selector: 'app-quiz-demo1',
  imports: [QuizComponent1],
  templateUrl: './quiz-demo.component.html',
  styleUrl: './quiz-demo.component.scss',
})
export class QuizDemoComponent {
  questions = STATES_AND_CAPITALS;
}
