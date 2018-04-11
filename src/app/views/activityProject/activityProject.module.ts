// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  BsDropdownModule, CarouselModule, CollapseModule, PaginationModule, PopoverModule, ProgressbarModule,
  TooltipModule
} from "ngx-bootstrap";
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {NgxPaginationModule} from "ngx-pagination";
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import {SimpleNotificationsModule} from "angular2-notifications";
import {SocketService} from "../../services/socket.service";
import {ActivityProjectRoutingModule} from "./activityProject-routing.module";
import {NewActivityProjectComponent} from "./newActivityProject.component";
import {EditActivityProjectComponent} from "./editActivityProject.component";
import {ActivityService} from "../../services/activity.service";
import { NgSelectModule } from '@ng-select/ng-select';
import {CustomerService} from "../../services/customer.service";
import {ProjectService} from "../../services/project.service";
import {OWL_DATE_TIME_LOCALE, OwlDateTimeModule, OwlNativeDateTimeModule} from "ng-pick-datetime";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ActivityProjectRoutingModule,
    BsDropdownModule.forRoot(),
    CarouselModule.forRoot(),
    CollapseModule.forRoot(),
    PaginationModule.forRoot(),
    PopoverModule.forRoot(),
    ProgressbarModule.forRoot(),
    TooltipModule.forRoot(),
    HttpClientModule,
    NgxPaginationModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger' // set defaults here
    }),
    SimpleNotificationsModule.forRoot(),
    NgSelectModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,

  ],
  declarations: [
    NewActivityProjectComponent,
    EditActivityProjectComponent,
  ],
  providers: [ActivityService,SocketService,CustomerService,ProjectService,{provide: OWL_DATE_TIME_LOCALE, useValue: 'fr'},]
})
export class ActivityProjectModule { }
