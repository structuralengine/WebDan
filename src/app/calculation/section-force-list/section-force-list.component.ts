import { Component, OnInit } from '@angular/core';
import { SaveDataService } from '../../providers/save-data.service';
import { CalcSafetyMomentService } from '../result-safety-moment/calc-safety-moment.service';
import { CalcSafetyShearForceService } from '../result-safety-shear-force/calc-safety-shear-force.service';
import { CalcSafetyFatigueMomentService } from '../result-safety-fatigue-moment/calc-safety-fatigue-moment.service';
import { CalcSafetyFatigueShearForceService } from '../result-safety-fatigue-shear-force/calc-safety-fatigue-shear-force.service';
import { CalcServiceabilityMomentService } from '../result-serviceability-moment/calc-serviceability-moment.service';
import { CalcServiceabilityShearForceService } from '../result-serviceability-shear-force/calc-serviceability-shear-force.service';
import { CalcDurabilityMomentService } from '../result-durability-moment/calc-durability-moment.service';
import { CalcRestorabilityMomentService } from '../result-restorability-moment/calc-restorability-moment.service';
import { CalcRestorabilityShearForceService } from '../result-restorability-shear-force/calc-restorability-shear-force.service';
import { CalcEarthquakesMomentService } from '../result-earthquakes-moment/calc-earthquakes-moment.service';
import { CalcEarthquakesShearForceService } from '../result-earthquakes-shear-force/calc-earthquakes-shear-force.service';
import { ArrayType } from '@angular/compiler';

@Component({
  selector: 'app-section-force-list',
  templateUrl: './section-force-list.component.html',
  styleUrls: ['../result-viewer/result-viewer.component.scss']
})
export class SectionForceListComponent implements OnInit {

  public pages: object[];

  public isLoading = true;
  public isFulfilled = false;

  private rowCountAtPage: number = 70; // 1ページあたり 75行
  private rowTitleRowCount: number = 6; // タイトル行は 6行分

  constructor(
    private save: SaveDataService,
    private durabilityMoment: CalcDurabilityMomentService,
    private earthquakesMoment: CalcEarthquakesMomentService,
    private earthquakesShearForce: CalcEarthquakesShearForceService,
    private restorabilityMoment: CalcRestorabilityMomentService,
    private restorabilityShearForce: CalcRestorabilityShearForceService,
    private SafetyFatigueMoment: CalcSafetyFatigueMomentService,
    private safetyFatigueShearForce: CalcSafetyFatigueShearForceService,
    private safetyMoment: CalcSafetyMomentService,
    private safetyShearForce: CalcSafetyShearForceService,
    private serviceabilityMoment: CalcServiceabilityMomentService,
    private serviceabilityShearForce: CalcServiceabilityShearForceService
  ) { }

