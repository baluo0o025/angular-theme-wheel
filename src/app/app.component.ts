import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { ThemeWheelComponent } from './theme-wheel/theme-wheel.component';
import { QuestionDialogComponent } from './question-dialog/question-dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ThemeWheelComponent, MatDialogModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'theme-wheel-quiz';
}
