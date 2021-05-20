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
    const title3: string = position.memberInfo.shape + side;
  
    return {
      m_no: title1,
      p_name: title2,
      side: title3
    };
  }


  // 照査表における 断面の文字列を取得
  public getShapeString(target: string, member: any, position: any){

    const shapeName = this.section.getShapeName(member, position.side );
    const sectionInfo = this.section.getShape(target, member, position);

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

    return result;
  }


  // 照査表における 引張鉄筋情報を取得
  public getAsString(shapeName: string, member: any, position: any): any {

    const barInfo = this.steel.getAs(shapeName, member, position);
    const result = {};
/*

    if (symbol in PrintData === false) {
      return {
        As: { alien: 'center', value: '-' },
        AsString: { alien: 'center', value: '-' },
        ds: { alien: 'center', value: '-' },
        cos: { alien: 'center', value: '-' },
        tan: null
      };
    }

    const subscript: string = symbol.replace('As', '');
    const As: string = symbol;
    const AsString: string = symbol + 'String';
    const ds: string = 'ds' + subscript;

    const cossymbol: string = 'cos' + symbol;
    let cosvalue: number = this.helper.toNumber( PrintData[cossymbol]);

    if (cosvalue === null) {
      cosvalue = 1;
    }

    let Ass: string =  PrintData[As].toFixed(1);
    if (cosvalue  !== 1) {
      Ass = '(' + cosvalue.toFixed(3) + ')' + Ass;
    }

    const result = {
      As: { alien: 'right', value: Ass },
      AsString: { alien: 'right', value: PrintData[AsString] },
      ds: { alien: 'right', value: PrintData[ds].toFixed(1) }
    };
*/
    return result;
  }

  // 照査表における コンクリート強度情報を取得
  public getFckString(PrintData: any): any {
    const result = {};

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
