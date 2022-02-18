import { Component, OnInit } from '@angular/core';
import { PlacesService, MapsService } from '../../services';
import { Feature } from '../../interfaces/places.interface';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {

  public selectedPlaceID: string = '';

  constructor(
    private placesService: PlacesService,
    private mapsService: MapsService
  ) { }

  ngOnInit(): void {
  }

  get isLoadingPlaces(): boolean {
    return this.placesService.isLoadingPlaces;
  };

  get places(): Feature[] {
    return this.placesService.places;
  };

  flyTo(place: Feature) {
    this.selectedPlaceID = place.id;

    const [lng, lat] = place.center;
    this.mapsService.flyTo([lng, lat]);
  }

}
