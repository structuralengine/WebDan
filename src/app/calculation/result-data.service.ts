import { SaveDataService } from '../providers/save-data.service';

import { Injectable } from '@angular/core';
import { DataHelperModule } from '../providers/data-helper.module';

@Injectable({
  providedIn: 'root'
})

export class ResultDataService {

  constructor(
    private save: SaveDataService,
    private helper: DataHelperModule) {
  }
  // 照査表における タイトル１行目を取得
  public getTitleString1(member: any, position: any): any {

    let strPos = '';
    if ( this.helper.toNumber(position.position) !== null ) {
      strPos = position.position.toFixed(3);
    }
    const m_no: string = member.m_no.toFixed(0);
    let title: string = m_no + '部材';
    if (member.m_len > 0) {
      title += '(' + strPos + ')';
    }
    const result = { alien: 'center', value: title };
    return result;
  }

  // 照査表における タイトル２行目を取得
  public getTitleString2(position: any, postdata: any): any {

    const title: string = position.p_name_ex;// + side;
    const result = { alien: 'center', value: title };
    return result;
  }
  // 照査表における タイトル３行目を取得
  public getTitleString3( position: any, postdata: any): any {

    const g_id: string = position.memberInfo.g_id;
    let side: string;

    // グループタイプ によって 上側・下側の表示を 右側・左側 等にする
    let upperSideName: string = '(上側)';
    let bottomSideName: string = '(下側)';
    if (g_id.toUpperCase().indexOf('R') >= 0) {
      upperSideName = '(外側)';
      bottomSideName = '(内側)';
    }
    if (g_id.toUpperCase().indexOf('L') >= 0) {
      upperSideName = '(内側)';
      bottomSideName = '(外側)';
    }
    if (g_id.toUpperCase().indexOf('P') >= 0) {
      upperSideName = '';
      bottomSideName = '';
    }
    if (g_id.toUpperCase().indexOf('C') >= 0) {
      upperSideName = '';
      bottomSideName = '';
    }

    switch (postdata.memo) {
      case '上側引張':
        side = upperSideName;
        break;
      case '下側引張':
        side = bottomSideName;
        break;
      default:
        side = '';
    }
    const title: string = position.memberInfo.shape + side;
    const result = { alien: 'center', value: title };
    return result;
  }

  // 照査表における 断面幅の文字列を取得
  public getShapeString_B(PrintData: any): any {

    const result = { alien: 'right' };
    switch (PrintData.shape) {
      case 'Ring':              // 円環
      case 'Circle':            // 円形
        result['value'] = PrintData.R;
        break;
      case 'HorizontalOval':    // 水平方向小判形
      case 'VerticalOval':      // 鉛直方向小判形
      case 'InvertedTsection':  // 逆T形
      case 'Tsection':          // T形
      case 'Rectangle':         // 矩形
      default:
        result['value'] = PrintData.B;
        break;
    }
    return result;
  }

  // 照査表における 断面高さの文字列を取得
  public getShapeString_H(PrintData: any): any {

    const result = { alien: 'right' };
    switch (PrintData.shape) {
      case 'Ring':              // 円環
        result['value'] = PrintData.R;
        break;
      case 'Circle':            // 円形
        result['alien'] = 'center';
        result['value'] = '-';
        break;
      case 'HorizontalOval':    // 水平方向小判形
      case 'VerticalOval':      // 鉛直方向小判形
      case 'InvertedTsection':  // 逆T形
      case 'Tsection':          // T形
      case 'Rectangle':         // 矩形
      default:
        result['value'] = PrintData.H;
        break;
    }

    return result;
  }

  // 照査表における フランジ幅の文字列を取得
  public getShapeString_Bt(PrintData: any): any {
    if ('Bt' in PrintData) {
      return { alien: 'right', value: PrintData.Bt };
    } else {
      return { alien: 'center', value: '-' };
    }
  }

  // 照査表における フランジ高さの文字列を取得
  public getShapeString_t(PrintData: any): any {
    if ('t' in PrintData) {
      return { alien: 'right', value: PrintData.t };
    } else {
      return { alien: 'center', value: '-' };
    }
  }

  // 照査表における 引張鉄筋情報を取得
  public getAsString(PrintData: any, symbol: string = 'Ast'): any {

    if (symbol in PrintData === false) {
      return {
        As: { alien: 'center', value: '-' },
        AsString: { alien: 'center', value: '-' },
        ds: { alien: 'center', value: '-' },
        cos: { alien: 'center', value: '-' }
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
