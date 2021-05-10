import { Injectable } from "@angular/core";
import { DataHelperModule } from "src/app/providers/data-helper.module";
import { InputDesignPointsService } from "../design-points/design-points.service";

@Injectable({
  providedIn: "root",
})
export class InputFatiguesService {

  public train_A_count: number; // A列車本数
  public train_B_count: number; // B列車本数
  public service_life: number; // 耐用年数
  public reference_count: number; // 200万回

  // 疲労情報
  private fatigue_list: any[];

  constructor(
    private helper: DataHelperModule,
    private points: InputDesignPointsService) {
    this.clear();
  }
  public clear(): void {
    this.train_A_count = null; // A列車本数
    this.train_B_count = null; // B列車本数
    this.service_life = null; // 耐用年数
    this.reference_count = 2000000;

    this.fatigue_list = new Array();
  }

  // 疲労情報
  private default_fatigue(id: number): any {
    return {
      m_no: null,
      index: id,
      g_name: null,
      p_name: null,
      b: null,
      h: null,
      title1: "上",
      M1: this.default_fatigue_coefficient(),
      V1: this.default_fatigue_coefficient(),
      title2: "下",
      M2: this.default_fatigue_coefficient(),
      V2: this.default_fatigue_coefficient(),
    };
  }

  private default_fatigue_coefficient(): any {
    return {
      SA: null,
      SB: null,
      NA06: null,
      NB06: null,
      NA12: null,
      NB12: null,
      A: null,
      B: null,
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
          data.m_no = member.m_no;
          data.b = member.B;
          data.h = member.H;
          data.position = pos.position;
          data.g_name = pos.g_name;
          data.p_name = pos.p_name;

          // データを2行に分ける
          const column1 = {};
          const column2 = {};
          column1["m_no"] = k === 0 ? data.m_no : ""; // 最初の行には 部材番号を表示する
          // 1行目
          column1["index"] = data.index;
          const a: number = this.helper.toNumber(data.position);
          column1["position"] = a === null ? "" : a.toFixed(3);
          column1['g_name'] = data['g_name'];
          column1['p_name'] = data['p_name'];


          column1['bh'] = data['b'];
          column1['design_point_id'] = data['title1'];

          column1['M_SA'] = data['M1'].SA;
          column1['M_SB'] = data['M1'].SB;
          column1['M_NA06'] = data['M1'].NA06;
          column1['M_NB06'] = data['M1'].NB06;
          column1['M_NA12'] = data['M1'].NA12;
          column1['M_NB12'] = data['M1'].NB12;
          column1['M_A'] = data['M1'].A;
          column1['M_B'] = data['M1'].B;

          column1['V_SA'] = data['V1'].SA;
          column1['V_SB'] = data['V1'].SB;
          column1['V_NA06'] = data['V1'].NA06;
          column1['V_NB06'] = data['V1'].NB06;
          column1['V_NA12'] = data['V1'].NA12;
          column1['V_NB12'] = data['V1'].NB12;
          column1['V_A'] = data['V1'].A;
          column1['V_B'] = data['V1'].B;

          table_groupe.push(column1);

          // 2行目
          column2['bh'] = data['h'];
          column2['design_point_id'] = data['title2'];

          column2['M_SA'] = data['M2'].SA;
          column2['M_SB'] = data['M2'].SB;
          column2['M_NA06'] = data['M2'].NA06;
          column2['M_NB06'] = data['M2'].NB06;
          column2['M_NA12'] = data['M2'].NA12;
          column2['M_NB12'] = data['M2'].NB12;
          column2['M_A'] = data['M2'].A;
          column2['M_B'] = data['M2'].B;

          column2['V_SA'] = data['V2'].SA;
          column2['V_SB'] = data['V2'].SB;
          column2['V_NA06'] = data['V2'].NA06;
          column2['V_NB06'] = data['V2'].NB06;
          column2['V_NA12'] = data['V2'].NA12;
          column2['V_NB12'] = data['V2'].NB12;
          column2['V_A'] = data['V2'].A;
          column2['V_B'] = data['V2'].B;
          table_groupe.push(column2);
        }
      }
      table_datas.push(table_groupe);
    }
    return table_datas;
  }

  private getTableColumn(index: any): any {
    let result = this.fatigue_list.find((value) => value.index === index);
    if (result === undefined) {
      result = this.default_fatigue(index);
      this.fatigue_list.push(result);
    }
    return result;
  }


  public setTableColumns(fatigues: any) {

    this.train_A_count - fatigues.train_A_count;
    this.train_B_count = fatigues.train_B_count;
    this.service_life = fatigues.service_life;

    this.fatigue_list = new Array();

    const table_datas = fatigues.table_datas;
    for (let i = 0; i < table_datas.length; i += 2) {
      const column1 = table_datas[i];
      const column2 = table_datas[i + 1];

      const f = this.default_fatigue(column1.index);
      f.g_name = column1.g_name;
      f.position = column1.position;
      f.m_no = column1.m_no;
      f.p_name = column1.p_name;
      f.b = column1.bh;
      f.h = column2.bh;

      f.title1 = column1.design_point_id;
      f['M1'].SA = column1.M_SA;
      f['M1'].SB = column1.M_SB;
      f['M1'].NA06 = column1.M_NA06;
      f['M1'].NB06 = column1.M_NB06;
      f['M1'].NA12 = column1.M_NA12;
      f['M1'].NB12 = column1.M_NB12;
      f['M1'].A = column1.M_A;
      f['M1'].B = column1.M_B;

      f['V1'].SA = column1.V_SA;
      f['V1'].SB = column1.V_SB;
      f['V1'].NA06 = column1.V_NA06;
      f['V1'].NB06 = column1.V_NB06;
      f['V1'].NA12 = column1.V_NA12;
      f['V1'].NB12 = column1.V_NB12;
      f['V1'].A = column1.V_A;
      f['V1'].B = column1.V_B;

      f.title2 = column2.design_point_id;
      f['M2'].SA = column2.M_SA;
      f['M2'].SB = column2.M_SB;
      f['M2'].NA06 = column2.M_NA06;
      f['M2'].NB06 = column2.M_NB06;
      f['M2'].NA12 = column2.M_NA12;
      f['M2'].NB12 = column2.M_NB12;
      f['M2'].A = column2.M_A;
      f['M2'].B = column2.M_B;

      f['V2'].SA = column2.V_SA;
      f['V2'].SB = column2.V_SB;
      f['V2'].NA06 = column2.V_NA06;
      f['V2'].NB06 = column2.V_NB06;
      f['V2'].NA12 = column2.V_NA12;
      f['V2'].NB12 = column2.V_NB12;
      f['V2'].A = column2.V_A;
      f['V2'].B = column2.V_B;

      this.fatigue_list.push(f);
    }

  }

  public setPickUpData() {

  }

  public getSaveData(): any {
    return {
      fatigue_list: this.fatigue_list,
      train_A_count: this.train_A_count,
      train_B_count: this.train_B_count,
      service_life: this.service_life
    }
  }

  public setSaveData(fatigues: any) {
    this.fatigue_list = fatigues.fatigue_list,
    this.train_A_count = fatigues.train_A_count,
    this.train_B_count = fatigues.train_B_count,
    this.service_life = fatigues.service_life
  }

  public getGroupeName(i: number): string {
    return this.points.getGroupeName(i);
  }

}
