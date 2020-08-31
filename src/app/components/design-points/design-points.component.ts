import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { InputDesignPointsService } from './input-design-points.service';
import { SaveDataService } from '../../providers/save-data.service';
import { InputDataService } from 'src/app/providers/input-data.service';

@Component({
  selector: 'app-design-points',
  templateUrl: './design-points.component.html',
  styleUrls: ['./design-points.component.scss']
})
export class DesignPointsComponent implements OnInit, OnDestroy {

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
  
}

