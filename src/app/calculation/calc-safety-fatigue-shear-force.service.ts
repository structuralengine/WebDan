import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalcSafetyFatigueShearForceService {
  // 安全性（疲労破壊）せん断力

  constructor() { }

  public safety_fatigue_shear_force_pages(): any[] {
    const result: any[] = new Array();

    for (let i = 0; i < 1; i++) {
      const page = { caption: '安全性（疲労破壊）せん断力の照査結果', columns: new Array() };

      for (let c = 0; c < 5; c++) {
        const column: any[] = new Array();
        column.push({ alien: 'center', value: '1部材(0.600)' });
        column.push({ alien: 'center', value: '壁前面(上側)' });
        column.push({ alien: 'center', value: '1' });

        column.push({ alien: 'right', value: '1000' });
        column.push({ alien: 'right', value: '3000' });
        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'center', value: '-' });

        column.push({ alien: 'right', value: '6353.6' });
        column.push({ alien: 'center', value: 'D32-8 本' });
        column.push({ alien: 'right', value: '82.0' });

        column.push({ alien: 'right', value: '24.0' });
        column.push({ alien: 'right', value: '1.30' });
        column.push({ alien: 'right', value: '18.5' });
        column.push({ alien: 'right', value: '390' });
        column.push({ alien: 'right', value: '1.00' });
        column.push({ alien: 'right', value: '390' });
        column.push({ alien: 'right', value: '390' });

        column.push({ alien: 'right', value: '506.8' });
        column.push({ alien: 'center', value: 'D32-4 本' });
        column.push({ alien: 'right', value: '345' });
        column.push({ alien: 'right', value: '90' });
        column.push({ alien: 'right', value: '250' });

        column.push({ alien: 'right', value: '501.7' });
        column.push({ alien: 'right', value: '455.2' });
        column.push({ alien: 'right', value: '0' });

        column.push({ alien: 'right', value: '501.7' });
        column.push({ alien: 'right', value: '455.2' });
        column.push({ alien: 'right', value: '44.18' });

        column.push({ alien: 'right', value: '0.529' });
        column.push({ alien: 'right', value: '1.30' });
        column.push({ alien: 'right', value: '362.6' });

        column.push({ alien: 'right', value: '0.5' });
        column.push({ alien: 'right', value: '65.7' });
        column.push({ alien: 'right', value: '48.4' });

        column.push({ alien: 'right', value: '48.4' });
        column.push({ alien: 'right', value: '103.5' });
        column.push({ alien: 'right', value: '0.468' });
        column.push({ alien: 'right', value: '0.06' });
        column.push({ alien: 'right', value: '2.662' });
        column.push({ alien: 'right', value: '17520000' });
        column.push({ alien: 'right', value: '8.00' });
        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'right', value: '0.65' });
        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'right', value: '1.05' });
        column.push({ alien: 'right', value: '169.06' });
        column.push({ alien: 'right', value: '1.10' });
        column.push({ alien: 'right', value: '1.00' });

        column.push({ alien: 'right', value: '0.210' });
        column.push({ alien: 'center', value: 'OK' });

        page.columns.push(column);
      }
      result.push(page);
    }

    return result;
  }

}
