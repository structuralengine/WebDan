import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { InputDesignPointsService } from './input-design-points.service';
import { SaveDataService } from '../../providers/save-data.service';

@Component({
  selector: 'app-design-points',
  templateUrl: './design-points.component.html',
  styleUrls: ['./design-points.component.scss']
})
export class DesignPointsComponent implements OnInit {

  @ViewChild('ht_container') ht_container: ElementRef;
  hottable_height: number;
  isManual:boolean;

  groupe_list: any[];
  table_datas: any[][];
  mergeCells: any[][];
  position_index: number[][];

  table_settings = {
    beforeChange: (source, changes) => {
    },
    afterChange: (hotInstance, changes, source) => {
    }
  };

  constructor(
    private input: InputDesignPointsService,
    private save: SaveDataService ) { }

  ngOnInit() {
    
    this.isManual = this.save.isManual();

    const height = this.ht_container.nativeElement.offsetHeight;
    this.hottable_height = height - 180;

    this.groupe_list = this.input.getDesignPointColumns();
    this.table_datas = new Array(this.groupe_list.length);
    this.mergeCells = new Array(this.groupe_list.length);
    this.position_index = new Array(this.groupe_list.length);

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
    this.input.setDesignPointColumns(this.table_datas);
  }

}

