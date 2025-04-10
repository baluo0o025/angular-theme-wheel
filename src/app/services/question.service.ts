// question.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class QuestionService {
  private themes: any[] = [];

  constructor(private http: HttpClient) {}

  loadQuestions(): Observable<any[]> {
    if (this.themes.length > 0) return of(this.themes); // Cache if already loaded

    return this.http.get('assets/questions.xlsx', { responseType: 'arraybuffer' }).pipe(
      map((data: ArrayBuffer) => {
        const workbook: XLSX.WorkBook = XLSX.read(data, { type: 'array' });
        const sheetName: string = workbook.SheetNames[0];
        const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        this.themes = this.groupByTheme(jsonData);
        return this.themes;
      })
    );
  }

  private groupByTheme(data: any[]): any[] {
    const grouped: { [key: string]: any[] } = {};

    data.forEach(row => {
      const theme = row['Theme'];
      const question = {
        question: row['Question'],
        options: [row['OptionA'], row['OptionB'], row['OptionC'], row['OptionD']],
        answer: row['Answer']
      };

      if (!grouped[theme]) {
        grouped[theme] = [];
      }

      grouped[theme].push(question);
    });

    return Object.keys(grouped).map(label => ({
      label,
      questions: grouped[label]
    }));
  }
}
