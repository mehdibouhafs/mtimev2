import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {DeleteComponent} from "./delete.component";
import {FormsModule} from "@angular/forms";
import {ModalModule} from "ngx-bootstrap";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ModalModule.forRoot()
  ],
  declarations: [DeleteComponent],
  exports: [
    DeleteComponent
  ]
})

export class CustomModalModule {}
