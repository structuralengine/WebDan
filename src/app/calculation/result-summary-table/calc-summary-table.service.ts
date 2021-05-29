import { Injectable } from '@angular/core';
import { utils, write, WorkBook } from 'xlsx';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class CalcSummaryTableService {

  //
  public summary_table: any[] = new Array();

  // 計算終了フラグ
  private durabilityMoment: boolean = false;
  private earthquakesMoment: boolean = false;
  private earthquakesShearForce: boolean = false;
  private restorabilityMoment: boolean = false;
  private restorabilityShearForce: boolean = false;
  private SafetyFatigueMoment: boolean = false;
  private safetyFatigueShearForce: boolean = false;
  private safetyMoment: boolean = false;
  private safetyShearForce: boolean = false;
  private serviceabilityMoment: boolean = false;
  private serviceabilityShearForce: boolean = false;
  
  constructor() { }

  public setSummaryTable(target: string, value: any){

    switch(target){
      case "durabilityMoment":
        this.durabilityMoment = true; 
        break;
      case "earthquakesMoment":
        this.earthquakesMoment = true; 
        break;
      case "earthquakesShearForce": 
        this.earthquakesShearForce = true; 
        break;
      case "restorabilityMoment": 
        this.restorabilityMoment = true; 
        break;
      case "restorabilityShearForce":
        this.restorabilityShearForce = true; 
        break;
      case "SafetyFatigueMoment":
        this.SafetyFatigueMoment = true; 
        break;
      case "safetyFatigueShearForce":
        this.safetyFatigueShearForce = true; 
        break;
      case "safetyMoment": 
        this.safetyMoment = true; 
        break;
      case "safetyShearForce": 
        this.safetyShearForce = true; 
        break;
      case "serviceabilityMoment": 
        this.serviceabilityMoment = true; 
        break;
      case "serviceabilityShearForce":
        this.serviceabilityShearForce = true; 
        break;
    }

    // 全ての項目が終了したかチェックする
    if(this.checkDone()){
      alert("計算が終了しました");
      this.initttt();
    }

  }

  // 全ての項目が終了したかチェックする
  private checkDone(): boolean {
    for(const target of [
      this.durabilityMoment,
      this.earthquakesMoment,
      this.earthquakesShearForce,
      this.restorabilityMoment,
      this.restorabilityShearForce,
      this.SafetyFatigueMoment,
      this.safetyFatigueShearForce,
      this.safetyMoment,
      this.safetyShearForce,
      this.serviceabilityMoment,
      this.serviceabilityShearForce]){
        if(target === false){
          return false;
        }
      }
    return true;
  }



  title = 'app';
  table = [
    {
      First: 'one',
      Second: 'two',
      Third: 'three',
      Forth: 'four',
      Fifth: 'five'
    },
    {
      First: 'un',
      Second: 'deux',
      Third: 'trois',
      Forth: 'quatre',
      Fifth: 'cinq'
    },
  ];

  initttt() {
    const ws_name = 'SomeSheet'; // シート名
    const wb: WorkBook = { SheetNames: [], Sheets: {} };
    const ws: any = utils.json_to_sheet(this.table);
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;
    const wbout = write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });

    function s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i !== s.length; ++i) {
        view[i] = s.charCodeAt(i) & 0xFF;
      };
      return buf;
    }

    saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), 'exported.xlsx');
  }

}
