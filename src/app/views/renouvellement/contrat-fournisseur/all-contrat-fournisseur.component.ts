import {Component, OnInit, ViewChild} from "@angular/core";
import {RenouvellementService} from "../../../services/renouvellement.service";
import {CtrctCustomer} from "../../../model/model.contratClient";
import {TreeNode} from 'primeng/api';
import {CtrctSupplier} from "../../../model/model.contratFournisseur";

@Component({
  templateUrl: 'all-contrat-fournisseur.component.html'
})
export class AllContratFournisseurComponent implements OnInit {

  data = [];
  contratsClients: Array<CtrctCustomer> = new Array();
  files: TreeNode[];

  SelectedContratClient:CtrctCustomer = new CtrctCustomer();
  SelectedContratFournisseur:CtrctSupplier = new CtrctSupplier();

  @ViewChild('showContratFournisseur')
  showContratFournisseur;
  @ViewChild('showContratClient')
  showContratClient;

  statut:any;

  currentDate : Date;

  statuts = [
    {name: "ALL",id:"ALL"},{name:"Only contrats in progress",id:"Encours"},{name:"Only contrats expired",id:"Expired"}
  ];

  constructor(private renouvellementService: RenouvellementService) {
  }

  ngOnInit() {
    this.currentDate = new Date();
    this.getContrats();
  }

  chargerContractClientFiltre(){
    console.log(" chargerContractClientFiltre Statut " + this.statut);

    switch(this.statut){
      case  'Expired' :{
        this.renouvellementService.getAllContratClientWithStatutContratFournisseur(this.statut).subscribe(
          (data: Array<CtrctCustomer>) => {
            console.log(data);
            this.data = [];
            this.files = null;
            this.contratsClients = null;
            this.contratsClients = data;
            this.chargerData();
          }, err => {
            console.log(err);
          })
        break;
      }
      case  'Encours' :{
        this.renouvellementService.getAllContratClientWithStatutContratFournisseur(this.statut).subscribe(
          (data: Array<CtrctCustomer>) => {
            console.log(data);
            this.data = [];
            this.files = null;
            this.contratsClients = null;
            this.contratsClients = data;
            this.chargerData();
          }, err => {
            console.log(err);
          })
        break;
      }

      case 'ALL': {
        console.log("ALL case");
        this.getContrats();
        break;
      }

      default: {
        break;
      }
    }




  }

  getContrats() {
    this.renouvellementService.getAllContratClient().subscribe(
      (data: Array<CtrctCustomer>) => {
        this.data = [];
        this.files = null;
        this.contratsClients = data;
        this.chargerData();
      }, err => {
        console.log(err);
      }
    )
  }

  chargerData() {
    this.contratsClients.forEach(
      contratClient => {
        if (contratClient.contrats.length > 0) {
          let line =
            {
              data: {
                id: contratClient.id,
                name: contratClient.ctrtName,
                debut: contratClient.dteStrt,
                fin: contratClient.dteEnd,
                client: contratClient.customer.name,
                contratClient: contratClient,
                statut:'',
                type: "CCL"
              },
              children: []
            };

          contratClient.contrats.forEach(
            contratFournisseur => {
              line.children.push({
                  data: {
                    id: contratFournisseur.id,
                    name: contratFournisseur.ctrtName,
                    debut: contratFournisseur.dteStrt,
                    fin: contratFournisseur.dteEnd,
                    client: contratClient.customer.name,
                    contratFrounisseur: contratFournisseur,
                    contratClient:contratClient,
                    statut:contratFournisseur.statut,
                    type: "CF"
                  }
                }
              )
            }
          );

          this.data.push(line);
        } else {
          this.data.push({
              data: {
                id: contratClient.id,
                name: contratClient.ctrtName,
                debut: contratClient.dteStrt,
                fin: contratClient.dteEnd,
                client: contratClient.customer.name,
                contratClient: contratClient,
                type: "CCL"
              }
            }
          )
        }
      }
    );

    this.files = <TreeNode[]>this.data;

  }

  showContrat(rowData:any) {
    switch(rowData.type) {
      case "CF": {
        this.SelectedContratFournisseur=rowData.contratFrounisseur;
        this.SelectedContratFournisseur.ctrctCustomer = rowData.contratClient;
        this.showContratFournisseur.show();
        break;
      }
      case "CCL": {
        this.SelectedContratClient=rowData.contratClient;
        this.showContratClient.show();
        break;
      }
    }
  }

}

