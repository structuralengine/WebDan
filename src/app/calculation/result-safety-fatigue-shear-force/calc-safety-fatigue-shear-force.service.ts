import { SaveDataService } from '../../providers/save-data.service';
import { SetDesignForceService } from '../set-design-force.service';
import { ResultDataService } from '../result-data.service';
import { SetPostDataService } from '../set-post-data.service';
import { CalcSafetyShearForceService } from '../result-safety-shear-force/calc-safety-shear-force.service';
import { SetFatigueService } from '../set-fatigue.service';

import { Injectable, ViewChild } from '@angular/core';
import { DataHelperModule } from 'src/app/providers/data-helper.module';
import { InputFatiguesService } from 'src/app/components/fatigues/fatigues.service';

@Injectable({
  providedIn: 'root'
})

export class CalcSafetyFatigueShearForceService {
  // 安全性（疲労破壊）せん断力
  public DesignForceList: any[];  // 永久+変動作用
  public DesignForceList3: any[]; // 永久作用
  public isEnable: boolean;

  constructor(
    private save: SaveDataService,
    private helper: DataHelperModule,
    private force: SetDesignForceService,
    private post: SetPostDataService,
    private result: ResultDataService,
    private base: CalcSafetyShearForceService,
    private fatigue: SetFatigueService,
    private fatigues: InputFatiguesService) {
    this.DesignForceList = null;
    this.DesignForceList3 = null;
    this.isEnable = false;
  }

  // 列車本数を返す関数
  public getTrainCount(): number[] {
    const result = new Array(2);
    let jA = 0;
    if ('train_A_count' in this.save.fatigues) {
      jA = this.helper.toNumber(this.save.fatigues.train_A_count);
      if (jA === null) { jA = 0; }
    }
    let jB = 0;
    if ('train_B_count' in this.save.fatigues) {
      jB = this.helper.toNumber(this.save.fatigues.train_B_count);
      if (jB === null) { jB = 0; }
    }
    result[0] = jA;
    result[1] = jB;
    return result;
  }

  // 設計断面力の集計
  // ピックアップファイルを用いた場合はピックアップテーブル表のデータを返す
  // 手入力モード（this.save.isManual === true）の場合は空の配列を返す
  public setDesignForces(): void {

    this.isEnable = false;

    this.DesignForceList = new Array();

    // せん断力が計算対象でない場合は処理を抜ける
    if (this.calc.print_selected.calculate_shear_force === false) {
      return;
    }

    // 列車本数の入力がない場合は処理を抜ける
    if (this.helper.toNumber(this.save.fatigues.train_A_count) === null &&
      this.helper.toNumber(this.save.fatigues.train_B_count) === null) {
      return;
    }

    // 最小応力
    this.DesignForceList3 = this.force.getDesignForceList('Vd', this.basic.pickup_shear_force_no[3]);
    // 最大応力
    this.DesignForceList = this.force.getDesignForceList('Vd', this.basic.pickup_shear_force_no[4]);

    // 変動応力
    const DesignForceList2 = this.getLiveload(this.DesignForceList3, this.DesignForceList);

    if (this.DesignForceList.length < 1) {
      return;
    }

    // サーバーに送信するデータを作成
    this.post.setPostData([this.DesignForceList, this.DesignForceList3, DesignForceList2], 'Vd');

  }

  // サーバー POST用データを生成する
  public setInputData(): any {

    if (this.DesignForceList.length < 1) {
      return null;
    }

    // POST 用
    const postData = this.post.setInputData(this.DesignForceList, 1, 'Vd', '耐力', 1);
    return postData;
  }

