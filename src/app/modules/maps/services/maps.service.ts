import { Injectable } from '@angular/core';
import { LngLatBounds, LngLatLike, Map, Marker, Popup } from 'mapbox-gl';
import { Feature } from '../interfaces/places.interface';

@Injectable({
  providedIn: 'root'
})
export class MapsService {

  private map?: Map; // o puede ser map!, si estoy seguro que siempre llegará
  private markers: Marker[] = [];

  get isMapReady(): boolean {
    return !!this.map; // verifica que la propiedad de arriba tenga un valor, por eso el !!
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

  createMarkersFromPlaces(places: Feature[], userLocation: [number, number]) {
    if (!this.map) return; // or throw Error

    // Limpiamos los marcadores del mapa, no el arreglo (Para cada nueva busqueda se limpiará, así no se acumulan los marcadores)
    this.markers.forEach(marker => marker.remove()) // .remove es una metodo propio de Mapbox que remueve un marcador del mapa
    const newMarkers = [];

    for (const place of places) {
      const [lng, lat] = place.center;

      const popup = new Popup()
        .setHTML(
          `
            <h6>${place.text}</h6>
            <span>${place.place_name}</span>
          `
        );

      const marker = new Marker()
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(this.map);

      newMarkers.push(marker);
    };

    this.markers = newMarkers;

    if (places.length === 0) return;

    const bounds = new LngLatBounds();
    // para que se vea también mi punto inicial, osea mi ubicación
    bounds.extend(userLocation);

    newMarkers.forEach( marker => bounds.extend(marker.getLngLat()) );

    this.map.fitBounds(bounds, {
      padding: 200
    });
  };
}
