import { NgModule } from '@angular/core';

import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {NgxPaginationModule} from "ngx-pagination";
import {BsDropdownModule, ModalModule} from "ngx-bootstrap";
import {OWL_DATE_TIME_LOCALE, OwlDateTimeModule, OwlNativeDateTimeModule} from "ng-pick-datetime";
import {NgSelectModule} from "@ng-select/ng-select";
import {CustomModalModule} from "../modal/modal.module";
import {NgxToggleModule} from "ngx-toggle";
import {ConfirmationPopoverModule} from "angular-confirmation-popover";
import {CalendarModule} from "primeng/primeng";
import {ObjectifRoutingModule} from "./objectif-routing.module";
import {ObjectifComponent} from "./objectif.component";
import {AuthenticationService} from "../../services/authentification.service";
import {UserService} from "../../services/user.service";
import {ObjectifService} from "../../services/objectif.service";
import {ShowObjectifComponent} from "./show-objectif.component";

@NgModule({
  imports: [
    ObjectifRoutingModule,
    FormsModule,
    CommonModule,
    NgxPaginationModule,
    ModalModule.forRoot(),
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgSelectModule,
    BsDropdownModule.forRoot(),
    CustomModalModule,
    NgxToggleModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger' // set defaults here
    }),
    CalendarModule,
  ],
  declarations: [
    ObjectifComponent,
    ShowObjectifComponent
  ],
  providers: [
    AuthenticationService,
    UserService,
    ObjectifService
  ]
})
export class ObjectifModule {

}
