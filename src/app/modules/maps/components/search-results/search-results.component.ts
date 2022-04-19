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
  }

  get places(): Feature[] {
    return this.placesService.places;
  }

  flyTo(place: Feature) {
    this.selectedPlaceID = place.id;

    const [lng, lat] = place.center;
    this.mapsService.flyTo([lng, lat]);
  }

  getDirections(place: Feature) {
    // Validación de más si ýa sabemos que en este punto ya tenemos la localización del usuario.
    // if (!this.placesService.userLocation) throw Error('User location is not avalaible');

    // Esto habilitaría el ngIf del template y no se mostraría mis resultados una vez que haga click en 'Direction'
    this.placesService.cleanPlaces();

    const start = this.placesService.userLocation!; // signo ! para decirle que estamos seguros de que ya hay localización
    const end = place.center as [number, number]; // end by default is number[] type

    this.mapsService.getRouteBetweenPoints(start, end);
  }
}
