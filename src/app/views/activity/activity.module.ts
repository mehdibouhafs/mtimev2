// Angular
import {CommonModule, DatePipe} from '@angular/common';
import { NgModule } from '@angular/core';
import {
  AlertModule,
  BsDropdownModule, CarouselModule, CollapseModule, ModalModule, PaginationModule, PopoverModule, ProgressbarModule,
  TooltipModule
} from "ngx-bootstrap";
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {NgxPaginationModule} from "ngx-pagination";
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import {SimpleNotificationsModule} from "angular2-notifications";
import {SocketService} from "../../services/socket.service";
import {MyActivitiessComponent} from "./myactivitiess.component";
import {ActivityService} from "../../services/activity.service";
import { NgSelectModule } from '@ng-select/ng-select';
import {CustomerService} from "../../services/customer.service";
import {ProjectService} from "../../services/project.service";
import {OWL_DATE_TIME_LOCALE, OwlDateTimeModule, OwlNativeDateTimeModule} from "ng-pick-datetime";
import {NewActivityProjectComponent} from "../activityProject/newActivityProject.component";
import {EditActivityProjectComponent} from "../activityProject/editActivityProject.component";
import {ActivityRoutingModule} from "./activity-routing.module";
import {ShowActivityProjectComponent} from "../activityProject/showActivityProject.component";
import {NewActivityRecouvrementComponent} from "../activityRecouvrement/newActivityRecouvrement.component";
import {EditActivityRecouvrementComponent} from "../activityRecouvrement/editActivityRecouvrement.component";
import {ShowActivityRecouvrementComponent} from "../activityRecouvrement/showActivityRecouvrement.component";
import {NewActivityRequestComponent} from "../activityRequest/newActivityRequest.component";
import {EditActivityRequestComponent} from "../activityRequest/editActivityRequest.component";
import {ShowActivityRequestComponent} from "../activityRequest/showActivityRequest.component";
import {RequestService} from "../../services/request.service";
import {CustomModalModule} from "../modal/modal.module";
import {NewActivityHolidayComponent} from "../activityHoliday/newActivityHoliday.component";
import {EditActivityHolidayComponent} from "../activityHoliday/editActivityHoliday.component";
import {NewActivityCommercialComponent} from "../activityCommercial/newActivityCommercial.component";
import {NewActivityComponent} from "./new-activity.component";
import {NewActivityModalComponent} from "../newactivitymodal/new-activity-modal.component";
import {ShowActivityCommercialComponent} from "../activityCommercial/showActivityCommercial.component";
import {ShowActivityHolidayComponent} from "../activityHoliday/showActivityHoliday.component";
import {EditActivityCommercialComponent} from "../activityCommercial/editActivityCommercial.component";
import {AllactivitiesComponent} from "./allactivities.component";
import {NewActivitySIComponent} from "../activitySI/newActivitySI.component";
import {ShowActivitySIComponent} from "../activitySI/showActivitySI.component";
import {EditActivitySIComponent} from "../activitySI/editActivitySI.component";
import {NgxToggleModule} from "ngx-toggle";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ActivityRoutingModule,
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
    NgxToggleModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    CustomModalModule

  ],
  declarations: [
    AllactivitiesComponent,
    NewActivityProjectComponent,
    EditActivityProjectComponent,
    ShowActivityProjectComponent,
    MyActivitiessComponent,
    NewActivityRecouvrementComponent,
    EditActivityRecouvrementComponent,
    ShowActivityRecouvrementComponent,
    NewActivityRequestComponent,
    EditActivityRequestComponent,
    ShowActivityRequestComponent,
    NewActivityHolidayComponent,
    ShowActivityHolidayComponent,
    EditActivityHolidayComponent,
    NewActivityCommercialComponent,
    EditActivityCommercialComponent,
    ShowActivityCommercialComponent,
    NewActivityComponent,
    NewActivityModalComponent,
    NewActivitySIComponent,
    ShowActivitySIComponent,
    EditActivitySIComponent,

  ],
  exports: [
    NewActivityProjectComponent,
    EditActivityProjectComponent,
    ShowActivityProjectComponent,
    MyActivitiessComponent,
    NewActivityRecouvrementComponent,
    EditActivityRecouvrementComponent,
    ShowActivityRecouvrementComponent,
    NewActivityRequestComponent,
    EditActivityRequestComponent,
    ShowActivityRequestComponent,
    NewActivityHolidayComponent,
    ShowActivityHolidayComponent,
    EditActivityHolidayComponent,
    NewActivityCommercialComponent,
    EditActivityCommercialComponent,
    ShowActivityCommercialComponent,
    NewActivityComponent,
    NewActivityModalComponent,
    NewActivitySIComponent,
    ShowActivitySIComponent,
    EditActivitySIComponent,
  ],
  providers: [ActivityService,SocketService,CustomerService,ProjectService,{provide: OWL_DATE_TIME_LOCALE, useValue: 'fr'},RequestService]
})
export class ActivityModule { }
