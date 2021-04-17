import { Injectable } from '@angular/core';
import { SaveDataService } from '../providers/save-data.service';

@Injectable({
  providedIn: 'root'
})
export class SetFatigueService {

  constructor(private save: SaveDataService) {
  }

  // 鉄筋の入力情報を セット
  public setFatigueData(g_id: string, m_no: number, position: any): any {

    const temp = JSON.parse(
      JSON.stringify({
        temp: this.save.fatigues.fatigue_list
      })
    ).temp;
    
    const fatigueList = temp.find( (value) => {
      return (value[0].g_id.toString() === g_id);
    });
    if (fatigueList === undefined) {
      console.log('部材グループが存在しない');
      this.clearPostDataAll(position);
      return;
    }

    const startFlg: boolean[] = [false, false];
    let fatigueData: object = null;
    for (let i = fatigueList.length - 1; i >= 0; i--) {
      // 同じ部材番号を探す
      if (fatigueList[i].positions.length < 1) { continue; }
      if (startFlg[0] === false) {
        if (fatigueList[i].positions[0].m_no === m_no) {
          startFlg[0] = true;
        } else {
          continue;
        }
      }

      // 同じ着目点位置を探す
      for (let j = fatigueList[i].positions.length - 1; j >= 0; j--) {
        const fatigue = fatigueList[i].positions[j];
        if (startFlg[1] === false) {
          if (fatigue.index === position.index) {
            startFlg[1] = true;
          } else {
            continue;
          }
        }
        // 疲労情報を集計
        if (fatigueData === null) {
          fatigueData = fatigue;
        } else {
          this.setFatigueObjectValue(fatigueData, fatigue);
        }
      }
    }

    position['fatigueData'] = fatigueData;
  }

  // 連想配列の null の要素をコピーする
  private setFatigueObjectValue(target: object, obj: object): void {
    try {
      for (const key of Object.keys(obj)) {
        if (obj[key] === undefined) { continue; }
        if (obj[key] === null) { continue; }
        if (key === 'b') { continue; }
        if (key === 'h') { continue; }
        if (key === 'index') { continue; }
        if (key === 'm_no') { continue; }
        if (key === 'p_name') { continue; }
        if (key === 'p_name_ex') { continue; }
        if (key === 'position') { continue; }
        if (key === 'title1') { continue; }
        if (key === 'title2') { continue; }

        if (typeof obj[key] === 'object') {
          this.setFatigueObjectValue(target[key], obj[key]);
        } else {
          if (target[key] === null) {
            target[key] = obj[key];
          }
        }
      }
    } catch {
      console.log('aa');
    }
  }
    
  private clearPostDataAll(position: any): void {
    let i = 0;
    let key: string = 'PostData' + i.toString();
    while (key in position) {
      position[key] = new Array();
      i++;
      key = 'PostData' + i.toString();
    }
  }

}
