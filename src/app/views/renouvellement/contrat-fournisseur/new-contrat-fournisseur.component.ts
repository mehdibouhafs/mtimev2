import {Component, Input, OnInit, EventEmitter, ChangeDetectorRef} from "@angular/core";
import {CtrctSupplier} from "../../../model/model.contratFournisseur";
import {RenouvellementService} from "../../../services/renouvellement.service";
import {CtrctCustomer} from "../../../model/model.contratClient";
import {CustomerService} from "../../../services/customer.service";
import {Customer} from "../../../model/model.customer";

import {CtrctSupplierProduct} from "../../../model/model.contratFournisseurProduit";
import {CtrctSupplierProductSeries} from "../../../model/model.contratFournisseurProduitSerie";
import {CtrctCustomerProduct} from "../../../model/model.contratClientProduit";
import {debounceTime, distinctUntilChanged, switchMap} from "rxjs/operators";
import {ObjectService} from "../../../services/object.service";
import {Distributeur} from "../../../model/model.distributeur";

@Component({
  selector: 'new-contrat-fournisseur',
  templateUrl: 'new-contrat-fournisseur.component.html'
})
export class NewContratFournisseurComponent implements OnInit {

  public popoverTitle: string = "Suppression d'un produit";
  public popoverMessage: string = "<b>Êtes-vous sûre de vouloir supprimer ce produit </b>";
  contrat:CtrctSupplier = new CtrctSupplier();
  contratClientSelected:CtrctCustomer;
  contratsClients:any;
  customers:any;
  suppliers:any;
  selectedCustomer:Customer;
  customerTypeahead = new EventEmitter<string>();
  supplierTypeahead = new EventEmitter<string>();
  selectedProducts = [];
  mode = 1;
  distributeurs:any;
  selectedDistributeur:Distributeur;
  devises = [
    {name: "USD"}, {name: "EUR"}, {name: "MAD"}
  ];

  constructor(
    private renouvellementService:RenouvellementService,
    private customerService:CustomerService,
    private objectService:ObjectService,
    private ref:ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log(this.objectService.getData());
    this.serverSideSearch();
  }

  private serverSideSearch() {
    this.customerTypeahead.pipe(
      distinctUntilChanged(),
      debounceTime(200),
      switchMap(term => this.customerService.searchCustomer(term))
    ).subscribe(x => {
      this.ref.markForCheck();
      this.customers = x["_embedded"]["customers"];
    }, (err) => {
      console.log(err);
      this.customers = [];
    });

    this.supplierTypeahead.pipe(
      distinctUntilChanged(),
      debounceTime(200),
      switchMap(term => this.customerService.searchSupplier(term))
    ).subscribe(x => {
      this.ref.markForCheck();
      this.suppliers = x["_embedded"]["customers"];
    }, (err) => {
      console.log(err);
      this.suppliers = [];
    });

  }

  chargerContratsClients() {
    if(this.selectedCustomer) {
      this.renouvellementService.getContratClientByClient(this.selectedCustomer.code).subscribe(
        data=>{
          this.contratsClients = data;
          this.contratClientSelected = null;
        }, err=>{
          console.log(err);
        }
      )
    } else {
      this.contratClientSelected = null;
      this.selectedDistributeur = null;
      this.chargerProductToList();
    }
  }
  chargerDistributeurs() {
    this.distributeurs = new Array<Distributeur>();
    if(this.contratClientSelected) {
      this.contratClientSelected.ctrctCustomerProducts.forEach(
        p=>{
          let found:boolean = false;
          this.distributeurs.forEach(d=>{
            if(d.id == p.product.distributeur.id) found = true;
          });
          if(!found)
            this.distributeurs.push({id:p.product.distributeur.id,name:p.product.distributeur.name});
        }
      )
    } else {
      this.selectedDistributeur = null;
      this.chargerProductToList();
    }
  }

  chargerProductToList() {
    if(this.contratClientSelected && this.selectedDistributeur) {
      console.log("chargerproduct to list if");
      this.contrat.ctrctSupplierProducts = new Array<CtrctSupplierProduct>();
      this.contratClientSelected.ctrctCustomerProducts.forEach(p=>{ console.log(p)});
      console.log("this.selectedDistributeur.id "+ this.selectedDistributeur.id);
      this.contratClientSelected.ctrctCustomerProducts.forEach(
        p=>{
          if(p.product.distributeur.id == this.selectedDistributeur.id) {
            console.log("selected distributeurMatch");
            let contratFrounisseurProduit:CtrctSupplierProduct = new CtrctSupplierProduct();
            contratFrounisseurProduit.product = p.product;
            contratFrounisseurProduit.qte = p.qte;
            contratFrounisseurProduit.qteMax = p.qteDisponible;
            contratFrounisseurProduit.ctrctCustomerProduct = p;
            this.contrat.ctrctSupplierProducts.push(contratFrounisseurProduit);
          }
        }
      )

      console.log("taille " +this.contrat.ctrctSupplierProducts.length );
    }
    else {
      console.log("chargerproduct to list  else");
      this.contrat.ctrctSupplierProducts = new Array<CtrctSupplierProduct>();
    }
  }

  onSaveContrat() {

    this.contrat.ctrctCustomer = this.contratClientSelected;

    this.renouvellementService.saveContratFournisseur(this.contrat).subscribe(
      data=>{
        console.log(data);
        this.mode = 2;
      }, err=>{
        console.log(err);
      }
    )

  }

  remove(item:CtrctSupplierProduct) {
    this.contrat.ctrctSupplierProducts = this.contrat.ctrctSupplierProducts.filter(p=>p!==item);
  }

  calculPrixTotal() {
    let verified:boolean = true;
    if(this.contrat.ctrctSupplierProducts.length>0) {
      this.contrat.ctrctSupplierProducts.forEach(
        p=>{
          if(p.prixUnitaire==null)
            verified = false;
        }
      )
    } else {
      verified = false;
    }

    if(verified) {
      let prixTotal:number = 0;
      this.contrat.ctrctSupplierProducts.forEach(
        p=>{
          prixTotal = prixTotal + p.qte*p.prixUnitaire;
        }
      )
      this.contrat.price = prixTotal;
      console.log(this.contrat.price);
    } else {
      this.contrat.price = null;
    }

  }

  clonePrixFromProduct() {
    this.contrat.ctrctSupplierProducts.forEach(
      p=>{
        p.prixUnitaire = null;
      }
    )
  }

  toModeOne() {
    this.mode=1;
    this.contrat = new CtrctSupplier();
  }



}
