import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { routes } from '@app/app.routes';
import { DataService } from '@app/core/services/data.service';
import { STORAGE_GLOBAL_KEY } from '@app/core/tokens/storage';
import Aura from '@primeng/themes/aura';
import { providePrimeNG } from 'primeng/config';

import { MockDataService } from './mock/data.serivce';

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
