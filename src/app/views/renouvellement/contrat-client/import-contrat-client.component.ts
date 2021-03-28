import {ChangeDetectorRef, Component, EventEmitter, OnInit, ViewChild} from "@angular/core";
import {CustomerService} from "../../../services/customer.service";
import {debounceTime, distinctUntilChanged, switchMap} from "rxjs/operators";
import {RenouvellementService} from "../../../services/renouvellement.service";
import {ObjectService} from "../../../services/object.service";

@Component({
  templateUrl: 'import-contrat-client.component.html'
})

export class ImportContratClientComponent implements OnInit {

  mode = 1;

  constructor(private customerService: CustomerService,
              private renouvellementService: RenouvellementService,
              private objectService:ObjectService,
              private ref: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  importer(){
    console.log("importer click");
    this.renouvellementService.saveContratClientFromFile().subscribe(
      (data) => {
        console.log(data);
      }, err => {
        console.log(err);
      })
  }



}
