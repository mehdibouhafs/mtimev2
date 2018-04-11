import { NgModule } from '@angular/core';
import { CalendarComponent } from './calendar.component';
import { CalendarRoutingModule } from './calendar-routing.module';
import {HttpClientModule} from "@angular/common/http";
import {CalendarModule} from "angular-calendar";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import {DemoUtilsModule} from "../demo-utils/module";
@NgModule({
  imports: [
    CalendarRoutingModule,
    HttpClientModule,
    CalendarModule.forRoot(),
    FormsModule,
    CommonModule,
    NgbModalModule.forRoot(),
    DemoUtilsModule

  ],
  declarations: [ CalendarComponent ],
  providers: []
})
export class CalendarModule2 { }