  ngOnInit() {
    this.pages = new Array();

    const groupeList = this.save.members.getGroupeList();

    // 安全性（破壊）
    const safetyMomentForces = this.safetyMoment.DesignForceList;
    const safetyShearForces = this.safetyShearForce.DesignForceList;
    // 安全性（疲労破壊）
    const safetyFatigueMomentForces = this.SafetyFatigueMoment.DesignForceList;
    const safetyFatigueShearForces = this.safetyFatigueShearForce.DesignForceList;
    // 耐久性
    const serviceabilityMomentForces = this.serviceabilityMoment.DesignForceList;
    const serviceabilityShearForces = this.serviceabilityShearForce.DesignForceList;
    // 使用性
    const durabilityMomentForces = this.durabilityMoment.DesignForceList;
    // 復旧性（地震時以外）
    const restorabilityMomentForces = this.restorabilityMoment.DesignForceList;
    const restorabilityShearForces = this.restorabilityShearForce.DesignForceList;
    // 復旧性（地震時）
    const earthquakesMomentForces = this.earthquakesMoment.DesignForceList;
    const earthquakesShearForces = this.earthquakesShearForce.DesignForceList;

    for (const memberList of groupeList) {

      let currentRow: number = 0;
      const g_name: string = memberList[0].g_name;
      let page: any = null;
      const g_name_moment: string = g_name + ' 曲げモーメントの照査';
      let tableType: number = 1;

      // 耐久性曲げモーメントの照査
      if (serviceabilityMomentForces.length > 0) {
        const targetRows: any[] = this.setPage(memberList, serviceabilityMomentForces, 2);
        
        const t1: any = this.getTableRowsOfPage(targetRows[1], currentRow, tableType);
        const rows1: any[] = t1.tableRowsOfPage;
        currentRow = t1.currentRow;
        page = this.setTables(rows1, page, g_name_moment, tableType, '耐久性　縁引張応力度検討用');

        const t2: any = this.getTableRowsOfPage(targetRows[0], currentRow, tableType);
        const rows2: any[] = t2.tableRowsOfPage;
        currentRow = t2.currentRow;
        page = this.setTables(rows2, page, g_name_moment, tableType, '耐久性　永久作用');
      }

      // 使用性曲げモーメントの照査
      if (durabilityMomentForces.length > 0) {
        const targetRows: any[] = this.setPage(memberList, durabilityMomentForces, 2);

        const t1: any = this.getTableRowsOfPage(targetRows[1], currentRow, tableType);
        const rows1: any[] = t1.tableRowsOfPage;
        currentRow = t1.currentRow;
        page = this.setTables(rows1, page, g_name_moment, tableType, '使用性　縁引張応力度検討用');

        const t2: any = this.getTableRowsOfPage(targetRows[0], currentRow, tableType);
        const rows2: any[] = t2.tableRowsOfPage;
        currentRow = t2.currentRow;
        page = this.setTables(rows2, page, g_name_moment, tableType, '使用性　永久作用');
      }
      
      // 安全性（破壊）曲げモーメントの照査
      if (safetyMomentForces.length > 0) {
        const targetRows: any[] = this.setPage(memberList, safetyMomentForces, 1);
        
        const t: any = this.getTableRowsOfPage(targetRows[0], currentRow, tableType);
        const rows: any[] = t.tableRowsOfPage;
        currentRow = t.currentRow;
        page = this.setTables(rows, page, g_name_moment, tableType, '安全性（破壊）');
      }

      // 安全性（疲労破壊）曲げモーメントの照査
      if (safetyFatigueMomentForces.length > 0) {
        const targetRows: any[] = this.setPage(memberList, safetyFatigueMomentForces, 2);
        
        const t1: any = this.getTableRowsOfPage(targetRows[0], currentRow, tableType);
        const rows1: any[] = t1.tableRowsOfPage;
        currentRow = t1.currentRow;
        page = this.setTables(rows1, page, g_name_moment, tableType, '安全性（疲労破壊）最小応力');

        const t2: any = this.getTableRowsOfPage(targetRows[1], currentRow, tableType);
        const rows2: any[] = t2.tableRowsOfPage;
        currentRow = t2.currentRow;
        page = this.setTables(rows2, page, g_name_moment, tableType, '安全性（疲労破壊）最大応力');
      }

      // 復旧性（地震時以外）曲げモーメントの照査
      if (restorabilityMomentForces.length > 0) {
        const targetRows: any[] = this.setPage(memberList, restorabilityMomentForces, 1);
        
        const t: any = this.getTableRowsOfPage(targetRows[0], currentRow, tableType);
        const rows: any[] = t.tableRowsOfPage;
        currentRow = t.currentRow;
        page = this.setTables(rows, page, g_name_moment, tableType, '復旧性（地震時以外）');
      }

      // 復旧性（地震時）曲げモーメントの照査
      if (earthquakesMomentForces.length > 0) {
        const targetRows: any[] = this.setPage(memberList, earthquakesMomentForces, 1);
        
        const t: any = this.getTableRowsOfPage(targetRows[0], currentRow, tableType);
        const rows: any[] = t.tableRowsOfPage;
        currentRow = t.currentRow;
        page = this.setTables(rows, page, g_name_moment, tableType, '復旧性（地震時）');
      }

      if (page !== null) {
        this.pages.push(page);
        page = null;
      }

      const g_name_shear: string = g_name + ' せん断力に対する照査';
      tableType = 2;

      // 耐久性せん断力に対する照査
      if (serviceabilityShearForces.length > 0) {
        const targetRows: any[] = this.setPage(memberList, serviceabilityShearForces, 3);

        const t1: any = this.getTableRowsOfPage(targetRows[0], currentRow, tableType);
        const rows1: any[] = t1.tableRowsOfPage;
        currentRow = t1.currentRow;
        page = this.setTables(rows1, page, g_name_shear, tableType, '耐久性　ひび割れ照査必要性の検討用');

        const t2: any = this.getTableRowsOfPage(targetRows[1], currentRow, tableType);
        const rows2: any[] = t2.tableRowsOfPage;
        currentRow = t2.currentRow;
        page = this.setTables(rows2, page, g_name_shear, tableType, '耐久性　永久作用');

        const t3: any = this.getTableRowsOfPage(targetRows[2], currentRow, tableType);
        const rows3: any[] = t3.tableRowsOfPage;
        currentRow = t3.currentRow;
        page = this.setTables(rows3, page, g_name_shear, tableType, '耐久性　変動作用');
      }

      // 安全性（破壊）せん断力に対する照査
      if (safetyShearForces.length > 0) {
        const targetRows: any[] = this.setPage(memberList, safetyShearForces, 1);

        const t: any = this.getTableRowsOfPage(targetRows[0], currentRow, tableType);
        const rows: any[] = t.tableRowsOfPage;
        currentRow = t.currentRow;
        page = this.setTables(rows, page, g_name_shear, tableType, '安全性（破壊）');
      }

      // 安全性（疲労破壊）せん断力に対する照査
      if (safetyFatigueShearForces.length > 0) {
        const targetRows: any[] = this.setPage(memberList, safetyFatigueShearForces, 2);

        const t1: any = this.getTableRowsOfPage(targetRows[0], currentRow, tableType);
        const rows1: any[] = t1.tableRowsOfPage;
        currentRow = t1.currentRow;
        page = this.setTables(rows1, page, g_name_shear, tableType, '安全性（疲労破壊）最小応力');

        const t2: any = this.getTableRowsOfPage(targetRows[1], currentRow, tableType);
        const rows2: any[] = t2.tableRowsOfPage;
        currentRow = t2.currentRow;
        page = this.setTables(rows2, page, g_name_shear, tableType, '安全性（疲労破壊）最大応力');
      }

      // 復旧性（地震時以外）せん断力に対する照査
      if (restorabilityShearForces.length > 0) {
        const targetRows: any[] = this.setPage(memberList, restorabilityShearForces, 1);

        const t: any = this.getTableRowsOfPage(targetRows[0], currentRow, tableType);
        const rows: any[] = t.tableRowsOfPage;
        currentRow = t.currentRow;
        page = this.setTables(rows, page, g_name_shear, tableType, '復旧性（地震時以外）');
      }

      // 復旧性（地震時）せん断力に対する照査
      if (earthquakesShearForces.length > 0) {
        const targetRows: any[] = this.setPage(memberList, earthquakesShearForces, 1);

        const t: any = this.getTableRowsOfPage(targetRows[0], currentRow, tableType);
        const rows: any[] = t.tableRowsOfPage;
        currentRow = t.currentRow;
        page = this.setTables(rows, page, g_name_shear, tableType, '復旧性（地震時）');
      }

      if (page !== null) {
        this.pages.push(page);
        page = null;
      }
     
    }

    this.isLoading = false;
    this.isFulfilled = true;

  }

