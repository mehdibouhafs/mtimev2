import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import {
  FullLayoutComponent,
  SimpleLayoutComponent
} from './containers';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    component: FullLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: './views/dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'formation',
        loadChildren: './views/formation/formation.module#FormationModule'
      },
      {
        path: 'certification',
        loadChildren: './views/certification/certification.module#CertificationModule'
      },
      {
        path: 'calendar',
        loadChildren: './views/calendar/calendar2.module#CalendarModule2'
      },
      {
        path: 'activityProject',
        loadChildren: './views/activityProject/activityProject.module#ActivityProjectModule'
      },
    ]
  },
  {
    path: 'pages',
    component: SimpleLayoutComponent,
    data: {
      title: 'Pages'
    },
    children: [
      {
        path: '',
        loadChildren: './views/pages/pages.module#PagesModule',
      },

    ]
  }

];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
