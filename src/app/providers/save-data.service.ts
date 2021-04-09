import { Injectable } from "@angular/core";
import { InputDataService } from "./input-data.service";
import { InputBarsService } from "../components/bars/bars.service";
import { InputBasicInformationService } from "../components/basic-information/basic-information.service";
import { InputDesignPointsService } from "../components/design-points/design-points.service";
import { InputFatiguesService } from "../components/fatigues/fatigues.service";
import { InputMembersService } from "../components/members/members.service";
import { InputSafetyFactorsMaterialStrengthsService } from "../components/safety-factors-material-strengths/safety-factors-material-strengths.service";
import { InputSectionForcesService } from "../components/section-forces/input-section-forces.service";
import { InputCalclationPrintService } from "../components/calculation-print/calclation-print.service";
import { InputCrackSettingsService } from "../components/crack-settings/crack-settings.service";

import * as Encord from 'encoding-japanese';

@Injectable({
  providedIn: "root",
})
export class SaveDataService extends InputDataService {
  constructor(
    public bars: InputBarsService,
    public basic: InputBasicInformationService,
    public points: InputDesignPointsService,
    public crack: InputCrackSettingsService,
    public fatigues: InputFatiguesService,
    public members: InputMembersService,
    public safety: InputSafetyFactorsMaterialStrengthsService,
    public force: InputSectionForcesService,
    public calc: InputCalclationPrintService
  ) {
    super();
  }

  public clear(): void {
    this.pickup_filename = "";
    this.basic.clear();
    this.members.clear();
    this.crack.clear();
    this.points.clear();
    this.bars.clear();
    this.fatigues.clear();
    this.safety.clear();
  }

