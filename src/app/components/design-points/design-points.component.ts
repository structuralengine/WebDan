import { Component, OnInit, ViewChild, ElementRef, OnDestroy, ViewChildren, QueryList } from '@angular/core';
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
export class DesignPointsComponent implements OnInit, OnDestroy {

  @ViewChildren('grid') items: QueryList;
  //@ViewChild('grid') grid: SheetComponent;

  private columnHeaders: object[] = [
    { title: "部材番号", align: "left", dataType: "string", dataIndx: "m_no", editable: false, sortable: false, width: 70, style: {'background': '#f5f5f5' }, styleHead: {'background': '#f5f5f5' } },
    { title: "算出点名", dataType: "center", dataIndx: "p_name_ex", sortable: false, width: 250, style: {'background': '#f5f5f5' }, styleHead: {'background': '#f5f5f5' } },
    { title: "せん断スパン長(mm)", dataType: "center", dataIndx: "La", sortable: false, width: 140 },
    { title: "算出点", dataType: "center", dataIndx: "p_name", sortable: false, width: 85 },
    { title: "位置", dataType: "center", dataIndx: "position", sortable: false, width: 110 },
    { title: "曲げ照査(y軸)", dataType: "center", dataIndx: "isMyCalc", sortable: false, width: 120 },
    { title: "せん断照査(y軸)", dataType: "center", dataIndx: "isVyCalc", sortable: false, width: 120 },
  ];

  @ViewChild('ht_container', { static: true }) ht_container: ElementRef;
  hottable_height: number;
  isManual:boolean;
  is3DPickUp:boolean;

  groupe_list: any[];
  table_datas: any[][];
  mergeCells: any[][];
  position_index: number[][];

  table_settings = {
    beforeChange: (...x: any[]) => {
      try {
        let changes: any = null;
        let target: any = null;
        for (let i = 0; i < x.length; i++) {
          if ('guid' in x[i]){
            target = x[i];
          }
          if (Array.isArray(x[i])) {
            changes = x[i];
            break;
          }
        }
        if (target === null) { return; }
        if (changes === null) { return; }
        for (let i = 0; i < changes.length; i++) {
          switch (changes[i][1]) {
            case 'La':
              const value1: number = this.helper.toNumber(changes[i][3]);
              if( value1 !== null ) {
                changes[i][3] = value1.toFixed(1);
              } else {
                changes[i][3] = null;
              }
              break;
            case 'isMyCalc':
              if( changes[i][3] === true){
                const row: number = changes[i][0];
                target.setDataAtCell(row, 7, false);
              }
              break;
            case 'isVyCalc':
              if( changes[i][3] === true){
                const row: number = changes[i][0];
                target.setDataAtCell(row, 8, false);
              }
              break;
            case 'isMzCalc':
              if( changes[i][3] === true){
                const row: number = changes[i][0];
                target.setDataAtCell(row, 5, false);
              }
              break;
            case 'isVzCalc':
              if( changes[i][3] === true){
                const row: number = changes[i][0];
                target.setDataAtCell(row, 6, false);
              }
              break;
          }
        }
      } catch (e) {
        console.log(e);
      }
    },
    afterChange: (...x: any[]) => {
      let changes: any = null;
      for (let i = 0; i < x.length; i++) {
        if (Array.isArray(x[i])) {
          changes = x[i];
          break;
        }
      }
      if (changes === null) { return; }
      
    }
  };

  constructor(
    private input: InputDesignPointsService,
    private save: SaveDataService,
    private helper: InputDataService) { }

  ngOnInit() {
    
    this.isManual = this.save.isManual();

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
    }
  }
  
  // tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy() {
    this.saveData();
  }
  
  public saveData(): void {
    this.input.setDesignPointColumns(this.table_datas);
  }

    // グリッドの設定
    options: pq.gridT.options = {
      showTop: false,
      reactive: true,
      sortable: false,
      locale: "jp",
      numberCell: { show: false }, // 行番号
      colModel: this.columnHeaders,
      dataModel: { data: [] },
    };
  
}

