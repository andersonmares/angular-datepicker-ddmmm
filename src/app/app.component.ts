import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

// ⬇️ seu adapter custom (conforme te passei antes)
import { CustomDateAdapter } from './shared/custom-date-adapter';

export const CUSTOM_DATE_FORMATS = {
  parse:   { dateInput: 'dd/MMM' },
  display: {
    dateInput: 'dd/MMM',
    monthYearLabel: 'MMM',
    dateA11yLabel: 'dd/MMM',
    monthYearA11yLabel: 'MMM',
  },
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,         // ✅ necessário para <mat-card>
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },     // ✅ meses "jan", "fev", ...
    { provide: DateAdapter, useClass: CustomDateAdapter },// ✅ parse/format dd/MMM
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
  ]
})
export class AppComponent {
  title = 'Exemplo dd/mmm';
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      dataInicial: [null],
      dataFinal: [null],
    });
  }

  formatDdMmm(d: Date | null): string {
    if (!d) return '';
    const dd = String(d.getDate()).padStart(2, '0');
    const mmm = d.toLocaleString('pt-BR', { month: 'short' }).replace('.', '').toLowerCase();
    return `${dd}/${mmm}`;
  }

  salvar() {
    const { dataInicial, dataFinal } = this.form.value;
    const payload = {
      dataInicial: this.formatDdMmm(dataInicial),
      dataFinal: this.formatDdMmm(dataFinal),
    };
    console.log('Payload para backend:', payload);
  }
}