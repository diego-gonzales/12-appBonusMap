import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlacesResponse, Feature } from '../interfaces/places.interface';
import { PlacesApiClient } from '../api';
import { MapsService } from '.';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  public userLocation?: [number, number];
  public isLoadingPlaces: boolean = false;
  public places: Feature[] = [];

  get isUserLocationReady(): boolean {
    return !!this.userLocation; /* Doble !! en pocas palabras es un casteo a un booleano */
  };

  constructor(
    private http: HttpClient,
    private placesApi: PlacesApiClient,
    private mapsService: MapsService
  ) {
    this.getUserLocation();
  }

  async getUserLocation(): Promise<[number, number]> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (args) => {
          this.userLocation = [args.coords.longitude, args.coords.latitude];
          resolve([args.coords.longitude, args.coords.latitude]);
        },
        (err) => {
          alert(err);
          console.log(err);
          reject(err);
        }
      )
    })
  };

  getPlacesByQuery(query: string = '') {

    if (query.length === 0) {
      this.isLoadingPlaces = false;
      this.places = [];
      return;
    };

    if (!this.userLocation) throw Error('There is not User location'); // or you can write only 'return'

    this.isLoadingPlaces = true;

    const url = `/${query}.json`;

    this.placesApi.get<PlacesResponse>(url, {
      params: {
        proximity: this.userLocation.join(',') // userLocation: [number,number] => join => number,number
      }
    }).subscribe(
      (resp) => {
        console.log(resp.features);
        this.isLoadingPlaces = false;
        this.places = resp.features;

        this.mapsService.createMarkersFromPlaces(this.places, this.userLocation!);
      }
    );
  };
}
