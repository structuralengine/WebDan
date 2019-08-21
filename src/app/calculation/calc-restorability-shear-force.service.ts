import { Injectable } from '@angular/core';
import { CalcSafetyShearForceService } from './calc-safety-shear-force.service';


@Injectable({
  providedIn: 'root'
})
export class CalcRestorabilityShearForceService extends CalcSafetyShearForceService {
  // 復旧性（地震時以外）せん断力

  constructor() {
    super();
  }

  public restorability_shear_force_pages(): any[] {
    const result: any[] = this.safety_shear_force_pages('復旧性（地震時以外）せん断力の照査結果');
    return result;
  }
}
