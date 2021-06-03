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
            columns.As.AscString = col[11].value;
            columns.As.AseString = col[14].value;
            // 照査結果
            columns.durabilityMoment.Wd = col[43].value;

            this.summary_table[key] = columns;
            break;

          case "earthquakesMoment":
            // index と side が同じデータだ既に登録されていればそのデータに追加する
            index = col[33];
            side = col[34];
            key = index + '-' + side;
            columns = (key in this.summary_table) ? this.summary_table[key] : this.default(index, side);

            // 断面位置
            columns.title.m_no = col[0].value;
            columns.title.p_name = col[1].value;
            columns.title.side = col[2].value;
            // 断面形状
            columns.shape.name = col[35];
            columns.shape.B = col[3].value;
            columns.shape.H = col[4].value;
            columns.shape.Bt = col[5].value;
            columns.shape.t = col[6].value;
            // 鉄筋量
            columns.As.AstString = col[8].value;
            columns.As.AscString = col[11].value;
            columns.As.AseString = col[14].value;
            // 照査結果
            columns.earthquakesMoment.ri = col[30].value;
            columns.earthquakesMoment.Md = col[22].value;
            columns.earthquakesMoment.Nd = col[23].value;
            columns.earthquakesMoment.Myd = col[29].value;
            columns.earthquakesMoment.ratio = col[31].value;

            this.summary_table[key] = columns;
            break; 

          case "earthquakesShearForce": 
            // index と side が同じデータだ既に登録されていればそのデータに追加する
            index = col[51];
            side = col[52];
            key = index + '-' + side;
            columns = (key in this.summary_table) ? this.summary_table[key] : this.default(index, side);

            // 断面位置
            columns.title.m_no = col[0].value;
            columns.title.p_name = col[1].value;
            columns.title.side = col[2].value;
            // 断面形状
            columns.shape.name = col[53];
            columns.shape.B = col[3].value;
            columns.shape.H = col[4].value;
            // 鉄筋量
            columns.As.AstString = col[7].value;
            columns.As.AseString = col[10].value;
            columns.As.AseString = col[12].value;
            // 照査結果
            columns.earthquakesShearForce.Vd = col[22].value;
            columns.earthquakesShearForce.Vyd = col[43].value;
            columns.earthquakesShearForce.Vyd_Ratio = col[45].value;

            this.summary_table[key] = columns;
            break;

          case "restorabilityMoment":
            // index と side が同じデータだ既に登録されていればそのデータに追加する
            index = col[33];
            side = col[34];
            key = index + '-' + side;
            columns = (key in this.summary_table) ? this.summary_table[key] : this.default(index, side);

            // 断面位置
            columns.title.m_no = col[0].value;
            columns.title.p_name = col[1].value;
            columns.title.side = col[2].value;
            // 断面形状
            columns.shape.name = col[35];
            columns.shape.B = col[3].value;
            columns.shape.H = col[4].value;
            columns.shape.Bt = col[5].value;
            columns.shape.t = col[6].value;
            // 鉄筋量
            columns.As.AstString = col[8].value;
            columns.As.AscString = col[11].value;
            columns.As.AseString = col[14].value;
            // 照査結果
            columns.restorabilityMoment.ri = col[30].value;
            columns.restorabilityMoment.Md = col[22].value;
            columns.restorabilityMoment.Nd = col[23].value;
            columns.restorabilityMoment.Myd = col[29].value;
            columns.restorabilityMoment.ratio = col[31].value;

            this.summary_table[key] = columns;
            break; 

          case "restorabilityShearForce":
            // index と side が同じデータだ既に登録されていればそのデータに追加する
            index = col[51];
            side = col[52];
            key = index + '-' + side;
            columns = (key in this.summary_table) ? this.summary_table[key] : this.default(index, side);

            // 断面位置
            columns.title.m_no = col[0].value;
            columns.title.p_name = col[1].value;
            columns.title.side = col[2].value;
            // 断面形状
            columns.shape.name = col[53];
            columns.shape.B = col[3].value;
            columns.shape.H = col[4].value;
            // 鉄筋量
            columns.As.AstString = col[7].value;
            columns.As.AseString = col[10].value;
            columns.As.AseString = col[12].value;
            // 照査結果
            columns.restorabilityShearForce.Vd = col[22].value;
            columns.restorabilityShearForce.Vyd = col[43].value;
            columns.restorabilityShearForce.Vyd_Ratio = col[45].value;

            this.summary_table[key] = columns;
            break;

          case "SafetyFatigueMoment":
            // index と side が同じデータだ既に登録されていればそのデータに追加する
            index = col[45];
            side = col[46];
            key = index + '-' + side;
            columns = (key in this.summary_table) ? this.summary_table[key] : this.default(index, side);

            // 断面位置
            columns.title.m_no = col[0].value;
            columns.title.p_name = col[1].value;
            columns.title.side = col[2].value;
            // 断面形状
            columns.shape.name = col[47];
            columns.shape.B = col[3].value;
            columns.shape.H = col[4].value;
            columns.shape.Bt = col[5].value;
            columns.shape.t = col[6].value;
            // 鉄筋量
            columns.As.AstString = col[8].value;
            columns.As.AscString = col[11].value;
            columns.As.AseString = col[14].value;
            // 照査結果
            columns.SafetyFatigueMoment.ri = col[42].value;
            //columns.SafetyFatigueMoment.rb = col[0].value;  rbが存在しないためコメントアウト
            columns.SafetyFatigueMoment.sigma_min = col[25].value;
            columns.SafetyFatigueMoment.sigma_rd = col[28].value;
            columns.SafetyFatigueMoment.fsr200 = col[29].value;
            columns.SafetyFatigueMoment.ratio200 = col[30].value;

            this.summary_table[key] = columns;
            break;

          case "safetyFatigueShearForce":
            // index と side が同じデータだ既に登録されていればそのデータに追加する
            index = col[50];
            side = col[51];
            key = index + '-' + side;
            columns = (key in this.summary_table) ? this.summary_table[key] : this.default(index, side);

            // 断面位置
            columns.title.m_no = col[0].value;
            columns.title.p_name = col[1].value;
            columns.title.side = col[2].value;
            // 断面形状
            columns.shape.name = col[52];
            columns.shape.B = col[3].value;
            columns.shape.H = col[4].value;
            // 鉄筋量
            columns.As.AstString = col[7].value;
            // 照査結果
            columns.safetyFatigueShearForce.sigma_min = col[30].value;
            columns.safetyFatigueShearForce.sigma_rd = col[31].value;
            columns.safetyFatigueShearForce.frd = col[45].value;
            columns.safetyFatigueShearForce.ratio = col[48].value;

            this.summary_table[key] = columns;
            break;

          case "safetyMoment": 
            // index と side が同じデータだ既に登録されていればそのデータに追加する
            index = col[33];
            side = col[34];
            key = index + '-' + side;
            columns = (key in this.summary_table) ? this.summary_table[key] : this.default(index, side);

            // 断面位置
            columns.title.m_no = col[0].value;
            columns.title.p_name = col[1].value;
            columns.title.side = col[2].value;
            // 断面形状
            columns.shape.name = col[35];
            columns.shape.B = col[3].value;
            columns.shape.H = col[4].value;
            columns.shape.Bt = col[5].value;
            columns.shape.t = col[6].value;
            // 鉄筋量
            columns.As.AstString = col[8].value;
            columns.As.AscString = col[11].value;
            columns.As.AseString = col[14].value;
            // 照査結果
            columns.safetyMoment.ri = col[30].value;
            columns.safetyMoment.Md = col[22].value;
            columns.safetyMoment.Nd = col[23].value;
            columns.safetyMoment.Mud = col[29].value;
            columns.safetyMoment.ratio = col[31].value;

            this.summary_table[key] = columns;
            break;

          case "safetyShearForce": 
            // index と side が同じデータだ既に登録されていればそのデータに追加する
            index = col[51];
            side = col[52];
            key = index + '-' + side;
            columns = (key in this.summary_table) ? this.summary_table[key] : this.default(index, side);

            // 断面位置
            columns.title.m_no = col[0].value;
            columns.title.p_name = col[1].value;
            columns.title.side = col[2].value;
            // 断面形状
            columns.shape.name = col[52];
            columns.shape.B = col[3].value;
            columns.shape.H = col[4].value;
            // 鉄筋量
            columns.As.AstString = col[7].value;
            columns.As.AscString = col[10].value;
            columns.As.AseString = col[12].value;
            // 照査結果
            columns.safetyShearForce.Vd = col[22].value;
            columns.safetyShearForce.Vyd = col[43].value;
            columns.safetyShearForce.Vwcd = col[48].value;
            columns.safetyShearForce.Vyd_Ratio = col[45].value;
            columns.safetyShearForce.Vwcd_Ratio = col[49].value;

            this.summary_table[key] = columns;
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
            columns.shape.name = col[47];
            columns.shape.B = col[3].value;
            columns.shape.H = col[4].value;
            columns.shape.Bt = col[5].value;
            columns.shape.t = col[6].value;
            // 鉄筋量
            columns.As.AstString = col[8].value;
            columns.As.AscString = col[11].value;
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
            // index と side が同じデータだ既に登録されていればそのデータに追加する
            index = col[45];
            side = col[46];
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
            // 鉄筋量
            columns.As.AstString = col[7].value;
            columns.As.AscString = col[10].value;
            columns.As.AseString = col[12].value;
            // 照査結果
            columns.serviceabilityShearForce.Vcd = col[37].value;
            columns.serviceabilityShearForce.Vcd07 = col[38].value;
            columns.serviceabilityShearForce.sigma = col[42].value;

            this.summary_table[key] = columns;
            break;
        }
      }
    }
    console.log(this.summary_table)
  }

  // 初期値
  private default(index: number, side: string): any {
    return {
      index: index,
      side: side,
      title: {
        m_no: '-',
        p_name: '-',
        side: '-'
      },
      shape: {
        name: '-',
        B: '-',
        H: '-',
        Bt: '-',
        t: '-'
      },
      As: {
        AstString: '-',
        AseString: '-',
        AwString: '-',
        Ss: '-'
      },
      durabilityMoment: {
        Wd: '-'
      },
      earthquakesMoment: {
        ri: '-',
        Md: '-',
        Nd: '-',
        Myd: '-',
        ratio:'-'
      },
      earthquakesShearForce: {  
        Vd: '-',
        Vyd: '-',
        Ratio: '-'
      },
      restorabilityMoment: {
        ri: '-',
        Md: '-',
        Nd: '-',
        Myd: '-',
        ratio: '-'
      },
      restorabilityShearForce: {
        Vd: '-',
        Vyd: '-',
        Ratio: '-'
      },
      SafetyFatigueMoment: {
        ri: '-',
        rb: '-',
        sigma_min: '-',
        sigma_rd: '-',
        fsr200: '-',
        ratio200: '-'
      },
      safetyFatigueShearForce: {
        sigma_min: '-',
        sigma_rd: '-',
        frd: '-',
        ratio: '-'
      },
      safetyMoment: {
        ri: '-',
        Md: '-',
        Nd: '-',
        Mud: '-',
        ratio: '-'
      },
      safetyShearForce: {
        Vd: '-',
        Vyd: '-',
        Vwcd: '-',
        Vyd_Ratio: '-',
        Vwcd_Ratio: '-'
      },
      serviceabilityMoment: {
        sigma_b: '-',
        sigma_c: '-',
        sigma_s: '-',
        Wd: '-',
        Wlim: '-'
      },
      serviceabilityShearForce: {
        Vcd: '-',
        Vcd07: '-',
        sigma: '-'
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
