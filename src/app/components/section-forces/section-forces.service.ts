import { Injectable } from '@angular/core';
import { InputDesignPointsService } from '../design-points/design-points.service';
import { InputMembersService } from '../members/members.service';

@Injectable({
  providedIn: 'root'
})
export class InputSectionForcesService  {

  private force: any[];

  constructor(
    private members: InputMembersService,
    private points: InputDesignPointsService) {
    this.clear();
  }
  public clear(): void {
    this.force = new Array();
  }

  // １行 のデフォルト値
  private default_1_column(index: number): any {

    const moment = { Md: null, Nd: null };
    const shearForce = { Md: null, Nd: null, Vd: null };

    const rows: any = { 
      index, 
      ap_1: moment,       // safetyMoment
      ap_2: shearForce,   // safetyShearForce
      ap_3: moment,       // SafetyFatigueMoment
      ap_4: shearForce,   // safetyFatigueShearForce
      ap_5: moment,       // serviceabilityMoment
      ap_6: shearForce,   // serviceabilityShearForce
      ap_7: moment,       // durabilityMoment
      ap_8: moment,       // restorabilityMoment
      ap_9: shearForce,   // restorabilityShearForce
      ap_10: moment,      // earthquakesMoment
      ap_11: shearForce,  // earthquakesShearForce
    };

    return rows;
  }


  // 曲げモーメント moment_force から 指定行 のデータを返す関数
  public getTable1Columns(index: number): any {

    let result = this.force.find( (item) => item.index === index );
    //
    const design_point = this.points.getTableColumn(index);
    const member = this.members.getTableColumns(design_point.m_no);

    const p_name: string = (design_point !== undefined) ? design_point.p_name: '';
    const g_name: string = (member !== undefined) ? member.g_name: '';
    const La: number = (design_point !== undefined) ? design_point.La: null;

    // 対象データが無かった時に処理
    if (result === undefined) {
      result = this.default_1_column(index);
      this.force.push(result);
    }

    result['g_name'] = g_name;
    result['p_name'] = p_name;
    result['La'] = La;
    return result;

  }

  // ファイル
  public setTable1Columns(table_datas1: any[]) {
    this.force = new Array();
    for (const data of table_datas1) {
      const new_colum = this.default_1_column(data.index);
      for (let i = 0; i < new_colum.case.length; i++) {
        new_colum.case[i].Md = data['case' + i + '_Md'];
        new_colum.case[i].Nd = data['case' + i + '_Nd'];

        new_colum.case[i].Vd = data['case' + i + '_Vd'];
        new_colum.case[i].Md = data['case' + i + '_Md'];
        new_colum.case[i].Nd = data['case' + i + '_Nd'];
      }
      this.force.push(new_colum);
    }
  }

  public getSaveData(): any{
    return this.force;
  }

  public setSaveData(force: any) {
    this.force = force;
  }

  public setTableColumns(force: any): void{
    this.clear();
    this.force = force;
  }

}
