import { Injectable } from '@angular/core';
import { SaveDataService } from './save-data.service';

import * as Encord from 'encoding-japanese';

@Injectable({
  providedIn: 'root'
})
export class DsdDataService  {

  constructor(private save: SaveDataService) { }

  // DSD データを読み込む
  public readDsdData(arrayBuffer: ArrayBuffer) {

    const buff: any = {
      u8array: new Uint8Array(arrayBuffer),
      byteOffset: 0
    };
    
    const obj = this.IsDSDFile(buff);
    buff['datVersID'] = obj.datVersID;
    buff['isManualInput'] = (obj.ManualInput > 0);
    
    // 断面力手入力モード
    if( buff.isManualInput ){
      this.FrmManualGetTEdata(buff, obj.ManualInput);
    }
    // 画面１ 基本データ
    this.GetKIHONscrn(buff);
    // 画面２  部材､断面データ
    this.GetBUZAIscrn(buff)
    // 画面５　安全係数の画面
    this.GetKEISUscrn(buff)
    // 画面３　算出点
    this.GetSANSHUTUscrn(buff)
    // 画面４　鉄筋データ
    this.GetTEKINscrn(buff)
    // 画面６　計算・印刷フォーム
    this.GetPrtScrn(buff)

    // 
    const jsonData = {};
    this.save.setInputData(jsonData);
  }

  // 画面１ 基本データ
  private GetKIHONscrn(buff: any): void{

    let snDummy: number
    let btDummy: number
    let iDummy: number

    snDummy = this.readSingle(buff); // -----> 疲労寿命 05/02/22
    btDummy = this.readByte(buff);
    btDummy = this.readByte(buff);
    iDummy = this.readInteger(buff);
    btDummy = this.readByte(buff);
    snDummy = this.readSingle(buff); // -----> 材料修正係数 ----->  ' 耐用年数 05/02/22

    btDummy = this.readByte(buff)

    if(!this.isOlder('0.1.6', buff.datVersID)){
      iDummy = this.readInteger(buff);
    }

    for(let i = 0; i <= 21; i++){
      btDummy = this.readByte(buff);
    }

    if(!this.isOlder('1.3.10', buff.datVersID)){
      iDummy = this.readInteger(buff);
    }
    
    if(!this.isOlder('1.3.11', buff.datVersID)){
      iDummy = this.readInteger(buff);
    }

    if(!this.isOlder('1.3.13', buff.datVersID)){
      snDummy = this.readSingle(buff);
      snDummy = this.readSingle(buff);
    }

    if(!this.isOlder('1.3.14', buff.datVersID)){
      btDummy = this.readByte(buff);
    }

    if(!this.isOlder('1.4.1', buff.datVersID)){
      btDummy = this.readByte(buff);
    }

    if(!this.isOlder('2.1.2', buff.datVersID)){
      btDummy = this.readByte(buff);
    }
    
    if(!this.isOlder('3.1.8', buff.datVersID)){
      snDummy = this.readSingle(buff);
    }

  }
  // 画面２  部材､断面データ
  private GetBUZAIscrn(buff: any): void{

    let iDummyCount: number;
    iDummyCount = this.readInteger(buff)

    for(let i = 0; i < iDummyCount; i++){
      const Index = this.readInteger(buff);     // 算出点データ（基本データ）へのIndex
      const iNumCalc = this.readInteger(buff);  // 部材の算出点数
      const iBzNo = this.readInteger(buff); // 部材番号
      const sLeng = this.readSingle(buff);  // 部材長　= JTAN

      const strMark = this.readString(buff, 32); 
      const strBuzaiName = this.readString(buff, 32); 

      const intDanmenType = this.readInteger(buff);
      for(let ii = 0; ii <= 3; ii++){
        let sngDanmen = this.readSingle(buff); 
        if(this.isOlder('3.1.1', buff.datVersID)){
          sngDanmen *= 10 // cm --> mm
        }
      }

      // 環境条件 曲げ
      for( let ii = 0; ii <= 1; ii++){
        const intKankyo = this.readInteger(buff);
      }

      // 環境条件せん断 　since version 0.1.4
      if(!this.isOlder('0.1.4', buff.datVersID)){        
        const intKankyo2  = this.readInteger(buff);
      }

      for( let ii = 0; ii <= 1; ii++){
        const bytHibi = this.readByte(buff);
      }

      if(this.isOlder("0.1.4", buff.datVersID)){
        for( let ii = 0; ii <= 2; ii++){
          const sngHirou  = this.readInteger(buff);
        }
      } else {
        if(this.isOlder("2.5.1", buff.datVersID)){
          for( let ii = 0; ii <= 3; ii++){
            const sngHirou  = this.readInteger(buff);
          }
        } else {
          for( let ii = 0; ii <= 4; ii++){
            const sngHirou  = this.readInteger(buff);
          }
        }
      }      

      if(!this.isOlder("3.6.1", buff.datVersID)){
        const sngK4 = this.readSingle(buff);
      }

      if(this.isOlder("1.3.4", buff.datVersID)){
        const sngNumBZI = this.readInteger(buff);
      } else if(this.isOlder("3.6.2", buff.datVersID)){
        const sngNumBZI = this.readSingle(buff); 
      } else {
        // 部材本数に分数を使えるようにする '''''''''''''' 20/08/30 sasa
        const strNumBZI = this.readString(buff, 32); 
      }

      if(!this.isOlder("0.1.3", buff.datVersID)){
        const bytTaisinKiso = this.readByte(buff);
      }
    }

  }  
  // 画面５　安全係数の画面
  private GetKEISUscrn(buff: any): void{
    let iDummyCount: number;
    iDummyCount = this.readInteger(buff)

    for(let i = 0; i < iDummyCount; i++){
      for(let ii = 0; ii <= 5; i++){
        const mgTkin = this.readByte(buff);
        if(this.isOlder('3.2.8', buff.datVersID)){
          for(let iii = 0; iii <= 3; iii++){
            const Mage = this.readSingle(buff);
            const Sen = this.readSingle(buff);
          }
          const Sen = this.readSingle(buff);
        } else {
          for(let iii = 0; iii <= 2; iii++){
            const Mage = this.readSingle(buff);
          }
          for(let iii = 0; iii <= 5; iii++){
            const Sen = this.readSingle(buff);
          }
        }
      }
      // 下半分のグリッドのデータ
      for(let ii = 0; ii <= 3; i++){
        for(let iii = 0; iii <= 3; iii++){
          const Kyodo = this.readInteger(buff);
        }
      }
      if(!this.isOlder('0.1.5', buff.datVersID)){
        for(let ii = 0; ii <= 3; i++){
          const KyodoD = this.readInteger(buff);
        }
      }
      if(this.isOlder('0.1.4', buff.datVersID)){
        const iii = this.readInteger(buff);
      } else {
        const Dummy = this.readSingle(buff);
      }
    }
  }  

