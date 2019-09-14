import { Component, OnInit } from '@angular/core';
import { SaveDataService } from '../../providers/save-data.service';
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

  private groupes: object[];
  private isLoading = true;
  private isFulfilled = false;

  constructor(
    private save: SaveDataService,
    private durabilityMoment: CalcDurabilityMomentService,
    private earthquakesMoment: CalcEarthquakesMomentService,
    private earthquakesShearForce: CalcEarthquakesShearForceService,
    private restorabilityMoment: CalcRestorabilityMomentService,
    private restorabilityShearForce: CalcRestorabilityShearForceService,
    private SafetyFatigueMoment: CalcSafetyFatigueMomentService,
    private safetyFatigueShearForce: CalcSafetyFatigueShearForceService,
    private safetyMoment: CalcSafetyMomentService,
    private safetyShearForce: CalcSafetyShearForceService,
    private serviceabilityMoment: CalcServiceabilityMomentService,
    private serviceabilityShearForce: CalcServiceabilityShearForceService
  ) { }

  ngOnInit() {
    this.groupes = new Array();

    const groupeList = this.save.members.getGroupeList();

    const ForceList: any[] = new Array();
    // 安全性（破壊）
    const safetyMomentForces = this.safetyMoment.DesignForceList;
    const safetyShearForces = this.safetyShearForce.DesignForceList;
    // 安全性（疲労破壊）
    const safetyFatigueMomentForces = this.SafetyFatigueMoment.DesignForceList;
    const safetyFatigueShearForces = this.safetyFatigueShearForce.DesignForceList;
    // 耐久性
    const serviceabilityMomentForces = this.serviceabilityMoment.DesignForceList;
    const serviceabilityShearForces = this.serviceabilityShearForce.DesignForceList;
    // 使用性
    const durabilityMomentForces = this.durabilityMoment.DesignForceList;
    // 復旧性（地震時以外）
    const restorabilityMomentForces = this.restorabilityMoment.DesignForceList;
    const restorabilityShearForces = this.restorabilityShearForce.DesignForceList;
    // 復旧性（地震時）
    const earthquakesMomentForces = this.earthquakesMoment.DesignForceList;
    const earthquakesShearForces = this.earthquakesShearForce.DesignForceList;

    for (const memberList of groupeList) {
      const groupe: any = {
        serviceabilityMoment1Pages: new Array(), // 耐久性（縁応力度）  
        serviceabilityMoment0Pages: new Array(),　// 耐久性（永久作用） 
        safetyFatigueMomentPages: new Array(),　// 疲労破壊 （曲げ）

        serviceabilityShearForcePages: new Array(), // 耐久性（せん断）
        safetyShearForce: new Array(), // 安全性（せん断）
      }

      let serviceabilityMoment1Page: any[] = new Array();

      for (const member of memberList) {
        let tmp: any = undefined;
        // 耐久性曲げモーメントの照査
        for (const smf of serviceabilityMomentForces) {
          tmp = smf.find(a => { return a.m_no === member.m_no; })
          if (tmp !== undefined) {
            break;
          }
        }
        if (tmp !== undefined) {
          for (const pos of tmp.positions) {
            const p0: any = pos.PostData0;
            const p1: any = pos.PostData1;
            serviceabilityMoment1Page.push(p1);
            if (serviceabilityMoment1Page.length > 15) {
              groupe.serviceabilityMoment1Pages.push(serviceabilityMoment1Page);
              serviceabilityMoment1Page = new Array();
            }
          }
        }
      }
      if(serviceabilityMoment1Page.length > 0) { 
        groupe.serviceabilityMoment1Pages.push(serviceabilityMoment1Page);
      }

      this.groupes.push(groupe);
    }

    this.isLoading = false;
    this.isFulfilled = true;

  }


}
