import { Injectable } from '@angular/core';
import { CalcRestorabilityMomentService } from './calc-restorability-moment.service';

@Injectable({
  providedIn: 'root'
})
export class CalcEarthquakesMomentService extends CalcRestorabilityMomentService {
  // 復旧性（地震時）曲げモーメント

  constructor() {
    super();
   }

  public earthquakes_moment_pages(): any[] {
    const result: any[] = this.restorability_moment_pages('復旧性（地震時）曲げモーメントの照査結果');
    return result;
  }
}
