import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlacesResponse, Feature } from '../interfaces/places.interface';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  public userLocation?: [number, number];
  public isLoadingPlaces: boolean = false;
  public places: Feature[] = [];

  get isUserLocationReady(): boolean {
    return !!this.userLocation;
  };

  constructor(
    private http: HttpClient
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

    this.isLoadingPlaces = true;

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?country=pe&proximity=-78.51744570065587%2C-7.157121853549555&types=place%2Cpostcode%2Caddress&language=es&access_token=pk.eyJ1IjoiZGllZ29lZ2oiLCJhIjoiY2ttcDlvYjVsMGV6OTJ2cXB5YTdtbm5rMSJ9.noDE8WEnh0vXhl38LZxHdw`;

    this.http.get<PlacesResponse>(url)
      .subscribe(
        (resp) => {
          this.isLoadingPlaces = false;
          this.places = resp.features;
        }
      );
  };
}
