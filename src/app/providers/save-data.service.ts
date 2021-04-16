import { Injectable } from "@angular/core";
import { DataHelperModule } from "./data-helper.module";
import { InputBarsService } from "../components/bars/bars.service";
import { InputBasicInformationService } from "../components/basic-information/basic-information.service";
import { InputDesignPointsService } from "../components/design-points/design-points.service";
import { InputFatiguesService } from "../components/fatigues/fatigues.service";
import { InputMembersService } from "../components/members/members.service";
import { InputSafetyFactorsMaterialStrengthsService } from "../components/safety-factors-material-strengths/safety-factors-material-strengths.service";
import { InputSectionForcesService } from "../components/section-forces/section-forces.service";
import { InputCalclationPrintService } from "../components/calculation-print/calclation-print.service";
import { InputCrackSettingsService } from "../components/crack-settings/crack-settings.service";
import { InputSteelsService } from "../components/steels/steels.service";

@Injectable({
  providedIn: "root",
})
export class SaveDataService {
  // ピックアップファイル
  public pickup_filename: string;
  public pickup_data: Object;
  //={
  //  1:[
  //    { index: 1, memberNo, p_name, position,
  //      M:{max:{ Mtd, Mdy, Mdz, Vdy, Vdz, Nd, comb },
  //         min:{ Mtd, Mdy, Mdz, Vdy, Vdz, Nd, comb }},
  //      S:{max:{ Mtd, Mdy, Mdz, Vdy, Vdz, Nd, comb },
  //         min:{ Mtd, Mdy, Mdz, Vdy, Vdz, Nd, comb }},
  //      N:{max:{ Mtd, Mdy, Mdz, Vdy, Vdz, Nd, comb },
  //         min:{ Mtd, Mdy, Mdz, Vdy, Vdz, Nd, comb }},
  //    },
  //    { index: 2, memberNo, ...
  //  ],
  //  2:[
  //    ...
  // }

  constructor(
    public helper: DataHelperModule,
    public bars: InputBarsService,
    public steel: InputSteelsService,
    public basic: InputBasicInformationService,
    public points: InputDesignPointsService,
    public crack: InputCrackSettingsService,
    public fatigues: InputFatiguesService,
    public members: InputMembersService,
    public safety: InputSafetyFactorsMaterialStrengthsService,
    public force: InputSectionForcesService,
    public calc: InputCalclationPrintService
  ) {
    this.clear();
  }

  public clear(): void {
    this.pickup_filename = "";
    this.pickup_data = {};
    this.basic.clear();
    this.members.clear();
    this.crack.clear();
    this.points.clear();
    this.bars.clear();
    this.fatigues.clear();
    this.safety.clear();
  }

  // 断面力て入力モードかどうか判定する
  public isManual(): boolean {
    if (this.pickup_filename.trim().length === 0) {
      return true;
    } else {
      return false;
    }
  }

  // 3次元解析のピックアップデータかどうか判定する
  public is3DPickUp(): boolean {
    if (this.helper.getExt(this.pickup_filename) === "csv") {
      return true;
    }
    return false;
  }

  // ピックアップファイルを読み込む
  public readPickUpData(str: string, filename: string) {
    try {
      const tmp = str.split("\n"); // 改行を区切り文字として行を要素とした配列を生成
      // 各行ごとにカンマで区切った文字列を要素とした二次元配列を生成
      const pickup1 = {};
      let index: number = 1;

      for (let i = 1; i < tmp.length; ++i) {
        const line = tmp[i];
        if (line.trim().length === 0) {
          continue;
        }

        let data: any;
        switch (this.helper.getExt(filename)) {
          case "pik":
            data = this.pikFileRead(line); // 2次元（平面）解析のピックアップデータ
            break;
          case "csv":
            data = this.csvFileRead(line); // 3次元（立体）解析のピックアップデータ
            break;
          default:
            this.pickup_filename = "";
            this.pickup_data = {};
            return;
        }

        if (data.pickUpNo in pickup1 === false) {
          pickup1[data.pickUpNo] = new Array();
        }
        const pickup2 = pickup1[data.pickUpNo];

        let pickup3 = pickup2.find((v)=>v.index===index);
        if (pickup3===undefined) {
          pickup3 = { index, memberNo: data.memberNo, p_name: data.p_name, position: data.position };
          pickup2.push(pickup3);
        }

        if (data.mark in pickup3 === false) {
          pickup3[data.mark] = {max: {}, min: {}};
          pickup3.index = 1;
          index = 1;
        }
        const pickup4 = pickup3[data.mark];

        pickup4.max = {
          Mtd: data.maxMdx,
          Mdy: data.maxMdy,
          Mdz: data.maxMdz,
          Vdy: data.maxVdy,
          Vdz: data.maxVdz,
          Nd: data.maxNd,
          comb: data.maxPickupCase,
        };

        pickup4.min = {
          Mtd: data.minMdx,
          Mdy: data.minMdy,
          Mdz: data.minMdz,
          Vdy: data.minVdy,
          Vdz: data.minVdz,
          Nd: data.minNd,
          comb: data.minPickupCase,
        };

        index += 1;
      }

      this.basic.setPickUpData(this.isManual());
      this.members.setPickUpData(pickup1, this.isManual());
      this.points.setPickUpData(pickup1);
      this.force.clear();

      this.pickup_filename = filename;
      this.pickup_data = pickup1;
    } catch {
      this.pickup_filename = "";
      this.pickup_data = {};
    }
  }

