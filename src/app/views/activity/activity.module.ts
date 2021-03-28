// Angular
import {CommonModule, DatePipe} from '@angular/common';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
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
import {ShowActivityCommercialComponent} from "../activityCommercial/showActivityCommercial.component";
import {ShowActivityHolidayComponent} from "../activityHoliday/showActivityHoliday.component";
import {EditActivityCommercialComponent} from "../activityCommercial/editActivityCommercial.component";
import {AllactivitiesComponent} from "./allactivities.component";
import {NewActivitySIComponent} from "../activitySI/newActivitySI.component";
import {ShowActivitySIComponent} from "../activitySI/showActivitySI.component";
import {EditActivitySIComponent} from "../activitySI/editActivitySI.component";
import {NgxToggleModule} from "ngx-toggle";
import {ActivityServiceComponent} from "./activity-service.component";
import {NewApWithoutTestComponent} from "../activityProjectWithoutTest/new-ap-without-test.component";
import { LOCALE_ID } from '@angular/core';
import {MyApComponent} from "../activityProjectWithoutTest/my-ap.component";
import {VilleService} from "../../services/ville.service";
import {NatureService} from "../../services/nature.service";
import {ActionService} from "../../services/action.service";
import {ProduitService} from "../../services/produit.service";
import {ShowApComponent} from "../activityProjectWithoutTest/show-ap.component";
import {NewActivityPMComponent} from "../activityPM/newActivityPM.component";
import {ShowActivityPMComponent} from "../activityPM/showActivityPM.component";
import {EditActivityPMComponent} from "../activityPM/editActivityPM.component";
import {NewActivityAvantVenteComponent} from "../activityAvantVente/newActivityAvantVente.component";
import {EditActivityAvantVenteComponent} from "../activityAvantVente/editActivityAvantVente.component";
import {ShowActivityAvantVenteComponent} from "../activityAvantVente/showActivityAvantVente.component";
import {OffreService} from "../../services/offre.service";
import {ObjectifService} from "../../services/objectif.service";
import {NewActivityDevCompetenceComponent} from "../activityDevCompetence/newActivityDevCompetence.component";
import {EditActivityDevCompetenceComponent} from "../activityDevCompetence/editActivityDevCompetence.component";
import {ShowActivityDevCompetenceComponent} from "../activityDevCompetence/showActivityDevCompetence.component";
import {MySelectionComponent} from "../calendar/myCalendar/my.selection.component";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";

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
    CustomModalModule,
    NgbModule.forRoot()


  ],
  declarations: [
    AllactivitiesComponent,
    ActivityServiceComponent,
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
    NewActivityAvantVenteComponent,
    EditActivityAvantVenteComponent,
    ShowActivityAvantVenteComponent,
    NewActivityDevCompetenceComponent,
    EditActivityDevCompetenceComponent,
    ShowActivityDevCompetenceComponent,
    NewActivityComponent,
    NewActivitySIComponent,
    ShowActivitySIComponent,
    EditActivitySIComponent,
    NewApWithoutTestComponent,
    MyApComponent,
    ShowApComponent,
    NewActivityPMComponent,
    ShowActivityPMComponent,
    EditActivityPMComponent,
    MySelectionComponent

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
    NewActivitySIComponent,
    ShowActivitySIComponent,
    EditActivitySIComponent,
    ShowApComponent,
    NewActivityPMComponent,
    ShowActivityPMComponent,
    EditActivityPMComponent,
    NewActivityAvantVenteComponent,
    EditActivityAvantVenteComponent,
    ShowActivityAvantVenteComponent,
    NewActivityDevCompetenceComponent,
    EditActivityDevCompetenceComponent,
    ShowActivityDevCompetenceComponent,

  ],

  providers: [
    OffreService,
    ObjectifService,
    ProduitService,
    NatureService,
    VilleService,
    ActivityService,
    SocketService,
    CustomerService,
    ProjectService,
    {provide: OWL_DATE_TIME_LOCALE, useValue: 'fr'},
    RequestService
  ]
})
export class ActivityModule { }
