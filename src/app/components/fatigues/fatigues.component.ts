import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { InputFatiguesService } from './input-fatigues.service';

@Component({
  selector: 'app-fatigues',
  templateUrl: './fatigues.component.html',
  styleUrls: ['./fatigues.component.scss']
})
export class FatiguesComponent implements OnInit {

  @ViewChild('ht_container') ht_container: ElementRef;
  hottable_height: number;

  groupe_list: any[];
  table_datas: any[][];

  table_settings = {
    beforeChange: (source, changes) => {
    },
    afterChange: (hotInstance, changes, source) => {
    }
  };


  constructor(private input: InputFatiguesService) {

  }

  ngOnInit() {
    
    const height = this.ht_container.nativeElement.offsetHeight;
    this.hottable_height = height - 250;

    this.groupe_list = this.input.getFatiguesColumns();
    this.table_datas = new Array(this.groupe_list.length);

    for (let i = 0; i < this.groupe_list.length; i++) {
      this.table_datas[i] = new Array();
      for (let j = 0; j < this.groupe_list[i].length; j++) {
        const member = this.groupe_list[i][j];
        for (let k = 0; k < member['positions'].length; k++) {
          const data = member['positions'][k];
          const column1 = {};
          const column2 = {};
          if (k === 0) {
            // 最初の行には 部材番号を表示する
            column1['m_no'] = data['m_no'];
          }
          // 1行目
          column1['index'] = data['index'];
          column1['position'] = data['position'];
          column1['p_name'] = data['p_name'];
          column1['p_name_ex'] = data['p_name_ex'];


          column1['bh'] = data['b'];
          column1['design_point_id'] = data['title1'];

          column1['M_SA'] = data['M1'].SA;
          column1['M_SB'] = data['M1'].SB;
          column1['M_NA06'] = data['M1'].NA06;
          column1['M_NB06'] = data['M1'].NB06;
          column1['M_NA12'] = data['M1'].NA12;
          column1['M_NB12'] = data['M1'].NB12;
          column1['M_A'] = data['M1'].A;
          column1['M_B'] = data['M1'].B;

          column1['V_SA'] = data['V1'].SA;
          column1['V_SB'] = data['V1'].SB;
          column1['V_NA06'] = data['V1'].NA06;
          column1['V_NB06'] = data['V1'].NB06;
          column1['V_NA12'] = data['V1'].NA12;
          column1['V_NB12'] = data['V1'].NB12;
          column1['V_A'] = data['V1'].A;
          column1['V_B'] = data['V1'].B;

          this.table_datas[i].push(column1);

          // 2行目
          column2['bh'] = data['h'];
          column2['design_point_id'] = data['title2'];

          column2['M_SA'] = data['M2'].SA;
          column2['M_SB'] = data['M2'].SB;
          column2['M_NA06'] = data['M2'].NA06;
          column2['M_NB06'] = data['M2'].NB06;
          column2['M_NA12'] = data['M2'].NA12;
          column2['M_NB12'] = data['M2'].NB12;
          column2['M_A'] = data['M2'].A;
          column2['M_B'] = data['M2'].B;

          column2['V_SA'] = data['V2'].SA;
          column2['V_SB'] = data['V2'].SB;
          column2['V_NA06'] = data['V2'].NA06;
          column2['V_NB06'] = data['V2'].NB06;
          column2['V_NA12'] = data['V2'].NA12;
          column2['V_NB12'] = data['V2'].NB12;
          column2['V_A'] = data['V2'].A;
          column2['V_B'] = data['V2'].B;

          this.table_datas[i].push(column2);
        }
      }
    }
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy() {
    this.input.setFatiguesColumns(this.table_datas);
  }


}
