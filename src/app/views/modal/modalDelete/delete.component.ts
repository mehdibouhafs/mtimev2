import {Component, EventEmitter, Input, Output} from "@angular/core";

@Component({
  selector: 'delete-modal',
  templateUrl: 'delete.component.html'
})
export class DeleteComponent {
  @Input() modal: any;
  @Output()
  functionDelete = new EventEmitter<String>();

  callFunctionDelete() {
    this.functionDelete.emit("Deleted");
  }

  hideModal() {
    this.modal.hide();
  }
}