  private setTables(rows: any[], page: any, g_name: string,
                    tableType: number, title: string): any {

    if (page === null) {
      page = {
        g_name: g_name,
        tables: new Array(),
        tableType: tableType
      };
    }
    // 最初の１つ目のテーブルは、同じページに
    if (rows[0] !== null) {
      let y: number = 70;
      y += (tableType===1) ? rows[0].length * 16 : rows[0].length * 32;
      page.tables.push({
        title: title,
        rows: rows[0],
        viewBox: '0 0 568 ' + y.toString(),
        height:  y.toString()
      });
    }
    // ２つ目以降のテーブル
    for (let i = 1; i < rows.length; i++) {
      // ページを登録
      this.pages.push(page);
      page = {
        g_name: g_name,
        tables: new Array(),
        tableType: tableType
      };
      // 新しいテーブルを登録
      let y: number = 70;
      y += (tableType===1) ? rows[i].length * 16 : rows[i].length * 32;
      const table: any = {
        title: title,
        rows: rows[i],
        viewBox: '0 0 568 ' + y.toString(),
        height:  y.toString()
      };
      page.tables.push(table);
    }
    return page;
  }

  private getTableRowsOfPage(targetRows: any[], currentRow: number, tableType: number): any {

    const result: object = {};
    const tableRowsOfPage: any[] = new Array();
    let rows: any[] = new Array();
    currentRow += this.rowTitleRowCount;
    const a: number = (tableType===1) ? 1 : 2;
    const RowsCount: number =  targetRows.length * a;

    if (currentRow > this.rowTitleRowCount) {
      if (this.rowCountAtPage < currentRow + RowsCount) {
        // 改ページが必要
        if (this.rowTitleRowCount + RowsCount < this.rowCountAtPage) {
          // 次のページに収まる
          tableRowsOfPage.push(null);
          tableRowsOfPage.push(targetRows);
          currentRow = this.rowTitleRowCount + RowsCount;
          result['currentRow'] = currentRow;
          result['tableRowsOfPage'] = tableRowsOfPage;
          return result;
        }
      }
    }

    let i: number = currentRow;

    for (const row of targetRows) {
      rows.push(row);
      i += (tableType===1) ? 1 : 2;
      if (this.rowCountAtPage < i) {
        tableRowsOfPage.push(rows);
        rows = new Array();
        i = this.rowTitleRowCount;
      }
    }
    if (i > this.rowTitleRowCount) {
      tableRowsOfPage.push(rows);
    }
    currentRow = i;
    result['currentRow'] = currentRow;
    result['tableRowsOfPage'] = tableRowsOfPage;
    return result;
  }

