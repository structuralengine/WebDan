import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SetPostDataService {

  constructor() { }

  // 計算(POST)するときのヘルパー ///////////////////////////////////////////////////////////////////////////
  public URL: string = 'http://structuralengine.com/RCnonlinear/api/values/';

  public parseJsonString(str: string): any {

    let json: any = null;
    let tmp: any = null;
    try {
      tmp = JSON.parse(str);
      json = JSON.parse(tmp);
    } catch (e) {
      return tmp;
    }
    return json;
  }
  
}
