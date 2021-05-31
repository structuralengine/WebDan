import { Injectable } from '@angular/core';
import { utils, write, read, WorkBook } from 'xlsx';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class CalcSummaryTableService {

  //
  public summary_table: any[];

  // 計算終了フラグ
  private summaryDone: any;

  constructor() { }
  
  public clear() {
    this.summary_table = new Array();
    // 計算終了フラグ
    this.summaryDone = {
      durabilityMoment: false,
      earthquakesMoment: false,
      earthquakesShearForce: false,
      restorabilityMoment: false,
      restorabilityShearForce: false,
      SafetyFatigueMoment: false,
      safetyFatigueShearForce: false,
      safetyMoment: false,
      safetyShearForce: false,
      serviceabilityMoment: false,
      serviceabilityShearForce: false
    }
  }

  public setSummaryTable(target: string, value: any){
    this.setValue(target, value);
    this.summaryDone[target] = true; 
  }

  private setValue(target: string, value: any): void{
    switch(target){
      case "durabilityMoment":

        break;
      case "earthquakesMoment":
  
        break;
      case "earthquakesShearForce": 

        break;
      case "restorabilityMoment": 

        break;
      case "restorabilityShearForce":

        break;
      case "SafetyFatigueMoment":

        break;
      case "safetyFatigueShearForce":

        break;
      case "safetyMoment": 

        break;
      case "safetyShearForce": 

        break;
      case "serviceabilityMoment": 

        break;
      case "serviceabilityShearForce":

        break;
    }
  }

  private default(index: number, side: number): any {
    return {
      index: index,
      side: side,
      title: {
        m_no: null,
        p_name: null,
        side: null
      },
      shape: {
        name: null,
        B: null,
        H: null,
        Bt: null,
        t: null
      },
      As: {
        Ast: null,
        AstString: null,
        dst: null,
      },
      durabilityMoment: {},
      earthquakesMoment: {},
      earthquakesShearForce: {},
      restorabilityMoment: {},
      restorabilityShearForce: {},
      SafetyFatigueMoment: {},
      safetyFatigueShearForce: {},
      safetyMoment: {},
      safetyShearForce: {},
      serviceabilityMoment: {},
      serviceabilityShearForce: {}
    };
  }
  // 全ての項目が終了したかチェックする
  public checkDone(): boolean {
    for(const target of Object.keys(this.summaryDone)) {
        if(this.summaryDone[target] === false){
          return false;
        }
      }
    return true;
  }

}
