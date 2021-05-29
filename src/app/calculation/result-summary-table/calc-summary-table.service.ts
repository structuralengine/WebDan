import { Injectable } from '@angular/core';

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
      alert("計算が終了しました")
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



}
