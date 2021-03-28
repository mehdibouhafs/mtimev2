import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import {AuthenticationService} from "../../services/authentification.service";
import {HttpClientModule} from "@angular/common/http";
import {DashboardService} from "../../services/dashboard.service";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {BrowserModule} from "@angular/platform-browser";
import {ModalModule, PaginationModule} from "ngx-bootstrap";
import {NgxPaginationModule} from "ngx-pagination";
import {OWL_DATE_TIME_LOCALE,OwlDateTimeModule, OwlNativeDateTimeModule} from "ng-pick-datetime";
import {NgSelectModule} from "@ng-select/ng-select";
import {NgxToggleModule} from "ngx-toggle";
import {ActivityModule} from "../activity/activity.module";
import {DashboardGroupComponent} from "./dashboard-group.component";
import {UserService} from "../../services/user.service";
import {ResolverDashboard} from "./resolverDashboard";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DashboardRoutingModule,
    ChartsModule,
    HttpClientModule,
    PaginationModule.forRoot(),
    NgxPaginationModule,
    ModalModule.forRoot(),
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgSelectModule,
    NgxToggleModule,
    ActivityModule
  ],
  declarations: [
    DashboardComponent,
    DashboardGroupComponent
  ],
  providers: [ResolverDashboard, AuthenticationService, DashboardService, UserService,{provide: OWL_DATE_TIME_LOCALE, useValue: 'fr'}]
})
export class DashboardModule { }
