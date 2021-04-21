import { Component, OnInit, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import { InputSafetyFactorsMaterialStrengthsService } from './safety-factors-material-strengths.service'
import { DataHelperModule } from 'src/app/providers/data-helper.module';
import { SheetComponent } from '../sheet/sheet.component';
import pq from 'pqgrid';

@Component({
  selector: 'app-safety-factors-material-strengths',
  templateUrl: './safety-factors-material-strengths.component.html',
  styleUrls: ['./safety-factors-material-strengths.component.scss']
})
export class SafetyFactorsMaterialStrengthsComponent implements OnInit, OnDestroy {

  // 安全係数
  @ViewChildren('grid1') grid1: QueryList<SheetComponent>;
  public options1: pq.gridT.options[] = new Array(); 
  private columnHeaders1: object[] = [];
  private table1_datas: any[][];    // 安全係数

  // 鉄筋材料強度
  @ViewChildren('grid2') grid2: QueryList<SheetComponent>;
  public options2: pq.gridT.options[] = new Array();
  private columnHeaders2: object[] = [];
  private table2_datas: any[][];      // 鉄筋材料強度

  // コンクリート材料強度
  @ViewChildren('grid3') grid3: QueryList<SheetComponent>;
  public options3: pq.gridT.options[] = new Array();
  private columnHeaders3: object[] = [];
  private table3_datas: any[][]; // コンクリート材料強度

  // 鉄骨 - 安全係数
  @ViewChildren('grid4') grid4: QueryList<SheetComponent>;
  public options4: pq.gridT.options[] = new Array();
  private columnHeaders4: object[] = [];
  // private table1_datas: any[][];    // 安全係数 - 1と共有

  // 鉄骨材料強度
  @ViewChildren('grid5') grid5: QueryList<SheetComponent>;
  public options5: pq.gridT.options[] = new Array();
  private columnHeaders5: object[] = [];
  private table5_datas: any[][];    // 鉄骨材料強度

  // 杭の施工条件
  public pile_factor_list: any[]; // 杭の施工条件

  // グループ情報
  public groupe_list: any[];

  constructor(
    private safety: InputSafetyFactorsMaterialStrengthsService,
    private helper: DataHelperModule) {
  }

  /////////////////////////////////////////////////////////////////////////////////////
  // 保存データを処理する関数
  ngOnInit() {

    this.setTitle();

    const table_datas = this.safety.getTableColumns();
    this.groupe_list = new Array();

    
    // 仕様によるタイトルの初期化
    this.safety.initSpecificationTitles();

    // グループリストを取得
    this.groupe_list = this.safety.getGroupeList();

    // 配列を作成
    this.table1_datas = new Array();    // 安全係数
    this.table2_datas = new Array();      // 鉄筋材料
    this.table3_datas = new Array(); // コンクリート材料
    this.table5_datas = new Array();    // 鉄骨材料

    this.pile_factor_list = new Array();              // 杭の施工条件
    this.pile_factor_selected = new Array();

    // 入力項目を作成
    for (let i = 0; i < this.groupe_list.length; i++) {

      const groupe = this.groupe_list[i];
      
      const data = this.safety.getTableColumns(groupe[0].g_id);

      // 安全係数
      const safety: any[] = data['safety_factor'];
      const title: string[] = data['safety_factor_title'];
      this.table1_datas.push(
        this.set_table1_datas(safety, title)
      );

      // 鉄筋材料
      this.table2_datas[i] = new Array();
      const bar = data['material_bar'];
      /*/ セパレータ
      this.table2_datas[i].push(
        this.set_bar_strength_table_split(bar[0])
      );*/
      const bar_table_titles: string[] = ['', '軸方向鉄筋', '側方向鉄筋', 'スターラップ', '折曲げ鉄筋'];
      for (let j = 1; j < bar.length; j++) {
        this.table2_datas[i].push(
          this.set_bar_strength_table_column(bar[j], bar_table_titles[j])
        );
      }

      // 鉄骨材料
      this.table5_datas[i] = new Array();
      const steel = data['material_steel'];
      // セパレータ
      this.table5_datas[i].push(
        this.set_steel_strength_table_split(steel[0])
      );
      const steel_table_titles: string[] = ['', '降伏強度', 'せん断強度', '引張強度'];
      for (let j = 1; j < steel.length; j++) {
        this.table5_datas[i].push(
          this.set_steel_strength_table_column(steel[j], steel_table_titles[j])
        );
      }

      // コンクリート材料
      this.table3_datas[i] = new Array();
      const concrete = data['material_concrete'];

      this.table3_datas[i].push({
        title: 'コンクリートの設計基準強度 fck(N/mm2)',
        value: concrete.fck
      });
      this.table3_datas[i].push({
        title: '粗骨材の最大寸法 (mm)',
        value: concrete.dmax
      });

      // 杭の施工条件
      this.pile_factor_list = data['pile_factor_list'];
      this.pile_factor_selected[i] = data['pile_factor_selected'];
      
      // グリッドの設定
      this.options1.push({
        width: 985,
        height: 235,
        showTop: false,
        reactive: true,
        sortable: false,
        locale: 'jp',
        numberCell: { show: false }, // 行番号
        colModel: this.columnHeaders1,
        dataModel: { data: this.table1_datas[i] },
      });
      this.options2.push({
        width: 532,
        height: 185,
        showTop: false,
        reactive: true,
        sortable: false,
        locale: 'jp',
        numberCell: { show: false }, // 行番号
        colModel: this.columnHeaders2,
        dataModel: { data: this.table2_datas[i] },
      });
      this.options3.push({
        width: 532,
        height: 95,
        showTop: false,
        reactive: true,
        sortable: false,
        locale: 'jp',
        numberCell: { show: false }, // 行番号
        colModel: this.columnHeaders3,
        dataModel: { data: this.table3_datas[i] },
      });  
      this.options4.push({
        showTop: false,
        reactive: true,
        sortable: false,
        locale: 'jp',
        numberCell: { show: false }, // 行番号
        colModel: this.columnHeaders4,
        dataModel: { data: this.table1_datas[i] },
      });
      this.options5.push({
        showTop: false,
        reactive: true,
        sortable: false,
        locale: 'jp',
        numberCell: { show: false }, // 行番号
        colModel: this.columnHeaders5,
        dataModel: { data: this.table5_datas[i] },
      });
    }

  }

  private setTitle(): void {
    this.columnHeaders1 = [
      { title: '', align: 'left', dataType: 'string', dataIndx: 'title', editable: false, sortable: false, width: 250, style: { 'background': '#f5f5f5' }, styleHead: { 'background': '#f5f5f5' } },
      { title: '曲げ安全係数', align: 'center', colModel: [
        { title: 'γc',  dataType: 'float', 'format':'#.00', dataIndx: 'M_rc', sortable: false, width: 70 },
        { title: 'γs',  dataType: 'float', 'format':'#.00', dataIndx: 'M_rs', sortable: false, width: 70 },
        { title: 'γbs', dataType: 'float', 'format':'#.00', dataIndx: 'M_rbs', sortable: false, width: 70 }
      ]},
      { title: 'せん断安全係数', align: 'center', colModel: [
        { title: 'γc',  dataType: 'float', 'format':'#.00', dataIndx: 'V_rc', sortable: false, width: 70 },
        { title: 'γs',  dataType: 'float', 'format':'#.00', dataIndx: 'V_rs', sortable: false, width: 70 },
        { title: 'γbc', dataType: 'float', 'format':'#.00', dataIndx: 'V_rbc', sortable: false, width: 70 },
        { title: 'γbs', dataType: 'float', 'format':'#.00', dataIndx: 'V_rbs', sortable: false, width: 70 },
        { title: 'γbd', dataType: 'float', 'format':'#.00', dataIndx: 'V_rbv', sortable: false, width: 70 }
      ]},
      { title: '係数γi', dataType: 'float', 'format':'#.00', dataIndx: 'ri', sortable: false, width: 70 },
      { title: '鉄筋配置', dataType: 'string'              , dataIndx: 'range', sortable: false, width: 100 },
    ];

    // 鉄筋材料強度
    this.columnHeaders2 = [
      { title: '', align: 'left', dataType: 'string', dataIndx: 'title', editable: false, sortable: false, width: 250, style: { 'background': '#f5f5f5' }, styleHead: { 'background': '#f5f5f5' } },
      { title: '降伏強度', align: 'center', colModel: [
        { title: 'D29以下', dataType: 'float', dataIndx: 'fsy1', sortable: false, width: 70 },
        { title: 'D32以上', dataType: 'float', dataIndx: 'fsy2', sortable: false, width: 70 }
      ]},
      { title: '設計引張強度', align: 'center', colModel: [
        { title: 'D29以下', dataType: 'float', dataIndx: 'fsu1', sortable: false, width: 70 },
        { title: 'D32以上', dataType: 'float', dataIndx: 'fsu2', sortable: false, width: 70 }
      ]},
    ];
  
    // コンクリート材料強度
    this.columnHeaders3 = [
      { title: '', align: 'left', dataType: 'string', dataIndx: 'title', editable: false, sortable: false, width: 390 },
      { title: '', dataType: 'float', dataIndx: 'value', sortable: false, width: 140 },
    ];
  
    // 鉄骨 - 安全係数
    this.columnHeaders4 = [
      { title: '', align: 'left', dataType: 'string', dataIndx: 'title', editable: false, sortable: false, width: 250, style: { 'background': '#f5f5f5' }, styleHead: { 'background': '#f5f5f5' } },
      { title: 'γs', dataType: 'float', 'format':'#.00', dataIndx: 'S_rs', sortable: false, width: 70 },
      { title: 'γb', dataType: 'float', 'format':'#.00', dataIndx: 'S_rb', sortable: false, width: 70 }
    ];
  
    // 鉄骨材料強度
    this.columnHeaders5 = [
      { title: '', align: 'left', dataType: 'string', dataIndx: 'title', editable: false, sortable: false, width: 250, style: { 'background': '#f5f5f5' }, styleHead: { 'background': '#f5f5f5' } },
      { title: 't≦16',     dataType: 'float', dataIndx: 'SRCfsyk1', sortable: false, width: 100 },
      { title: '16＜t≦40', dataType: 'float', dataIndx: 'SRCfsyk2', sortable: false, width: 100 },
      { title: '40＜t≦75', dataType: 'float', dataIndx: 'SRCfsyk3', sortable: false, width: 100 }
    ];
  
  }


  // 安全係数のデータをテーブル用の変数に整形する
  private set_table1_datas(safety: any[], title: string[]): any[] {

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

    const fsy2 = this.helper.getNextRebar(split['fsy1']);
    if (fsy2 !== undefined) {
      result['fsy2'] = 'D' + fsy2.D + '以上';
    } else {
      result['fsy2'] = '';
    }

    const fsu2 = this.helper.getNextRebar(split['fsu1']);
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

    this.safety.setSaveData({
      safety_factor: this.table1_datas,
      material_bar: this.table2_datas, 
      material_steel: this.table5_datas, 
      material_concrete:this.table3_datas,
      pile_factor: this.pile_factor_list 
    })

  }

  // 安全係数のデータを保存用に整形する
  private get_table1_datas(table1_datas: any[]): any[] {

    const result: any[] = table1_datas;

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
  private get_set_table2_datas(table2_datas: any[]): any[] {

    const result: any[] = table2_datas;
    /*
    for (const key of Object.keys(result[0])) {
      if (result[0][key] === null) { continue; }
      if (typeof result[0][key] === 'string') {
        result[0][key] = this.helper.toNumber(result[0][key].replace('D', '').replace('以下', ''));
      }
    }
    */
    result.unshift({fsy1: 25, fsu1: 25});
    //
    for (let i = 1; i < result.length; i++) {
      for (const key of Object.keys(result[i])) {
        result[i][key] = this.helper.toNumber(result[i][key])
      }
    }

    return result;
  }

  // 鉄骨のセパレータを保存用に整形する
  private get_set_table5_datas(table5_datas: any[]): any[] {

    const result: any[] = table5_datas;

    for (const key of Object.keys(result[0])) {
      if (result[0][key] === null) { continue; }
      if (typeof result[0][key] === 'string') {
        result[0][key] = this.helper.toNumber(result[0][key].toString().replace('D', '').replace('以下', ''))
      }
    }

    for (let i = 1; i < result.length; i++) {
      for (const key of Object.keys(result[i])) {
        result[i][key] = this.helper.toNumber(result[i][key])
      }
    }

    return result;
  }


  // コンクリート材料データを保存用に整形する
  private get_table3_datas(table3_datas: any[]): any[] {
    const result: any[] = table3_datas;
    for (const column of result) {
      for (const key of Object.keys(column)) {
        column[key] = this.helper.toNumber(column[key])
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

  public getGroupeName(i: number): string {
    const target = this.groupe_list[i];
    const first = target[0];
    let result: string = '';
    if(first.g_name === null){
      result = first.g_id;
    } else if(first.g_name === ''){
      result = first.g_id;
    } else {
      result = first.g_name;
    }
    if(result === ''){
      result = 'No' + i;
    }
    return result;
  }
}
