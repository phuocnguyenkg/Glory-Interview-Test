import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'atms'
  },
  {
    path: 'atms',
    loadComponent: () => import('./atm/pages/atm-list-page/atm-list-page').then((m) => m.AtmListPage)
  },
  {
    path: 'atms/new',
    loadComponent: () => import('./atm/pages/atm-form-page/atm-form-page').then((m) => m.AtmFormPage),
    data: { mode: 'create' }
  },
  {
    path: 'atms/:id/edit',
    loadComponent: () => import('./atm/pages/atm-form-page/atm-form-page').then((m) => m.AtmFormPage),
    data: { mode: 'edit' }
  },
  {
    path: 'atms/:id',
    loadComponent: () => import('./atm/pages/atm-form-page/atm-form-page').then((m) => m.AtmFormPage),
    data: { mode: 'view' }
  },
  {
    path: '**',
    redirectTo: 'atms'
  }
];
