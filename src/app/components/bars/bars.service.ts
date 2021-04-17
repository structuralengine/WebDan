import { Injectable } from '@angular/core';
import { DataHelperModule } from '../../providers/data-helper.module';
import { InputDesignPointsService } from '../design-points/design-points.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InputBarsService {

  // 鉄筋情報
  public bar_list: any[];

  constructor(private helper: DataHelperModule,
              private points: InputDesignPointsService) {
    this.clear();
  }
  public clear(): void {
    this.bar_list = new Array();
  }

  public getBarsColumn(index: any): any{

    let result = this.bar_list.find((value)=> value.index === index);
    if(result === undefined){
      result = this.default_bars(index);
      this.bar_list.push(result);
    }
    return result;
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

  public matchBarSize(dia: any): number {

    let result: number = null;
    const temp = this.helper.toNumber(dia);
    for ( const d of this.helper.rebar_List ){
      if ( d.D === temp){
        result = temp;
        break;
      }       
    }
    return result;
  }
}
