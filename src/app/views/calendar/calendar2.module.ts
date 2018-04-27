import { NgModule } from '@angular/core';
import { CalendarComponent } from './calendar.component';
import { CalendarRoutingModule } from './calendar-routing.module';
import {HttpClientModule} from "@angular/common/http";
import {CalendarModule} from "angular-calendar";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import {DemoUtilsModule} from "../demo-utils/module";
import {MyCalendarComponent} from "./myCalendar/my.calendar.component";
import {AuthenticationService} from "../../services/authentification.service";
import {ActivityService} from "../../services/activity.service";
import {
  AlertModule, BsDropdownModule, CarouselModule, CollapseModule, ModalModule,
  PaginationModule, PopoverModule, ProgressbarModule, TooltipModule
} from "ngx-bootstrap";
import {NgxPaginationModule} from "ngx-pagination";
import {ConfirmationPopoverModule} from "angular-confirmation-popover";
import {SimpleNotificationsModule} from "angular2-notifications";
import {NgSelectModule} from "@ng-select/ng-select";
import {OwlDateTimeModule, OwlNativeDateTimeModule} from "ng-pick-datetime";
import {CustomModalModule} from "../modal/modal.module";
import {CalendarHeaderComponent} from "./CalendarHeaderComponent";
import localeFr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeFr);

@NgModule({
  imports: [
    CalendarRoutingModule,
    CalendarModule.forRoot(),
    NgbModalModule.forRoot(),
    DemoUtilsModule,
    CommonModule,
    FormsModule,
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
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    CustomModalModule,

  ],
  declarations: [ CalendarComponent,MyCalendarComponent ],
  providers: [AuthenticationService,ActivityService]
})
export class CalendarModule2 { }
