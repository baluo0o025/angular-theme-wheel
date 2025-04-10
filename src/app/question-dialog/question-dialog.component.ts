import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { ConfettiService } from '../services/confetti.service';
@Component({
  selector: 'app-question-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatRadioModule],
  templateUrl: './question-dialog.component.html',
  styleUrl: './question-dialog.component.scss'
})

export class QuestionDialogComponent {
  selectedAnswer: string | null = null;
  winAudio = new Audio('assets/sounds/win.mp3');
  lossAudio = new Audio('assets/sounds/fail.mp3');
  result: 'correct' | 'incorrect' | 'skipped' | null = null;

  constructor(
    public dialogRef: MatDialogRef<QuestionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public confetti: ConfettiService
  ) {}

  onSubmit() {
    const correct = this.selectedAnswer === this.data.answer;
    if (correct) {
      this.confetti.launchConfetti();
      this.winAudio.play().catch(err => console.warn('Autoplay blocked:', err));
    } else {
      this.confetti.showSadConfetti();
      this.lossAudio.play().catch(err => console.warn('Autoplay blocked:', err));
    }
  
    // Attach result info to be shown in the template
    this.data.result = {
      selected: this.selectedAnswer,
      correct
    };
  }

  onCancel() {
    this.dialogRef.close();
  }
}
