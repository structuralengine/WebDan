import { Injectable } from "@angular/core";
import { DataHelperModule } from "../providers/data-helper.module";
import { InputBarsService } from "../components/bars/bars.service";
import { SetPostDataService } from "./set-post-data.service";
import { InputDesignPointsService } from "../components/design-points/design-points.service";
import { InputMembersService } from "../components/members/members.service";
import { SetRectService } from "./shape-data/set-rect.service";
import { SetCircleService } from "./shape-data/set-circle.service";
import { SetHorizontalOvalService } from "./shape-data/set-horizontal-oval.service";
import { SetVerticalOvalService } from "./shape-data/set-vertical-oval.service";

@Injectable({
  providedIn: "root",
})
export class ResultDataService {
  constructor(
    private members: InputMembersService,
    private points: InputDesignPointsService,
    private bars: InputBarsService,
    private post: SetPostDataService,
    private helper: DataHelperModule,
    private circle: SetCircleService,
    private rect: SetRectService,
    private hOval: SetHorizontalOvalService,
    private vOval: SetVerticalOvalService) { }

  // 表題の共通した行
  public getTitleString(member: any, position: any, side: string): any {
    // 照査表における タイトル１行目を取得
    let strPos = "";
    if (this.helper.toNumber(position.position) !== null) {
      strPos = position.position.toFixed(3);
    }
    const m_no: string = member.m_no.toFixed(0);
    let title1: string = m_no + "部材";
    if (member.m_len > 0) {
      title1 += "(" + strPos + ")";
    }

    // 照査表における タイトル２行目を取得
    const title2: string = position.p_name; // + side;

    // 照査表における タイトル３行目を取得
    const bar = this.bars.getCalcData(position.index);

    let title3: string = '';
    if (side === '上側引張') {
      title3 = bar.rebar1.title + '引張';
    } else {
      title3 = bar.rebar2.title + '引張';
    }

    return {
      m_no: title1,
      p_name: title2,
      side: title3,
    };
  }

  // value が null なら center 寄せ の -
  public alien(value: any, alien: string = "right"): any {
    let result: object;
    if (value === null) {
      result = { alien: "center", value: "-" };
    } else {
      result = { alien, value };
    }
    return result;
  }

  // 整数なら Fixed(0), 少数なら dim で指定した少数で丸める
  public numStr(dst: number, dim: number = 2): string {

    if (dst === null) {
      return null;
    }

    return dst.toFixed(Number.isInteger(dst) ? 0 : dim)
  }

  // 照査表における 断面の文字列を取得
  public getSection(target: string, res: any, safety: any): any {

    const result = {
      member: null,
      shapeName: null,
      shape: {
        B: null,
        H: null,
        Bt: null,
        t: null,
      }
    };

    const index = res.index;
    const side = res.side;

    const position = this.points.getCalcData(index);

    // 部材情報
    const member = this.members.getCalcData(position.m_no);
    result.member = member;

    // 断面形状
    const shapeName = this.post.getShapeName(member, side);
    result.shapeName = shapeName;

    // 断面情報
    let section: any;
    switch (shapeName) {
      case 'Circle':            // 円形
        if (target === 'Md') {
          section = this.circle.getCircleShape(member, index, safety);
        } else {
          section = this.circle.getCircleVdShape(member, index, safety);
        }
        result.shape.H = section.H;
        break;

      case 'Ring':              // 円環
        if (target === 'Md') {
          section = this.circle.getRingShape(member, index, safety);
        } else {
          section = this.circle.getRingVdShape(member, index, safety);
        }
        result.shape.H = section.H;
        result.shape.B = section.B;
        break;

      case 'Rectangle':         // 矩形
        section = this.rect.getRectangleShape(member, target, index, side, safety);
        result.shape.H = section.H;
        result.shape.B = section.B;
        break;

      case 'Tsection':          // T形
      case 'InvertedTsection':  // 逆T形
        section = this.rect.getTsectionShape(member, target, index, side, safety);
        result.shape.H = section.H;
        result.shape.B = section.B;
        result.shape.Bt = section.Bt;
        result.shape.t = section.t;
        break;

      case 'HorizontalOval':    // 水平方向小判形
        section = this.hOval.getShape(member, index, side, safety);
        result.shape.H = section.H;
        result.shape.B = section.B;
        break;

      case 'VerticalOval':      // 鉛直方向小判形
        section = this.vOval.getShape(member, index, side, safety);
        result.shape.H = section.H;
        result.shape.B = section.B;
        break;

      default:
        throw ("断面形状：" + shapeName + " は適切ではありません。");
    }

    result['Ast'] = this.getAst(section);
    result['Asc'] = this.getAsc(section);
    result['Ase'] = this.getAse(section);

    // せん断の場合 追加でパラメータを設定する
    if (target === 'Vd') {
      const vmuSection = this.getVmuSection(section, safety);
      for (const key of Object.keys(vmuSection)) {
        result[key] = vmuSection[key];
      }
    }

    return result;
  }

