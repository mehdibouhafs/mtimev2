import {Component, Input} from "@angular/core";
import {CtrctSupplier} from "../../../model/model.contratFournisseur";


@Component({
  selector: 'show-contrat-fournisseur',
  templateUrl: 'show-contrat-fournisseur.component.html'
})
export class ShowContratFournisseurComponent {

  @Input() contrat:CtrctSupplier;
  @Input() modal:any;

}
