import { Injectable } from '@angular/core';
import { DataHelperModule } from '../../providers/data-helper.module';
import { InputDesignPointsService } from '../design-points/design-points.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InputBarsService {

  // 鉄筋情報
  private bar_list: any[];

  constructor(private helper: DataHelperModule,
    private points: InputDesignPointsService) {
    this.clear();
  }
  public clear(): void {
    this.bar_list = new Array();
  }

  // 鉄筋情報
  private default_bars(id: number): any {
    return {
      index: id,
      m_no: null,
      position: null,
      p_name: null,
      p_name_ex: null,
      b: null,
      h: null,
      haunch_M: null,
      haunch_V: null,
      rebar1: this.default_rebar('上'),
      rebar2: this.default_rebar('下'),
      sidebar: this.default_sidebar(),
      starrup: this.default_starrup(),
      bend: this.default_bend(),
      tan: null
    };
  }

  private default_rebar(title: string): any {
    return {
      'title': title,
      'rebar_dia': null,
      'rebar_n': null,
      'rebar_cover': null,
      'rebar_lines': null,
      'rebar_space': null,
      'rebar_ss': null,
      'cos': null,
      'enable': null
    };
  }

  private default_sidebar(): any {
    return {
      'side_dia': null,
      'side_n': null,
      'side_cover': null,
      'side_ss': null
    };
  }

  private default_starrup(): any {
    return {
      'stirrup_dia': null,
      'stirrup_n': null,
      'stirrup_ss': null
    };
  }

  private default_bend(): any {
    return {
      'bending_dia': null,
      'bending_n': null,
      'bending_ss': null,
      'bending_angle': null
    };
  }

  public getTableColumns(): any[] {

    const table_datas: any[] = new Array();

    // グリッド用データの作成
    const groupe_list = this.points.getGroupeList();
    for (let i = 0; i < groupe_list.length; i++) {
      table_datas.push([]);
      const groupe = groupe_list[i];

      // 部材
      for (const member of groupe_list[i]) {

        // 着目点
        for (let k = 0; k < member.positions.length; k++) {
          const pos = member.positions[k];
          if (!this.points.isEnable(pos)) {
            continue;
          }
          // barデータに（部材、着目点など）足りない情報を追加する
          const data: any = this.getTableColumn(pos.index);
          data.m_no = member.m_no;
          data.b = member.B;
          data.h = member.H;
          data.position = pos.position;
          data.p_name = pos.p_name;
          data.p_name_ex = pos.p_name;

          // データを2行に分ける
          const column1 = {};
          const column2 = {};
          column1['m_no'] = (k === 0) ? data.m_no: ''; // 最初の行には 部材番号を表示する
          // 1行目
          column1['index'] = data.index;
          const a: number = this.helper.toNumber(data.position);
          column1['position'] = (a === null) ? '' : a.toFixed(3);
          column1['p_name'] = data['p_name'];
          column1['p_name_ex'] = data['p_name_ex'];
          column1['bh'] = data['b'];
          column1['haunch_height'] = data['haunch_M'];

          column1['design_point_id'] = data['rebar1'].title;
          column1['rebar_dia'] = data['rebar1'].rebar_dia;
          column1['rebar_n'] = data['rebar1'].rebar_n;
          column1['rebar_cover'] = data['rebar1'].rebar_cover;
          column1['rebar_lines'] = data['rebar1'].rebar_lines;
          column1['rebar_space'] = data['rebar1'].rebar_space;
          column1['rebar_ss'] = data['rebar1'].rebar_ss;
          column1['cos'] = data['rebar1'].cos;
          column1['enable'] = data['rebar1'].enable;

          column1['side_dia'] = data['sidebar'].side_dia;
          column1['side_n'] = data['sidebar'].side_n;
          column1['side_cover'] = data['sidebar'].side_cover;
          column1['side_ss'] = data['sidebar'].side_ss;

          column1['stirrup_dia'] = data['starrup'].stirrup_dia;
          column1['stirrup_n'] = data['starrup'].stirrup_n;
          column1['stirrup_ss'] = data['starrup'].stirrup_ss;

          column1['tan'] = data['tan'];
          table_datas[i].push(column1);

          // 2行目
          column2['bh'] = data['h'];
          column2['haunch_height'] = data['haunch_V'];

          column2['design_point_id'] = data['rebar2'].title;
          column2['rebar_dia'] = data['rebar2'].rebar_dia;
          column2['rebar_n'] = data['rebar2'].rebar_n;
          column2['rebar_cover'] = data['rebar2'].rebar_cover;
          column2['rebar_lines'] = data['rebar2'].rebar_lines;
          column2['rebar_space'] = data['rebar2'].rebar_space;
          column2['rebar_ss'] = data['rebar2'].rebar_ss;
          column2['stirrup_dia'] = data['bend'].bending_dia;
          column2['stirrup_n'] = data['bend'].bending_n;
          column2['stirrup_ss'] = data['bend'].bending_ss;
          column2['cos'] = data['rebar2'].cos;
          column2['enable'] = data['rebar2'].enable;

          table_datas[i].push(column2);
        }
      }
    }
    return table_datas;
  }

  private getTableColumn(index: any): any {

    let result = this.bar_list.find((value) => value.index === index);
    if (result === undefined) {
      result = this.default_bars(index);
      this.bar_list.push(result);
    }
    return result;
  }

  public setSaveData(bars: any[]) {

    this.bar_list = new Array();

    for (let i = 0; i < bars.length; i += 2) {
      const column1 = bars[i];
      const column2 = bars[i + 1];

      const b = this.default_bars(column1.index);
      b.p_name = column1.p_name;
      b.position = column1.position;
      b.m_no = column1.m_no;
      b.p_name_ex = column1.p_name_ex;
      b.b = column1.bh;
      b.h = column2.bh;
      b.haunch_M = column1.haunch_height;
      b.haunch_V = column2.haunch_height;

      b.rebar1.title = column1.design_point_id;
      b.rebar1.rebar_dia = column1.rebar_dia;
      b.rebar1.rebar_n = column1.rebar_n;
      b.rebar1.rebar_cover = column1.rebar_cover;
      b.rebar1.rebar_lines = column1.rebar_lines;
      b.rebar1.rebar_space = column1.rebar_space;
      b.rebar1.rebar_ss = column1.rebar_ss;
      b.rebar1.cos = column1.cos;
      b.rebar1.enable = column1.enable;

      b.rebar2.title = column2.design_point_id;
      b.rebar2.rebar_dia = column2.rebar_dia;
      b.rebar2.rebar_n = column2.rebar_n;
      b.rebar2.rebar_cover = column2.rebar_cover;
      b.rebar2.rebar_lines = column2.rebar_lines;
      b.rebar2.rebar_space = column2.rebar_space;
      b.rebar2.rebar_ss = column2.rebar_ss;
      b.rebar2.cos = column2.cos;
      b.rebar2.enable = column2.enable;

      b.sidebar.side_dia = column1.side_dia;
      b.sidebar.side_n = column1.side_n;
      b.sidebar.side_cover = column1.side_cover;
      b.sidebar.side_ss = column1.side_ss;

      b.starrup.stirrup_dia = column1.stirrup_dia;
      b.starrup.stirrup_n = column1.stirrup_n;
      b.starrup.stirrup_ss = column1.stirrup_ss;

      b.bend.bending_dia = column2.stirrup_dia;
      b.bend.bending_n = column2.stirrup_n;
      b.bend.bending_ss = column2.stirrup_ss;
      b.bend.bending_angle = 45;

      b.tan = column1.tan;

      this.bar_list.push(b);
    }
  }

  public setPickUpData() {

  }

  public getSaveData(): any[] {
    return this.bar_list;
  }

  public matchBarSize(dia: any): number {

    let result: number = null;
    const temp = this.helper.toNumber(dia);
    for (const d of this.helper.rebar_List) {
      if (d.D === temp) {
        result = temp;
        break;
      }
    }
    return result;
  }

}
