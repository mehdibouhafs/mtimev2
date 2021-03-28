import {Component, Input} from "@angular/core";
import {Objectif} from "../../model/model.objectif";

@Component({
  selector: 'show-objectif',
  templateUrl: 'show-objectif.component.html'
})

export class ShowObjectifComponent {

  @Input() objectif: Objectif;
  @Input() modal: any;

}
