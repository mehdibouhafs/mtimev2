import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {Request} from "../../../model/model.request";


@Component({
  selector: 'request-modal',
  templateUrl: 'modal.request.component.html'
})
export class ModalRequestComponent implements OnInit{
  @Input() modal: any;

  @Input()
  request : Request;


  constructor(){
    console.log("teste");
  }

  ngOnInit(){
    console.log("request " + JSON.stringify(this.request));

  }

  hideModal() {
    this.modal.hide();
  }
}

