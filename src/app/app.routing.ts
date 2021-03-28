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
      title: 'Accueil'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: './views/dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'tickets',
        loadChildren: './views/support/support.module#SupportModule'
      },


      {
        path: 'activity',
        loadChildren: './views/activity/activity.module#ActivityModule'
      },
      {
        path: 'calendar',
        loadChildren: './views/calendar/calendar2.module#CalendarModule2'
      },
      {
        path: 'competence',
        loadChildren: './views/competence/competence.module#CompetenceModule'
      },
      {
        path: 'projects',
        loadChildren: './views/projects-management/projects.module#ProjectsModule'
      },
      {
        path: 'cablage',
        loadChildren: './views/cablage/cablage-activity.module#CablageActivityModule'
      },
      {
        path: 'renouvellement',
        loadChildren: './views/renouvellement/renouvellement.module#RenouvellementModule'
      },
      {
        path: 'activity-direction',
        loadChildren: './views/direction/activityDirection.module#ActivityDirectionModule'
      },
      {
        path: 'objectif',
        loadChildren: './views/objectif/objectif.module#ObjectifModule'
      }
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
