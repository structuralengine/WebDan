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
    if (this.helper.toNumber(position.position) !== null) {
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
  public getShapeString(target: string, member: any, res: any): any {

    const shapeName = this.section.getShapeName(member, res.side);

    const sectionInfo = this.section.getShape(shapeName, member, target, res.index);

    const result = {
      B: this.helper.toNumber(sectionInfo.B),
      H: this.helper.toNumber(sectionInfo.H),
      Bt: this.helper.toNumber(sectionInfo.Bt),
      t: this.helper.toNumber(sectionInfo.t)
    };

    for (const key of Object.keys(result)) {
      if (result[key] === null) {
        result[key] = { alien: 'center', value: '-' };
      } else {
        result[key] = { alien: 'right', value: result[key] };
      }
    }

    result['shape'] = shapeName;

    return result;
  }


  // 照査表における 引張鉄筋情報を取得
  public getAsString(target: string, shapeName: string, res: any, safety: any): any {

    const bar = this.steel.getAs(shapeName, res.index, res.side);

    const result = {
      Ast: null,
      AstString: null,
      dst: null,

      Asc: null,
      AscString: null,
      dsc: null,

      Ase: null,
      AseString: null,
      dse: null
    };

    /////////////// 引張鉄筋 ///////////////
    const fsyt = this.steel.getFsyk(bar.tension.rebar_dia, safety.material_bar);
    if (fsyt.fsy === 235) {
      bar.tension.mark = "R"; // 鉄筋強度が 235 なら 丸鋼
    }
    const markt = (bar.tension.mark === "R") ? 'φ' : 'D';
    const Ast = markt + bar.tension.rebar_dia;
    const Astx: number = this.helper.getAs(Ast) * bar.tension.rebar_n * bar.tension.cos;
    const dstx: number = this.steel.getBarCenterPosition(
      bar.tension.dsc, bar.tension.rebar_n, bar.tension.line,
      bar.tension.space, bar.tension.cos);

    result['Ast'] = Astx.toFixed(2);
    result['AstString'] = Ast + '-' + bar.tension.rebar_n + '本';
    result['dst'] = (Number.isInteger(dstx)) ? dstx.toFixed(0) : dstx.toFixed(2);


    /////////////// 圧縮鉄筋 ///////////////
    if (safety.safety_factor.range >= 2) {
      const fsyc = this.steel.getFsyk(bar.compres.rebar_dia, safety.material_bar);
      if (fsyc.fsy === 235) {
        bar.compres.mark = "R"; // 鉄筋強度が 235 なら 丸鋼
      }
      const markc = (bar.compres.mark === "R") ? 'φ' : 'D';
      const Asc = markc + bar.compres.rebar_dia;
      const Ascx: number = this.helper.getAs(Asc) * bar.compres.rebar_n * bar.compres.cos;
      const dscx: number = this.steel.getBarCenterPosition(
        bar.compres.dsc, bar.compres.rebar_n, bar.compres.line,
        bar.compres.space, bar.compres.cos);

      result['Asc'] = Ascx.toFixed(2);
      result['AscString'] = Asc + '-' + bar.compres.rebar_n + '本';
      result['dsc'] = (Number.isInteger(dscx)) ? dscx.toFixed(0) : dscx.toFixed(2);
    }

    /////////////// 側面鉄筋 ///////////////
    if (safety.safety_factor.range >= 3) {
      const fsye = this.steel.getFsyk(bar.sidebar.rebar_dia, safety.material_bar, "sidebar");
      if (fsye.fsy === 235) {
        bar.sidebar.mark = "R"; // 鉄筋強度が 235 なら 丸鋼
      }
      const marke = (bar.sidebar.mark === "R") ? 'φ' : 'D';
      const Ase = marke + bar.sidebar.rebar_dia;
      const Asex: number = this.helper.getAs(Ase) * bar.sidebar.rebar_n;
      const dsex: number = this.steel.getBarCenterPosition(
        bar.sidebar.dsc, bar.sidebar.rebar_n, bar.sidebar.line,
        bar.sidebar.space, bar.sidebar.cos);

      result['Ase'] = Asex.toFixed(2);
      result['AseString'] = Ase + '-' + bar.sidebar.rebar_n + '段';
      result['dse'] = (Number.isInteger(dsex)) ? dsex.toFixed(0) : dsex.toFixed(2);
    }

    for (const key of Object.keys(result)) {
      if (result[key] === null) {
        result[key] = { alien: 'center', value: '-' };
      } else {
        result[key] = { alien: 'center', value: result[key] };
      }
    }

    result['AstCos'] = bar.tension.cos;
    result['AscCos'] = bar.compres.cos;


    // 照査表における 鉄筋強度情報を取得
    if ('fsy' in fsyt) {
      result['fsy'] = { alien: 'right', value: fsyt.fsy.toFixed(0) };
      result['Es'] = { alien: 'right', value: '200' };
      result['fsd'] = { alien: 'right', value: (fsyt.fsy / safety.safety_factor.rs).toFixed(1) };
    } else {
      result['fsy'] = { alien: 'center', value: '-' };
      result['Es'] = { alien: 'center', value: '-' };
      result['fsd'] = { alien: 'center', value: '-' };
    }

    if ('rs' in safety.safety_factor) {
      result['rs'] = { alien: 'right', value: safety.safety_factor.rs.toFixed(2) };
    } else {
      result['rs'] = { alien: 'center', value: '-' };
    }

  if ('fsu' in fsyt) {
      result['fsu'] = { alien: 'right', value: fsyt.fsu.toFixed(0) };
    } else {
      result['fsu'] = { alien: 'center', value: '-' };
    }

    return result;
  }

  // 照査表における コンクリート強度情報を取得
  public getFckString(safety: any): any {
    const result = {};

    const pile = safety.pile_factor.find(e => e.selected === true);
    const rfck = (pile !== undefined) ? pile.rfck : 1;
    const rEc = (pile !== undefined) ? pile.rEc : 1;
    let rc = safety.safety_factor.rc;

    if ('rc' in safety.safety_factor) {
      result['rc'] = { alien: 'right', value: rc.toFixed(2) };
    } else {
      result['rc'] = { alien: 'center', value: '-' };
      rc = 1;
    }

    if ('fck' in safety.material_concrete) {
      const fck = safety.material_concrete.fck;
      if (rfck === 1) {
        result['fck'] = { alien: 'right', value: fck.toFixed(1) };
      } else {
        const value = fck * rfck;
        result['fck'] = { alien: 'right', value: value.toFixed(1) };
      }

      const Ec = this.section.getEc(result['fck']);
      if (rEc === 1) {
        result['Ec'] = { alien: 'right', value: Ec.toFixed(1) };
      } else {
        const value = Ec * rEc;
        result['Ec'] = { alien: 'right', value: value.toFixed(1) };
      }

      result['fcd'] = { alien: 'right', value: (rfck * fck / rc).toFixed(1) };

    } else {
      result['fck'] = { alien: 'center', value: '-' };
      result['Ec'] = { alien: 'center', value: '-' };
      result['fcd'] = { alien: 'center', value: '-' };
    }

    return result;
  }


}
