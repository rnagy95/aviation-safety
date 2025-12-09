import { AfterViewInit, Component, Input, WritableSignal, ViewChild, signal, OnChanges, SimpleChanges } from '@angular/core';
import { GoogleMapsModule, GoogleMap, MapGeocoder } from '@angular/google-maps';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { MapMarkerData } from '../app';
import { forkJoin, of, map } from 'rxjs';

@Component({
  selector: 'app-map',
  imports: [GoogleMapsModule],
  templateUrl: './map.html',
  styleUrl: './map.scss'
})
export class Map implements AfterViewInit, OnChanges {


  constructor(private geocoder: MapGeocoder) {

  }

  private _clusterer: MarkerClusterer | null = null;

  @Input({ required: true }) markers: MapMarkerData[] = [];

  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;

  center: google.maps.LatLngLiteral = { lat: 48.856667, lng: 2.352222 };
  zoom = 2;

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes['markers'].currentValue) {
      this.updateMarkers();
    }
  }

  ngAfterViewInit(): void {
    this.initClusterer()
  }

  initClusterer(): void {
    if (!this._clusterer) {
      this._clusterer = new MarkerClusterer({
        map: this.map.googleMap!,
        markers: []
      });
    }
  }

  updateMarkers(): void {
    this.initClusterer();
    this._clusterer?.clearMarkers();
    this.addMarkers();
  }

  addMarkers(): void {
    const requests = this.markers.map((marker) => {
      if ((!marker.position?.lat || !marker.position?.lng) && !!marker.location) {
        return this.geocoder.geocode({ address: marker.location }).pipe(map(response => ({ marker, response })))
      }
      else {
        return of({ marker, response: null })
      }
    });

    forkJoin(requests).subscribe((results) => {
      results.forEach(({ marker, response }) => {
        if (!!response && response?.results.length > 0) {
          const position = response.results[0].geometry.location;
          marker.position.lat = position.lat();
          marker.position.lng = position.lng();
        }
      });
      this._clusterer?.addMarkers(this.markers.filter(marker => !!marker.position.lat && !!marker.position.lng).map(marker => new google.maps.Marker({ position: marker.position })))
    });
  }
}
