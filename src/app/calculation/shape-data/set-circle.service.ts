import { Injectable } from '@angular/core';
import { retry } from 'rxjs/operators';
import { InputBarsService } from 'src/app/components/bars/bars.service';
import { DataHelperModule } from 'src/app/providers/data-helper.module';

@Injectable({
  providedIn: 'root'
})
export class SetCircleService {

  constructor(
    private bars: InputBarsService,
    private helper: DataHelperModule
  ) { }

  // 円形断面の POST 用 データ作成
  public getCircle(member: any, index: number, safety: any): any {

    const result = { symmetry: true, Sections: [], SectionElastic:[] };

    const RCOUNT = 100;

    // 断面情報を集計
    const section = this.getCircleShape(member, index, safety);
    const h = section.H;

    const x1: number = h / RCOUNT;
    let b1 = 0;
    for (let i = 1; i <= RCOUNT; i++) {
      const x2: number = x1 * i;
      const b2: number = this.getCircleWidth(h, x2);
      result.Sections.push({
        Height: x1,     // 断面高さ
        WTop: b1,       // 断面幅（上辺）
        WBottom: b2,    // 断面幅（底辺）
        ElasticID: 'c'  // 材料番号
      });
      b1 = b2;
    }

    result.SectionElastic.push(this.helper.getSectionElastic(safety));

    const result2 = this.getCircleBar(section, safety);
    for(const key of Object.keys(result2)){
      result[key] = result2[key];
    }

    return result;
  }

  // 円環断面の POST 用 データ作成
  public getRing(member: any, index: number, safety: any): any {

    const result = { symmetry: true, Sections: [], SectionElastic:[] };

    const RCOUNT = 100;

    // 断面情報を集計
    const section = this.getRingShape(member, index, safety);
    let h: number = section.H; // 外径
    let b: number = section.B; // 内径
    const x1: number = h / RCOUNT;
    const x3: number = (h - b) / 2;

    let b1 = 0;
    let b3 = 0;
    for (let i = 1; i <= RCOUNT; i++) {
      const x2 = x1 * i;
      const x4 = x2 - x3;
      const b2 = this.getCircleWidth(h, x2);
      let b4: number;
      if (x2 < x3) {
        b4 = 0;
      } else if (x2 > x3 + b) {
        b4 = 0;
      } else {
        b4 = this.getCircleWidth(b, x4);
      }

      result.Sections.push({
        Height: x1,       // 断面高さ
        WTop: b1 - b3,    // 断面幅（上辺）
        WBottom: b2 - b4, // 断面幅（底辺）
        ElasticID: 'c'    // 材料番号
      });
      b1 = b2;
      b3 = b4;
    }

    result.SectionElastic.push(this.helper.getSectionElastic(safety));

    const result2 = this.getCircleBar(section, safety);
    for(const key of Object.keys(result2)){
      result[key] = result2[key];
    }

    return result;
  }

  // 円形の 鉄筋のPOST用 データを登録する。
  private getCircleBar(section: any, safety: any ): any {

    const result = {
      Steels: new Array(),
      SteelElastic: new Array(),
    };

    // 鉄筋配置
    const h: number = section.H;
    const tension = section.tension;
    const fsy = section.tension.fsy;
    const id = "s" + fsy.id;

    // 鉄筋の位置
    result.Steels = this.getSteels(tension, h, id);
    // 基準となる 鉄筋強度
    const rs = section.tension.rs;

    // 鉄筋強度の入力
    result.SteelElastic.push({
      fsk: fsy.fsy / rs,
      Es: 200,
      ElasticID: id,
    });

    return result;
  }

  private getSteels(tension: any, h: number, id: string){

    const Steels = [];

    const dia: string = tension.mark + tension.rebar_dia;

    for (let i = 0; i < tension.n; i++) {
      const Depth = tension.dsc + i * tension.space;
      const Rt: number = h - Depth * 2; // 鉄筋直径
      const num = tension.rebar_n - tension.line * i; // 鉄筋本数
      const steps: number = 360 / num; // 鉄筋角度間隔

      for (let j = 0; j < num; j++) {
        const deg = j * steps;
        const dst = Rt / 2 - (Math.cos(this.helper.Radians(deg)) * Rt) / 2 + Depth;
        if( deg === 135 || deg === 225){
          // ちょうど 45° 半分引張鉄筋
          for(const tensionBar of [true, false]){
            Steels.push({
              Depth: dst, // 深さ位置
              i: dia, // 鋼材
              n: 0.5, // 鋼材の本数
              IsTensionBar: tensionBar, // 鋼材の引張降伏着目Flag
              ElasticID: id, // 材料番号
            });      
          }
        } else {
          const tensionBar: boolean = deg >= 135 && deg <= 225 ? true : false;
          Steels.push({
            Depth: dst, // 深さ位置
            i: dia, // 鋼材
            n: 1, // 鋼材の本数
            IsTensionBar: tensionBar, // 鋼材の引張降伏着目Flag
            ElasticID: id, // 材料番号
          });
        }
      }
    }

    return Steels
  }

