// Angular
import { CommonModule } from '@angular/common';
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
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    CustomModalModule,

  ],
  declarations: [
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
    ShowActivityRequestComponent
  ],
  providers: [ActivityService,SocketService,CustomerService,ProjectService,{provide: OWL_DATE_TIME_LOCALE, useValue: 'fr'},RequestService]
})
export class ActivityModule { }
