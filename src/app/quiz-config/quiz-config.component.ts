import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';


@Component({
  selector: 'app-quiz-config',
  imports: [MatCardModule, MatFormFieldModule, FormsModule, MatInputModule, MatButtonModule],
  templateUrl: './quiz-config.component.html',
  styleUrls: ['./quiz-config.component.scss'],
})
export class QuizConfigComponent {
  router = inject(Router);

  numQuestions: number = 10; // Default number of questions
  totalTime: number = 5; // Default time in minutes

  isValidConfig(): boolean {
    return this.numQuestions > 0 && this.totalTime > 0;
  }

  startQuiz(): void {
    //  Navigate to the quiz page with state data
     this.router.navigate(['/quiz-demo'], {
      state: { numQuestions: this.numQuestions, totalTime: this.totalTime },
    });
  }
}
