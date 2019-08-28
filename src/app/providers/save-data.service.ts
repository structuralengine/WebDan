import { Injectable } from '@angular/core';
import { InputDataService } from './input-data.service';
import { InputBarsService } from '../components/bars/input-bars.service';
import { InputBasicInformationService } from '../components/basic-information/input-basic-information.service';
import { InputDesignPointsService } from '../components/design-points/input-design-points.service';
import { InputFatiguesService } from '../components/fatigues/input-fatigues.service';
import { InputMembersService } from '../components/members/input-members.service';
import { InputSafetyFactorsMaterialStrengthsService } from '../components/safety-factors-material-strengths/input-safety-factors-material-strengths.service';
import { InputSectionForcesService } from '../components/section-forces/input-section-forces.service';
import { InputCalclationPrintService } from '../components/calculation-print/input-calclation-print.service';

@Injectable({
  providedIn: 'root'
})
export class SaveDataService extends InputDataService {

  constructor(
    public bars: InputBarsService,
    public basic: InputBasicInformationService,
    public points: InputDesignPointsService,
    public fatigues: InputFatiguesService,
    public members: InputMembersService,
    public safety: InputSafetyFactorsMaterialStrengthsService,
    public force: InputSectionForcesService,
    public calc: InputCalclationPrintService
  ) {
    super();
  }

  public clear(): void {
    this.pickup_filename = '';
    this.basic.clear();
    this.members.clear();
    this.points.clear();
    this.bars.clear();
    this.fatigues.clear();
    this.safety.clear();
  }

  // ピックアップファイルを読み込む
  public readPickUpData(str: string, filename: string) {

    try {

      const tmp = str.split('\n'); // 改行を区切り文字として行を要素とした配列を生成
      // 各行ごとにカンマで区切った文字列を要素とした二次元配列を生成
      const pickup_data = {};
      let index: number = 0;
      for (let i = 1; i < tmp.length; ++i) {
        const line = tmp[i];
        if (line.trim().length === 0) { continue; }
        const pickUpNo: string = 'pickUpNo:' + line.slice(0, 5).trim();
        const mark: string = line.slice(5, 10).trim();
        const memberNo: number = this.toNumber(line.slice(10, 15));
        const maxPickupCase: string = line.slice(15, 20).trim();
        const minPickupCase: string = line.slice(20, 25).trim();
        const p_name: string = line.slice(25, 30).trim();
        const position: number = this.toNumber(line.slice(30, 40));
        const maxMd: number = this.toNumber(line.slice(40, 50));
        const maxVd: number = this.toNumber(line.slice(50, 60));
        const maxNd: number = -1 * this.toNumber(line.slice(60, 70)); // このソフトでは 圧縮がプラス(+)
        const minMd: number = this.toNumber(line.slice(70, 80));
        const minVd: number = this.toNumber(line.slice(80, 90));
        const minNd: number = -1 * this.toNumber(line.slice(90, 100)); // このソフトでは 圧縮がプラス(+)
        index += 1;

        if (pickUpNo in pickup_data === false) {
          pickup_data[pickUpNo] = new Array();
          index = 1;
        }

        let m = pickup_data[pickUpNo].find(function (value) {
          return value.memberNo === memberNo;
        });
        if (m === undefined) {
          m = { memberNo: memberNo, positions: [] };
          pickup_data[pickUpNo].push(m);
        }

        let p = m['positions'].find(function (value) {
          return value.p_name === p_name;
        });
        if (p === undefined) {
          p = { p_name: p_name, index: index, position: position };
          m['positions'].push(p);
        }

        if (mark in p === false) {
          p[mark] = {};
        }
        p[mark]['max'] = { 'Md': maxMd, 'Vd': maxVd, 'Nd': maxNd, 'comb': maxPickupCase };
        p[mark]['min'] = { 'Md': minMd, 'Vd': minVd, 'Nd': minNd, 'comb': minPickupCase };
      }

      this.members.setPickUpData(pickup_data);
      this.points.setPickUpData(pickup_data);
      this.force.clear();

      this.pickup_filename = filename;
      this.pickup_data = pickup_data;

    } catch {
      this.pickup_filename = '';
      this.pickup_data = {};
    }

  }

