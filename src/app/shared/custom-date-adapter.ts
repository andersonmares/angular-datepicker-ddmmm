import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {
  // Garante locale pt-BR (meses abreviados: jan, fev, mar, ...)
  override getFirstDayOfWeek(): number {
    return 0; // domingo
  }

  // Converte Date -> string exibida no input
  override format(date: Date, displayFormat: Object): string {
    const day = String(date.getDate()).padStart(2, '0');
    // 'pt-BR' dá "jan", "fev", "mar"... (3 letras)
    const mmm = date
      .toLocaleString('pt-BR', { month: 'short' })
      .replace('.', '') // remove ponto em alguns ambientes
      .toLowerCase();
    return `${day}/${mmm}`;
  }

  // Converte string do input -> Date
  override parse(value: any): Date | null {
    if (!value || typeof value !== 'string') return null;

    // Normaliza (remove espaços, minúsculas)
    const v = value.trim().toLowerCase();

    // Aceita "dd/mmm" (ex.: 05/jan, 15/fev, 30/dez)
    const m1 = v.match(/^(\d{1,2})\/([a-zç]{3})$/);
    // Aceita "dd/mm" (ex.: 05/01, 15/02)
    const m2 = v.match(/^(\d{1,2})\/(\d{1,2})$/);

    const year = new Date().getFullYear();

    const mapMmm: Record<string, number> = {
      jan: 0, fev: 1, mar: 2, abr: 3, mai: 4, jun: 5,
      jul: 6, ago: 7, set: 8, out: 9, nov: 10, dez: 11,
    };

    if (m1) {
      const dd = parseInt(m1[1], 10);
      const mmm = m1[2].replace('.', '');
      const mm = mapMmm[mmm];
      if (Number.isInteger(dd) && mm !== undefined) {
        const d = new Date(year, mm, dd);
        return isNaN(d.getTime()) ? null : d;
      }
    }

    if (m2) {
      const dd = parseInt(m2[1], 10);
      const mmNum = parseInt(m2[2], 10) - 1;
      if (Number.isInteger(dd) && Number.isInteger(mmNum)) {
        const d = new Date(year, mmNum, dd);
        return isNaN(d.getTime()) ? null : d;
      }
    }

    return null;
  }
}