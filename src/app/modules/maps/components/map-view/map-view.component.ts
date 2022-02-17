import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { PlacesService } from '../../services';
import { Map, Popup, Marker } from 'mapbox-gl';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css'],
})
export class MapViewComponent implements AfterViewInit {

  @ViewChild('divMap') divMapElement!: ElementRef<HTMLDivElement>;

  constructor(private placesService: PlacesService) {}

  ngAfterViewInit(): void {
    // This error should never be seen because we did a validation in the service
    if (!this.placesService.userLocation)
      throw Error('There is not placesService.userLocation');

    const map = new Map({
      container: this.divMapElement.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/light-v10', // style URL
      center: this.placesService.userLocation, // starting position [lng, lat]
      zoom: 14, // starting zoom
    });

    const popup = new Popup()
      .setHTML(`
        <h6>I'm here</h6>
        <span>I'm in this place of the world</span>
      `)

    new Marker({ color: 'red'})
      .setLngLat(this.placesService.userLocation)
      .setPopup(popup)
      .addTo(map)
  }
}
