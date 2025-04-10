// 1. ThemeWheelComponent (wheel + spin logic)
import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { QuestionDialogComponent } from '../question-dialog/question-dialog.component';
import { CommonModule } from '@angular/common';
import { QuestionService } from '../services/question.service';

@Component({
  selector: 'app-theme-wheel',
  standalone: true,
  imports: [CommonModule, MatDialogModule, QuestionDialogComponent],
  templateUrl: './theme-wheel.component.html',
  styleUrls: ['./theme-wheel.component.scss']
})
export class ThemeWheelComponent {
  private spinAudio = new Audio('assets/sounds/spin.mp3');
  readonly baseOffset = 60;
  themes = [{ 
    label: 'JavaScript7', 
    questions: [
      {
        question: 'What is hoisting in JavaScript?',
        options: ['Running code in strict mode', 'Moving declarations to top', 'Variable shadowing'],
        answer: 'Moving declarations to top'
      }
    ]
  }];
  spinning = false;
  currentRotation = 0;
  selectedIndex: number | null = null;

  constructor(private dialog: MatDialog, private questionService: QuestionService) {}
  ngOnInit() {
    this.questionService.loadQuestions().subscribe(themes => {
      this.themes = themes ||this.themes;
      console.log('Themes ready:', this.themes);
    });
  }
  get anglePerSlice() {
    return 360 / this.themes.length;
  }

  spin() {
    if (this.spinning) return;
    this.spinning = true;
    this.selectedIndex = null;
  
    // 🔊 Play spin sound
    this.spinAudio.play();
  
    const spins = 5;
    const anglePerSlice = this.anglePerSlice;
    const winIndex = Math.floor(Math.random() * this.themes.length);
    const sliceCenterAngle = winIndex * anglePerSlice + anglePerSlice / 2;
  
    // Adjust final angle to account for baseOffset (initial rotation of the SVG)
    const finalAngle = 360 - (sliceCenterAngle - this.baseOffset);
    const totalRotation = spins * 360 + finalAngle;
  
    const wheel = document.querySelector('.wheel') as HTMLElement;
    if (wheel) {
      wheel.style.transition = 'transform 4s ease-out';
      wheel.style.transform = `rotate(${totalRotation}deg)`;
    }
  
    setTimeout(() => {
      this.spinning = false;
  
      // Normalize final angle
      const normalized = totalRotation % 360;
      if (wheel) {
        wheel.style.transition = 'none';
        wheel.style.transform = `rotate(${normalized}deg)`;
      }
  
      // Calculate selected index considering baseOffset
      const pointerAngle = (360 - normalized + anglePerSlice / 2 - this.baseOffset + 360) % 360;
      const index = Math.floor(pointerAngle / anglePerSlice) % this.themes.length;
  
      this.selectedIndex = index;
  
      setTimeout(() => {
        const theme = this.themes[index];
        const questions = theme.questions;
        const randomQ = questions[Math.floor(Math.random() * questions.length)];
  
        this.openQuestionDialog(theme.label, randomQ);
      }, 500);
    }, 4100); // Match animation time
  }
  
  
  
  openQuestionDialog(themeLabel: string, question: any) {
    const dialogRef = this.dialog.open(QuestionDialogComponent, {
      width: '550px',
      data: { themeLabel, ...question }
    });

    dialogRef.afterClosed().subscribe(() => {
      // No alert needed – results shown inside the dialog
    });
  }

  getSlicePath(index: number): string {
    const radius = 200;
    const angle = this.anglePerSlice;
    const startAngle = index * angle;
    const endAngle = startAngle + angle;
    const start = this.polarToCartesian(250, 250, radius, endAngle);
    const end = this.polarToCartesian(250, 250, radius, startAngle);
    const largeArc = angle > 180 ? 1 : 0;

    return [
      `M250,250`,
      `L${start.x},${start.y}`,
      `A${radius},${radius} 0 ${largeArc} 0 ${end.x},${end.y}`,
      'Z'
    ].join(' ');
  }

  polarToCartesian(cx: number, cy: number, r: number, angle: number) {
    const radians = (angle - 90) * (Math.PI / 180);
    return {
      x: cx + r * Math.cos(radians),
      y: cy + r * Math.sin(radians)
    };
  }

  getTextX(index: number): number {
    const angle = index * this.anglePerSlice + this.anglePerSlice / 2;
    return 250 + 160 * Math.cos((angle - 90) * (Math.PI / 180));
  }

  getTextY(index: number): number {
    const angle = index * this.anglePerSlice + this.anglePerSlice / 2;
    return 250 + 160 * Math.sin((angle - 90) * (Math.PI / 180));
  }
  
  getWrappedText(text: string, maxCharsPerLine = 8): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';
  
    for (let word of words) {
      if ((currentLine + ' ' + word).trim().length <= maxCharsPerLine) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
    return lines;
  }
  
  getTextAngle(index: number): number {
    return index * this.anglePerSlice + this.anglePerSlice / 2;
  }

  getColor(index: number): string {
    
    const brightColors = [
      '#FF3CAC', // Pink
      '#784BA0', // Purple
      '#2B86C5', // Blue
      '#00F5A0', // Teal
      '#FFB75E', // Orange
      '#FF6F61', // Coral
      '#FFD700', // Gold
      '#00C9FF', // Light Blue
      '#FF5F6D', // Watermelon
      '#9D50BB'  // Deep Purple
    ];
    return brightColors[index % brightColors.length];
  }
}
