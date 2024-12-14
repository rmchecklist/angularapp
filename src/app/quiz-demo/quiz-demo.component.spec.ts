import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizDemoComponent } from './quiz-demo.component';

describe('QuizDemoComponent', () => {
  let component: QuizDemoComponent;
  let fixture: ComponentFixture<QuizDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizDemoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
