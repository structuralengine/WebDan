import { Component, OnInit } from '@angular/core';
import { CalcSafetyMomentService } from '../result-safety-moment/calc-safety-moment.service';
import { CalcSafetyShearForceService } from '../result-safety-shear-force/calc-safety-shear-force.service';
import { CalcSafetyFatigueMomentService } from '../result-safety-fatigue-moment/calc-safety-fatigue-moment.service';
import { CalcSafetyFatigueShearForceService } from '../result-safety-fatigue-shear-force/calc-safety-fatigue-shear-force.service';
import { CalcServiceabilityMomentService } from '../result-serviceability-moment/calc-serviceability-moment.service';
import { CalcServiceabilityShearForceService } from '../result-serviceability-shear-force/calc-serviceability-shear-force.service';
import { CalcDurabilityMomentService } from '../result-durability-moment/calc-durability-moment.service';
import { CalcRestorabilityMomentService } from '../result-restorability-moment/calc-restorability-moment.service';
import { CalcRestorabilityShearForceService } from '../result-restorability-shear-force/calc-restorability-shear-force.service';
import { CalcEarthquakesMomentService } from '../result-earthquakes-moment/calc-earthquakes-moment.service';
import { CalcEarthquakesShearForceService } from '../result-earthquakes-shear-force/calc-earthquakes-shear-force.service';

@Component({
  selector: 'app-section-force-list',
  templateUrl: './section-force-list.component.html',
  styleUrls: ['../result-viewer/result-viewer.component.scss']
})
export class SectionForceListComponent implements OnInit {
  // 安全性（破壊）
  private safetyMomentForces: any[];
  private safetyShearForces: any[];
  // 安全性（疲労破壊）
  private safetyFatigueMomentForces: any[];
  private safetyFatigueShearForces: any[];
  // 耐久性
  private serviceabilityMomentForces: any[];
  private serviceabilityShearForces: any[];
  // 使用性
  private durabilityMomentForces: any[];
  // 復旧性（地震時以外）
  private restorabilityMomentForces: any[];
  private restorabilityShearForces: any[];
  // 復旧性（地震時）
  private earthquakesMomentForces: any[];
  private earthquakesShearForces: any[];

  constructor(
    private CalcSafetyMoment: CalcSafetyMomentService,
    private CalcSafetyShearForce: CalcSafetyShearForceService,
    private CalcSafetyFatigueMoment: CalcSafetyFatigueMomentService,
    private CalcSafetyFatigueShearForce: CalcSafetyFatigueShearForceService,
    private CalcServiceabilityMoment: CalcServiceabilityMomentService,
    private CalcServiceabilityShearForce: CalcServiceabilityShearForceService,
    private CalcDurabilityMoment: CalcDurabilityMomentService,
    private CalcRestorabilityMoment: CalcRestorabilityMomentService,
    private CalcRestorabilityShearForce: CalcRestorabilityShearForceService,
    private CalcEarthquakesMoment: CalcEarthquakesMomentService,
    private CalcEarthquakesShearForce: CalcEarthquakesShearForceService
    ) { }

  ngOnInit() {
    /*
    // 安全性（破壊）
    this.safetyMomentForces = this.CalcSafetyMoment.setDesignForces();
    this.safetyShearForces = this.CalcSafetyShearForce.setDesignForces();
    // 安全性（疲労破壊）
    this.safetyFatigueMomentForces = this.CalcSafetyFatigueMoment.setDesignForces();
    this.safetyFatigueShearForces = this.CalcSafetyFatigueShearForce.setDesignForces();
    // 耐久性
    this.serviceabilityMomentForces = this.CalcServiceabilityMoment.setDesignForces();
    this.serviceabilityShearForces = this.CalcServiceabilityShearForce.setDesignForces();
    // 使用性
    this.durabilityMomentForces = this.CalcDurabilityMoment.setDesignForces();
    // 復旧性（地震時以外）
    this.restorabilityMomentForces = this.CalcRestorabilityMoment.setDesignForces();
    this.restorabilityShearForces = this.CalcRestorabilityShearForce.setDesignForces();
    // 復旧性（地震時）
    this.earthquakesMomentForces = this.CalcEarthquakesMoment.setDesignForces();
    this.earthquakesShearForces = this.CalcEarthquakesShearForce.setDesignForces();
    */
  }

}
