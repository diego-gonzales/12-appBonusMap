import { Injectable } from '@angular/core';
import { AnySourceData, LngLatBounds, LngLatLike, Map, Marker, Popup } from 'mapbox-gl';
import { DirectionsApiClient } from '../api';
import { Feature } from '../interfaces/places.interface';
import { DirectionsResponse, Route } from '../interfaces/directions.interface';

@Injectable({
  providedIn: 'root'
})
export class MapsService {

  private map?: Map; // o puede ser map!, si estoy seguro que siempre llegará
  private markers: Marker[] = [];

  get isMapReady(): boolean {
    return !!this.map; // verifica que la propiedad de arriba tenga un valor, por eso el !!
  };

  constructor(
    private directionsApi: DirectionsApiClient
  ) { }

  setMap(map: Map) {
    this.map = map;
  }

  flyTo(coords: LngLatLike) {
    if (!this.isMapReady) throw Error('Map is not ready');

    this.map?.flyTo({
      zoom: 14,
      center: coords
    });
  }

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
  }

  getRouteBetweenPoints(start: [number, number], end: [number, number]) {
    this.directionsApi.get<DirectionsResponse>(`/${start.join(',')};${end.join(',')}`)
      .subscribe(resp => this.drawLineString(resp.routes[0]))
  }

  private drawLineString(route: Route) {
    console.log({ distance_kms: route.distance / 1000, duration: route.duration / 60 })
    if (!this.map) throw Error('Mapa is not initialized');

    const bounds = new LngLatBounds();

    const coords = route.geometry.coordinates;
    coords.forEach(([lng, lat]) => bounds.extend([lng, lat]));

    this.map.fitBounds(bounds, {
      padding: 200
    });

    // LineString
    // Se define el source
    const sourceData: AnySourceData = {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coords
            }
          }
        ]
      }
    }

    // Limpiamos el layer antes de dibujar otro
    if (this.map.getLayer('MyLineString')) {
      this.map.removeLayer('MyLineString');
      this.map.removeSource('MyLineString');
    };

    // Se añade al mapa
    this.map.addSource('MyLineString', sourceData);
    // Se define como quieres que se vea
    this.map.addLayer({
      id: 'MyLineString', // nombre no tiene que ser igual que lo de arriba
      type: 'line',
      source: 'MyLineString',
      layout: {
        'line-cap': 'round',
        'line-join': 'round'
      },
      paint: {
        'line-color': 'black',
        'line-width': 3
      }
    });
  }
}
