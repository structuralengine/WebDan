import { Component, OnInit } from '@angular/core';
import { InputSafetyFactorsMaterialStrengthsService } from './input-safety-factors-material-strengths.service'
import { InputMembersService } from '../members/input-members.service';

@Component({
  selector: 'app-safety-factors-material-strengths',
  templateUrl: './safety-factors-material-strengths.component.html',
  styleUrls: ['./safety-factors-material-strengths.component.scss']
})
export class SafetyFactorsMaterialStrengthsComponent implements OnInit {

  groupe_list: any[];
  safety_factors_table_datas: any[][];
  bar_strength_table_datas: any[][];
  steel_strength_table_datas: any[][];
  concrete_strength_table_datas: any[][];
  pile_factor_list: any[];
  pile_factor_selected: string[];
  isSRC: boolean[]; // SRC部材 があるかどうか

  safety_factors_table_settings = {
    beforeChange: (source, changes1, changes2) => {
      try {
        const changes = (Array.isArray(changes1)) ? changes1 : changes2;
        for (let i = 0; i < changes.length; i++) {
          switch (changes[i][1]) {
            case 'range':
              const value: number = this.input.toNumber(changes[i][3]);
              if (value === null) {
                changes[i][3] = changes[i][2]; // 入力も元に戻す
              } else {
                switch (value) {
                  case 1:
                    changes[i][3] = "引張鉄筋";
                    break;
                  case 2:
                    changes[i][3] = "引張＋圧縮";
                    break;
                  case 3:
                    changes[i][3] = "全周鉄筋";
                    break;
                  default:
                    changes[i][3] = changes[i][2]; // 入力も元に戻す
                }
              }
              break;
            default:
            //何もしない
          }

        }

      } catch (e) {
        console.log(e);
      }
    }
  };

