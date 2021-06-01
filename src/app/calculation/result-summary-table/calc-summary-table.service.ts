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

    this.summary_table.push(
      this.default(1, 'aasa')
    );

    this.summary_table.push(
      this.default(1, 'aasa')
    );

  }

  private setValue(target: string, value: any = null): void{

    if(value === null){
      return;
    }

    for(const groupe of value){
      for( const col of groupe.colmns){
          let index: number;
          let side: string;
          let shape: string;
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
            index = col[48];
            side = col[49];
            shape = col[50];
            break;
          case "serviceabilityShearForce":

            break;
        }
      }
    }
  }

  private default(index: number, side: string): any {
    return {
      index: index,
      side: side,
      title: {
        m_no: 1,
        p_name: 2,
        side: 3
      },
      shape: {
        name: 4,
        B: 5,
        H: 6,
        Bt: 7,
        t: 8
      },
      As: {
        AstString: 9,
        AseString: 10,
        AwString: 11,
        Ss: 12
      },
      durabilityMoment: {
        Wd: 13
      },
      earthquakesMoment: {},
      earthquakesShearForce: {},
      restorabilityMoment: {
        ri: 14,
        Md: 15,
        Nd: 16,
        Myd: 17,
        ratio:18
      },
      restorabilityShearForce: {
        Vd: 19,
        Vyd: 20,
        Ratio: 21
      },
      SafetyFatigueMoment: {
        ri: 22,
        rb: 23,
        sigma_min: 24,
        sigma_rd: 25,
        fsr200: 26,
        ratio200: 27
      },
      safetyFatigueShearForce: {
        sigma_min: 28,
        sigma_rd: 29,
        frd: 30,
        ratio: 31
      },
      safetyMoment: {
        ri: 32,
        Md: 33,
        Nd: 34,
        Mud: 35,
        ratio: 36
      },
      safetyShearForce: {
        Vd: 37,
        Vyd: 38,
        Vwcd: 39,
        Vyd_Ratio: 40,
        Vwcd_Ratio: 41
      },
      serviceabilityMoment: {
        sigma_b: 42,
        sigma_c: 43,
        sigma_s: 44,
        Wd: 45,
        Wlim: 46
      },
      serviceabilityShearForce: {
        Vcd: 47,
        Vcd07: 48,
        sigma: 49
      }
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
