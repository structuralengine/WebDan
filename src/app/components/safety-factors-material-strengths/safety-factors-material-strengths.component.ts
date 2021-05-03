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
export class SafetyFactorsMaterialStrengthsComponent
  implements OnInit, OnDestroy {

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

    const safety = this.safety.getTableColumns();

    // 配列を作成
    this.table1_datas = new Array();      // 安全係数
    this.table2_datas = new Array();      // 鉄筋材料
    this.table3_datas = new Array();      // コンクリート材料
    this.table5_datas = new Array();      // 鉄骨材料
    this.pile_factor_list = new Array();  // 杭の施工条件
    this.groupe_list = safety.groupe_list;

    // 入力項目を作成
    for ( let i = 0; i < safety.groupe_list.length; i++){
      const groupe = safety.groupe_list[i];
      const id = groupe.g_id;

      // 安全係数
      this.table1_datas.push(safety.safety_factor[id]);

      // 鉄筋材料
      const f1 = safety.material_bar[id][0]; // D25以下
      const f2 = safety.material_bar[id][1]; // D29以上
      this.table2_datas.push([
        { title: '軸方向鉄筋',   fsy1: f1.tensionBar.fsy, fsy2: f2.tensionBar.fsy, fsu1: f1.tensionBar.fsu, fsu2: f2.tensionBar.fsu },
        { title: '側方向鉄筋',   fsy1: f1.sidebar.fsy,    fsy2: f2.sidebar.fsy,    fsu1: f1.sidebar.fsu,    fsu2: f2.sidebar.fsu },
        { title: 'スターラップ', fsy1: f1.stirrup.fsy,   fsy2: f2.stirrup.fsy,    fsu1: f1.stirrup.fsu,    fsu2: f2.stirrup.fsu },
      ]);

      // 鉄骨材料
      const s1 = safety.material_steel[id][0]; // t16以下
      const s2 = safety.material_steel[id][1]; // t40以下
      const s3 = safety.maal_steel[id][2]; // t40以上
      this.table5_datas.push([
        { title: '引張降伏強度',   SRCfsyk1: s1.fsyk,  SRCfsyk2: s2.fsyk,  SRCfsyk3: s3.fsyk  },
        { title: 'せん断降伏強度', SRCfsyk1: s1.fsvyk, SRCfsyk2: s2.fsvyk, SRCfsyk3: s3.fsvyk },
        { title: '引張強度',       SRCfsyk1: s1.fsuk,  SRCfsyk2: s2.fsuk,  SRCfsyk3: s3.fsuk  }
      ]);

      // コンクリート材料
      const concrete = safety.material_concrete[id];
      this.table3_datas.push([{
        title: 'コンクリートの設計基準強度 fck(N/mm2)',
        value: concrete.fck
      },{
        title: '粗骨材の最大寸法 (mm)',
        value: concrete.dmax
      }]);

      // 杭の施工条件
      this.pile_factor_list.push(safety.pile_factor[id]);

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

  ngOnDestroy(): void {
    this.saveData();
  }
  public saveData(): void {
    const safety_factor = {};
    const material_bar = {};
    const material_steel = {};
    const material_concrete = {};
    const pile_factor = {};

    for (let i = 0; i < this.groupe_list.length; i++) {
      const groupe = this.groupe_list[i];

      // 安全係数
      safety_factor[groupe.g_id] = this.table1_datas[i];

      // 鉄筋材料
      const bar = this.table2_datas[i];
      material_bar[groupe.g_id] = [{
          tensionBar: { fsy:  bar[0].fsy1, fsu:  bar[0].fsu1 },
          sidebar:    { fsy: bar[1].fsy1,    fsu: bar[1].fsu1 },
          stirrup:    { fsy: bar[2].fsy1,    fsu: bar[2].fsu1 }
        },
        {
          tensionBar: { fsy:  bar[0].fsy2, fsu:  bar[0].fsu2 },
          sidebar:    { fsy: bar[1].fsy2,    fsu: bar[1].fsu2 },
          stirrup:    { fsy: bar[2].fsy2,    fsu: bar[2].fsu2 }
      }];
      const steel = this.table5_datas[i];

      // 鉄骨材料
      material_steel[groupe.g_id] =  [
        {
          fsyk: steel[0].SRCfsyk1,
          fsvyk: steel[1].SRCfsyk1,
          fsuk:  steel[2].SRCfsyk1,
        },
        {
          fsyk: steel[0].SRCfsyk2,
          fsvyk: steel[1].SRCfsyk2,
          fsuk: steel[2].SRCfsyk2,
        },
        {
          fsyk: steel[0].SRCfsyk3,
          fsvyk: steel[1].SRCfsyk3,
          fsuk: steel[2].SRCfsyk3,
        }
      ];

      // コンクリート材料
      const conc = this.table3_datas[i];
      material_concrete[groupe.g_id] =  {
        fck: conc[0].value,
        dmax: conc[1].value
      }

      // 杭の施工条件
      pile_factor[groupe.g_id] = this.pile_factor_list[i];
    }

    this.safety.setSaveData({
      safety_factor,
      material_bar,
      material_steel,
      material_concrete,
      pile_factor
    })

  }

  // 杭の施工条件を変更を処理する関数
  public setPileFactor(i: number, j: number): void {

    const pile = this.pile_factor_list[i];

    for(let k = 0; k < pile.length; k++){
      pile[k].selected = (i===k) ? true: false;
    }

  }

  public getGroupeName(i: number): string {
    return this.safety.getGroupeName(i);
  }



}
