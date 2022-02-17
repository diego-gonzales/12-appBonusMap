import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import Mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"

Mapboxgl.accessToken = 'pk.eyJ1IjoiZGllZ29lZ2oiLCJhIjoiY2ttcDlvYjVsMGV6OTJ2cXB5YTdtbm5rMSJ9.noDE8WEnh0vXhl38LZxHdw';

if (!navigator.geolocation) {
  alert('Browser does not support geolocation');
  throw new Error('Browser does not support geolocation');
}

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
