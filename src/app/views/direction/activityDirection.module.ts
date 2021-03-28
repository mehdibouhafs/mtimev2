import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ActivityDirectionRouting} from "./activityDirection.routing";
import {ActivityResponsableComponent} from "./activity-responsable.component";
import {ActivityModule} from "../activity/activity.module";
import {ConfirmationPopoverModule} from "angular-confirmation-popover";
import {NgxToggleModule} from "ngx-toggle";
import {CustomModalModule} from "../modal/modal.module";
import {BsDropdownModule, ModalModule} from "ngx-bootstrap";
import {NgxPaginationModule} from "ngx-pagination";
import {OWL_DATE_TIME_LOCALE, OwlDateTimeModule, OwlNativeDateTimeModule} from "ng-pick-datetime";
import {NgSelectModule} from "@ng-select/ng-select";
import {ProjectService} from "../../services/project.service";
import {AuthenticationService} from "../../services/authentification.service";
import {CustomerService} from "../../services/customer.service";
import {UserService} from "../../services/user.service";
import {ActivityService} from "../../services/activity.service";
import {NewApResponsableComponent} from "./new-ap-responsable.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ActivityDirectionRouting,
    ActivityModule,
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
    ActivityResponsableComponent,
    NewApResponsableComponent,
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

export class ActivityDirectionModule {

}
