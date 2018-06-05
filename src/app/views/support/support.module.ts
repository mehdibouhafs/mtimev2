import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {SupportComponent} from "./support.component";
import {SupportRouting} from "./support.routing";
import {FormsModule} from "@angular/forms";
import {ModalModule, PaginationModule} from "ngx-bootstrap";
import {NgxPaginationModule} from "ngx-pagination";
import {RequestService} from "../../services/request.service";
import {ActivityModule} from "../activity/activity.module";

@NgModule({
  imports: [
    PaginationModule.forRoot(),
    NgxPaginationModule,
    CommonModule,
    FormsModule,
    SupportRouting,
    ActivityModule,
    ModalModule,
  ],
  declarations: [
    SupportComponent
  ],
  providers: [
    RequestService
  ]
})

export class SupportModule {

}
