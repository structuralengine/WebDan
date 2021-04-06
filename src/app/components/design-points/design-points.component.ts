import { Component, OnInit, ViewChild, ElementRef, OnDestroy, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { InputDesignPointsService } from './input-design-points.service';
import { SaveDataService } from '../../providers/save-data.service';
import { InputDataService } from 'src/app/providers/input-data.service';
import { SheetComponent } from '../sheet/sheet.component';
import pq from 'pqgrid';

@Component({
  selector: 'app-design-points',
  templateUrl: './design-points.component.html',
  styleUrls: ['./design-points.component.scss']
})
export class DesignPointsComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChildren('grid') grids: QueryList<SheetComponent>;
  public options: pq.gridT.options[] = new Array();

  private columnHeaders: object[] = [];

  @ViewChild('ht_container', { static: true }) ht_container: ElementRef;
  hottable_height: number;
  isManual:boolean;
  is3DPickUp:boolean;

  groupe_list: any[];
  table_datas: any[][];
  mergeCells: any[][];
  position_index: number[][];

  constructor(
    private input: InputDesignPointsService,
    private save: SaveDataService,
    private helper: InputDataService) { }

  ngOnInit() {

    this.isManual = this.save.isManual();
    if(this.isManual){
      this.columnHeaders = [
        { title: "部材番号", align: "left", dataType: "string", dataIndx: "m_no", sortable: false, width: 70, editable: false, style: {'background': '#f5f5f5' }, styleHead: {'background': '#f5f5f5' } },
        { title: "算出点名", dataType: "string", dataIndx: "p_name_ex", sortable: false, width: 250 },
        { title: "曲げ照査", align: "center", dataType: "bool", dataIndx: "isMyCalc", type: 'checkbox', sortable: false, width: 120 },
        { title: "せん断照査", align: "center", dataType: "bool", dataIndx: "isVyCalc", type: 'checkbox', sortable: false, width: 120 },
        { title: "せん断スパン長(mm)", dataType: "float", dataIndx: "La", sortable: false, width: 140 },
      ];
    }else {
      this.columnHeaders = [
        { title: "部材番号", align: "left", dataType: "string", dataIndx: "m_no", sortable: false, width: 70, editable: false, style: {'background': '#f5f5f5' }, styleHead: {'background': '#f5f5f5' } },
        { title: "算出点", dataType: "string", dataIndx: "p_name", sortable: false, width: 85, editable: false, style: {'background': '#f5f5f5' }, styleHead: {'background': '#f5f5f5' }},
        { title: "位置", dataType: "float", format: "#.000", dataIndx: "position", sortable: false, width: 110,editable: false, style: {'background': '#f5f5f5' }, styleHead: {'background': '#f5f5f5' } },
        { title: "算出点名", dataType: "string", dataIndx: "p_name_ex", sortable: false, width: 250 },
        { title: "曲げ照査(y軸)", align: "center", dataType: "bool", dataIndx: "isMyCalc", type: 'checkbox', sortable: false, width: 120 },
        { title: "せん断照査(y軸)", align: "center", dataType: "bool", dataIndx: "isVyCalc", type: 'checkbox', sortable: false, width: 120 },
        { title: "曲げ照査(z軸)", align: "center", dataType: "bool", dataIndx: "isMzCalc", type: 'checkbox', sortable: false, width: 120 },
        { title: "せん断照査(z軸)", align: "center", dataType: "bool", dataIndx: "isVzCalc", type: 'checkbox', sortable: false, width: 120 },
        { title: "せん断スパン長(mm)", dataType: "float", dataIndx: "La", sortable: false, width: 140 },
      ];
    }
    const height = this.ht_container.nativeElement.offsetHeight;
    this.hottable_height = height - 180;

    this.groupe_list = this.input.getDesignPointColumns();
    this.table_datas = new Array(this.groupe_list.length);
    this.mergeCells = new Array(this.groupe_list.length);
    this.position_index = new Array(this.groupe_list.length);

    this.is3DPickUp = this.save.is3DPickUp();

    for (let i = 0; i < this.groupe_list.length; i++) {
      this.table_datas[i] = new Array();
      this.mergeCells[i] = new Array();
      this.position_index[i] = new Array();

      let row: number = 0;
      for (let j = 0; j < this.groupe_list[i].length; j++) {
        const member = this.groupe_list[i][j];

        const positionCount: number = member['positions'].length;
        if(positionCount> 1){
          this.mergeCells[i].push({row: row, col: 0, rowspan: positionCount, colspan: 1});
        }

        for (let k = 0; k < positionCount; k++) {
          const column = member['positions'][k];
          if (k === 0) {
            // 最初の行には 部材番号を表示する
            column['m_no'] = member['m_no'];
          }

          this.table_datas[i].push(column);
          this.position_index[i].push(column.index)

          row++;
        }
      }

      // グリッドの設定
      this.options.push({
        showTop: false,
        reactive: true,
        sortable: false,
        locale: "jp",
        numberCell: { show: false }, // 行番号
        colModel: this.columnHeaders,
        dataModel: { data: this.table_datas[i] },
      });

    }
  }
  
  ngAfterViewInit(){
    this.grids.forEach((grid, i, array)=>{
      grid.options =this.options[i];
      grid.refreshDataAndView();
    });
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy() {
    this.saveData();
  }
  
  public saveData(): void {
    this.input.setDesignPointColumns(this.table_datas);
  }
  
}