  private setPage(memberList: any[], forces: any[], count: number): any[] {

    const result: any[] = new Array(count);
    for (let i = 0; i < count; i++) {
      result[i] = new Array();
    }

    for (const member of memberList) {
      let tmp: any = undefined;
      for (const m of forces) {
        tmp = m.find(a => { return a.m_no === member.m_no; })
        if (tmp !== undefined) { break; }
      }
      if (tmp !== undefined) {
        for (const pos of tmp.positions) {

          const pd: any[] = new Array();
          for (let i = 0; i < count; i++) {
            const key: string = 'PostData' + i.toString();
            if (key in pos) { pd.push(pos[key]); }
          }

          for (let i = 0; i < pd.length; i++) {
            const p: any = {
              m_no: member.m_no,
              position: pos.position.toFixed(3),
              p_name: pos.p_name,
              p_name_ex: pos.p_name_ex
            };

            for (const pp of pd[i]) {
              const pt = { Md: '-', Nd: '-', Vd: '-', comb: '-' };
              if ('Md' in pp) { pt.Md = pp.Md.toFixed(2); }
              if ('Nd' in pp) { pt.Nd = pp.Nd.toFixed(2); }
              if ('Vd' in pp) { pt.Vd = pp.Vd.toFixed(2); }
              if ('comb' in pp) { pt.comb = pp.comb; }
              switch (pp.memo) {
                case '上側引張':
                  p['upper'] = pt;
                  break;
                case '下側引張':
                  p['lower'] = pt;
                  break;
              }
            }

            if ('upper' in p === false) {
              p['upper'] = { Md: '-', Nd: '-', Vd: '-', comb: '-' };
            }
            if ('lower' in p === false) {
              p['lower'] = { Md: '-', Nd: '-', Vd: '-', comb: '-' };
            }

            result[i].push(p);
          }
        }
      }
    }
    return result;
  }

}
