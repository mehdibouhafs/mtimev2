import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {NgSelectModule} from "@ng-select/ng-select";
import {OWL_DATE_TIME_LOCALE, OwlDateTimeModule, OwlNativeDateTimeModule} from "ng-pick-datetime";
import {NgxPaginationModule} from "ngx-pagination";
import {BsDropdownModule, ModalModule} from "ngx-bootstrap";
import {CustomModalModule} from "../modal/modal.module";
import {NgxToggleModule} from "ngx-toggle";
import {ConfirmationPopoverModule} from "angular-confirmation-popover";
import {ActivitiesComponent} from "./activities.component";
import {CablageActivityRoutingModule} from "./cablage-activity-routing.module";
import {ActivityService} from "../../services/activity.service";
import {UserService} from "../../services/user.service";
import {CustomerService} from "../../services/customer.service";
import {AuthenticationService} from "../../services/authentification.service";
import {ProjectService} from "../../services/project.service";
import {ActivityModule} from "../activity/activity.module";
import {NewAsCablageComponent} from "./new-as-cablage.component";
import {NewApCablageComponent} from "./new-ap-cablage.component";
import {NewActivityHolidayCablageComponent} from "./new-activity-holiday.component";

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    ActivityModule,
    CablageActivityRoutingModule,
    NgSelectModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgxPaginationModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    CustomModalModule,
    NgxToggleModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger' // set defaults here
    }),
  ],
  declarations: [
    ActivitiesComponent,
    NewAsCablageComponent,
    NewApCablageComponent,
    NewActivityHolidayCablageComponent,
  ],
  providers: [
    ActivityService,
    UserService,
    CustomerService,
    AuthenticationService,
    ProjectService,
    {provide: OWL_DATE_TIME_LOCALE, useValue: 'fr'}
  ]
})
export class CablageActivityModule {

}