  // 変動荷重を
  private getLiveload(minDesignForceList: any[], maxDesignForceList: any[]): any[] {

    const result = JSON.parse(
      JSON.stringify({
        temp: minDesignForceList
      })
    ).temp;

    for (let ig = 0; ig < maxDesignForceList.length; ig++) {
      const groupe = maxDesignForceList[ig];
      for (let im = 0; im < groupe.length; im++) {
        const member = groupe[im];

        for (let ip = member.positions.length - 1; ip >= 0; ip--) {

          const position = member.positions[ip];
          if (position === undefined) {
            console.log('着目点が存在しない');
            continue;
          }
          // position に 疲労係数入れる
          this.fatigue.setFatigueData(member.g_id, member.m_no, position);

          // もし疲労係数がなかったら削除する
          let flg = false;
          if (position.fatigueData !== null) {
            for (const key of Object.keys(position.fatigueData.V1)) {
              if (this.helper.toNumber(position.fatigueData.V1[key]) !== null) {
                flg = true;
                break;
              }
            }
            if (flg === false) {
              for (const key of Object.keys(position.fatigueData.V2)) {
                if (this.helper.toNumber(position.fatigueData.V2[key]) !== null) {
                  flg = true;
                  break;
                }
              }
            }
          }
          if (flg === false) {
            member.positions.splice(ip, 1); // 削除する
            continue;
          }

          // 最大応力 - 最小応力 で変動荷重を求める
          const maxForce: any = position.designForce;
          const minForce: any = result[ig][im].positions[ip].designForce;
          for (let i = 0; i < maxForce.length; i++) {
            for (const key1 of Object.keys(maxForce[i])) {
              if (key1 === 'n') { continue; }

              // 最大<=>最小 反対の断面力 も探査対象にする
              let key2: string;
              if (key1.indexOf('max') >= 0) {
                key2 = key1.replace('max', 'min');
              } else {
                key2 = key1.replace('min', 'max');
              }
              const force0 = maxForce[i][key1];
              const force1 =  minForce[i][key1];
              const force2 =  minForce[i][key2];

              // 最小と最大 差が大きい方を変動作用とする
              let Vd0: number = force0.Vd;
              let Vd1: number = force1.Vd * Math.sign(Vd0);
              let Vd2: number = force2.Vd * Math.sign(Vd0);
              Vd0 = Math.abs(Vd0);

              // 最小の方が大きい場合は、比較対象から除外する
              if ( Vd0 < Vd1) {
                Vd1 = Vd0;
              }
              if ( Vd0 < Vd2) {
                Vd2 = Vd0;
              }

              let targetMinForce: object;
              if ( Vd0 - Vd1 > Vd0 - Vd2 ) {
                targetMinForce = force1;
              } else {
                // 反対のキーを持つ最小応力が採用された場合
                targetMinForce = force2;
                minForce[i][key1] = minForce[i][key2]; // 反対のキーに断面力をコピーする
              }

              // 最大 - 最小 断面力の計算
              for (const key3 of Object.keys(maxForce[i][key1])) {
                if (key3 === 'comb') { continue; }
                maxForce[i][key1][key3] -= targetMinForce[key3];
              }
            }
          }
        }
      }
    }
    return result;
  }