  // .pik 形式のファイルを 1行読む
  private pikFileRead(line: string): any {
    const mark: string = line.slice(5, 10).trim();
    let ma: string = mark;
    switch (mark) {
      case "M":
        ma = "my";
        break;
      case "S":
        ma = "fy";
        break;
      case "N":
        ma = "fx";
        break;
    }

    return {
      pickUpNo: "pickUpNo:" + line.slice(0, 5).trim(),
      mark: ma,
      memberNo: this.helper.toNumber(line.slice(10, 15)),
      maxPickupCase: line.slice(15, 20).trim(),
      minPickupCase: line.slice(20, 25).trim(),
      p_name: line.slice(25, 30).trim(),
      position: this.helper.toNumber(line.slice(30, 40)),
      maxMdx: 0,
      maxMdy: this.helper.toNumber(line.slice(40, 50)),
      maxMdz: 0,
      maxVdy: this.helper.toNumber(line.slice(50, 60)),
      maxVdz: 0,
      maxNd: -1 * this.helper.toNumber(line.slice(60, 70)),
      minMdx: 0,
      minMdy: this.helper.toNumber(line.slice(70, 80)),
      minMdz: 0,
      minVdy: this.helper.toNumber(line.slice(80, 90)),
      minVdz: 0,
      minNd: -1 * this.helper.toNumber(line.slice(90, 100)),
    };
    // ※ このソフトでは 圧縮がプラス(+)
  }

  // .csv 形式のファイルを 1行読む
  private csvFileRead(tmp: string): any {
    const line = tmp.split(",");
    return {
      pickUpNo: "pickUpNo:" + line[0].trim(),
      mark: line[1].trim(),
      memberNo: line[2].trim(),
      maxPickupCase: line[3].trim(),
      minPickupCase: line[4].trim(),
      p_name: line[5].trim(),
      position: this.helper.toNumber(line[6]),
      maxNd: -1 * this.helper.toNumber(line[7]),
      maxVdy: this.helper.toNumber(line[8]),
      maxVdz: this.helper.toNumber(line[9]),
      maxMdx: this.helper.toNumber(line[10]),
      maxMdy: this.helper.toNumber(line[11]),
      maxMdz: this.helper.toNumber(line[12]),
      minNd: -1 * this.helper.toNumber(line[13]),
      minVdy: this.helper.toNumber(line[14]),
      minVdz: this.helper.toNumber(line[15]),
      minMdx: this.helper.toNumber(line[16]),
      minMdy: this.helper.toNumber(line[17]),
      minMdz: this.helper.toNumber(line[18]),
    };
    // ※ このソフトでは 圧縮がプラス(+)
  }

  // ファイルに保存用データを生成
  public getInputText(): string {
    const jsonData = {};

    // ピックアップ断面力
    jsonData["pickup_filename"] = this.pickup_filename;
    jsonData["pickup_data"] = this.pickup_data;

    // 設計条件
    jsonData["pickup_moment_no"] = this.basic.pickup_moment_no; // ピックアップ番号 曲げモーメント
    jsonData["pickup_shear_force_no"] = this.basic.pickup_shear_force_no; // ピックアップ番号 せん断力
    jsonData["specification1_selected"] = this.basic.specification1_selected; // 適用 に関する変数
    jsonData["specification2_selected"] = this.basic.specification2_selected; // 仕様 に関する変数
    jsonData["conditions_list"] = this.basic.conditions_list; // 設計条件

    // 部材情報
    jsonData["member_list"] = this.members.member_list;

    // ひび割れ情報
    jsonData["crack_list"] = this.crack.crack_list;

    // 着目点情報
    jsonData["position_list"] = this.points.position_list;

    // 鉄筋情報
    jsonData["bar_list"] = this.bars.bar_list;

    // 疲労情報
    jsonData["fatigue_list"] = this.fatigues.fatigue_list;
    jsonData["train_A_count"] = this.fatigues.train_A_count;
    jsonData["train_B_count"] = this.fatigues.train_B_count;
    jsonData["service_life"] = this.fatigues.service_life;
    jsonData["fatigue_reference_count"] = this.fatigues.reference_count;

    // 安全係数情報
    jsonData[
      "safety_factor_material_strengths"
    ] = this.safety.safety_factor_material_strengths_list;

    // 断面力手入力情報
    jsonData["manual_moment_force"] = this.force.moment_force;
    jsonData["manual_shear_force"] = this.force.shear_force;

    // 計算印刷設定
    jsonData["print_selected"] = this.calc.print_selected;

    // string 型にする
    const result: string = JSON.stringify(jsonData);
    return result;
  }

