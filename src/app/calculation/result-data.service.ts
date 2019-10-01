﻿import { SaveDataService } from '../providers/save-data.service';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ResultDataService {

  constructor(private save: SaveDataService) {
  }
  // 照査表における タイトル１行目を取得
  public getTitleString1(member: any, position: any): any {
    const strPos: string = position.position.toFixed(3);
    const m_no: string = member.m_no.toFixed(0);
    const title: string = m_no + '部材(' + strPos + ')';
    const result = { alien: 'center', value: title };
    return result;
  }

  // 照査表における タイトル２行目を取得
  public getTitleString2(position: any, postdata: any): any {
    let side: string;
    switch (postdata.memo) {
      case '上側引張':
        side = '(上側)';
        break
      case '下側引張':
        side = '(下側)';
        break
      default:
        side = '';
    }
    const title: string = position.p_name_ex + side;
    const result = { alien: 'center', value: title };
    return result;
  }
  // 照査表における タイトル３行目を取得
  public getTitleString3(position: any): any {
    const title: string = position.memberInfo.shape;
    const result = { alien: 'center', value: title };
    return result;
  }

  // 照査表における 断面幅の文字列を取得
  public getShapeString_B(printData: any): any {
    const result = { alien: 'right', value: printData.B };
    return result;
  }

  // 照査表における 断面高さの文字列を取得
  public getShapeString_H(printData: any): any {
    const result = { alien: 'right', value: printData.H };
    return result;
  }

  // 照査表における フランジ幅の文字列を取得
  public getShapeString_Bt(printData: any): any {
    if ('Bt' in printData) {
      return { alien: 'right', value: printData.Bt };
    } else {
      return { alien: 'center', value: '-' };
    }
  }

  // 照査表における フランジ高さの文字列を取得
  public getShapeString_t(printData: any): any {
    if ('t' in printData) {
      return { alien: 'right', value: printData.t };
    } else {
      return { alien: 'center', value: '-' };
    }
  }

  // 照査表における 引張鉄筋情報を取得
  public getAsString(printData: any, symbol: string = 'Ast'): any {

    if (symbol in printData === false) {
      return {
        As: { alien: 'center', value: '-' },
        AsString: { alien: 'center', value: '-' },
        ds: { alien: 'center', value: '-' }
      };
    }

    const subscript: string = symbol.replace('As', '');
    const As: string = symbol;
    const AsString: string = symbol + 'String';
    const ds: string = 'ds' + subscript;

    const result = {
      As: { alien: 'right', value: printData[As].toFixed(1) },
      AsString: { alien: 'right', value: printData[AsString] },
      ds: { alien: 'right', value: printData[ds].toFixed(1) }
    };

    return result;
  }

  // 照査表における コンクリート強度情報を取得
  public getFckString(printData: any): any {
    const result = {};

    if ('fck' in printData) {
      result['fck'] = { alien: 'right', value: printData.fck.toFixed(1) };
    } else {
      result['fck'] = { alien: 'center', value: '-' };
    }

    if ('rc' in printData) {
      result['rc'] = { alien: 'right', value: printData.rc.toFixed(2) };
    } else {
      result['rc'] = { alien: 'center', value: '-' };
    }

    if ('Ec' in printData) {
      result['Ec'] = { alien: 'right', value: printData.Ec.toFixed(1) };
    } else {
      result['Ec'] = { alien: 'center', value: '-' };
    }

    if ('fck' in printData && 'rc' in printData) {
      result['fcd'] = { alien: 'right', value: (printData.fck / printData.rc).toFixed(1) };
    } else {
      result['fcd'] = { alien: 'center', value: '-' };
    }

    return result;
  }

  // 照査表における 鉄筋強度情報を取得
  public getFskString(printData: any): any {
    const result = {};

    if ('fsy' in printData) {
      result['fsy'] = { alien: 'right', value: printData.fsy.toFixed(0) };
    } else {
      result['fsy'] = { alien: 'center', value: '-' };
    }

    if ('rs' in printData) {
      result['rs'] = { alien: 'right', value: printData.rs.toFixed(2) };
    } else {
      result['rs'] = { alien: 'center', value: '-' };
    }

    if ('Es' in printData) {
      result['Es'] = { alien: 'right', value: printData.Ec.toFixed(0) };
    } else {
      result['Es'] = { alien: 'center', value: '-' };
    }

    if ('fsy' in printData && 'rs' in printData) {
      result['fsd'] = { alien: 'right', value: (printData.fsy / printData.rs).toFixed(1) };
    } else {
      result['fsd'] = { alien: 'center', value: '-' };
    }

    if ('fsu' in printData) {
      result['fsu'] = { alien: 'right', value: printData.fsu.toFixed(0) };
    } else {
      result['fsu'] = { alien: 'center', value: '-' };
    }


    return result;
  }

}