  // 出力テーブル用の配列にセット
  public setSafetyFatiguePages(postData: any): any[] {
    const result: any[] = new Array();
    let page: any;
    let groupeName: string;
    let i = 0;
    const title = '安全性（疲労破壊）せん断力の照査結果';

    for (const groupe of postData) {
      groupeName = groupe[0].g_name;
      page = { caption: title, g_name: groupeName, columns: new Array() };

      for (const member of groupe) {
        for (const position of member.positions) {
          for (let j = 0; j < position.PostData0.length; j++) {

            // 最小応力
            const postdata0 = position.PostData1[j];
            // 変動応力
            const postdata1 = position.PostData0[j];

            // 印刷用データ
            const PrintData = position.PrintData[j];

            if (page.columns.length > 4) {
              result.push(page);
              page = { caption: title, g_name: groupeName, columns: new Array() };
            }

            const column: any[] = new Array();


            /////////////// まず計算 ///////////////

            const resultFatigue: any = this.calcFatigue(PrintData, postdata0, postdata1, position);

            const resultColumn: any = this.getResultString(resultFatigue);

            /////////////// タイトル ///////////////
            column.push(this.result.getTitleString1(member, position));
            column.push(this.result.getTitleString2(position, postdata0));
            column.push(this.result.getTitleString3(position, postdata0));

            ///////////////// 形状 /////////////////
            column.push(this.base.getShapeString_B(PrintData));
            column.push(this.base.getShapeString_H(PrintData));
            column.push(resultColumn.tan);
            /////////////// 引張鉄筋 ///////////////
            column.push(resultColumn.As);
            column.push(resultColumn.AsString);
            column.push(resultColumn.dst);
            /////////////// コンクリート情報 ///////////////
            const fck: any = this.result.getFckString(PrintData);
            column.push(fck.fck);
            column.push(fck.rc);
            column.push(fck.fcd);
            /////////////// 鉄筋強度情報 ///////////////
            const fsk: any = this.result.getFskString(PrintData);
            column.push(fsk.fsy);
            column.push(fsk.rs);
            column.push(fsk.fsd);
            column.push(resultColumn.fwud);
            /////////////// 帯鉄筋情報 ///////////////
            column.push(resultColumn.AwString);
            column.push(resultColumn.fwyd);
            column.push(resultColumn.deg);
            column.push(resultColumn.Ss);
            /////////////// 断面力 ///////////////
            column.push(resultColumn.Vpd);
            column.push(resultColumn.Mpd);
            column.push(resultColumn.Npd);

            column.push(resultColumn.Vrd);
            column.push(resultColumn.Mrd);
            column.push(resultColumn.Nrd);

            column.push(resultColumn.fvcd);
            column.push(resultColumn.rbc);
            column.push(resultColumn.Vcd);

            column.push(resultColumn.kr);

            column.push(resultColumn.sigma_min);
            column.push(resultColumn.sigma_rd);
            column.push(resultColumn.sigma_rd);

            column.push(resultColumn.fsr200);
            column.push(resultColumn.ratio200);

            column.push(resultColumn.k);
            column.push(resultColumn.ar);
            column.push(resultColumn.N);

            column.push(resultColumn.NA);
            column.push(resultColumn.NB);

            column.push(resultColumn.SASC);
            column.push(resultColumn.SBSC);

            column.push(resultColumn.r1);
            column.push(resultColumn.r2);

            column.push(resultColumn.rs);
            column.push(resultColumn.frd);

            column.push(resultColumn.rbs);
            column.push(resultColumn.ri);
            column.push(resultColumn.ratio);
            column.push(resultColumn.result);

            page.columns.push(column);
            i++;
          }
        }
      }
      if (page.columns.length > 0) {
        result.push(page);
      }
    }
    return result;
  }

