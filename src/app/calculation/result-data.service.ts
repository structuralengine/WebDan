import { Injectable } from '@angular/core';
import { SaveDataService } from '../providers/save-data.service';

@Injectable({
  providedIn: 'root'
})
export class ResultDataService {

  constructor(private save: SaveDataService) {
  }

  public getDesignForceList(type: string): any[] {
    const result: any[] = new Array();
    switch (type) {
      case '使用性 曲げひび割れ':

        break;
    }
    return result;
  }

}
