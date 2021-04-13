import { Injectable } from '@angular/core';
import { SaveDataService } from './save-data.service';

import * as Encord from 'encoding-japanese';

@Injectable({
  providedIn: 'root'
})
export class DsdDataService {

  constructor(private save: SaveDataService) { }

  // DSD データを読み込む
  public readDsdData(arrayBuffer: ArrayBuffer): string {

    const buff: any = {
      u8array: new Uint8Array(arrayBuffer),
      byteOffset: 0
    };

    const obj = this.IsDSDFile(buff);
    buff['datVersID'] = obj.datVersID;
    buff['isManualInput'] = (obj.ManualInput > 0);

    // 断面力手入力モード
    if (buff.isManualInput) {
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

    // 断面力手入力モード
    if (buff.isManualInput) {
      return null; 
    } else {
      return buff.PickFile.trim();
    }
  }

  // ピックアップファイルを読み込む
  private readPickUpData(PickFile: string, file: any){
    file.name = PickFile;
    this.fileToText(file)
    .then(text => {
      this.save.readPickUpData(text, file.name); // データを読み込む
    })
    .catch(err => {
      console.log(err);
    });
  }

  // ファイルのテキストを読み込む
  private fileToText(file): any {
    const reader = new FileReader();
    reader.readAsText(file);
    return new Promise((resolve, reject) => {
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = () => {
        reject(reader.error);
      };
    });
  }

  // 画面１ 基本データ
  private GetKIHONscrn(buff: any): void {

    const dt1Dec = this.readSingle(buff); // -----> 疲労寿命 05/02/22
    const dt1Infl = this.readByte(buff);
    const dt1Spec = this.readByte(buff);
    const dt1Ser = this.readInteger(buff);
    const dt1Sekou = this.readByte(buff);
    const dt1Shusei = this.readSingle(buff); // -----> 材料修正係数 ----->  ' 耐用年数 05/02/22

    const gOud = this.readByte(buff)

    if (!this.isOlder('0.1.6', buff.datVersID)) {
      const MaxPicUp = this.readInteger(buff);
    }

    for (let i = 0; i <= 21; i++) {
      const dt2Pick = this.readByte(buff);
    }

    if (!this.isOlder('1.3.10', buff.datVersID)) {
      const iOutputHibiware = this.readInteger(buff);
    }

    if (!this.isOlder('1.3.11', buff.datVersID)) {
      const iOutputTgataKeisan = this.readInteger(buff);
    }

    if (!this.isOlder('1.3.13', buff.datVersID)) {
      const dt1HibiSeigen = this.readSingle(buff);
      const dt1HibiK2 = this.readSingle(buff);
    }

    if (!this.isOlder('1.3.14', buff.datVersID)) {
      const dt1USCheck = this.readByte(buff);
    }

    if (!this.isOlder('1.4.1', buff.datVersID)) {
      const dt1ChoutenCheck = this.readByte(buff);
    }

    if (!this.isOlder('2.1.2', buff.datVersID)) {
      const gひび割れ制限 = this.readByte(buff);
    }

    if (!this.isOlder('3.1.8', buff.datVersID)) {
      const sng外観ひび = this.readSingle(buff);
    }

  }

  // 画面２  部材､断面データ
  private GetBUZAIscrn(buff: any): void {

    let iDummyCount: number;
    iDummyCount = this.readInteger(buff)

    for (let i = 0; i < iDummyCount; i++) {
      const Index = this.readInteger(buff);     // 算出点データ（基本データ）へのIndex
      const iNumCalc = this.readInteger(buff);  // 部材の算出点数
      const iBzNo = this.readInteger(buff); // 部材番号
      const sLeng = this.readSingle(buff);  // 部材長　= JTAN

      const strMark = this.readString(buff, 32);
      const strBuzaiName = this.readString(buff, 32);

      const intDanmenType = this.readInteger(buff);
      const isOlder311 = (this.isOlder('3.1.1', buff.datVersID));
      for (let ii = 0; ii <= 3; ii++) {
        let sngDanmen = this.readSingle(buff);
        if (isOlder311) { sngDanmen *= 10; } // cm --> mm 
      }

      // 環境条件 曲げ
      for (let ii = 0; ii <= 1; ii++) {
        const intKankyo = this.readInteger(buff);
      }

      // 環境条件せん断 　since version 0.1.4
      if (!this.isOlder('0.1.4', buff.datVersID)) {
        const intKankyo2 = this.readInteger(buff);
      }

      for (let ii = 0; ii <= 1; ii++) {
        const bytHibi = this.readByte(buff);
      }

      if (this.isOlder("0.1.4", buff.datVersID)) {
        for (let ii = 0; ii <= 2; ii++) {
          const sngHirou = this.readInteger(buff);
        }
      } else {
        if (this.isOlder("2.5.1", buff.datVersID)) {
          for (let ii = 0; ii <= 3; ii++) {
            const sngHirou = this.readSingle(buff);
          }
        } else {
          for (let ii = 0; ii <= 4; ii++) {
            const sngHirou = this.readSingle(buff);
          }
        }
      }

      if (!this.isOlder("3.6.1", buff.datVersID)) {
        const sngK4 = this.readSingle(buff);
      }

      if (this.isOlder("1.3.4", buff.datVersID)) {
        const sngNumBZI = this.readInteger(buff);
      } else if (this.isOlder("3.6.2", buff.datVersID)) {
        const sngNumBZI = this.readSingle(buff);
      } else {
        // 部材本数に分数を使えるようにする '''''''''''''' 20/08/30 sasa
        const strNumBZI = this.readString(buff, 32);
      }

      if (!this.isOlder("0.1.3", buff.datVersID)) {
        const bytTaisinKiso = this.readByte(buff);
      }
    }

  }

  // 画面５　安全係数の画面
  private GetKEISUscrn(buff: any): void {
    let iDummyCount: number;
    iDummyCount = this.readInteger(buff)

    const isOlder328 = this.isOlder('3.2.8', buff.datVersID);
    const isOlder015 = this.isOlder('0.1.5', buff.datVersID);
    const IsOldData = this.isOlder('0.1.4', buff.datVersID);

    for (let i = 0; i < iDummyCount; i++) {
      for (let ii = 0; ii <= 5; ii++) {
        const mgTkin = this.readByte(buff);
        if (isOlder328) {
          for (let iii = 0; iii <= 3; iii++) {
            const Mage = this.readSingle(buff);
            const Sen = this.readSingle(buff);
          }
          const Sen = this.readSingle(buff);
        } else {
          for (let iii = 0; iii <= 2; iii++) {
            const Mage = this.readSingle(buff);
          }
          for (let iii = 0; iii <= 5; iii++) {
            const Sen = this.readSingle(buff);
          }
        }
      }
      // 下半分のグリッドのデータ
      for (let ii = 0; ii <= 3; ii++) {
        for (let iii = 0; iii <= 3; iii++) {
          const Kyodo = this.readInteger(buff);
        }
      }
      if (!isOlder015) {
        for (let ii = 0; ii <= 3; ii++) {
          const KyodoD = this.readInteger(buff);
        }
      }
      if (IsOldData) {
        const iii = this.readInteger(buff);
      } else {
        const Dummy = this.readSingle(buff);
      }
    }
  }

  // 画面３　算出点
  private GetSANSHUTUscrn(buff: any): void {
    let iDummyCount: number;
    iDummyCount = this.readInteger(buff)

    if (iDummyCount !== 0) {
      buff['PickFile'] = this.readString(buff, 100); // ピックアップファイルのパス
      const D_Name = this.readString(buff, 100);

      for (let i = 0; i < iDummyCount; i++) {
        const Matr = this.readInteger(buff);
        const Calc1 = this.readString(buff, 32);
        const Calc2 = this.readSingle(buff);
      }
    }

    iDummyCount = this.readInteger(buff)

    for (let i = 0; i < iDummyCount; i++) {
      const CalName = this.readString(buff, 12);
      const iBzNo = this.readInteger(buff);
      if (this.isOlder('0.1.2', buff.datVersID)) {
        const byteVar = this.readByte(buff);
      } else {
        const Safe2 = this.readInteger(buff);
      }
      const Safe1 = this.readBoolean(buff);
      const Ness0 = this.readBoolean(buff);
      const Ness1 = this.readBoolean(buff);

      const GammaEM = this.readSingle(buff);

      if (!this.isOlder('3.2.8', buff.datVersID)) {
        const T2d = this.readSingle(buff);
        const KuiKei = this.readSingle(buff);
      }
    }

  }

  // 画面４　鉄筋データ
  private GetTEKINscrn(buff: any): void {

    const bTekinShori = this.readByte(buff);

    const iDummyCount = this.readInteger(buff);

    for (let i = 0; i < iDummyCount; i++) {
      const iType = this.readInteger(buff);
      const iNext = this.readInteger(buff);
      const MageSendan0 = this.readSingle(buff);
      const MageSendan1 = this.readSingle(buff);
      if (this.isOlder("3.1.4", buff.datVersID)) {
        const stDummy1 = this.readByte(buff);
        const stDummy2 = this.readByte(buff);
      } else {
        const JikuR0 = this.readInteger(buff);
        const JikuR1 = this.readInteger(buff);
      }
      const JikuHON0 = this.readSingle(buff);
      const JikuHON1 = this.readSingle(buff);
      const JikuKABURI0 = this.readSingle(buff);
      const JikuKABURI1 = this.readSingle(buff);

      if (this.isOlder("3.2.6", buff.datVersID) === true
        && this.isOlder("3.1.4", buff.datVersID) === false) {
        const stDummy6 = this.readByte(buff);
        const stDummy7 = this.readByte(buff);
        const stDummy8 = this.readSingle(buff);
        const stDummy9 = this.readSingle(buff);
      } else {
        if (this.isOlder("3.1.4", buff.datVersID)) {
          const stDummy3 = this.readInteger(buff);
          const stDummy4 = this.readInteger(buff);
        } else {
          const JikuNARABI0 = this.readSingle(buff);
          const JikuNARABI1 = this.readSingle(buff);
        }
        if (this.isOlder("3.3.2", buff.datVersID)) {
          const stDummy6 = this.readByte(buff);
          const stDummy7 = this.readByte(buff);
        } else {
          const JikuAKI0 = this.readSingle(buff);
          const JikuAKI1 = this.readSingle(buff);
        }
      }
      const JikuPITCH0 = this.readSingle(buff);
      const JikuPITCH1 = this.readSingle(buff);
      const JikuSHARITU0 = this.readSingle(buff);
      const JikuSHARITU1 = this.readSingle(buff);

      const SokuR0 = this.readByte(buff);
      const SokuR1 = this.readByte(buff);
      const SokuHON0 = this.readByte(buff);
      const SokuHON1 = this.readByte(buff);
      const SokuKABURI0 = this.readSingle(buff);
      const SokuKABURI1 = this.readSingle(buff);

      const StarR0 = this.readByte(buff);
      const StarR1 = this.readByte(buff);
      const StarKUMI0 = this.readSingle(buff);
      const StarKUMI1 = this.readSingle(buff);
      const StarPitch0 = this.readSingle(buff);
      const StarPitch1 = this.readSingle(buff);
      const StarTanTHETA0 = this.readSingle(buff);
      const StarTanTHETA1 = this.readSingle(buff);

      const OrimgR = this.readByte(buff);

      if (this.isOlder("3.4.5", buff.datVersID)) {
        const stDummy10 = this.readByte(buff);
      } else {
        const OrimgHON = this.readSingle(buff);
      }
      const OrimgANGLE = this.readByte(buff);

      if (this.isOlder("0.1.5", buff.datVersID)) {
        const Shori0 = this.readByte(buff);
      } else {
        const OrimgKankaku = this.readSingle(buff);

        const Shori0 = this.readByte(buff);
        const Shori1 = this.readByte(buff);
      }

      if (!this.isOlder("3.1.6", buff.datVersID)) {
        const cMage00 = this.readSingle(buff);
        const cMage01 = this.readSingle(buff);
        const cMage10 = this.readSingle(buff);
        const cMage11 = this.readSingle(buff);
        const cMage20 = this.readSingle(buff);
        const cMage21 = this.readSingle(buff);
        const cMage30 = this.readSingle(buff);
        const cMage31 = this.readSingle(buff);
        const cMage40 = this.readSingle(buff);
        const cMage41 = this.readSingle(buff);
        const cMage50 = this.readSingle(buff);
        const cMage51 = this.readSingle(buff);
        const cMage60 = this.readSingle(buff);
        const cMage61 = this.readSingle(buff);
        const cMage70 = this.readSingle(buff);
        const cMage71 = this.readSingle(buff);
        const cMage800 = this.readSingle(buff);
        const cMage810 = this.readSingle(buff);
        const cMage801 = this.readSingle(buff);
        const cMage811 = this.readSingle(buff);
        const cMage802 = this.readSingle(buff);
        const cMage812 = this.readSingle(buff);

        const cSend00 = this.readSingle(buff);
        const cSend01 = this.readSingle(buff);
        const cSend10 = this.readSingle(buff);
        const cSend11 = this.readSingle(buff);
        const cSend20 = this.readSingle(buff);
        const cSend21 = this.readSingle(buff);
        const cSend30 = this.readSingle(buff);
        const cSend31 = this.readSingle(buff);
        const cSend40 = this.readSingle(buff);
        const cSend41 = this.readSingle(buff);
        const cSend50 = this.readSingle(buff);
        const cSend51 = this.readSingle(buff);
        const cSend60 = this.readSingle(buff);
        const cSend61 = this.readSingle(buff);
        const cSend70 = this.readSingle(buff);
        const cSend71 = this.readSingle(buff);
        const cSend800 = this.readSingle(buff);
        const cSend810 = this.readSingle(buff);
        const cSend801 = this.readSingle(buff);
        const cSend811 = this.readSingle(buff);
        const cSend802 = this.readSingle(buff);
        const cSend812 = this.readSingle(buff);

      }


    }


  }

  // 画面６　計算・印刷フォーム
  private GetPrtScrn(buff: any): void {
    const bCollect = this.readBoolean(buff);
    const bDoDraft = this.readBoolean(buff);
    const bDoPrev = this.readBoolean(buff);
    for (let i = 0; i <= 4; i++) {
      const bDoPrint = this.readBoolean(buff);
    }
    for (let i = 0; i <= 1; i++) {
      const bDoType = this.readBoolean(buff);
    }
    const bN_Fixed = this.readBoolean(buff);
    const bDummy = this.readBoolean(buff);
    for (let i = 0; i <= 3; i++) {
      const byteDanSokuHON = this.readByte(buff);
    }
    const iDanBUZAI = this.readInteger(buff);
    for (let i = 0; i <= 3; i++) {
      const fDanHON = this.readSingle(buff);
    }
    const iDanOtoshi = this.readInteger(buff);
    const iJIKUScale = this.readInteger(buff);
    const iKOUKAN_ATUMI = this.readInteger(buff);
    const iMOMENTperCM = this.readInteger(buff);
    const intKetaFlag = this.readInteger(buff);
    for (let i = 0; i <= 3; i++) {
      const fDSY = this.readSingle(buff);
    }
    const strSubTITLE = this.readString(buff, 100);
    if (!this.isOlder("2.1.0", buff.datVersID)) {
      for (let i = 0; i <= 2; i++) {
        const KuiTKIN_D = this.readInteger(buff);
      }
    }

  }

  // 断面力手入力情報を
  private FrmManualGetTEdata(buff: any, NumManualDt: number): void {

    let strfix10: string;
    let strfix32: string;

    for (let i = 0; i < NumManualDt; i++) {

      strfix10 = this.readString(buff, 10);
      strfix32 = this.readString(buff, 32);
      strfix32 = this.readString(buff, 32);

      // 設計曲げモーメントの入力を取得
      let sHAND_MageDAN: number;
      for (let j = 0; j <= 10; j++) {
        sHAND_MageDAN = this.readSingle(buff);
        sHAND_MageDAN = this.readSingle(buff);
      }
      // 設計せん断力の入力を取得
      let sHAND_SenDAN: number;
      for (let j = 0; j <= 7; j++) {
        sHAND_SenDAN = this.readSingle(buff);
        sHAND_SenDAN = this.readSingle(buff);
        sHAND_SenDAN = this.readSingle(buff);
      }
      // せん断スパンの入力を取得
      let sHAND_SenDANLa: number = 0;
      if (!this.isOlder('3.1.7', buff.datVersID)) {
        sHAND_SenDANLa = this.readSingle(buff);
      }
      // 安全性破壊の設計軸圧縮力の入力を取得
      let sHAND_軸力maxDAN = 0
      if (!this.isOlder('3.2.4', buff.datVersID)) {
        sHAND_軸力maxDAN = this.readSingle(buff);
      }
      let sHAND_SenDANLa2_1: number = 0
      if (!this.isOlder('3.2.7', buff.datVersID)) {
        sHAND_SenDANLa2_1 = this.readSingle(buff);
      }
      let sHAND_SenDANLa2_2: number = 0
      if (!this.isOlder('3.2.8', buff.datVersID)) {
        sHAND_SenDANLa2_2 = this.readSingle(buff);
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
    while (str.length < length) {
      const tmp = Encord.convert(String.fromCharCode.apply("", buff.u8array.slice(0, 2)), 'unicode', 'sjis');
      if (tmp.length == 1) {
        // ２バイト文字（日本語）
        str += tmp;
        buff.u8array = buff.u8array.slice(2);
      } else {
        str += String.fromCharCode.apply("", buff.u8array.slice(0, 1));
        buff.u8array = buff.u8array.slice(1);
      }
    }
    return str;
  }

  // Boolean型の情報を バイナリから読み取る
  private readBoolean(buff: any): boolean {
    const view = this.getDataView(buff, 2);
    const num = view.getInt16(0);
    return num < 0;
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

  private getDataView(buff, length: number): DataView {
    const data = buff.u8array.slice(0, length);
    const re = data.reverse();
    const b = re.buffer;
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
