// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  BsDropdownModule, CarouselModule, CollapseModule, PaginationModule, PopoverModule, ProgressbarModule,
  TooltipModule
} from "ngx-bootstrap";
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {NgxPaginationModule} from "ngx-pagination";
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import {NewCertificationComponent} from "./newCertification.component";
import {AllCertificationComponent} from "./allCertification.component";
import {SimpleNotificationsModule} from "angular2-notifications";
import {CertificationRoutingModule} from "./certification-routing.module";
import {CertificationService} from "../../services/certification.service";
import {EditCertificationComponent} from "./editCertification.component";
import {SocketService} from "../../services/socket.service";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CertificationRoutingModule,
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
    NewCertificationComponent,
    AllCertificationComponent,
    EditCertificationComponent,
  ],
  providers: [CertificationService,SocketService]
})
export class CertificationModule { }