  // 画面３　算出点
  private GetSANSHUTUscrn(buff: any): void{
    let iDummyCount: number;
    iDummyCount = this.readInteger(buff)

    if( iDummyCount !== 0){
      const PickFile = this.readString(buff, 100);
      const D_Name = this.readString(buff, 100);

      for(let i = 0; i < iDummyCount; i++){
        const Matr = this.readInteger(buff);
        const Calc1 = this.readString(buff, 32);
        const Calc2 = this.readSingle(buff);
      }
    }

    iDummyCount = this.readInteger(buff)

    for(let i = 0; i < iDummyCount; i++){
      const CalName = this.readString(buff, 12);
      const iBzNo = this.readInteger(buff);
      if(this.isOlder('0.1.2', buff.datVersID)){
        const byteVar = this.readByte(buff);
      } else {
        const Safe2 = this.readInteger(buff);
      }
      const Safe1 = this.readBoolean(buff);
      const Ness0 = this.readBoolean(buff);
      const Ness1 = this.readBoolean(buff);

      const GammaEM = this.readSingle(buff);

      if(!this.isOlder('3.2.8', buff.datVersID)){
        const T2d = this.readSingle(buff);
        const KuiKei = this.readSingle(buff);
      }
    }

  }  
  // 画面４　鉄筋データ
  private GetTEKINscrn(buff: any): void{

    const bTekinShori = this.readByte(buff);

    const iDummyCount = this.readInteger(buff);

    for(let i = 0; i < iDummyCount; i++){

    }


  }  
  // 画面６　計算・印刷フォーム
  private GetPrtScrn(buff: any): void{

  }

