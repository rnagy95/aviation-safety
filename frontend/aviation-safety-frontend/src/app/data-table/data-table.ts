import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MaterialModule } from '../material.module';
import { PageEvent } from '@angular/material/paginator';
import { CdkTableDataSourceInput } from '@angular/cdk/table';

@Component({
  selector: 'app-data-table',
  imports: [MaterialModule],
  templateUrl: './data-table.html',
  styleUrl: './data-table.scss',
})
export class DataTable {

  @Input() page: number = 0;
  @Input() page_size: number = 50;
  @Input() length: number = 0;
  @Input() data: CdkTableDataSourceInput<any> = [];
  @Output() pageChange: EventEmitter<number> = new EventEmitter();
  @Output() page_sizeChange: EventEmitter<number> = new EventEmitter();

  onPageChanged(event: PageEvent): void {
    if(this.page !== event.pageIndex){
      this.page = event.pageIndex;
      this.pageChange.emit(this.page)
    }
    if (this.page_size !== event.pageSize){
      this.page_size = event.pageSize;
      this.page_sizeChange.emit(this.page_size)
    }
  }

  displayedColumns: string[] = ["Event.Id", "Investigation.Type", "Accident.Number", "Event.Date", "Location", "Country", "Airport.Code", "Airport.Name", "Aircraft.Category", "Registration.Number", "Make", "Model", "Amateur.Built", "Total.Fatal.Injuries", "Total.Serious.Injuries", "Total.Minor.Injuries", "Total.Uninjured"];
}
