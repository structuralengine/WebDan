import { Injectable } from '@angular/core';
import { InputMembersService } from './input-members.service';

@Injectable({
  providedIn: 'root'
})
export class InputCalclationPrintService {

  public print_selected: any;
  private calc_checked: boolean[];

  constructor(private members: InputMembersService) {

    this.print_selected = {
      'print_calculate_checked': false,
      'print_section_force_checked': false,
      'print_summary_table_checked': false,
      'calculate_moment_checked': false,
      'calculate_shear_force': false
    }
    this.calc_checked = new Array();

  }

  public getColumnData(): any[] {
    const result: any[] = new Array();

    const groups: any[] = this.members.getGroupeList();
    for ( let i = 0; i < groups.length; i++) {
      let checked = false;
      if ( i < this.calc_checked.length ) {
        checked = this.calc_checked[i];
      }
      result.push({
        'checked': checked,
        'g_name': groups[i][0].g_name
      });
    }
    return result;
  }

  public setColumnData(ColumnData: any[] ): void {
    this.calc_checked = new Array();
    for ( const data of ColumnData ){
      this.calc_checked.push(data.calc_checked);
    }
  }


}
