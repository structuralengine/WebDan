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
import { ArrayType } from '@angular/compiler';

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

      const groupe: any[] = new Array();
      let temp: any[];

      // 耐久性曲げモーメントの照査
      if (serviceabilityMomentForces.length > 0) {
        temp = this.setPage(memberList, serviceabilityMomentForces, 2);
        groupe.push({
          title: '耐久性　縁引張応力度検討用',
          g_name: memberList.g_name,
          page: temp[0]
        });
        groupe.push({
          title: '耐久性　永久作用',
          g_name: memberList.g_name,
          page: temp[1]
        });
      }

      // 使用性曲げモーメントの照査
      if (durabilityMomentForces.length > 0) {
        temp = this.setPage(memberList, durabilityMomentForces, 2);
        groupe.push({
          title: '使用性　縁引張応力度検討用',
          g_name: memberList.g_name,
          page: temp[0]
        });
        groupe.push({
          title: '使用性　永久作用',
          g_name: memberList.g_name,
          page: temp[1]
        });
      }

      // 安全性（疲労破壊）曲げモーメントの照査
      if (safetyFatigueMomentForces.length > 0) {
        temp = this.setPage(memberList, safetyFatigueMomentForces, 2);
        groupe.push({
          title: '安全性（疲労破壊）最小応力',
          g_name: memberList.g_name,
          page: temp[0]
        });
        groupe.push({
          title: '安全性（疲労破壊）最大応力',
          g_name: memberList.g_name,
          page: temp[1]
        });
      }

      // 安全性（破壊）曲げモーメントの照査
      if (safetyMomentForces.length > 0) {
        temp = this.setPage(memberList, safetyMomentForces, 1);
        groupe.push({
          title: '安全性（破壊）',
          g_name: memberList.g_name,
          page: temp[0]
        });
      }

      // 復旧性（地震時以外）曲げモーメントの照査
      if (restorabilityMomentForces.length > 0) {
        temp = this.setPage(memberList, restorabilityMomentForces, 1);
        groupe.push({
          title: '復旧性（地震時以外）',
          g_name: memberList.g_name,
          page: temp[0]
        });
      }

      // 復旧性（地震時）曲げモーメントの照査
      if (earthquakesMomentForces.length > 0) {
        temp = this.setPage(memberList, earthquakesMomentForces, 1);
        groupe.push({
          title: '復旧性（地震時）',
          g_name: memberList.g_name,
          page: temp[0]
        });
      }

      this.groupes.push(groupe);
    }

    this.isLoading = false;
    this.isFulfilled = true;

  }


  private setPage(memberList: any[], forces: any[], count: number): any[] {

    const result: any[] = [new Array()];
    for (let i = 1; i < count; i++) { result.push(new Array()); }

    const page: any[] = new Array();
    for (let i = 0; i < count; i++) {
      page.push(new Array());
    }

    for (const member of memberList) {
      let tmp: any = undefined;
      for (const m of forces) {
        tmp = m.find(a => { return a.m_no === member.m_no; })
        if (tmp !== undefined) { break; }
      }
      if (tmp !== undefined) {
        for (const pos of tmp.positions) {
          const pd: any[] = [pos.PostData0];
          for (let i = 1; i < count; i++) { pd.push(pos.PostData1); }
          for (let i = 0; i < count; i++) {
            const p: any = {
              m_no: member.m_no,
              position: pos.position.toFixed(3),
              p_name: pos.p_name,
              p_name_ex: pos.p_name_ex
            };
            for (const pp of pd[i]) {
              const pt = { Md: '-', Nd: '-', Vd: '-', comb: '-' };
              if ('Md' in pp) { pt.Md = pp.Md.toFixed(2); }
              if ('Nd' in pp) { pt.Nd = pp.Nd.toFixed(2); }
              if ('Vd' in pp) { pt.Vd = pp.Vd.toFixed(2); }
              if ('comb' in pp) { pt.comb = pp.comb; }
              switch (pp.memo) {
                case '上側引張':
                  p['upper'] = pt;
                  break;
                case '下側引張':
                  p['lower'] = pt;
                  break;
              }
              p[pp.memo] = pt;
            }
            if ('upper' in p === false) {
              p['upper'] = { Md: '-', Nd: '-', Vd: '-', comb: '-' };
            }
            if ('lower' in p === false) {
              p['lower'] = { Md: '-', Nd: '-', Vd: '-', comb: '-' };
            }
            page[i].push(p);
            if (page[i].length > 15) { // 行数が15行以上になったらページに登録してリセット
              result[i].push(page[i]);
              page[i] = new Array();
            }

          }
        }
      }

    }
    for (let i = 0; i < result.length; i++) {
      result[i].push(page[i]);
    }
    return result;
  }

}