  bar_strength_table_settings = {
    beforeChange: (source, changes1, changes2) => {
      try {
        const changes = (Array.isArray(changes1)) ? changes1 : changes2;
        for (let i = 0; i < changes.length; i++) {
          if (changes[i][0] === 0) // split
          {
            let value: string = changes[i][3].replace('D', '');
            value = value.replace('以上', '');
            value = value.replace('以下', '');
            if (this.input.toNumber(value) === null) {
              changes[i][3] = changes[i][2]; // 入力も元に戻す
              return;
            }
            switch (changes[i][1]) {
              case 'fsy1':
                const next_fsy2 = this.input.getNextRebar(value);
                if (next_fsy2 !== undefined) {
                  source.setDataAtCell(changes[i][0], 2, 'D' + next_fsy2.D + '以上')
                  changes[i][3] = 'D' + value + '以下';
                }
                break;
              case 'fsy2':
                const next_fsy1 = this.input.getPreviousRebar(value);
                if (next_fsy1 !== undefined) {
                  source.setDataAtCell(changes[i][0], 1, 'D' + next_fsy1.D + '以下')
                  changes[i][3] = 'D' + value + '以上';
                }
                break;
              case 'fsu1':
                const next_fsu2 = this.input.getNextRebar(value);
                if (next_fsu2 !== undefined) {
                  source.setDataAtCell(changes[i][0], 4, 'D' + next_fsu2.D + '以上')
                  changes[i][3] = 'D' + value + '以下';
                }
                break;
              case 'fsu2':
                const next_fsu1 = this.input.getPreviousRebar(value);
                if (next_fsu1 !== undefined) {
                  source.setDataAtCell(changes[i][0], 3, 'D' + next_fsu1.D + '以下')
                  changes[i][3] = 'D' + value + '以上';
                }
                break;

              default:
              //何もしない
            }
          } else {
            const value: number = this.input.toNumber(changes[i][3]);
            if (value === null) {
              changes[i][3] = changes[i][2];
            } else {
              changes[i][3] = value;
            }
          }

          switch (changes[i][1]) {
            case 'range':
              const value: number = this.input.toNumber(changes[i][3]);
              if (value === null) {
                changes[i][3] = changes[i][2]; // 入力も元に戻す
              } else {
                switch (value) {
                  case 1:
                    changes[i][3] = "引張鉄筋";
                    break;
                  case 2:
                    changes[i][3] = "引張＋圧縮";
                    break;
                  case 3:
                    changes[i][3] = "全周鉄筋";
                    break;
                  default:
                    changes[i][3] = changes[i][2]; // 入力も元に戻す
                }
              }
              break;
            default:
            //何もしない
          }

        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  steel_strength_table_settings = {
    beforeChange: (source, changes) => { }
  };

  concrete_strength_table_settings = {
    beforeChange: (source, changes) => { }
  };

  constructor(private input: InputSafetyFactorsMaterialStrengthsService,
    private member: InputMembersService) {
  }

  /////////////////////////////////////////////////////////////////////////////////////
  // 保存データを処理する関数
  ngOnInit() {

    // 仕様によるタイトルの初期化
    this.input.initSpecificationTitles();

    // グループリストを取得
    this.groupe_list = this.input.getGroupeList();
    const srcCount = this.member.getSRC();

    // 配列を作成
    this.safety_factors_table_datas = new Array();    // 安全係数
    this.bar_strength_table_datas = new Array();    // 鉄筋材料
    this.steel_strength_table_datas = new Array();    // 鉄骨材料
    this.concrete_strength_table_datas = new Array(); // コンクリート材料
    this.pile_factor_list = new Array();              // 杭の施工条件
    this.pile_factor_selected = new Array();
    this.isSRC = new Array();

    // 入力項目を作成
    for (let i = 0; i < this.groupe_list.length; i++) {

      const g = this.groupe_list[i];

      const data = this.input.getTableColumns(g[0].g_no);

      // 安全係数
      const safety: any[] = data['safety_factor'];
      const title: string[] = data['safety_factor_title'];
      this.safety_factors_table_datas.push(
        this.set_safety_factors_table_datas(safety, title)
      );

      // 鉄筋材料
      this.bar_strength_table_datas[i] = new Array();
      const bar = data['material_bar'];
      // セパレータ
      this.bar_strength_table_datas[i].push(
        this.set_bar_strength_table_split(bar[0])
      );
      const bar_table_titles: string[] = ['', '軸方向鉄筋', '側方向鉄筋', 'スターラップ', '折曲げ鉄筋'];
      for (let j = 1; j < bar.length; j++) {
        this.bar_strength_table_datas[i].push(
          this.set_bar_strength_table_column(bar[j], bar_table_titles[j])
        );
      }

      // 鉄骨材料
      this.steel_strength_table_datas[i] = new Array();
      const steel = data['material_steel'];
      // セパレータ
      this.steel_strength_table_datas[i].push(
        this.set_steel_strength_table_split(steel[0])
      );
      const steel_table_titles: string[] = ['', '降伏強度', 'せん断強度', '引張強度'];
      for (let j = 1; j < steel.length; j++) {
        this.steel_strength_table_datas[i].push(
          this.set_steel_strength_table_column(steel[j], steel_table_titles[j])
        );
      }

      // コンクリート材料
      this.concrete_strength_table_datas[i] = new Array();
      const concrete = data['material_concrete'];

      this.concrete_strength_table_datas[i].push({
        title: 'コンクリートの設計基準強度 fck(N/mm2)',
        value: concrete.fck
      });
      this.concrete_strength_table_datas[i].push({
        title: '粗骨材の最大寸法 (mm)',
        value: concrete.dmax
      });

      // 杭の施工条件
      this.pile_factor_list = data['pile_factor_list'];
      this.pile_factor_selected[i] = data['pile_factor_selected'];
      if (srcCount[i] > 0) {
        this.isSRC.push(true);
      } else {
        this.isSRC.push(false);
      }

    }

  }

  // 安全係数のデータをテーブル用の変数に整形する
  private set_safety_factors_table_datas(safety: any[], title: string[]): any[] {

    const result: any[] = safety;

    for (let i = 0; i < result.length; i++) {

      // タイトルを追加する
      result[i].title = title[i];

      // range　を文字列に変換
      switch (result[i].range) {
        case 1:
          result[i].range = '引張鉄筋';
          break;
        case 2:
          result[i].range = '引張＋圧縮';
          break;
        case 3:
          result[i].range = '全周鉄筋';
          break;
        default:
          result[i].range = '';
      }
    }
    return result;
  }

  // 鉄筋のセパレータをテーブル用の変数に整形する
  private set_bar_strength_table_split(split: any): any {

    const result = {
      title: '',
      fsy1: 'D' + split['fsy1'] + '以下',
      fsu1: 'D' + split['fsu1'] + '以下'
    }

    const fsy2 = this.input.getNextRebar(split['fsy1']);
    if (fsy2 !== undefined) {
      result['fsy2'] = 'D' + fsy2.D + '以上';
    } else {
      result['fsy2'] = '';
    }

    const fsu2 = this.input.getNextRebar(split['fsu1']);
    if (fsu2 !== undefined) {
      result['fsu2'] = 'D' + fsu2.D + '以上';
    } else {
      result['fsu2'] = '';
    }

    return result;
  }

  // 鉄筋の軸方向鉄筋をテーブル用のデータに整形する
  private set_bar_strength_table_column(bar: any, title: string): any {
    const result = bar;
    result['title'] = title;
    return result;
  }

  // 鉄骨のセパレータをテーブル用の変数に整形する
  private set_steel_strength_table_split(split: any): any {

    const result = { title: '' };
    result['SRCfsyk1'] = 't≦' + split['SRCfsyk1'];
    result['SRCfsyk2'] = split['SRCfsyk1'] + '＜t≦' + split['SRCfsyk2'];
    result['SRCfsyk3'] = split['SRCfsyk2'] + '＜t≦' + split['SRCfsyk3'];

    return result;
  }

  // 鉄骨の軸方向鉄筋をテーブル用のデータに整形する
  private set_steel_strength_table_column(steel: any, title: string): any {
    const result = steel;
    result['title'] = title;
    return result;
  }

  /////////////////////////////////////////////////////////////////////////////////////
  // 入力変更を処理する関数
  // tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy(): void {
    this.saveData();
  }
  public saveData(): void {
    const result = new Array();
    for (let i = 0; i < this.groupe_list.length; i++) {
      const g = this.groupe_list[i];
      result.push({
        'g_no': g[0].g_no,
        'safety_factor': this.get_safety_factors_table_datas(this.safety_factors_table_datas[i]),
        'material_bar': this.get_set_bar_strength_table_datas(this.bar_strength_table_datas[i]),
        'material_steel': this.get_set_steel_strength_table_datas(this.steel_strength_table_datas[i]),
        'material_concrete': this.get_concrete_strength_table_datas(this.concrete_strength_table_datas[i]),
        'pile_factor_selected': this.pile_factor_selected[i]
      });
    }
    this.input.setTableColumns(result);
  }

  // 安全係数のデータを保存用に整形する
  private get_safety_factors_table_datas(safety_factors_table_datas: any[]): any[] {

    const result: any[] = safety_factors_table_datas;

    for (const safety of result) {

      if (safety.title) {
        delete safety.title;
      }

      switch (safety.range) {
        case '引張鉄筋':
          safety.range = 1;
          break;
        case '引張＋圧縮':
          safety.range = 2;
          break;
        case '全周鉄筋':
          safety.range = 3;
          break;
        default:
      }

    }
    return result;
  }

  // 鉄筋のセパレータを保存用に整形する
  private get_set_bar_strength_table_datas(bar_strength_table_datas: any[]): any[] {

    const result: any[] = bar_strength_table_datas;

    for (const key of Object.keys(result[0])) {
      result[0][key] = this.input.toNumber(result[0][key].toString().replace('D', '').replace('以下', ''))
    }

    for (let i = 1; i < result.length; i++) {
      for (const key of Object.keys(result[i])) {
        result[i][key] = this.input.toNumber(result[i][key])
      }
    }

    return result;
  }

  // 鉄骨のセパレータを保存用に整形する
  private get_set_steel_strength_table_datas(steel_strength_table_datas: any[]): any[] {

    const result: any[] = steel_strength_table_datas;

    for (const key of Object.keys(result[0])) {
      result[0][key] = this.input.toNumber(result[0][key].toString().replace('D', '').replace('以下', ''))
    }

    for (let i = 1; i < result.length; i++) {
      for (const key of Object.keys(result[i])) {
        result[i][key] = this.input.toNumber(result[i][key])
      }
    }

    return result;
  }


  // コンクリート材料データを保存用に整形する
  private get_concrete_strength_table_datas(concrete_strength_table_datas: any[]): any[] {
    const result: any[] = concrete_strength_table_datas;
    for (const column of result) {
      for (const key of Object.keys(column)) {
        column[key] = this.input.toNumber(column[key])
      }
    }
    return result;
  }

  /////////////////////////////////////////////////////////////////////////////////////
  // 杭の施工条件を変更を処理する関数
  public setPileFactor(i: number, j: number): void {
    const id: string = this.pile_factor_list[j].id;
    this.pile_factor_selected[i] = id;
  }

}
