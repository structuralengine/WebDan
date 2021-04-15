import { Component, OnInit, OnDestroy, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { InputDesignPointsService } from './design-points.service';
import { SaveDataService } from '../../providers/save-data.service';
import { SheetComponent } from '../sheet/sheet.component';
import pq from 'pqgrid';

@Component({
  selector: 'app-design-points',
  templateUrl: './design-points.component.html',
  styleUrls: ['./design-points.component.scss']
})
export class DesignPointsComponent implements OnInit, OnDestroy {

  // データグリッドの設定変数
  @ViewChildren('grid') grids: QueryList<SheetComponent>;
  public options: pq.gridT.options[] = new Array();
  private columnHeaders: object[] = [];
  // このページで表示するデータ
  public groupe_list: any[];
  private table_datas: any[][];

  constructor(
    private save: SaveDataService) { }

  ngOnInit() {

    if (this.save.isManual()) {
      // 断面力手入力モードの場合
      this.columnHeaders = [
        { title: "", align: "left", dataType: "string", dataIndx: "m_no", sortable: false, width: 70, editable: false, style: { 'background': '#f5f5f5' }, styleHead: { 'background': '#f5f5f5' } },
        { title: "算出点名", dataType: "string", dataIndx: "p_name_ex", sortable: false, width: 250 },
        { title: "せん断スパン長(mm)", dataType: "float", dataIndx: "La", sortable: false, width: 140 },
      ];
    } else {
      // ピックアップファイルを使う場合
      this.columnHeaders = [
        { title: "部材番号", align: "left", dataType: "string", dataIndx: "m_no", sortable: false, width: 70, editable: false, style: { 'background': '#f5f5f5' }, styleHead: { 'background': '#f5f5f5' } },
        { title: "算出点", dataType: "string", dataIndx: "p_name", sortable: false, width: 85, editable: false, style: { 'background': '#f5f5f5' }, styleHead: { 'background': '#f5f5f5' } },
        { title: "位置", dataType: "float", format: "#.000", dataIndx: "position", sortable: false, width: 110, editable: false, style: { 'background': '#f5f5f5' }, styleHead: { 'background': '#f5f5f5' } },
        { title: "算出点名", dataType: "string", dataIndx: "p_name_ex", sortable: false, width: 250 },
      ];
      if (this.save.is3DPickUp()) {
        // 3次元ピックアップファイルの場合
        this.columnHeaders.push(
          { title: "曲げ照査(y軸)", align: "center", dataType: "bool", dataIndx: "isMyCalc", type: 'checkbox', sortable: false, width: 120 },
          { title: "せん断照査(y軸)", align: "center", dataType: "bool", dataIndx: "isVyCalc", type: 'checkbox', sortable: false, width: 120 },
          { title: "曲げ照査(z軸)", align: "center", dataType: "bool", dataIndx: "isMzCalc", type: 'checkbox', sortable: false, width: 120 },
          { title: "せん断照査(z軸)", align: "center", dataType: "bool", dataIndx: "isVzCalc", type: 'checkbox', sortable: false, width: 120 }
        );
      } else {
        // 2次元ピックアップファイルの場合
        this.columnHeaders.push(
          { title: "曲げ照査", align: "center", dataType: "bool", dataIndx: "isMyCalc", type: 'checkbox', sortable: false, width: 120 },
          { title: "せん断照査", align: "center", dataType: "bool", dataIndx: "isVyCalc", type: 'checkbox', sortable: false, width: 120 }
        );
      }
      this.columnHeaders.push(
        { title: "せん断スパン長(mm)", dataType: "float", dataIndx: "La", sortable: false, width: 140 }
      );
    }

    this.groupe_list = this.save.points.getDesignPointColumns();
    this.table_datas = new Array(this.groupe_list.length);

    for (let i = 0; i < this.groupe_list.length; i++) {
      this.table_datas[i] = new Array();

      let row: number = 0;
      for (let j = 0; j < this.groupe_list[i].length; j++) {
        const member = this.groupe_list[i][j];

        const positionCount: number = member['positions'].length;

        for (let k = 0; k < positionCount; k++) {
          const column = member['positions'][k];
          if (k === 0) {
            // 最初の行には 部材番号を表示する
            column['m_no'] = member['m_no'];
          }

          this.table_datas[i].push(column);

          row++;
        }
      }

      // グリッドの設定
      this.options.push({
        showTop: false,
        reactive: true,
        sortable: false,
        locale: "jp",
        height: this.tableHeight().toString(),
        numberCell: { show: false }, // 行番号
        colModel: this.columnHeaders,
        dataModel: { data: this.table_datas[i] },
      });

      this.grids[i].options = this.options[i];

    }
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

  ngOnDestroy() {
    this.saveData();
  }

  public saveData(): void {
  }

  // 表の高さを計算する
  private tableHeight(): number {
    let containerHeight = window.innerHeight;
    containerHeight -= 230;
    return containerHeight;
  }

}