  public calcFatigue(PrintData: any, postdata0: any, postdata1: any, position: any): any {

    if ('La' in PrintData) { delete PrintData.La; } // Vcd を計算するので La は削除する
    if ('Nd' in PrintData) { PrintData.Nd = 0; }    // 疲労の Vcd を計算する時は βn=1
    const resultData = { M: { Mi: 0 } };
    const result: any = this.base.calcVmu(PrintData, resultData, position);

    // 最小応力
    let Vpd: number;
    if ('Vd' in postdata1) {
      Vpd = this.helper.toNumber(postdata0.Vd);
      if (Vpd === null) { return result; }
    } else {
      return result;
    }
    result.Vpd = Vpd;

    let Mpd: number;
    if ('Md' in PrintData) {
      Mpd = this.helper.toNumber(PrintData.Md);
      if (Mpd !== null) {
        result['Mpd'] = Mpd;
      }
    }

    let Npd: number;
    if ('Nd' in postdata0) {
      Npd = this.helper.toNumber(postdata0.Nd);
      if (Npd !== null) {
        result['Npd'] = Npd;
      }
    }
    // 変動応力
    let Vrd: number;
    if ('Vd' in postdata1) {
      Vrd = this.helper.toNumber(postdata1.Vd);
      if (Vrd === null) { return result; }
    } else {
      return result;
    }
    result['Vrd'] = Vrd;

    let Mrd: number;
    if ('Md' in postdata1) {
      Mrd = this.helper.toNumber(postdata1.Md);
      if (Mrd !== null) {
        result['Mrd'] = Mrd;
      }
    }

    let Nrd: number;
    if ('Nd' in postdata1) {
      Nrd = this.helper.toNumber(postdata1.Nd);
      if (Nrd !== null) {
        result['Nrd'] = Nrd;
      }
    }

    // せん断補強鉄筋の設計応力度
    let kr: number = this.helper.toNumber(position.memberInfo.kr);
    if (kr === null) { kr = 0.5; }
    result['kr'] = kr;

    // スターラップの永久応力度
    const tmpWrd1: number = Vpd + Vrd - kr * result.Vcd;
    const tmpWrd2: number = (result.Aw * result.z) / result.Ss;
    const tmpWrd3: number = Vpd + result.Vcd;
    const tmpWrd4: number = Vpd + Vrd + result.Vcd;
    let sigma_min: number = (tmpWrd1 / tmpWrd2) * (tmpWrd3 / tmpWrd4);
    if (sigma_min === null) { return result; }
    sigma_min = sigma_min * 1000;
    result['sigma_min'] = sigma_min;

    // スターラップの変動応力度
    let sigma_rd: number = (tmpWrd1 / tmpWrd2) * (Vrd / tmpWrd4);
    if (sigma_rd === null) { return result; }
    sigma_rd = sigma_rd * 1000;
    result['sigma_rd'] = sigma_rd;

    // f200 の計算
    let rs = 1.05;
    if ('rs' in PrintData) {
      rs = this.helper.toNumber(PrintData.rs);
      if (rs === null) { rs = 1; }
    }
    result['rs'] = rs;

    let k = 0.12;

    let fai: number;
    if ('AW-φ' in PrintData) {
      fai = this.helper.toNumber(PrintData['AW-φ']);
      if (fai === null) { return result; }
    } else {
      return result;
    }

    let fwud: number;
    if ('fwud' in PrintData) {
      fwud = this.helper.toNumber(PrintData.fwud);
      if (fwud === null) { return result; }
    } else {
      return result;
    }
    result['fwud'] = fwud;

    let r1 = 1;
    if ('r1_2' in position.memberInfo) {
      r1 = this.helper.toNumber(position.memberInfo.r1_2);
      if (r1 === null) { r1 = 1; }
    }
    result['r1'] = r1;

    let ar: number = 3.09 - 0.003 * fai;

    let reference_count: number = this.helper.toNumber(this.save.fatigues.reference_count);
    if (reference_count === null) {
      reference_count = 2000000;
    }
    const tmp201: number = Math.pow(10, ar) / Math.pow(reference_count, k);
    const tmp202: number = 1 - sigma_min / fwud;
    const fsr200: number = r1 * tmp201 * tmp202 / rs;
    result['fsr200'] = fsr200;

    let ri = 1;
    if ('ri' in PrintData) {
      ri = this.helper.toNumber(PrintData.ri);
      if (ri === null) { ri = 1; }
    }
    result['ri'] = ri;

    let rb = 1;
    if ('rb' in position.safety_factor) {
      rb = this.helper.toNumber(position.safety_factor.rb);
      if (rb === null) { rb = 1; }
    }

    const ratio200: number = ri * sigma_rd / (fsr200 / rb);
    result['ratio200'] = ratio200;

    if (ratio200 < 1) {
      k = 0.06;
      ar = 2.71 - 0.003 * fai;
    } else {
      k = 0.12;
      ar = 3.09 - 0.003 * fai;
    }
    result['k']  = k;
    result['ar']  = ar;

    // 標準列車荷重観山の総等価繰返し回数 N の計算
    let T: number = this.helper.toNumber(this.fatigues.service_life);
    if (T === null) { return result; }

    const j = this.getTrainCount();
    const jA = j[0];
    const jB = j[1];

    let inputFatigue: any;
    switch (PrintData.memo) {
      case '上側引張':
        inputFatigue = position.fatigueData.V1;
        break;
      case '下側引張':
        inputFatigue = position.fatigueData.V2;
        break;
    }
    let SASC: number = this.helper.toNumber(inputFatigue.SA);
    if (SASC === null) {
      SASC = 1;
    } else {
      result['SASC'] = SASC;
    }
    let SBSC: number = this.helper.toNumber(inputFatigue.SB);
    if (SBSC === null) {
      SBSC = 1;
    } else {
      result['SBSC'] = SBSC;
    }
    let a: number = this.helper.toNumber(inputFatigue.A);
    if (a === null) {
      a = 1;
    } else {
      result['a'] = a;
    }
    let b: number = this.helper.toNumber(inputFatigue.B);
    if (b === null) {
      b = 1;
    } else {
      result['b'] = b;
    }
    let NA = 0;
    let NB = 0;
    if (k === 0.06) {
      NA = this.helper.toNumber(inputFatigue.NA06);
      NB = this.helper.toNumber(inputFatigue.NB06);
    } else {
      NA = this.helper.toNumber(inputFatigue.NA12);
      NB = this.helper.toNumber(inputFatigue.NB12);
    }
    if (NA === null) {
      NA = 0;
    } else {
      result['NA'] = NA;
    }
    if (NB === null) {
      NB = 0;
    } else {
      result['NB'] = NB;
    }

    const tmpN1: number = 365 * T * jA * NA * Math.pow(SASC, 1 / k);
    const tmpN2: number = 365 * T * jB * NB * Math.pow(SBSC, 1 / k);
    const N: number = tmpN1 + tmpN2;
    result['N'] = Math.ceil(N / 100) * 100;

    // frd の計算
    const tmpR21: number = Math.pow(a, 1 / k);
    const tmpR22: number = Math.pow(1 - a, 1 / k);
    const tmpR23: number = (tmpR21 + tmpR22) * ((1 - b) + b);
    const r2: number = Math.pow(1 / tmpR23, k);
    result['r2'] = r2;

    const tmpfrd1: number = Math.pow(10, ar) / Math.pow(N, k);
    const tmpfrd2: number = 1 - sigma_min / fwud;
    const frd: number = r1 * r2 * tmpfrd1 * tmpfrd2 / rs;
    result['frd'] = frd;

    if (ratio200 < 1 && N <= reference_count) {
      return result;
    }
    const ratio: number = ri * sigma_rd / (frd / rb);
    result['ratio'] = ratio;

    return result;

  }

