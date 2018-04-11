import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import {AuthenticationService} from "../../services/authentification.service";
import {HttpClientModule} from "@angular/common/http";

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    data: {
      title: 'Dashboard'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],

})
export class DashboardRoutingModule {}
