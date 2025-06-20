import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'buildings',
    loadComponent: () =>
      import('./buildings/pages/buildings/buildings.component').then(
        (m) => m.BuildingsComponent
      ),
  },
  {
    path: 'sites',
    loadComponent: () =>
      import('./sites/pages/sites/sites.component').then(
        (m) => m.SitesComponent
      ),
  },
  { path: '**', redirectTo: 'buildings', pathMatch: 'full' },
];
