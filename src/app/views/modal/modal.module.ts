import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {DeleteComponent} from "./modalDelete/delete.component";
import {FormsModule} from "@angular/forms";
import {ModalModule} from "ngx-bootstrap";
import {ModalRequestComponent} from "./modalRequest/modal.request.component";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ModalModule.forRoot()
  ],
  declarations: [
    DeleteComponent,
    ModalRequestComponent,
  ],
  exports: [
    DeleteComponent,
    ModalRequestComponent,
  ]
})

export class CustomModalModule {}
