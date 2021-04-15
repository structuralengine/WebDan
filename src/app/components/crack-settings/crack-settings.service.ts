import { Injectable } from "@angular/core";
import { DataHelperModule } from "src/app/providers/data-helper.module";
import { InputDesignPointsService } from "../design-points/design-points.service";

@Injectable({
  providedIn: "root",
})
export class InputCrackSettingsService {
  // 部材情報
  public crack_list: any[];

  constructor(private points: InputDesignPointsService) {
    this.clear();
  }
  public clear(): void {
    this.crack_list = new Array();
  }

  /// <summary>
  /// fatigues の
  /// g_id でグループ化した配列のデータを返す関数
  /// </summary>
  public getCrackColumns(): any[] {
    const result: any[] = new Array();

    const old_crack_list = this.crack_list.slice(0, this.crack_list.length);
    // this.fatigue_list = new Array();

    const design_points: any[] = this.points.getDesignPointColumns();

    for (const groupe of design_points) {
      const member_list = new Array();
      for (const members of groupe) {
        const position_list = {
          g_name: members.g_name,
          g_id: members.g_id,
          positions: new Array(),
        };
        for (const position of members["positions"]) {
          if (
            position["isMyCalc"] !== true &&
            position["isVyCalc"] !== true &&
            position["isMzCalc"] !== true &&
            position["isVzCalc"] !== true
          ) {
            continue;
          }
          let b = old_crack_list.find((value) => {
            return (
              value.m_no === members.m_no && value.p_name === position.p_name
            );
          });
          if (b === undefined) {
            b = this.default_crack(members.m_no, position.p_name);
          }
          b.index = position["index"];
          b.position = position["position"];
          b.p_name_ex = position["p_name_ex"];
          b.b = members["B"];
          b.h = members["H"];
          position_list["positions"].push(b);
        }
        member_list.push(position_list);
      }
      result.push(member_list);
    }
    return result;
  }

  public setCrackColumns(table_datas: any[][]) {}

  // 部材情報
  private default_crack(m_no: number, p_name: string): any {
    return {
      m_no: m_no,
      index: null,
      p_name: p_name,
      p_name_ex: null,
      b: null,
      h: null,
      title1: "上",
      con_u: null,
      con_s: null,
      vis_u: false,
      title2: "下",
      con_l: null,
      vis_l: false,
      ecsd: null,
      kr: null,
    };
  }
}