  private getResultString(re: any): any {

    const result = {
      tan: { alien: 'center', value: '-' },

      As: { alien: 'center', value: '-' },
      AsString: { alien: 'center', value: '-' },
      dst: { alien: 'center', value: '-' },

      fwud: { alien: 'center', value: '-' },
      Aw: { alien: 'center', value: '-' },
      AwString: { alien: 'center', value: '-' },
      fwyd: { alien: 'center', value: '-' },
      deg: { alien: 'center', value: '-' },
      Ss: { alien: 'center', value: '-' },

      Vpd: { alien: 'center', value: '-' },
      Mpd: { alien: 'center', value: '-' },
      Npd: { alien: 'center', value: '-' },

      Vrd: { alien: 'center', value: '-' },
      Mrd: { alien: 'center', value: '-' },
      Nrd: { alien: 'center', value: '-' },

      fvcd: { alien: 'center', value: '-' },
      rbc: { alien: 'center', value: '-' },
      Vcd: { alien: 'center', value: '-' },

      kr: { alien: 'center', value: '-' },

      sigma_min: { alien: 'center', value: '-' },
      sigma_rd: { alien: 'center', value: '-' },

      fsr200: { alien: 'center', value: '-' },
      ratio200: { alien: 'center', value: '-' },

      k: { alien: 'center', value: '-' },
      ar: { alien: 'center', value: '-' },
      N: { alien: 'center', value: '-' },

      NA: { alien: 'center', value: '-' },
      NB: { alien: 'center', value: '-' },

      SASC: { alien: 'center', value: '-' },
      SBSC: { alien: 'center', value: '-' },

      r1: { alien: 'center', value: '-' },
      r2: { alien: 'center', value: '-' },

      rs: { alien: 'center', value: '-' },
      frd: { alien: 'center', value: '-' },

      rbs: { alien: 'center', value: '-' },
      ri: { alien: 'center', value: '-' },
      ratio: { alien: 'center', value: '-' },
      result: { alien: 'center', value: '-' }
    };

    if ('tan' in re) {
      result.tan = { alien: 'right', value: re.tan.toFixed(1) };
    }

    // 引張鉄筋
    if ('Ast' in re) {
      result.As = { alien: 'right', value: re.Ast.toFixed(1) };
    }
    if ('AstString' in re) {
      result.AsString = { alien: 'right', value: re.AstString };
    }
    if ('d' in re) {
      result.dst = { alien: 'right', value: (re.H - re.d).toFixed(1) };
    }

    // 帯鉄筋
    if ('fwud' in re) {
      result.fwud = { alien: 'right', value: re.fwud.toFixed(0) };
    }
    if ('Aw' in re) {
      result.Aw = { alien: 'right', value: re.Aw.toFixed(1) };
    }
    if ('AwString' in re) {
      result.AwString = { alien: 'right', value: re.AwString };
    }
    if ('fwyd' in re) {
      result.fwyd = { alien: 'right', value: re.fwyd.toFixed(0) };
    }
    if ('deg' in re) {
      result.deg = { alien: 'right', value: re.deg.toFixed(0) };
    }
    if ('Ss' in re) {
      result.Ss = { alien: 'right', value: re.Ss.toFixed(0) };
    }

    // 断面力
    if ('Vpd' in re) {
      result.Vpd = { alien: 'right', value: re.Vpd.toFixed(1) };
    }
    if ('Mpd' in re) {
      result.Mpd = { alien: 'right', value: re.Mpd.toFixed(1) };
    }
    if ('Npd' in re) {
      result.Npd = { alien: 'right', value: re.Npd.toFixed(1) };
    }

    if ('Vrd' in re) {
      result.Vrd = { alien: 'right', value: re.Vrd.toFixed(1) };
    }
    if ('Mrd' in re) {
      result.Mrd = { alien: 'right', value: re.Mrd.toFixed(1) };
    }
    if ('Nrd' in re) {
      result.Nrd = { alien: 'right', value: re.Nrd.toFixed(1) };
    }

    // 耐力
    if ('fvcd' in re) {
      result.fvcd = { alien: 'right', value: re.fvcd.toFixed(3) };
    }
    if ('rbc' in re) {
      result.rbc = { alien: 'right', value: re.rbc.toFixed(2) };
    }
    if ('Vcd' in re) {
      result.Vcd = { alien: 'right', value: re.Vcd.toFixed(1) };
    }
    if ('kr' in re) {
      result.kr = { alien: 'right', value: re.kr.toFixed(1) };
    }

    if ('sigma_min' in re) {
      result.sigma_min = { alien: 'right', value: re.sigma_min.toFixed(2) };
    }
    if ('sigma_rd' in re) {
      result.sigma_rd = { alien: 'right', value: re.sigma_rd.toFixed(2) };
    }


    if ('fsr200' in re) {
      result.fsr200 = { alien: 'right', value: re.fsr200.toFixed(2) };
    }
    if ('ratio200' in re) {
      result.ratio200.value = re.ratio200.toFixed(3);
    }

    if ('k' in re) {
      result.k = { alien: 'right', value: re.k.toFixed(2) };
    }
    if ('ar' in re) {
      result.ar = { alien: 'right', value: re.ar.toFixed(3) };
    }
    if ('N' in re) {
      result.N = { alien: 'right', value: re.N.toFixed(0) };
    }

    if ('NA' in re) {
      result.NA = { alien: 'right', value: re.NA.toFixed(2) };
    }
    if ('NB' in re) {
      result.NB = { alien: 'right', value: re.NB.toFixed(2) };
    }
    if ('SASC' in re) {
      result.SASC = { alien: 'right', value: re.SASC.toFixed(3) };
    }
    if ('SBSC' in re) {
      result.SBSC = { alien: 'right', value: re.SBSC.toFixed(3) };
    }
    if ('r1' in re) {
      result.r1 = { alien: 'right', value: re.r1.toFixed(2) };
    }
    if ('r2' in re) {
      result.r2 = { alien: 'right', value: re.r2.toFixed(3) };
    }
    if ('rs' in re) {
      result.rs = { alien: 'right', value: re.rs.toFixed(2) };
    }
    if ('frd' in re) {
      result.frd = { alien: 'right', value: re.frd.toFixed(2) };
    }
    if ('rbs' in re) {
      result.rbs = { alien: 'right', value: re.rbs.toFixed(2) };
    }
    if ('ri' in re) {
      result.ri = { alien: 'right', value: re.ri.toFixed(2) };
    }
    let ratio = 0;
    if ('ratio' in re) {
      result.ratio.value = re.ratio.toFixed(3);
      ratio = re.ratio;
    }
    if (ratio < 1) {
      result.result.value = 'OK';
    } else {
      result.result.value = 'NG';
    }

    return result;
  }

}
