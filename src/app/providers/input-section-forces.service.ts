import { Injectable } from '@angular/core';
import { InputDataService } from './input-data.service';
import { InputDesignPointsService } from './input-design-points.service';

@Injectable({
  providedIn: 'root'
})
export class InputSectionForcesService extends InputDataService {

  public Mdatas: any[];
  public Vdatas: any[];
  
  constructor(private points: InputDesignPointsService) {
    super();
    this.clear();
  }
  public clear(): void {
    this.Mdatas = new Array();
    this.Vdatas = new Array();
  }


  private default_m_column(m_no: number, p_name_ex: string ): any {
    
    const rows: any = { 'm_no': m_no, 'p_name_ex': p_name_ex, case: new Array() };
    for ( let i = 0; i < 10; i++ ){
      const keyMd: string = 'case' + i + '_Md';
      const keyNd: string = 'case' + i + '_Nd';
      const tmp = { keyMd: null, keyNd: null };
      if ( i === 7){
        tmp['Nmax'] = null;
      }
      rows['case'].push(tmp)
    }
    return rows;
  }

  private default_v_column(m_no: number, p_name_ex: string ): any {
    
    const rows: any = { 'm_no': m_no, 'p_name_ex': p_name_ex, case: new Array() };
    for ( let i = 0; i < 8; i++ ){
      const keyVd: string = 'case' + i + '_Vd';
      const keyMd: string = 'case' + i + '_Md';
      const keyNd: string = 'case' + i + '_Nd';
      const tmp = { keyVd: null, keyMd: null, keyNd: null };
      rows['case'].push(tmp)
    }
    return rows;
  }

  public getMdtableColumns(): any[] {
    const old_Mdatas = this.Mdatas.slice(0, this.Mdatas.length);
    this.Mdatas = new Array();
    const pp = this.points.position_list;
    for ( const p of this.points.position_list) {
      const p0 = p['positions'][0];
      let new_colum: any  = old_Mdatas.find(function (value) {
        return value.m_no === p.m_no;
      });
      if (new_colum === undefined) {
        new_colum = this.default_v_column(p.m_no, p0.p_name_ex );
      }
      new_colum.p_name_ex = p0.p_name_ex;
      this.Mdatas.push(new_colum);
    }
    return this.Mdatas;
  }

  setMdtableColumns(Mtable_datas: any[]){
    this.Mdatas = new Array();
    for (const data of Mtable_datas){
      const new_colum = this.default_m_column(data.m_no, data.p_name_ex );
      for( let i = 0; i < new_colum['case'].length; i++ ){
        const keyMd: string = 'case' + i + '_Md';
        const keyNd: string = 'case' + i + '_Nd';
        new_colum['case'][i].Md = data[keyMd];
        new_colum['case'][i].Nd = data[keyNd];
        if ('Nmax' in new_colum['case'][i]) {
          const keyNmax: string = 'case' + i + '_Nmax';
          new_colum['case'][i].Nmax = data[keyNmax];
        }
      }
      this.Mdatas.push(new_colum);
    }
  }

  public getVdtableColumns(): any[] {
    const old_Vdatas = this.Vdatas.slice(0, this.Vdatas.length);
    this.Vdatas = new Array();
    for ( const p of this.points.position_list) {
      const p0 = p['positions'][0];
      let new_colum: any  = old_Vdatas.find(function (value) {
        return value.m_no === p.m_no;
      });
      if (new_colum === undefined) {
        new_colum = this.default_m_column(p.m_no, p0.p_name_ex );
      }
      new_colum.p_name_ex = p0.p_name_ex;
      this.Vdatas.push(new_colum);
    }
    return this.Vdatas;
  }
  setVdtableColumns(Vtable_datas: any[]){
    this.Vdatas = new Array();
    for (const data of Vtable_datas){
      const new_colum = this.default_v_column(data.m_no, data.p_name_ex );
      for( let i = 0; i < new_colum['case'].length; i++ ){
        const keyVd: string = 'case' + i + '_Vd';
        const keyMd: string = 'case' + i + '_Md';
        const keyNd: string = 'case' + i + '_Nd';
        new_colum['case'][i].Vd = data[keyVd];
        new_colum['case'][i].Md = data[keyMd];
        new_colum['case'][i].Nd = data[keyNd];
      }
      this.Vdatas.push(new_colum);
    }
  }

}
