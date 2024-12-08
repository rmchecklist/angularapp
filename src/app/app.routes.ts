import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'config',
    pathMatch: 'full', // Default route
  },
  {
    path: 'config',
    loadComponent: () =>
      import('./quiz-config/quiz-config.component').then((m) => m.QuizConfigComponent),
  },
  {
    path: 'quiz',
    loadComponent: () =>
      import('./quiz/quiz.component').then((m) => m.QuizComponent),
  },
  {
    path: 'results',
    loadComponent: () =>
      import('./quiz-results/quiz-results.component').then((m) => m.QuizResultsComponent),
  },
  {
    path: '**',
    redirectTo: 'config', // Redirect unknown routes to config
  },
];