  // 断面情報を集計
  public getCircleShape(member: any, index: number, safety: any){

    const result = this.getSection(member);
    
    const bar = this.bars.getCalcData(index);

    const tension = this.helper.rebarInfo(bar.rebar1);
    if(tension === null){
      throw ("引張鉄筋情報がありません");
    }
    if(tension.rebar_ss === null || tension.rebar_ss === 0){
      const D = result.H - tension.dsc * 2;
      tension.rebar_ss = D / tension.line;
    }

    const fsy = this.helper.getFsyk(
      tension.rebar_dia,
      safety.material_bar,
      "tensionBar"
    );
    tension['fsy'] = fsy;
    tension['rs'] = safety.safety_factor.rs;;

    // 鉄筋径
    if (fsy.fsy === 235) {
      // 鉄筋強度が 235 なら 丸鋼
      tension.mark = "R";
    }
    result['tension'] = tension;
    result['stirrup'] = bar.stirrup;
    result['bend'] = bar.bend;
    
    return result;
  }

  // 断面情報を集計
  public getCircleVdShape(member: any, index: number, safety: any){

    const result = {};

    // 円形としての情報を取得
    const section = this.getCircleShape(member, index, safety);
    for(const key of Object.keys(section)){
      result[key] = section[key]
    }

    // 換算矩形
    const Area = Math.pow(section.H, 2) * Math.PI / 4;
    const h = Math.sqrt(Area);
    result['H'] = h;
    result['B'] = h;

    // 換算矩形としての鉄筋位置
    const tension = section.tension;
    const steels = this.getSteels(tension, section.H, null);
    let d = 0.0, n = 0;
    for(const s of steels){
      if(s.IsTensionBar === true){
        d += s.Depth * s.n;
        n += s.n;
      }
    }
    const dh = (section.H - h)/2;
    const dsc = d / n;
    tension.dsc = h - dsc + dh;
    tension.rebar_n = n;

    return result;
  }


  // 円環断面情報を集計
  public getRingShape(member: any, index: number, safety: any): any{

    const result = {};

    // 円形としての情報を取得
    const section = this.getCircleShape(member, index, safety);
    for(const key of Object.keys(section)){
      result[key] = section[key]
    }

    return result;
  }

  public getSection(member: any): any{
    
    const result = {};

    let H = this.helper.toNumber(member.H);
    if (H === null) {
      H = this.helper.toNumber(member.B);
    }
    if (H === null) {
      throw('円形の径の入力が正しくありません');
    }
    result['H'] = H; // 外径
    result['B'] = this.helper.toNumber(member.B); // 内径

    return result;
  }

  // 円環断面情報を集計
  public getRingVdShape(member: any, index: number, safety: any){

    const result = {};

    // 円環としての情報を取得
    const section = this.getRingShape(member, index, safety);
    for(const key of Object.keys(section)){
      result[key] = section[key]
    }

    // 換算矩形
    let h = section.H;
    let b = section.B;
    const Area1 = Math.pow(h, 2) * Math.PI / 4;
    const Area2 = Area1 - (b ** 2) * Math.PI / 4;
    result['H'] = Math.sqrt(Area1),
    result['B'] = h - Math.sqrt((h ** 2) - Area2)

    // 換算矩形としての鉄筋位置
    const tension = section.tension;
    const steels = this.getSteels(tension, section.H, null);
    let d = 0.0, n = 0;
    for(const s of steels){
      if(s.IsTensionBar === true){
        d += s.Depth;
        n += s.n;
      }
    }
    const dsc = h - (d / n);
    tension.dsc = dsc;

    return result;

  }

  // 円の頂部からの距離を指定してその円の幅を返す
  private getCircleWidth(R: number, positionFromVertex: number): number {

    const a = R / 2;
    const x = positionFromVertex;

    const c = Math.sqrt((a ** 2) - ((a - x) ** 2));

    return Math.abs(2 * c);

  }


}