  // ファイルに保存用データを生成
  public getInputText(): string {
    const jsonData = {};
    jsonData['pickup_filename'] = this.pickup_filename;
    jsonData['pickup_data'] = this.pickup_data;
    jsonData['pickup_moment_no'] = this.basic.pickup_moment_no;
    jsonData['pickup_shear_force_no'] = this.basic.pickup_shear_force_no;
    jsonData['specification1_selected'] = this.basic.specification1_selected; // 適用 に関する変数
    jsonData['specification2_selected'] = this.basic.specification2_selected; // 仕様 に関する変数
    jsonData['conditions_list'] = this.basic.conditions_list;                 // 設計条件
    jsonData['member_list'] = this.members.member_list;                         // 部材情報
    jsonData['position_list'] = this.points.position_list;                     // 着目点情報
    jsonData['bar_list'] = this.bars.bar_list;                               // 鉄筋情報
    jsonData['fatigue_list'] = this.fatigues.fatigue_list;                       // 疲労情報
    jsonData['train_A_count'] = this.fatigues.train_A_count;
    jsonData['train_B_count'] = this.fatigues.train_B_count;
    jsonData['service_life'] = this.fatigues.service_life;
    jsonData['fatigue_reference_count'] = this.fatigues.reference_count;
    jsonData['safety_factor_material_strengths'] = this.safety.safety_factor_material_strengths_list;                     // 安全係数情報
    jsonData['manual_moment_force'] = this.force.Mdatas;
    jsonData['manual_shear_force'] = this.force.Vdatas;
    jsonData['print_selected'] = this.calc.print_selected;

    // string 型にする
    const result: string = JSON.stringify(jsonData);
    return result;
  }

  public readInputData(inputText: string) {
    this.clear();
    const jsonData: {} = JSON.parse(inputText);

    this.pickup_filename = jsonData['pickup_filename'];
    this.pickup_data = jsonData['pickup_data'];
    this.basic.pickup_moment_no = jsonData['pickup_moment_no'];
    this.basic.pickup_shear_force_no = jsonData['pickup_shear_force_no'];
    this.basic.specification1_selected = jsonData['specification1_selected']; // 適用 に関する変数
    this.basic.specification2_selected = jsonData['specification2_selected']; // 仕様 に関する変数
    this.basic.conditions_list = jsonData['conditions_list'];                 // 設計条件
    this.members.member_list = jsonData['member_list'];                         // 部材情報
    this.points.position_list = jsonData['position_list'];                     // 着目点情報
    this.bars.bar_list = jsonData['bar_list'];                               // 鉄筋情報
    this.fatigues.fatigue_list = jsonData['fatigue_list'];                       // 疲労情報
    this.fatigues.train_A_count = ('train_A_count' in jsonData) ? jsonData['train_A_count'] : null;
    this.fatigues.train_B_count = ('train_B_count' in jsonData) ? jsonData['train_B_count'] : null;
    this.fatigues.service_life = ('service_life' in jsonData) ? jsonData['service_life'] : null;
    this.fatigues.reference_count = ('fatigue_reference_count' in jsonData) ? jsonData['fatigue_reference_count'] : null;
    this.safety.safety_factor_material_strengths_list = jsonData['safety_factor_material_strengths'];                     // 安全係数情報
    this.force.Mdatas = jsonData['manual_moment_force'];
    this.force.Vdatas = jsonData['manual_shear_force'];
    this.calc.print_selected = jsonData['print_selected'];
  }


  public getCalcrateText(mode: string = 'file', Properties = {}): string {
    return 'aa';
  }

}