  // ピックアップファイルを読み込む
  public readPickUpData(str: string, filename: string) {
    try {
      const tmp = str.split("\n"); // 改行を区切り文字として行を要素とした配列を生成
      // 各行ごとにカンマで区切った文字列を要素とした二次元配列を生成
      const pickup_data = {};
      let index: number = 0;
      for (let i = 1; i < tmp.length; ++i) {
        const line = tmp[i];
        if (line.trim().length === 0) {
          continue;
        }

        let data: any;
        switch (this.getExt(filename)) {
          case "pik":
            data = this.pikFileRead(line);
            break;
          case "csv":
            data = this.csvFileRead(line);
            break;
          default:
            this.pickup_filename = "";
            this.pickup_data = {};
            return;
        }

        index += 1;

        if (data.pickUpNo in pickup_data === false) {
          pickup_data[data.pickUpNo] = new Array();
          index = 1;
        }

        let m = pickup_data[data.pickUpNo].find((value) => {
          return value.memberNo === data.memberNo;
        });
        if (m === undefined) {
          m = { memberNo: data.memberNo, positions: [] };
          pickup_data[data.pickUpNo].push(m);
        }

        let p = m["positions"].find((value) => {
          return value.p_name === data.p_name;
        });
        if (p === undefined) {
          p = {
            p_name: data.p_name,
            index: index,
            position: data.position,
          };
          m["positions"].push(p);
        }

        if (data.mark in p === false) {
          p[data.mark] = {};
        }

        p[data.mark]["max"] = {
          Mtd: data.maxMdx,
          Mdy: data.maxMdy,
          Mdz: data.maxMdz,
          Vdy: data.maxVdy,
          Vdz: data.maxVdz,
          Nd: data.maxNd,
          comb: data.maxPickupCase,
        };

        p[data.mark]["min"] = {
          Mtd: data.minMdx,
          Mdy: data.minMdy,
          Mdz: data.minMdz,
          Vdy: data.minVdy,
          Vdz: data.minVdz,
          Nd: data.minNd,
          comb: data.minPickupCase,
        };
      }

      this.basic.setPickUpData(this.isManual());
      this.members.setPickUpData(pickup_data, this.isManual());
      this.points.setPickUpData(pickup_data);
      this.force.clear();

      this.pickup_filename = filename;
      this.pickup_data = pickup_data;
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
      memberNo: this.toNumber(line.slice(10, 15)),
      maxPickupCase: line.slice(15, 20).trim(),
      minPickupCase: line.slice(20, 25).trim(),
      p_name: line.slice(25, 30).trim(),
      position: this.toNumber(line.slice(30, 40)),
      maxMdx: 0,
      maxMdy: this.toNumber(line.slice(40, 50)),
      maxMdz: 0,
      maxVdy: this.toNumber(line.slice(50, 60)),
      maxVdz: 0,
      maxNd: -1 * this.toNumber(line.slice(60, 70)),
      minMdx: 0,
      minMdy: this.toNumber(line.slice(70, 80)),
      minMdz: 0,
      minVdy: this.toNumber(line.slice(80, 90)),
      minVdz: 0,
      minNd: -1 * this.toNumber(line.slice(90, 100)),
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
      position: this.toNumber(line[6]),
      maxNd: -1 * this.toNumber(line[7]),
      maxVdy: this.toNumber(line[8]),
      maxVdz: this.toNumber(line[9]),
      maxMdx: this.toNumber(line[10]),
      maxMdy: this.toNumber(line[11]),
      maxMdz: this.toNumber(line[12]),
      minNd: -1 * this.toNumber(line[13]),
      minVdy: this.toNumber(line[14]),
      minVdz: this.toNumber(line[15]),
      minMdx: this.toNumber(line[16]),
      minMdy: this.toNumber(line[17]),
      minMdz: this.toNumber(line[18]),
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
    jsonData["manual_moment_force"] = this.force.Mdatas;
    jsonData["manual_shear_force"] = this.force.Vdatas;

    // 計算印刷設定
    jsonData["print_selected"] = this.calc.print_selected;

    // string 型にする
    const result: string = JSON.stringify(jsonData);
    return result;
  }

  public readInputData(inputText: string) {
    this.clear();
    const jsonData: {} = JSON.parse(inputText);

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

    // ひび割れ情報
    if ("crack_list" in jsonData) {
      this.crack.crack_list = jsonData["crack_list"];
    } else {
      this.crack.clear();
    }

    // 着目点情報
    this.points.position_list = jsonData["position_list"];

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
    this.force.Mdatas = jsonData["manual_moment_force"];
    this.force.Vdatas = jsonData["manual_shear_force"];

    // 計算印刷設定
    this.calc.print_selected = jsonData["print_selected"];
  }

  // 鉄筋の断面積
  public getAs(strAs: string): number {
    let result: number = 0;
    if (strAs.indexOf("φ") >= 0) {
      const fai: number = this.toNumber(strAs.replace("φ", ""));
      if (fai === null) {
        return 0;
      }
      result = (fai ** 2 * Math.PI) / 4;
    } else if (strAs.indexOf("R") >= 0) {
      const fai: number = this.toNumber(strAs.replace("R", ""));
      if (fai === null) {
        return 0;
      }
      result = (fai ** 2 * Math.PI) / 4;
    } else if (strAs.indexOf("D") >= 0) {
      const fai: number = this.toNumber(strAs.replace("D", ""));
      if (fai === null) {
        return 0;
      }
      let reverInfo = this.rebar_List.find((value) => {
        return value.D === fai;
      });
      if (reverInfo === undefined) {
        return 0;
      }
      result = reverInfo.As;
    } else {
      result = this.toNumber(strAs);
      if (result === null) {
        return 0;
      }
    }
    return result;
  }

  //////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////
  // DSD データを読み込む
  public readDsdData(arrayBuffer: ArrayBuffer) {

    const buff: any = {
      u8array: new Uint8Array(arrayBuffer),
      byteOffset: 0
    };
    
    const obj = this.IsDSDFile(buff);
    buff['datVersID'] = obj.datVersID;
    buff['isManualInput'] = (obj.isManualInput > 0);
    
    // 断面力手入力モード
    if( buff.isManualInput ){
      this.FrmManualGetTEdata(buff, obj.isManualInput);
    }

  }

  private FrmManualGetTEdata(buff: any, NumManualDt: number): void {

    const isOlder316 = this.isOlder('3.1.7', buff.datVersID);
    const isOlder324 = this.isOlder('3.2.4', buff.datVersID);
    const isOlder327 = this.isOlder('3.2.7', buff.datVersID);
    const isOlder328 = this.isOlder('3.2.8', buff.datVersID);
    let strfix10: string;
    let strfix32: string;

    for(let i = 0; i < NumManualDt; i++){
      strfix10 = this.readString(buff, 10);
      strfix32 = this.readString(buff, 32);
      strfix32 = this.readString(buff, 32);

      let sHAND_MageDAN: number;
      for(let j = 0; j <= 10; j++){
        sHAND_MageDAN = this.readSingle(buff);
        sHAND_MageDAN = this.readSingle(buff);
      }
      let sHAND_SenDAN: number;
      for(let j = 0; j <= 7; j++){
        sHAND_SenDAN = this.readSingle(buff);
        sHAND_SenDAN = this.readSingle(buff);
        
      }
    }

  }

  private IsDSDFile(buff: any): any {
    // バージョンを調べる
    const strfix32 = this.readString(buff, 32);
    const strT: string[] = strfix32.replace("WINDAN", "").trim().split(" ");
    return {
      datVersID: strT[0],
      isManualInput: this.toNumber(strT[1])
    };
  }

  private readString(buff: any, length: number): string {
    let str: string = '';
    while(str.length < length){
      const s = Encord.convert(
        String.fromCharCode.apply( "", buff.u8array.slice(0, 2)), 'unicode', 'sjis');
      if(str.length + s.length > length) {
        // 文字数が超えたら
        str += Encord.convert(
          String.fromCharCode.apply( "", buff.u8array.slice(0, 1)), 'unicode', 'sjis');
        buff.u8array = buff.u8array.slice(1);
        break;
      }
      str += s;
      buff.u8array = buff.u8array.slice(2);
    }
    return str;
  }

  private readSingle(buff: any): number {
    const length: number = 4;
    const data =  buff.u8array.slice(0, length);
    const b  = data.buffer;
    const view = new DataView(b);
    const num = view.getFloat32(0);
    buff.u8array = buff.u8array.slice(length);
    return num;
  }

  // バージョン文字列比較処理
  private isOlder(a: string, b: string): boolean {
    if (a === b) return false;
    const aUnits = a.split(".");
    const bUnits = b.split(".");
    // 探索幅に従ってユニット毎に比較していく
    for (var i = 0; i < Math.min(aUnits.length, bUnits.length); i++) {
      if (parseInt(aUnits[i]) > parseInt(bUnits[i])) return true; // A > B
      if (parseInt(aUnits[i]) < parseInt(bUnits[i])) return false;  // A < B
    }
    return false;
  }

}
