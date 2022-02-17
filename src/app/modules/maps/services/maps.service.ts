import { Injectable } from '@angular/core';
import { LngLatLike, Map } from 'mapbox-gl';

@Injectable({
  providedIn: 'root'
})
export class MapsService {

  private map?: Map;

  get isMapReady(): boolean {
    return !!this.map;
  };

  constructor() { }

  setMap(map: Map) {
    this.map = map;
  };

  flyTo(coords: LngLatLike) {
    if (!this.isMapReady) throw Error('Map is not ready');

    this.map?.flyTo({
      zoom: 14,
      center: coords
    });
  };
}
