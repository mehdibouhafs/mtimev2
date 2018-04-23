import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {DeleteComponent} from "./delete.component";
import {FormsModule} from "@angular/forms";
import {ModalModule} from "ngx-bootstrap";
import {AllparticipantsComponent} from "./allparticipants.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ModalModule.forRoot()
  ],
  declarations: [
    DeleteComponent,
    AllparticipantsComponent
  ],
  exports: [
    DeleteComponent,
    AllparticipantsComponent
  ]
})

export class CustomModalModule {}
