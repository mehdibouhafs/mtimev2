// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  ModalModule,
} from "ngx-bootstrap";
import {FormsModule} from "@angular/forms";
import {MyActivitiessComponent} from "./myactivitiess.component";
import {ActivityService} from "../../services/activity.service";
import {ActivityRoutingModule} from "./activity-routing.module";
import {CustomModalModule} from "../modal/modal.module";
import {NgxPaginationModule} from "ngx-pagination";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ActivityRoutingModule,
    ModalModule.forRoot(),
    NgxPaginationModule,
    CustomModalModule, // no


  ],
  declarations: [
  MyActivitiessComponent,
  ],
  exports: [
    MyActivitiessComponent,
  ],
  providers: [ActivityService]
})
export class ActivityModule { }
