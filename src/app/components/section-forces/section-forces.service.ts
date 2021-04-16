import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { DataHelperModule } from 'src/app/providers/data-helper.module';
import { SaveDataService } from 'src/app/providers/save-data.service';

@Injectable({
  providedIn: 'root'
})
export class InputSectionForcesService  {

  public moment_force: any[];
  public shear_force: any[];

  constructor(
    private save: SaveDataService,
    private helper: DataHelperModule) {
    this.clear();
  }
  public clear(): void {
    this.moment_force = new Array();
    this.shear_force = new Array();
  }

  // 曲げモーメント １入力行のデフォルト値
  // { m_no, p_name_ex, case: [{Md, Nd}, {Md, Nd}, ...] }
  private default_m_column(m_no: number): any {

    const rows: any = { m_no, p_name_ex: '', case: new Array() };

    switch(this.save.basic.specification1_selected){
      case 0: // 鉄道
        for (let i = 0; i < 10; i++) {
          const tmp = {Md: null, Nd: null };
          rows.case.push(tmp)
        }
        break;
      case 1: // 道路
        break;
    }
    return rows;
  }

  // せん断力 １入力行のデフォルト値
  // { m_no, p_name_ex, case: [{Vd, Md, Nd}, {Vd, Md, Nd}, ...] }
  private default_v_column(m_no: number): any {

    const rows: any = { m_no, p_name_ex: '', case: new Array() };

    switch(this.save.basic.specification1_selected){
      case 0: // 鉄道
      for (let i = 0; i < 8; i++) {
        const tmp = {Vd: null, Md: null, Nd: null};
        rows.case.push(tmp)
      }
        break;
      case 1: // 道路
        break;
    }
    return rows;
  }

  // member_list から 指定行 のデータを返す関数
  public getTable1Columns(row: number): any[] {

    // 
    const design_point = this.save.points.getDesignPointColumns(row);

    let result = this.default_m_column(row, p_name_ex);

    // 対象データが無かった時に処理
    if (design_point !== undefined) {
      const p_name_ex = design_point.p_name_ex;
      result = r;
      if(result.g_no === null){
        result.g_id = '';
      }
    } else {
      result = this.default_m_column(row, p_name_ex);
      this.moment_force.push(result);
    }
    return result;


    

    const old_moment_force = this.moment_force.slice(0, this.moment_force.length);
    this.moment_force = new Array();
    const pp = this.points.position_list;
    for (const p of this.points.position_list) {
      const p0 = p['positions'][0];
      let new_colum: any = old_moment_force.find( (value) => {
        return value.m_no === p.m_no;
      });
      if (new_colum === undefined) {
        new_colum = this.default_v_column(p.m_no, p0.p_name_ex);
      }
      new_colum.p_name_ex = p0.p_name_ex;
      this.moment_force.push(new_colum);
    }

    for (const data of this.save.force.getMdtableColumns()) {
      const column = { 'm_no': data['m_no'] };
      column['p_name_ex'] = data['p_name_ex'];
      const caseList: any[] = data['case'];
      for (let i = 0; i < caseList.length; i++) {
        column['case' + i + '_Md'] = caseList[i].Md;
        column['case' + i + '_Nd'] = caseList[i].Nd;
      }
      this.table_datas1.push(column);
    }



    return this.moment_force;
  }

  public setMdtableColumns(table_datas1: any[]) {
    this.moment_force = new Array();
    for (const data of table_datas1) {
      const new_colum = this.default_m_column(data.m_no, data.p_name_ex);
      for (let i = 0; i < new_colum['case'].length; i++) {
        new_colum['case'][i].Md = data['case' + i + '_Md'];
        new_colum['case'][i].Nd = data['case' + i + '_Nd'];
      }
      this.moment_force.push(new_colum);
    }
  }

  public getTable2Columns(): any[] {
    const old_shear_force = this.shear_force.slice(0, this.shear_force.length);
    this.shear_force = new Array();
    for (const p of this.points.position_list) {
      const p0 = p['positions'][0];
      let new_colum: any = old_shear_force.find( (value) => {
        return value.m_no === p.m_no;
      });
      if (new_colum === undefined) {
        new_colum = this.default_m_column(p.m_no, p0.p_name_ex);
      }
      new_colum.p_name_ex = p0.p_name_ex;
      this.shear_force.push(new_colum);
    }
    return this.shear_force;
  }

  public setVdtableColumns(table_datas2: any[]) {
    this.shear_force = new Array();
    for (const data of table_datas2) {
      const new_colum = this.default_v_column(data.m_no, data.p_name_ex);
      for (let i = 0; i < new_colum['case'].length; i++) {
        new_colum['case'][i].Vd = data['case' + i + '_Vd'];
        new_colum['case'][i].Md = data['case' + i + '_Md'];
        new_colum['case'][i].Nd = data['case' + i + '_Nd'];
      }
      this.shear_force.push(new_colum);
    }
  }



}
