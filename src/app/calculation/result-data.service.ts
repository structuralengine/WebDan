import { SaveDataService } from "../providers/save-data.service";

import { Injectable } from "@angular/core";
import { DataHelperModule } from "../providers/data-helper.module";
import { SetSectionService } from "./set-section.service";
import { SetBarService } from "./set-bar.service";

@Injectable({
  providedIn: "root",
})
export class ResultDataService {
  constructor(
    private section: SetSectionService,
    private steel: SetBarService,
    private helper: DataHelperModule
  ) {}

  public getTitleString(member: any, position: any, side: string): any {
    // 照査表における タイトル１行目を取得
    let strPos = "";
    if (this.helper.toNumber(position.position) !== null) {
      strPos = position.position.toFixed(3);
    }
    const m_no: string = member.m_no.toFixed(0);
    let title1: string = m_no + "部材";
    if (member.m_len > 0) {
      title1 += "(" + strPos + ")";
    }

    // 照査表における タイトル２行目を取得
    const title2: string = position.p_name; // + side;

    // 照査表における タイトル３行目を取得
    const title3: string = side;

    return {
      m_no: title1,
      p_name: title2,
      side: title3,
    };
  }

  public alien(value: any, alien: string = "right"): any {
    let result: object;
    if (value === null) {
      result = { alien: "center", value: "-" };
    } else {
      result = { alien, value };
    }
    return result;
  }

  public numStr(dst: number, dim: number = 2): string{

    if ( dst === null ){ 
      return null;
    }

    return dst.toFixed(Number.isInteger(dst)? 0 : dim )
  }

}
