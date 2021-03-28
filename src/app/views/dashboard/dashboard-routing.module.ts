import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import {AuthenticationService} from "../../services/authentification.service";
import {HttpClientModule} from "@angular/common/http";
import {DashboardGroupComponent} from "./dashboard-group.component";

const routes: Routes = [
  {
    path: '',
    data: {
      title: ''
    },
    children: [
      {
        path: '',
        component: DashboardComponent,
        data: {
          title: 'Dashboard'
        }
      },
      {
        path: 'dashboard-group',
        component: DashboardGroupComponent,
        data: {
          title: 'Dashboard de groupe'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],

})
export class DashboardRoutingModule {}
