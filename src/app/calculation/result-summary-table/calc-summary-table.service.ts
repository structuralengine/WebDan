import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalcSummaryTableService {

  //
  public summary_table: any;

  // 計算終了フラグ
  private summaryDone: any;

  constructor() { }
  
  public clear() {
    this.summary_table = {};
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

  public setSummaryTable(target: string, value: any = null){

    if(value === null){
      this.summaryDone[target] = true; 
      return;
    }

    this.setValue(target, value);
    this.summaryDone[target] = true; 

  }

  private setValue(target: string, value: any): void{

    if(value === null){
      return;
    }

    for(const groupe of value){
      for( const col of groupe.columns){

        let index: number, side: string, key: string, shape: string;
        let columns: any

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
            // index と side が同じデータだ既に登録されていればそのデータに追加する
            index = col[48];
            side = col[49];
            key = index + '-' + side;
            columns = (key in this.summary_table) ? this.summary_table[key] : this.default(index, side);

            // 断面位置
            columns.title.m_no = col[0].value;
            columns.title.p_name = col[1].value;
            columns.title.side = col[2].value;
            // 断面形状
            columns.shape.name = col[50];
            columns.shape.B = col[3].value;
            columns.shape.H = col[4].value;
            columns.shape.Bt = col[5].value;
            columns.shape.t = col[6].value;
            // 鉄筋量
            columns.As.AstString = col[8].value;
            columns.As.AseString = col[14].value;
            // 照査結果
            columns.serviceabilityMoment.sigma_b = col[25].value;
            columns.serviceabilityMoment.sigma_c = col[28].value;
            columns.serviceabilityMoment.sigma_s = col[29].value;
            columns.serviceabilityMoment.Wd = col[43].value;
            columns.serviceabilityMoment.Wlim = col[44].value;

            this.summary_table[key] = columns;
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
