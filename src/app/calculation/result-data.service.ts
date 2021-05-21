import { SaveDataService } from '../providers/save-data.service';

import { Injectable } from '@angular/core';
import { DataHelperModule } from '../providers/data-helper.module';
import { SetSectionService } from './set-section.service';
import { SetBarService } from './set-bar.service';

@Injectable({
  providedIn: 'root'
})

export class ResultDataService {

  constructor(
    private section: SetSectionService,
    private steel: SetBarService,
    private helper: DataHelperModule) {
  }

  public getTitleString(member: any, position: any, side: string): any {

    // 照査表における タイトル１行目を取得
    let strPos = '';
    if ( this.helper.toNumber(position.position) !== null ) {
      strPos = position.position.toFixed(3);
    }
    const m_no: string = member.m_no.toFixed(0);
    let title1: string = m_no + '部材';
    if (member.m_len > 0) {
      title1 += '(' + strPos + ')';
    }

    // 照査表における タイトル２行目を取得
    const title2: string = position.p_name;// + side;

    // 照査表における タイトル３行目を取得
    const title3: string = side;
  
    return {
      m_no: title1,
      p_name: title2,
      side: title3
    };
  }


  // 照査表における 断面の文字列を取得
  public getShapeString(target: string, member: any, res: any): any{

    const shapeName = this.section.getShapeName(member, res.side );

    const sectionInfo = this.section.getShape(shapeName, member, target, res.index);

    const result = {
      B: this.helper.toNumber(sectionInfo.B),
      H: this.helper.toNumber(sectionInfo.H),
      Bt: this.helper.toNumber(sectionInfo.Bt),
      t: this.helper.toNumber(sectionInfo.t)
    };

    for(const key of Object.keys(result)){
      if(result[key] === null){
        result[key] = { alien: 'center', value: '-'};
      } else {
        result[key] = { alien: 'right', value: result[key]};
      }
    }

    result['shape'] = shapeName;

    return result;
  }


  // 照査表における 引張鉄筋情報を取得
  public getAsString(target: string, shapeName: string, res: any, safety: any): any {

    const bar = this.steel.getAs(shapeName, res.index, res.side);

    const result = {
      Ast:  null,
      AstString:  null,
      dst:  null,

      Asc: null,
      AscString: null,
      dsc: null,

      Ase: null,
      AseString: null,
      dse: null
    };

    /////////////// 引張鉄筋 ///////////////
    const Astx: number = this.helper.getAs(bar.tension.dia) * bar.tension.n * bar.tension.cos;
    const dstx: number = this.steel.getBarCenterPosition(bar.tension.dsc, bar.tension.n, bar.tension.line, bar.tension.space, bar.tension.cos);

    result['Ast'] = Astx.toFixed(2);
    result['AstString'] = bar.tension.dia + '-' + bar.tension.n + '本';
    result['dst'] = (Number.isInteger(dstx)) ? dstx.toFixed(0) : dstx.toFixed(2);


    /////////////// 圧縮鉄筋 ///////////////
    if (safety.safety_factor.range >= 2) {
      const Ascx: number = this.helper.getAs(bar.compres.dia) * bar.compres.n * bar.compres.cos;
      const dscx: number = this.steel.getBarCenterPosition(bar.compres.dsc, bar.compres.n, bar.compres.line, bar.compres.space, bar.compres.cos);

      result['Asc'] = Ascx.toFixed(2);
      result['AscString'] = bar.compres.dia + '-' + bar.compres.n + '本';
      result['dsc'] = (Number.isInteger(dscx)) ? dscx.toFixed(0) : dscx.toFixed(2);
    }

    /////////////// 側面鉄筋 ///////////////
    if (safety.safety_factor.range >= 3) {
      const Asex: number = this.helper.getAs(bar.sidebar.dia) * bar.sidebar.n;
      const dsex: number = this.steel.getBarCenterPosition(bar.sidebar.dsc, bar.sidebar.n, bar.sidebar.line, bar.sidebar.space, bar.sidebar.cos);

      result['Ase'] = Asex.toFixed(2);
      result['AseString'] = bar.sidebar.dia + '-' + bar.sidebar.n + '段';
      result['dse'] = (Number.isInteger(dsex)) ? dsex.toFixed(0) : dsex.toFixed(2);
    }

    for(const key of Object.keys(result)){
      if(result[key] === null){
        result[key] = { alien: 'center', value: '-'};
      } else {
        result[key] = { alien: 'center', value: result[key]};
      }
    }

    result['AstCos'] = bar.tension.cos;
    result['AscCos'] = bar.compres.cos;

    return result;
  }

  // 照査表における コンクリート強度情報を取得
  public getFckString(safety: any): any {
    const result = {};

    const PrintData: any = this.section.getSectionElastic(safety);

    if ('fck' in PrintData) {
      if (PrintData.rfck === 1) {
        result['fck'] = { alien: 'right', value: PrintData.fck.toFixed(1) };
      } else {
        const value = PrintData.fck * PrintData.rfck;
        result['fck'] = { alien: 'right', value: value.toFixed(1) };
      }
    } else {
      result['fck'] = { alien: 'center', value: '-' };
    }

    if ('rc' in PrintData) {
      result['rc'] = { alien: 'right', value: PrintData.rc.toFixed(2) };
    } else {
      result['rc'] = { alien: 'center', value: '-' };
    }

    if ('Ec' in PrintData) {
      if (PrintData.rEc === 1) {
        result['Ec'] = { alien: 'right', value: PrintData.Ec.toFixed(1) };
      } else {
        const value = PrintData.Ec * PrintData.rEc;
        result['Ec'] = { alien: 'right', value: value.toFixed(1) };
      }
    } else {
      result['Ec'] = { alien: 'center', value: '-' };
    }

    if ('fck' in PrintData && 'rc' in PrintData) {
      result['fcd'] = { alien: 'right', value: (PrintData.rfck * PrintData.fck / PrintData.rc).toFixed(1) };
    } else {
      result['fcd'] = { alien: 'center', value: '-' };
    }

    return result;
  }

  // 照査表における 鉄筋強度情報を取得
  public getFskString(PrintData: any): any {
    const result = {};

    if ('fsy' in PrintData) {
      result['fsy'] = { alien: 'right', value: PrintData.fsy.toFixed(0) };
    } else {
      result['fsy'] = { alien: 'center', value: '-' };
    }

    if ('rs' in PrintData) {
      result['rs'] = { alien: 'right', value: PrintData.rs.toFixed(2) };
    } else {
      result['rs'] = { alien: 'center', value: '-' };
    }

    if ('Es' in PrintData) {
      result['Es'] = { alien: 'right', value: PrintData.Ec.toFixed(0) };
    } else {
      result['Es'] = { alien: 'center', value: '-' };
    }

    if ('fsy' in PrintData && 'rs' in PrintData) {
      result['fsd'] = { alien: 'right', value: (PrintData.fsy / PrintData.rs).toFixed(1) };
    } else {
      result['fsd'] = { alien: 'center', value: '-' };
    }

    if ('fsu' in PrintData) {
      result['fsu'] = { alien: 'right', value: PrintData.fsu.toFixed(0) };
    } else {
      result['fsu'] = { alien: 'center', value: '-' };
    }

    return result;
  }



}
