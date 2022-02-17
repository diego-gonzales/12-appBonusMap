import { Component, OnInit } from '@angular/core';
import { MapsService, PlacesService } from '../../services';

@Component({
  selector: 'app-button-my-location',
  templateUrl: './button-my-location.component.html',
  styleUrls: ['./button-my-location.component.css']
})
export class ButtonMyLocationComponent implements OnInit {

  constructor(
    private mapsService: MapsService,
    private placesService: PlacesService
  ) { }

  ngOnInit(): void {
  }

  goToMyLocation() {
    if (!this.placesService.isUserLocationReady) throw Error('There is not user location');
    if (!this.mapsService.isMapReady) throw Error('Map is not ready');

    this.mapsService.flyTo(this.placesService.userLocation! );
  };
}
