import { Injectable } from '@angular/core';
import { CalcServiceabilityMomentService } from './calc-serviceability-moment.service';

@Injectable({
  providedIn: 'root'
})
export class CalcDurabilityMomentService extends CalcServiceabilityMomentService {
  // 使用性 曲げひび割れ

  constructor() {
    super();
  }

  public durability_moment_pages(): any[] {
    const result: any[] = this.serviceability_moment_pages('使用性（外観）曲げひび割れの照査結果');
    return result;
  }
}
