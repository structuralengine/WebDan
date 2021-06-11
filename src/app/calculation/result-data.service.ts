import { SaveDataService } from "../providers/save-data.service";

import { Injectable } from "@angular/core";
import { DataHelperModule } from "../providers/data-helper.module";

@Injectable({
  providedIn: "root",
})
export class ResultDataService {
  constructor(
    private helper: DataHelperModule
  ) {}

  // 表題の共通した行
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
    let title3: string = '';
    if(side === '上側引張'){
      title3 = position.title[0].toString() + '引張';
    } else {
      title3 = position.title[1].toString() + '引張';
    }

    return {
      m_no: title1,
      p_name: title2,
      side: title3,
    };
  }

  // value が null なら center 寄せ の -
  public alien(value: any, alien: string = "right"): any {
    let result: object;
    if (value === null) {
      result = { alien: "center", value: "-" };
    } else {
      result = { alien, value };
    }
    return result;
  }

  // 整数なら Fixed(0), 少数なら dim で指定した少数で丸める
  public numStr(dst: number, dim: number = 2): string{

    if ( dst === null ){ 
      return null;
    }

    return dst.toFixed(Number.isInteger(dst)? 0 : dim )
  }

}
