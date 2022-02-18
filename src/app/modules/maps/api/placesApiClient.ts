import { Injectable } from '@angular/core';
import { HttpClient, HttpHandler, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlacesApiClient extends HttpClient {

  public baseURL: string = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

  constructor(handler: HttpHandler) {
    super(handler)
  }

  public override get<T>(uri: string, options: {
    params?: HttpParams | {
      [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
    };
  }) {
    const url = this.baseURL + uri;

    return super.get<T>(url, {
      params: {
        limit: 5,
        language: 'es',
        access_token: environment.accessToken,
        ...options.params
      }
    });
  };
}

/*
destructuring ...options.params, for example:
params: { proximity: -7.1020,79.3040 }
destructuring returns only => proximity: -7.1020,79.3040
*/
