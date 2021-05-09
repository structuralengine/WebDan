import { newArray } from "@angular/compiler/src/util";
import { Injectable } from "@angular/core";
import { DataHelperModule } from "src/app/providers/data-helper.module";
import { InputDesignPointsService } from "../design-points/design-points.service";

@Injectable({
  providedIn: "root",
})
export class InputCrackSettingsService {


  // 部材情報
  public crack_list: any[];

  constructor(
    private points: InputDesignPointsService) {
    this.clear();
  }
  public clear(): void {
    this.crack_list = new Array();
  }

  // ひび割れ情報
  private default_crack(id: number): any {
    return {
      index: id,
      m_no: null,
      p_name: null,
      p_name_ex: null,
      con_u: null,
      con_l: null,
      con_s: null,
      vis_u: false,
      vis_l: false,
      ecsd: null,
      kr: null,
    };
  }

  public getTableColumns(): any[] {

    const table_datas: any[] = new Array();

    // グリッド用データの作成
    const groupe_list = this.points.getGroupeList();
    for (let i = 0; i < groupe_list.length; i++) {
      const table_groupe = [];
      // 部材
      for (const member of groupe_list[i]) {
        // 着目点
        for (let k = 0; k < member.positions.length; k++) {
          const pos = member.positions[k];
          if (!this.points.isEnable(pos)) {
            continue;
          }
          // barデータに（部材、着目点など）足りない情報を追加する
          const data: any = this.getTableColumn(pos.index);
          data.m_no = (k === 0) ? member.m_no: ''; // 最初の行には 部材番号を表示する
          data.b = member.B;
          data.h = member.H;
          data.position = pos.position;
          data.p_name = pos.p_name;
          data.p_name_ex = pos.p_name_ex;

          table_groupe.push(data);
        }
      }
      table_datas.push(table_groupe);
    }
    return table_datas;
  }

  private getTableColumn(index: any): any {

    let result = this.crack_list.find((value) => value.index === index);
    if (result === undefined) {
      result = this.default_crack(index);
      this.crack_list.push(result);
    }
    return result;
  }

  public setTableColumns(table_datas: any[]) {

    this.crack_list = new Array();

    for (const column of table_datas) {
      const b = this.default_crack(column.index);
      b.m_no =      column.m_no;   
      b.p_name =    column.p_name;  
      b.p_name_ex = column.p_name_ex;
      b.con_u =     column.con_u;   
      b.con_l =     column.con_l;   
      b.con_s =     column.con_s;   
      b.vis_u =     column.vis_u;   
      b.vis_l =     column.vis_l;   
      b.ecsd =      column.ecsd;    
      b.kr =        column.kr;      
      this.crack_list.push(b);
    }
  }

  public setPickUpData() {

  }
  
  public getSaveData(): any[] {
    return this.crack_list;
  }

  public setSaveData(crack: any) {
    this.crack_list = crack;
  }

  public getGroupeName(i: number): string {
    return this.points.getGroupeName(i);
  }

}
