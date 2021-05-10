import { Injectable } from '@angular/core';
import { InputDesignPointsService } from '../design-points/design-points.service';

@Injectable({
  providedIn: 'root'
})
export class InputSectionForcesService  {

  public moment_force: any[];
  public shear_force: any[];

  constructor(private points: InputDesignPointsService) {
    this.clear();
  }
  public clear(): void {
    this.moment_force = new Array();
    this.shear_force = new Array();
  }

  // 曲げモーメント １入力行のデフォルト値
  // { index, p_name, case: [{Md, Nd}, {Md, Nd}, ...] }
  private default_1_column(index: number): any {

    const rows: any = { index, case: new Array() };

    let counter: number = 7;

    for (let i = 0; i < counter; i++) {
      const tmp = {Md: null, Nd: null };
      rows.case.push(tmp)
    }

    return rows;
  }

  // せん断力 １入力行のデフォルト値
  // { index, p_name, case: [{Vd, Md, Nd}, {Vd, Md, Nd}, ...] }
  private default_2_column(index: number): any {

    const rows: any = { index, case: new Array() };

    let counter: number = 8;

    for (let i = 0; i < counter; i++) {
      const tmp = {Vd: null, Md: null, Nd: null};
      rows.case.push(tmp)
    }

    return rows;
  }

  // 曲げモーメント moment_force から 指定行 のデータを返す関数
  public getTable1Columns(row: number): any {

    let result = this.moment_force.find( (item) => item.index === row );
    //
    const design_point = this.points.getTableColumn(row);
    let g_name: string = '';
    let p_name: string = '';
    if(design_point !== undefined){
      g_name = design_point.g_name;
      p_name = design_point.p_name;
    }

    // 対象データが無かった時に処理
    if (result === undefined) {
      result = this.default_1_column(row);
      this.moment_force.push(result);
    }

    result['g_name'] = g_name;
    result['p_name'] = p_name;
    return result;

  }

  // ファイル
  public setTable1Columns(table_datas1: any[]) {
    this.moment_force = new Array();
    for (const data of table_datas1) {
      const new_colum = this.default_1_column(data.index);
      for (let i = 0; i < new_colum.case.length; i++) {
        new_colum.case[i].Md = data['case' + i + '_Md'];
        new_colum.case[i].Nd = data['case' + i + '_Nd'];
      }
      this.moment_force.push(new_colum);
    }
  }

  // せん断力 shear_force から 指定行 のデータを返す関数
  public getTable2Columns(row: number): any {

    let result = this.shear_force.find( (item) => item.index === row );
    //
    const design_point = this.points.getTableColumn(row);
    const p_name: string = (design_point !== undefined) ? design_point.p_name: '';

    // 対象データが無かった時に処理
    if (result === undefined) {
      result = this.default_2_column(row);
      this.shear_force.push(result);
    }

    result['p_name'] = p_name;
    return result;

  }

  public setTable2Columns(table_datas2: any[]) {
    this.shear_force = new Array();
    for (const data of table_datas2) {
      const new_colum = this.default_2_column(data.index);
      for (let i = 0; i < new_colum.case.length; i++) {
        new_colum.case[i].Vd = data['case' + i + '_Vd'];
        new_colum.case[i].Md = data['case' + i + '_Md'];
        new_colum.case[i].Nd = data['case' + i + '_Nd'];
      }
      this.shear_force.push(new_colum);
    }
  }

  public getSaveData(): any{
    return {
      moment_force: this.moment_force,
      shear_force: this.shear_force
    };
  }

  public setSaveData(force: any) {
    this.moment_force = force.moment_force,
    this.shear_force = force.shear_force
  }

  public setTableColumns(force: any): void{
    this.clear();
    if('moment_force' in force){
      this.moment_force = force.moment_force;
    }
    if('shear_force' in force){
      this.shear_force = force.shear_force;
    }
  }

}
