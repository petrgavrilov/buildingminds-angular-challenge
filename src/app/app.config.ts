import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

import { routes } from './app.routes';
import { DataService } from './core/services/data.service';
import { MockDataService } from './mock/data.serivce';
import { provideHttpClient } from '@angular/common/http';
import { STORAGE_GLOBAL_KEY } from './core/tokens/storage';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
    {
      provide: DataService,
      useClass: MockDataService,
    },
    {
      provide: STORAGE_GLOBAL_KEY,
      useValue: 'buildingminds_challenge',
    },
  ],
};
