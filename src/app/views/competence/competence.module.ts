
import {NgModule} from "@angular/core";

import {MyformationComponent} from "./myformation.component";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {CompetenceRoutingModule} from "./competence-routing.module";
import {FormationService} from "../../services/formation.service";
import {NgxPaginationModule} from "ngx-pagination";
import {MycertificationComponent} from "./mycertification.component";
import {AllFormationsComponent} from "./all-formations.component";
import {AllCertificationsComponent} from "./all-certifications.component";
import {CertificationService} from "../../services/certification.service";
import {AddFormationComponent} from "./formation/add-formation.component";
import {BsDropdownModule, ModalModule, PopoverModule} from "ngx-bootstrap";
import {OWL_DATE_TIME_LOCALE, OwlDateTimeModule, OwlNativeDateTimeModule} from "ng-pick-datetime";
import {NgSelectModule} from "@ng-select/ng-select";
import {UserService} from "../../services/user.service";
import {ShowFormationComponent} from "./formation/show-formation.component";
import {AddCertificationComponent} from "./certification/add-certification.component";
import {ShowCertificationComponent} from "./certification/show-certification.component";
import {StorageService} from "../../services/storage.service";
import {ValideCertificationComponent} from "./certification/valide-certification.component";
import {CustomModalModule} from "../modal/modal.module";
import {TechnologieService} from "../../services/technologie.service";
import {EditeurService} from "../../services/editeur.service";
import {ManageFormationCertificationComponent} from "./manage-formation-certification.component";
import {ManageEmpcertificationComponent} from "./certification/manage-empcertification.component";
import {NgxToggleModule} from "ngx-toggle";
import {ShowCertificationAllParticipantsComponent} from "./certification/show-certification-all-participants.component";
import {ConfirmationPopoverModule} from "angular-confirmation-popover";
import {ShowFormationAllParticipantsComponent} from "./formation/show-formation-all-participants.component";
import {ManageEmpformationComponent} from "./formation/manage-empformation.component";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {CalendarModule} from "primeng/primeng";

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    CompetenceRoutingModule,
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
    MyformationComponent,
    MycertificationComponent,
    AllFormationsComponent,
    AllCertificationsComponent,
    AddFormationComponent,
    ShowFormationComponent,
    AddCertificationComponent,
    ShowCertificationComponent,
    ValideCertificationComponent,
    ManageFormationCertificationComponent,
    ManageEmpcertificationComponent,
    ShowCertificationAllParticipantsComponent,
    ShowFormationAllParticipantsComponent,
    ManageEmpformationComponent,
  ],
  providers: [FormationService, CertificationService, UserService, StorageService, TechnologieService, EditeurService, {provide: OWL_DATE_TIME_LOCALE, useValue: 'fr'}]
})
export class CompetenceModule { }
