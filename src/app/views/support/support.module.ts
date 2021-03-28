import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {SupportComponent} from "./support.component";
import {SupportRouting} from "./support.routing";
import {FormsModule} from "@angular/forms";
import {BsDropdownModule, ModalModule, PaginationModule} from "ngx-bootstrap";
import {NgxPaginationModule} from "ngx-pagination";
import {RequestService} from "../../services/request.service";
import {ActivityModule} from "../activity/activity.module";
import {ActivitybyticketComponent} from "./activitybyticket.component";

@NgModule({
  imports: [
    PaginationModule.forRoot(),
    NgxPaginationModule,
    CommonModule,
    FormsModule,
    SupportRouting,
    ActivityModule,
    ModalModule,
    BsDropdownModule.forRoot(),
  ],
  declarations: [
    SupportComponent,
    ActivitybyticketComponent
  ],
  providers: [
    RequestService
  ]
})

export class SupportModule {

}
