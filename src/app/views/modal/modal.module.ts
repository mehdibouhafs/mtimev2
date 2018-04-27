import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {DeleteComponent} from "./modalDelete/delete.component";
import {FormsModule} from "@angular/forms";
import {AlertModule, ModalModule, TooltipModule} from "ngx-bootstrap";
import {ModalRequestComponent} from "./modalRequest/modal.request.component";
import {
  OWL_DATE_TIME_LOCALE, OWL_DATE_TIME_LOCALE_PROVIDER, OwlDateTimeModule,
  OwlNativeDateTimeModule
} from "ng-pick-datetime";
import {NgSelectModule} from "@ng-select/ng-select";
import {NewActivityProjectComponent} from "./modalActivityProject/newActivityProject.component";
import {ShowActivityProjectComponent} from "./modalActivityProject/showActivityProject.component";
import {NewActivityRecouvrementComponent} from "./modalActivityRecouvrement/newActivityRecouvrement.component";
import {EditActivityRecouvrementComponent} from "./modalActivityRecouvrement/editActivityRecouvrement.component";
import {ShowActivityRecouvrementComponent} from "./modalActivityRecouvrement/showActivityRecouvrement.component";
import {NewActivityRequestComponent} from "./modalActivityRequest/newActivityRequest.component";
import {EditActivityRequestComponent} from "./modalActivityRequest/editActivityRequest.component";
import {ShowActivityRequestComponent} from "./modalActivityRequest/showActivityRequest.component";
import {RequestService} from "../../services/request.service";
import {ProjectService} from "../../services/project.service";
import {CustomerService} from "../../services/customer.service";
import {SocketService} from "../../services/socket.service";
import {ActivityService} from "../../services/activity.service";
import {EditActivityProjectComponent} from "./modalActivityProject/editActivityProject.component";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    NgSelectModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    AlertModule.forRoot(),
  ],
  declarations: [
    DeleteComponent,
    ModalRequestComponent,
    NewActivityProjectComponent,
    EditActivityProjectComponent,
    ShowActivityProjectComponent,
    NewActivityRecouvrementComponent,
    EditActivityRecouvrementComponent,
    ShowActivityRecouvrementComponent,
    NewActivityRequestComponent,
    EditActivityRequestComponent,
    ShowActivityRequestComponent,
  ],
  exports: [
    DeleteComponent,
    ModalRequestComponent,
    NewActivityProjectComponent,
    EditActivityProjectComponent,
    ShowActivityProjectComponent,
    NewActivityRecouvrementComponent,
    EditActivityRecouvrementComponent,
    ShowActivityRecouvrementComponent,
    NewActivityRequestComponent,
    EditActivityRequestComponent,
    ShowActivityRequestComponent,
  ],
  providers : [ActivityService,SocketService,CustomerService,ProjectService,{provide: OWL_DATE_TIME_LOCALE, useValue: 'fr'},RequestService]
})

export class CustomModalModule {}
