import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { InputSteelsService } from './input-steels.service';

@Component({
  selector: 'app-steels',
  templateUrl: './steels.component.html',
  styleUrls: ['./steels.component.scss']
})
export class SteelsComponent implements OnInit {

  @ViewChild('ht_container') ht_container: ElementRef;
  hottable_height: number;

  groupe_list: any[];
  table_datas: any[][];
  mergeCells: any[][];
  readonlyRows: boolean[][];
  table_settings: any[];

  constructor(private input: InputSteelsService) {

  }

  ngOnInit() {

    const height = this.ht_container.nativeElement.offsetHeight;
    this.hottable_height = height - 250;
    this.table_settings = new Array();
    this.groupe_list = this.input.getSteelColumns();
    this.table_datas = new Array(this.groupe_list.length);
    this.mergeCells = new Array(this.groupe_list.length);
    this.readonlyRows = new Array(this.groupe_list.length);

    for (let i = 0; i < this.groupe_list.length; i++) {
      this.table_datas[i] = new Array();
      this.mergeCells[i] = new Array();
      this.readonlyRows[i] = new Array();

      let row: number = 0;
      for (let j = 0; j < this.groupe_list[i].length; j++) {
        const member = this.groupe_list[i][j];

        const positionCount: number = member['positions'].length;
        this.mergeCells[i].push({ row: row, col: 0, rowspan: positionCount * 2, colspan: 1 });

        for (let k = 0; k < positionCount; k++) {
          const data = member['positions'][k];
          const column1 = {};
          const column2 = {};
          if (k === 0) {
            // 最初の行には 部材番号を表示する
            column1['m_no'] = data['m_no'];
          }
          // 1行目
          column1['index'] = data['index'];
          const a: number = this.input.toNumber(data['position']);
          column1['position'] = (a === null) ? '' : a.toFixed(3);
          column1['p_name'] = data['p_name'];
          column1['p_name_ex'] = data['p_name_ex'];
          column1['bh'] = data['b'];

          column1['design_point_id'] = data['I'].title;

          column1['upper_left_cover'] = data['I'].upper_cover;

          column1['upper_left_width'] = data['I'].upper_width;
          column1['upper_left_thickness'] = data['I'].upper_thickness;

          column1['web_thickness'] = data['I'].web_thickness;
          column1['web_height'] = data['I'].web_height;

          column1['lower_right_width'] = data['I'].lower_width;
          column1['lower_right_thickness'] = data['I'].lower_thickness;

          this.table_datas[i].push(column1);

          // 2行目
          column2['bh'] = data['h'];

          column2['design_point_id'] = data['H'].title;

          column2['upper_left_cover'] = data['H'].left_cover;

          column2['upper_left_width'] = data['H'].left_width;
          column2['upper_left_thickness'] = data['H'].left_thickness;

          column2['web_thickness'] = data['H'].web_thickness;
          column2['web_height'] = data['H'].web_height;

          column2['lower_right_width'] = data['H'].right_width;
          column2['lower_right_thickness'] = data['H'].right_thickness;

          // SRCの情報
          if (data.shape.indexOf('SRC') >= 0) {
            this.readonlyRows[i].push(false);
            this.readonlyRows[i].push(false);
          } else {
            // SRCではない場合
            for (const key of ['upper_left_cover', 'upper_left_width', 'upper_left_thickness',
                               'web_thickness', 'web_height',
                               'lower_right_width', 'lower_right_thickness']) {
              column1[key] = null;
              column2[key] = null;
            }
            this.readonlyRows[i].push(true);
            this.readonlyRows[i].push(true);
          }
          this.table_datas[i].push(column2);

          // セルの結合情報
          for (let col = 1; col <= 2; col++) {
            this.mergeCells[i].push({ row: row, col: col, rowspan: 2, colspan: 1 });
          }
          for (let col = 12; col <= 18; col++) {
            this.mergeCells[i].push({ row: row, col: col, rowspan: 2, colspan: 1 });
          }

          row += 2;
        }
      }
      this.table_settings.push({
        cells: (row, col, prop) => {
          const cellProperties: any = {};
          cellProperties.readOnly = this.readonlyRows[i][row];
          return cellProperties;
        }
      });
    }
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy() {
    this.saveData();
  }
  public saveData(): void {
    this.input.setSteelsColumns(this.table_datas);
  }

}