  // インプットデータを読み込む
  public readInputData(inputText: string) {
    const jsonData: {} = JSON.parse(inputText);
    this.setInputData(jsonData);
  }
  public setInputData(jsonData: any) {
    this.clear();

    // ピックアップ断面力
    this.pickup_filename = jsonData["pickup_filename"];
    this.pickup_data = jsonData["pickup_data"];

    // 設計条件
    this.basic.pickup_moment_no = jsonData["pickup_moment_no"]; // ピックアップ番号 曲げモーメント
    this.basic.pickup_shear_force_no = jsonData["pickup_shear_force_no"]; // ピックアップ番号 せん断力
    this.basic.specification1_selected = jsonData["specification1_selected"]; // 適用 に関する変数
    this.basic.specification2_selected = jsonData["specification2_selected"]; // 仕様 に関する変数
    this.basic.conditions_list = jsonData["conditions_list"]; // 設計条件

    // 部材情報
    this.members.member_list = jsonData["member_list"];
    // 着目点情報
    this.points.position_list = jsonData["position_list"];

    // ひび割れ情報
    if ("crack_list" in jsonData) {
      this.crack.crack_list = jsonData["crack_list"];
    } else {
      this.crack.clear();
    }

    // 鉄筋情報
    this.bars.bar_list = jsonData["bar_list"];

    // 疲労情報
    this.fatigues.fatigue_list = jsonData["fatigue_list"];
    this.fatigues.train_A_count =
      "train_A_count" in jsonData ? jsonData["train_A_count"] : null;
    this.fatigues.train_B_count =
      "train_B_count" in jsonData ? jsonData["train_B_count"] : null;
    this.fatigues.service_life =
      "service_life" in jsonData ? jsonData["service_life"] : null;
    this.fatigues.reference_count =
      "fatigue_reference_count" in jsonData
        ? jsonData["fatigue_reference_count"]
        : null;

    // 安全係数情報
    this.safety.safety_factor_material_strengths_list =
      jsonData["safety_factor_material_strengths"];

    // 断面力手入力情報
    this.force.moment_force = jsonData["manual_moment_force"];
    this.force.shear_force = jsonData["manual_shear_force"];

    // 計算印刷設定
    this.calc.print_selected = jsonData["print_selected"];
  }

  // 鉄筋の断面積
  public getAs(strAs: string): number {
    let result: number = 0;
    if (strAs.indexOf("φ") >= 0) {
      const fai: number = this.helper.toNumber(strAs.replace("φ", ""));
      if (fai === null) {
        return 0;
      }
      result = (fai ** 2 * Math.PI) / 4;
    } else if (strAs.indexOf("R") >= 0) {
      const fai: number = this.helper.toNumber(strAs.replace("R", ""));
      if (fai === null) {
        return 0;
      }
      result = (fai ** 2 * Math.PI) / 4;
    } else if (strAs.indexOf("D") >= 0) {
      const fai: number = this.helper.toNumber(strAs.replace("D", ""));
      if (fai === null) {
        return 0;
      }
      let reverInfo = this.helper.rebar_List.find((value) => {
        return value.D === fai;
      });
      if (reverInfo === undefined) {
        return 0;
      }
      result = reverInfo.As;
    } else {
      result = this.helper.toNumber(strAs);
      if (result === null) {
        return 0;
      }
    }
    return result;
  }

  // グループ別 部材情報{m_no, m_len, g_no, g_id, g_name, shape, B, H, Bt, t} の配列
  public getGroupeList(): any[] {

    const id_list: string[] = new Array();
    for (const m of this.members.member_list) {

      if (!('g_id' in m) || m.g_id === undefined || m.g_id === null || m.g_id.trim().length === 0) {
        continue;
      }

      if (id_list.find((value)=>value===m.g_id) === undefined) {
        id_list.push(m.g_id);
      }
    }

    // グループ番号順に並べる
    id_list.sort();

    // グループ番号を持つ部材のリストを返す
    const result = new Array();
    for (const id of id_list) {
      // グループ番号を持つ部材のリスト
      const members: any[] = this.members.member_list.filter( (item, index) => {
        if (item.g_id === id) { return item; }
      });
      result.push(members);
    }
    return result;
  }

}
