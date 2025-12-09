import { Component, OnChanges, OnInit, signal, Signal, SimpleChanges, WritableSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MaterialModule } from './material.module';
import { Map } from './map/map';
import { DataTable } from './data-table/data-table';
import { Http } from './services/http';
import { FormsModule } from '@angular/forms';
import { CdkTableDataSourceInput } from '@angular/cdk/table';

interface AviationSafetyResult {
  status: string,
  lenght: number,
  data: unknown
}
export interface MapMarkerData {
  id: string,
  position: google.maps.LatLngLiteral,
  location: string,
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MaterialModule, Map, DataTable, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {

  data: CdkTableDataSourceInput<any> = [];
  markers: WritableSignal<MapMarkerData[]> = signal([]);
  year: number = 2008;
  page: number = 0;
  page_size: number = 50;
  length: WritableSignal<number> = signal(0);

  constructor(private http: Http) { }

  onQueryChanged(): void {
    this._getData()
  }

  ngOnInit(): void {
    this._getData()
  }

  private _getData(): void {
    this.http.get("api/aviation-safety/query", { "year": this.year, "page": this.page + 1, "page_size": this.page_size }).subscribe((response) => {
      const result = response as AviationSafetyResult;
      this.length.set(result.lenght)
      this.data = result.data as CdkTableDataSourceInput<any>;
      const markers = (this.data as Array<any>).filter(
        (item) => !!item.Location || (!!item.Latitude && !!item.Longitude)
      ).map(
        (item) => {
          return {
            id: item["Event.Id"],
            position: {
              lat: item.Latitude,
              lng: item.Longitude
            },
            location: item.Location
          }
        }
      );
      this.markers.set(markers)
    })
  }
}