  // 断面力手入力情報を
  private FrmManualGetTEdata(buff: any, NumManualDt: number): void {

    let strfix10: string;
    let strfix32: string;

    for(let i = 0; i < NumManualDt; i++){

      strfix10 = this.readString(buff, 10);
      strfix32 = this.readString(buff, 32);
      strfix32 = this.readString(buff, 32);

      // 設計曲げモーメントの入力を取得
      let sHAND_MageDAN: number;
      for(let j = 0; j <= 10; j++){
        sHAND_MageDAN = this.readSingle(buff);
        sHAND_MageDAN = this.readSingle(buff);
      }
      // 設計せん断力の入力を取得
      let sHAND_SenDAN: number;
      for(let j = 0; j <= 7; j++){
        sHAND_SenDAN = this.readSingle(buff);
        sHAND_SenDAN = this.readSingle(buff);
        sHAND_SenDAN = this.readSingle(buff);
      }
      // せん断スパンの入力を取得
      let sHAND_SenDANLa: number = 0;
      if(!this.isOlder('3.1.7', buff.datVersID)){
        sHAND_SenDANLa = this.readSingle(buff);
      }
      // 安全性破壊の設計軸圧縮力の入力を取得
      let sHAND_軸力maxDAN = 0
      if(!this.isOlder('3.2.4', buff.datVersID)){
        sHAND_軸力maxDAN = this.readSingle(buff);
      }
      let sHAND_SenDANLa2_1: number = 0
      if(!this.isOlder('3.2.7', buff.datVersID)){
        sHAND_SenDANLa2_1  = this.readSingle(buff); 
      }
      let sHAND_SenDANLa2_2: number = 0
      if(!this.isOlder('3.2.8', buff.datVersID)){
        sHAND_SenDANLa2_2  = this.readSingle(buff); 
      }
    }
  }

  // バージョンを調べる
  private IsDSDFile(buff: any): any {
    const strfix32 = this.readString(buff, 32);
    const strT: string[] = strfix32.replace("WINDAN", "").trim().split(" ");
    return {
      datVersID: strT[0],
      ManualInput: this.save.toNumber(strT[1])
    };
  }

  // string型の情報を バイナリから取り出す
  private readString(buff: any, length: number): string {
    let str: string = '';
    while(str.length < length){
      const tmp = Encord.convert(String.fromCharCode.apply( "", buff.u8array.slice(0, 2)), 'unicode', 'sjis');
      if (tmp.length == 1) {
        // ２バイト文字（日本語）
        str += tmp;
        buff.u8array = buff.u8array.slice(2);
      } else {
        str += String.fromCharCode.apply( "", buff.u8array.slice(0, 1));
        buff.u8array = buff.u8array.slice(1);
      }
    }
    return str;
  }
    
  // Boolean型の情報を バイナリから読み取る
  private readBoolean(buff: any): number {
    const view = this.getDataView(buff, 2);
    const num = view.getInt16(0);
    return num;
  }

  // Byte型の情報を バイナリから読み取る
  private readByte(buff: any): number {
    const view = this.getDataView(buff, 1);
    const num = view.getUint8(0);
    return num;
  }

  // Integer型の情報を バイナリから読み取る
  private readInteger(buff: any): number {
    const view = this.getDataView(buff, 2);
    const num = view.getInt16(0);
    return num;
  }

  //Long型の情報を バイナリから読み取る
  private readLong(buff: any): number {
    const view = this.getDataView(buff, 4);
    const num = view.getInt32(0);
    return num;
  }

  // single型の情報を バイナリから読み取る
  private readSingle(buff: any): number {
    const view = this.getDataView(buff, 4);
    const num = view.getFloat32(0);
    return num;
  }

  // Double型の情報を バイナリから読み取る
  private readDouble(buff: any): number {
    const view = this.getDataView(buff, 8);
    const num = view.getFloat64(0);
    return num;
  }

  private getDataView(buff, length: number): DataView{
    const data =  buff.u8array.slice(0, length);
    const re = data.reverse();
    const b  = re.buffer;
    const view = new DataView(b);
    buff.u8array = buff.u8array.slice(length);
    return view;
  }

  // バージョン文字列比較処理
  private isOlder(a: string, b: string): boolean {
    if (a === b) return false;
    const aUnits = a.split(".");
    const bUnits = b.split(".");
    // 探索幅に従ってユニット毎に比較していく
    for (var i = 0; i < Math.min(aUnits.length, bUnits.length); i++) {
      if (parseInt(aUnits[i]) > parseInt(bUnits[i])) return true; // A > B
      if (parseInt(aUnits[i]) < parseInt(bUnits[i])) return false;  // A < B
    }
    return false;
  }

}
