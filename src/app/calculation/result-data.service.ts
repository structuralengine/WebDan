import { Injectable } from '@angular/core';
import { CalcSafetyMomentService } from './calc-safety-moment.service';
import { CalcSafetyShearForceService } from './calc-safety-shear-force.service';
import { CalcSafetyFatigueMomentService } from './calc-safety-fatigue-moment.service';
import { CalcSafetyFatigueShearForceService } from './calc-safety-fatigue-shear-force.service';
import { CalcServiceabilityMomentService } from './calc-serviceability-moment.service';
import { CalcServiceabilityShearForceService } from './calc-serviceability-shear-force.service';
import { CalcDurabilityMomentService } from './calc-durability-moment.service';
import { CalcRestorabilityMomentService } from './calc-restorability-moment.service';
import { CalcRestorabilityShearForceService } from './calc-restorability-shear-force.service';
import { CalcEarthquakesMomentService } from './calc-earthquakes-moment.service';
import { CalcEarthquakesShearForceService } from './calc-earthquakes-shear-force.service';

@Injectable({
  providedIn: 'root'
})
export class ResultDataService {

  constructor( private CalcSafetyMoment: CalcSafetyMomentService,
               private CalcSafetyShearForce: CalcSafetyShearForceService,
               private CalcSafetyFatigueMoment: CalcSafetyFatigueMomentService,
               private CalcSafetyFatigueShearForce: CalcSafetyFatigueShearForceService,
               private CalcServiceabilityMoment: CalcServiceabilityMomentService,
               private CalcServiceabilityShearForce: CalcServiceabilityShearForceService,
               private CalcDurabilityMoment: CalcDurabilityMomentService,
               private CalcRestorabilityMoment: CalcRestorabilityMomentService,
               private CalcRestorabilityShearForce: CalcRestorabilityShearForceService,
               private CalcEarthquakesMoment: CalcEarthquakesMomentService,
               private CalcEarthquakesShearForce: CalcEarthquakesShearForceService ) {
  }

  // 安全性（破壊）曲げモーメント
  public safety_moment_pages(): any[] {
    const result: any[] = new Array();
    return result;
  }

  // 安全性（破壊）せん断力
  public safety_shear_force_pages(): any[] {
    const result: any[] = new Array();
    return result;
  }

  // 安全性（疲労破壊）曲げモーメント
  safety_fatigue_moment_pages(): any[] {
    const result: any[] = new Array();
    return result;
  }

  // 安全性（疲労破壊）せん断力
  safety_fatigue_shear_force_pages(): any[] {
    const result: any[] = new Array();
    return result;
  }

  // 耐久性 曲げひび割れ
  serviceability_moment_pages(): any[] {
    const result: any[] = new Array();
    return result;
  }

  // 耐久性 せん断ひび割れ
  serviceability_shear_force_pages(): any[] {
    const result: any[] = new Array();
    return result;
  }

  // 使用性 曲げひび割れ
  durability_moment_pages(): any[] {
    const result: any[] = new Array();
    return result;
  }

  // 復旧性（地震時以外）曲げモーメント
  restorability_moment_pages(): any[] {
    const result: any[] = new Array();

    for (let i = 0; i < 1; i++) {
      const page = { caption: '復旧性（地震時以外）曲げモーメントの照査結果', columns: new Array() };

      for (let c = 0; c < 5; c++) {
        const column: any[] = new Array();
        column.push({ alien: 'center', value: '1部材(0.600)' });
        column.push({ alien: 'center', value: '壁前面(上側)' });
        column.push({ alien: 'center', value: '1' });
        column.push({ alien: 'right', value: '1000' });
        column.push({ alien: 'right', value: '3000' });
        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'right', value: '6353.6' });
        column.push({ alien: 'center', value: 'D32-8 本' });
        column.push({ alien: 'right', value: '82.0' });
        column.push({ alien: 'right', value: '12707.2' });
        column.push({ alien: 'center', value: 'D32-16 本' });
        column.push({ alien: 'right', value: '114.0' });
        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'center', value: '' });
        column.push({ alien: 'center', value: '-' });
        column.push({ alien: 'right', value: '24.0' });
        column.push({ alien: 'right', value: '1.30' });
        column.push({ alien: 'right', value: '18.5' });
        column.push({ alien: 'right', value: '390' });
        column.push({ alien: 'right', value: '1.00' });
        column.push({ alien: 'right', value: '390' });
        column.push({ alien: 'right', value: '501.7' });
        column.push({ alien: 'right', value: '455.2' });
        column.push({ alien: 'right', value: '0.00048' });
        column.push({ alien: 'right', value: '0.00195' });
        column.push({ alien: 'right', value: '572.1' });
        column.push({ alien: 'right', value: '7420.2' });
        column.push({ alien: 'right', value: '1.00' });
        column.push({ alien: 'right', value: '7420.2' });
        column.push({ alien: 'right', value: '1.20' });
        column.push({ alien: 'right', value: '0.081' });
        column.push({ alien: 'center', value: 'OK' });
        page.columns.push(column);
      }
      result.push(page);
    }
    return result;
  }
  // 復旧性（地震時以外）せん断力
  restorability_shear_force_pages(): any[] {
    const result: any[] = new Array();
    return result;
  }
  // 復旧性（地震時）曲げモーメント
  earthquakes_moment_pages(): any[] {
    const result: any[] = new Array();
    return result;
  }
  // 復旧性（地震時）せん断力
  earthquakes_shear_force_pages(): any[] {
    const result: any[] = new Array();
    return result;
  }

}
