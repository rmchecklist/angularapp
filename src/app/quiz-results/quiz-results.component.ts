import { JsonPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';
import {MatTableModule} from '@angular/material/table';
@Component({
  selector: 'app-quiz-results',
  imports: [MatCardModule, MatListModule, NgIf, NgFor, MatTableModule, JsonPipe],
  templateUrl: './quiz-results.component.html',
  styleUrls: ['./quiz-results.component.scss'],
})
export class QuizResultsComponent implements OnInit {

  data: any;
  constructor(private router: Router) {}

  columnConfig: any[] = [
    {
      display: 'State', column: 'question'
    },
    {
      display: 'Capital', column: 'correct'
    },
    {
      display: 'Selected', column: 'selected'
    },
    {
      display: 'Status', column: 'isCorrect'
    }    
  ];

  displayedColumns = this.columnConfig.map(col => col.column);

  dataSource:any = [];

  ngOnInit(): void {
    const state = history.state as { results: any[]; score: number; correctAnswers: number, incorrectAnswers: number, timeTaken: number; totalTime: number };

    console.log(state);
    if (state && state.results) {
      this.data= state.results;
      this.dataSource = this.data.results as any[];
    } else {
      this.router.navigate(['/config']);
    }
  }
}
