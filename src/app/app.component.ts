import { Component } from '@angular/core';
import { QuizComponent } from './quiz/quiz.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MENU_ITEMS } from './app.model';
import { JsonPipe, KeyValuePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatMenuModule,
    MatIcon,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'quiz-app';
  menu = MENU_ITEMS;

  getKeys(item: object): string[] {
    return Object.keys(item);
  }

  getValues(item: object): string[] {
    return Object.values(item)[0];
  }
}