  // せん断照査表における 断面の文字列を取得
  private getVmuSection(section: any, safety: any): any {

    const result = {
      tan: null,
      Aw: {
        stirrup_dia: null,
        stirrup_n: null,

        Aw: null,
        AwString: null,
        deg: null,
        Ss: null,

        fwyd: null,
        fwud: null,
        rs: null,
      }
    };


    // 鉄筋径
    if (this.helper.toNumber(section.stirrup.stirrup_dia) === null) {
      return result;
    }
    result.Aw.stirrup_dia = Math.abs(section.stirrup.stirrup_dia);

    // 異形鉄筋:D, 丸鋼: R
    let mark = section.stirrup.stirrup_dia > 0 ? "D" : "R";

    // 鉄筋本数
    result.Aw.stirrup_n = this.helper.toNumber(section.stirrup.stirrup_n);
    if (result.Aw.stirrup_n === null) {
      result.Aw.stirrup_n = 0;
    }

    result.Aw.Ss = this.helper.toNumber(section.stirrup.stirrup_ss);
    if (result.Aw.Ss === null) {
      result.Aw.Ss = Number.MAX_VALUE;
    }

    const fwyd = this.helper.getFsyk(result.Aw.stirrup_dia, safety.material_bar, "stirrup");
    if (fwyd.fsy === 235) {
      // 鉄筋強度が 235 なら 丸鋼
      mark = "R";
    }

    const dia: string = mark + result.Aw.stirrup_dia;
    const As: number = this.helper.getAs(dia);

    result.Aw.Aw = As * result.Aw.stirrup_n;
    if (!(result.Aw.Aw === 0)) {
      result.Aw.AwString = dia + "-" + result.Aw.stirrup_n + "本";
    }

    result.Aw.fwyd = fwyd.fsy;
    result.Aw.fwud = fwyd.fsu;
    result.Aw.rs = safety.safety_factor.rs;

    let tan = this.helper.toNumber(section.tan);
    if (tan === null) {
      tan = 0;
    }
    result.tan = tan;


    return result;

  }

  private getAst(section: any): any {

    const result = {
      tension: null,
      Ast: null,
      AstString: null,
      dst: null,
      fsy: null,
      fsu: null,
      rs: null,
    }

    result.tension = section.tension;
    result.fsy = section.fsy.fsy;
    result.fsu = section.fsy.fsu;

    const mark = section.tension.mark === "R" ? "φ" : "D";
    const AstDia = mark + section.tension.rebar_dia;
    let rebar_n = section.tension.rebar_n;

    const Astx: number = this.helper.getAs(AstDia) * rebar_n * section.tension.cos;

    result.Ast = Astx;
    result.AstString = AstDia + "-" + rebar_n + "本";
    result.dst = this.getBarCenterPosition(section.tension);

    return result;

  }

  private getAsc(section: any): any {

    const result = {
      compress: null,
      Asc: null,
      AscString: null,
      dsc: null,
    }

    if (!('compress' in section)) {
      return result;
    }

    result.compress = section.compress;

    const mark = section.compress.mark === "R" ? "φ" : "D";
    const AstDia = mark + section.compress.rebar_dia;
    let rebar_n = section.compress.rebar_n;

    const Astx: number = this.helper.getAs(AstDia) * rebar_n * section.compress.cos;

    result.Asc = Astx;
    result.AscString = AstDia + "-" + rebar_n + "本";
    result.dsc = this.getBarCenterPosition(section.compress);

    return result;

  }

  private getAse(section: any): any {

    const result = {
      Ase: null,
      AseString: null,
      dse: null,
    }

    if (!('sidebar' in section)) {
      return result;
    }

    const mark = section.sidebar.mark === "R" ? "φ" : "D";
    const AstDia = mark + section.sidebar.rebar_dia;
    let rebar_n = section.sidebar.rebar_n;

    const Astx: number = this.helper.getAs(AstDia) * rebar_n * section.sidebar.cos;

    result.Ase = Astx;
    result.AseString = AstDia + "-" + rebar_n + "本";
    result.dse = this.getBarCenterPosition(section.sidebar);

    return result;

  }

