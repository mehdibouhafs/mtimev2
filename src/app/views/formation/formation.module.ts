// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  BsDropdownModule, CarouselModule, CollapseModule, PaginationModule, PopoverModule, ProgressbarModule,
  TooltipModule
} from "ngx-bootstrap";
import {FormationRoutingModule} from "./formation-routing.module";
import {FormsModule} from "@angular/forms";
import {NewFormationComponent} from "./newFormation.component";
import {AllFormationComponent} from "./allFormation.component";
import {FormationService} from "../../services/formation.service";
import {HttpClientModule} from "@angular/common/http";
import {NgxPaginationModule} from "ngx-pagination";
import {EditFormationComponent} from "./editFormation.component";
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import {SimpleNotificationsModule} from "angular2-notifications";
import {AppHeaderComponent} from "../../components/app-header/app-header.component";
import {AppModule} from "../../app.module";
import {AppHeaderModule} from "../../components/app-header/app-header.module";
import {MultipleFormationComponent} from "./multipleFormation.component";



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FormationRoutingModule,
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


  ],
  declarations: [
    NewFormationComponent,
    AllFormationComponent,
    EditFormationComponent,
    MultipleFormationComponent,
  ],
  providers: [FormationService]
})
export class FormationModule { }
