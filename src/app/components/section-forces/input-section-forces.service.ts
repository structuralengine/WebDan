import { Injectable } from '@angular/core';
import { DataHelperModule } from '../../providers/data-helper.module';
import { InputDesignPointsService } from '../design-points/design-points.service';

@Injectable({
  providedIn: 'root'
})
export class InputSectionForcesService  {

  public Mdatas: any[];
  public Vdatas: any[];

  constructor(private points: InputDesignPointsService) {
    this.clear();
  }
  public clear(): void {
    this.Mdatas = new Array();
    this.Vdatas = new Array();
  }


  private default_m_column(m_no: number, p_name_ex: string): any {

    const rows: any = { 'm_no': m_no, 'p_name_ex': p_name_ex, case: new Array() };
    for (let i = 0; i < 10; i++) {
      const tmp = {Md: null, Nd: null };
      rows['case'].push(tmp)
    }
    return rows;
  }

  private default_v_column(m_no: number, p_name_ex: string): any {

    const rows: any = { 'm_no': m_no, 'p_name_ex': p_name_ex, case: new Array() };
    for (let i = 0; i < 8; i++) {
      const tmp = {Vd: null, Md: null, Nd: null};
      rows['case'].push(tmp)
    }
    return rows;
  }

  public getMdtableColumns(row: number): any[] {
    
    const r = this.Mdatas.find( (item) => item.m_no === row );

    let result: any;

    // 対象データが無かった時に処理
    if (r !== undefined) {
      result = r;
      if(result.g_no === null){
        result.g_id = '';
      }
    } else {
      result = this.default_m_column(row);
      this.Mdatas.push(result);
    }
    return result;


    

    const old_Mdatas = this.Mdatas.slice(0, this.Mdatas.length);
    this.Mdatas = new Array();
    const pp = this.points.position_list;
    for (const p of this.points.position_list) {
      const p0 = p['positions'][0];
      let new_colum: any = old_Mdatas.find( (value) => {
        return value.m_no === p.m_no;
      });
      if (new_colum === undefined) {
        new_colum = this.default_v_column(p.m_no, p0.p_name_ex);
      }
      new_colum.p_name_ex = p0.p_name_ex;
      this.Mdatas.push(new_colum);
    }

    for (const data of this.save.force.getMdtableColumns()) {
      const column = { 'm_no': data['m_no'] };
      column['p_name_ex'] = data['p_name_ex'];
      const caseList: any[] = data['case'];
      for (let i = 0; i < caseList.length; i++) {
        column['case' + i + '_Md'] = caseList[i].Md;
        column['case' + i + '_Nd'] = caseList[i].Nd;
      }
      this.Mtable_datas.push(column);
    }



    return this.Mdatas;
  }

  public setMdtableColumns(Mtable_datas: any[]) {
    this.Mdatas = new Array();
    for (const data of Mtable_datas) {
      const new_colum = this.default_m_column(data.m_no, data.p_name_ex);
      for (let i = 0; i < new_colum['case'].length; i++) {
        new_colum['case'][i].Md = data['case' + i + '_Md'];
        new_colum['case'][i].Nd = data['case' + i + '_Nd'];
      }
      this.Mdatas.push(new_colum);
    }
  }

  public getVdtableColumns(): any[] {
    const old_Vdatas = this.Vdatas.slice(0, this.Vdatas.length);
    this.Vdatas = new Array();
    for (const p of this.points.position_list) {
      const p0 = p['positions'][0];
      let new_colum: any = old_Vdatas.find( (value) => {
        return value.m_no === p.m_no;
      });
      if (new_colum === undefined) {
        new_colum = this.default_m_column(p.m_no, p0.p_name_ex);
      }
      new_colum.p_name_ex = p0.p_name_ex;
      this.Vdatas.push(new_colum);
    }
    return this.Vdatas;
  }

  public setVdtableColumns(Vtable_datas: any[]) {
    this.Vdatas = new Array();
    for (const data of Vtable_datas) {
      const new_colum = this.default_v_column(data.m_no, data.p_name_ex);
      for (let i = 0; i < new_colum['case'].length; i++) {
        new_colum['case'][i].Vd = data['case' + i + '_Vd'];
        new_colum['case'][i].Md = data['case' + i + '_Md'];
        new_colum['case'][i].Nd = data['case' + i + '_Nd'];
      }
      this.Vdatas.push(new_colum);
    }
  }



}