  // 断面積と断面係数
  public getStructuralVal(shapeName: string, member: any,
    target: string, index: number): any {

    const result = {};

    let shape: any;
    let h: number, b: number, bf: number, hf: number;
    let a1: number, a2: number, a3: number, a4: number, a5: number;
    let x: number, e1: number, e2: number;
    let Area: number, circleArea: number, rectArea: number;

    switch (shapeName) {
      case 'Circle':            // 円形
        shape = this.circle.getSection(member);
        h = shape.H;
        result['A'] = Math.pow(h, 2) * Math.PI / 4;
        result['I'] = Math.pow(h, 4) * Math.PI / 64;
        result['eu'] = h / 2;
        result['el'] = h / 2;
        break;

      case 'Ring':              // 円環
        shape = this.circle.getSection(member);
        h = shape.H; // 外径
        b = shape.B; // 内径
        result['A'] = (Math.pow(h, 2) - Math.pow(b, 2)) * Math.PI / 4;
        result['I'] = (Math.pow(h, 4) - Math.pow(b, 4)) * Math.PI / 64;
        result['eu'] = h / 2;
        result['el'] = h / 2;
        break;

      case 'Rectangle':         // 矩形
        shape = this.rect.getSection(member, target, index);
        h = shape.H;
        b = shape.B;
        result['A'] = b * h;
        result['I'] = b * Math.pow(h, 3) / 12;
        result['eu'] = h / 2;
        result['el'] = h / 2;
        break;

      case 'Tsection':          // T形
        shape = this.rect.getSection(member, target, index);
        h = shape.H;
        b = shape.B;
        bf = shape.Bt;
        hf = shape.t;
        x = bf - b;
        result['A'] = h * b + hf * x;
        a1 = b * Math.pow(h, 2) + x * Math.pow(hf, 2);
        a2 = 2 * (b * h + x * hf);
        e1 = a1 / a2;
        e2 = h - e1;
        result['eu'] = e1;
        result['el'] = e2;
        a3 = bf * Math.pow(e1, 3);
        a4 = x * h;
        a5 = b * Math.pow(e2, 3);
        result['I'] = (a3 - a4 + a5) / 3;
        break;


      case 'InvertedTsection':  // 逆T形
        shape = this.rect.getSection(member, target, index);
        h = shape.H;
        b = shape.B;
        bf = shape.Bt;
        hf = shape.t;
        x = bf - b;
        result['A'] = h * b + hf * x;
        a1 = b * Math.pow(h, 2) + x * Math.pow(hf, 2);
        a2 = 2 * (b * h + x * hf);
        e1 = a1 / a2;
        e2 = h - e1;
        result['eu'] = e2;
        result['el'] = e1;
        a3 = bf * Math.pow(e1, 3);
        a4 = x * h;
        a5 = b * Math.pow(e2, 3);
        result['I'] = (a3 - a4 + a5) / 3;
        break;

      case 'HorizontalOval':    // 水平方向小判形
        shape = this.hOval.getSection(member);
        h = shape.H;
        b = shape.B;
        circleArea = (h ** 2) * Math.PI / 4;
        rectArea = h * (b - h);
        Area = circleArea + rectArea;
        result['A'] = Area;
        result['I'] = (Math.pow(h, 4) * Math.PI / 64) + ((b - h) * Math.pow(h, 3) / 12);
        result['eu'] = h / 2;
        result['el'] = h / 2;
        break;

      case 'VerticalOval':      // 鉛直方向小判形
        shape = this.vOval.getSection(member);
        x = h - b;
        circleArea = (b ** 2) * Math.PI / 4;
        rectArea = b * x;
        Area = circleArea + rectArea;
        a1 = Math.PI * Math.pow(b, 4) / 64;
        a2 = x * Math.pow(b, 3) / 6;
        a3 = Math.PI * Math.pow(x, 2) * Math.pow(b, 2) / 16;
        a4 = b * Math.pow(x, 3) / 12;
        result['A'] = Area;
        result['I'] = a1 + a2 + a3 + a4;
        result['eu'] = h / 2;
        result['el'] = h / 2;

        break;

      default:
        throw ("断面形状：" + member.shape + " は適切ではありません。");
    }

    return result;
  }

  // 鉄筋の重心位置を求める
  private getBarCenterPosition(bar: any) {

    const cover: number = bar.dsc;
    const n: number = bar.rebar_n;
    const line: number = bar.line;
    const space: number = bar.space;
    const cos: number = bar.cos;

    // 計算する必要のない場合の処理
    if (cover === null) {
      return 0;
    }
    if (n === null || n <= 0) {
      return cover;
    }
    if (line === null || line <= 0) {
      return cover;
    }
    if (space === null || space <= 0) {
      return cover;
    }
    if (n < line) {
      return cover;
    }
    // 鉄筋の重心位置を計算する
    const steps: number = Math.ceil(n / line); // 鉄筋段数
    let reNum: number = n;
    let PosNum: number = 0;
    for (let i = 0; i < steps; i++) {
      const pos = cover + i * space;
      const num: number = Math.min(line, reNum);
      PosNum += pos * num;
      reNum -= line;
    }
    let result: number = PosNum / n;
    result /= cos;
    return result;
  }


}
