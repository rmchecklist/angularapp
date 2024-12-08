import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizResultComponent } from './quiz-results.component';

describe('QuizResultComponent', () => {
  let component: QuizResultComponent;
  let fixture: ComponentFixture<QuizResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizResultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
