import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Request} from "../../../model/model.request";

@Component({
  selector: 'request-modal',
  templateUrl: 'modal.request.component.html'
})
export class ModalRequestComponent {
  @Input() modal: any;

  @Input()
  request : Request;


  constructor(){
    console.log("teste");
  }

  hideModal() {
    this.modal.hide();
  }
}

