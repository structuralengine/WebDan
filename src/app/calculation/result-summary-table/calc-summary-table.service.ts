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
  public summaryDone: boolean;
  private durabilityMoment: boolean;
  private earthquakesMoment: boolean;
  private earthquakesShearForce: boolean;
  private restorabilityMoment: boolean;
  private restorabilityShearForce: boolean;
  private SafetyFatigueMoment: boolean;
  private safetyFatigueShearForce: boolean;
  private safetyMoment: boolean;
  private safetyShearForce: boolean;
  private serviceabilityMoment: boolean;
  private serviceabilityShearForce: boolean;
  
  constructor() { }
  
  public clear() {
    this.summary_table = new Array();
    // 計算終了フラグ
    this.summaryDone = false;
    this.durabilityMoment = false;
    this.earthquakesMoment = false;
    this.earthquakesShearForce = false;
    this.restorabilityMoment = false;
    this.restorabilityShearForce = false;
    this.SafetyFatigueMoment = false;
    this.safetyFatigueShearForce = false;
    this.safetyMoment = false;
    this.safetyShearForce = false;
    this.serviceabilityMoment = false;
    this.serviceabilityShearForce = false;
  }

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
