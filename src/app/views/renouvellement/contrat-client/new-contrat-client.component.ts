import {ChangeDetectorRef, Component, EventEmitter, OnInit, ViewChild} from "@angular/core";
import {CtrctCustomer} from "../../../model/model.contratClient";
import {CustomerService} from "../../../services/customer.service";
import {debounceTime, distinctUntilChanged, switchMap} from "rxjs/operators";
import {CtrctCustomerProduct} from "../../../model/model.contratClientProduit";
import {Product} from "../../../model/model.produit";
import {CtrctCustomerProductSeries} from "../../../model/model.contratClientProduitSerie";
import {RenouvellementService} from "../../../services/renouvellement.service";
import {ObjectService} from "../../../services/object.service";
import {forEach} from "@angular/router/src/utils/collection";

@Component({
  templateUrl: 'new-contrat-client.component.html'
})

export class NewContratClientComponent implements OnInit {

  public popoverTitle: string = "Suppression d'un produit";
  public popoverMessage: string = "<b>Êtes-vous sûre de vouloir supprimer ce produit </b>";
  contrat: CtrctCustomer = new CtrctCustomer();
  ctrctCustomerProduct: CtrctCustomerProduct = new CtrctCustomerProduct();
  selectedProduct: CtrctCustomerProduct = new CtrctCustomerProduct();
  @ViewChild('addSeries') addSeries;
  customers: any;
  products: any;
  distributeurs : any;
  customerTypeahead = new EventEmitter<string>();
  productTypeahead = new EventEmitter<string>();
  distributeurTypeahead = new EventEmitter<string>();
  pilotes = [
    {
      name: 'Achraf MESSAOUDI'
    },
    {
      name: 'Ihssane ERRAJAI'
    },
    {
      name: 'Mohamed KARCHE'
    },
    {
      name: 'Sara EL FEKKI'
    },
    {
      name: 'Tarik FDIL'
    }
  ];
  sn: string;
  mode = 1;
  validation: boolean = true;

  constructor(private customerService: CustomerService,
              private renouvellementService: RenouvellementService,
              private objectService:ObjectService,
              private ref: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.objectService.setData("yassine");
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

    this.productTypeahead.pipe(
      distinctUntilChanged(),
      debounceTime(200),
      switchMap(term => this.renouvellementService.getProducts(term))
    ).subscribe(x => {
      this.ref.markForCheck();
      this.products = x["content"].filter(element => {
        let found: boolean = false;
        this.contrat.ctrctCustomerProducts.forEach(
          p => {
            if (p.product.ref === element.ref)
              found = true;
          }
        )
        if (!found)
          return element;
      })
    }, (err) => {
      console.log(err);
      this.products = [];
    });


    this.distributeurTypeahead.pipe(
      distinctUntilChanged(),
      debounceTime(200),
      switchMap(term => this.renouvellementService.getDistributeur(term))
    ).subscribe(x => {
      this.ref.markForCheck();
      this.distributeurs = x["content"];
    }, (err) => {
      console.log(err);
      this.distributeurs = [];
    });

  }

  toAddSeries(selected: CtrctCustomerProduct) {
    this.selectedProduct = selected;
    this.sn = "";
    this.addSeries.show();
  }

  addSerie() {
    let productSerie = new CtrctCustomerProductSeries();
    productSerie.sn = this.sn;
    this.selectedProduct.ctrctCustomerProductSeries.push(productSerie);
  }


  addProductToList() {

    /*for (let i=0; i<this.ctrctCustomerProduct.qte; i++) {
      let productSerie = new CtrctCustomerProductSeries();
      productSerie.sn = 'Non renseigné';
      this.ctrctCustomerProduct.ctrctCustomerProductSeries.push(productSerie);
    }*/

    this.contrat.ctrctCustomerProducts.push(this.ctrctCustomerProduct);
    this.serverSideSearch();
    this.products = [];
    this.ctrctCustomerProduct = new CtrctCustomerProduct();

  }

  onSaveContrat() {

    this.contrat.ctrctCustomerProducts.forEach(
      p => {
        if (p.product.distributeur.ref != null){
          console.log(" ref not null");
            p.product.distributeur.id=null;
            p.product.distributeur.name = p.product.distributeur.ref;
            p.qteDisponible = p.qte;
            p.devise = 'MAD';
        }

      }
    );

    this.renouvellementService.saveContratClient(this.contrat).subscribe(
      data => {
        console.log(data);
        this.mode = 2;
      }, err => {
        console.log(err);
      }
    )
  }

  toModeOne() {
    this.mode = 1;
    this.contrat = new CtrctCustomer();
  }

  addTag(name) {
    return {
      ref: name
    }
  }

  remove(p: CtrctCustomerProduct) {
    this.contrat.ctrctCustomerProducts = this.contrat.ctrctCustomerProducts.filter(p1 => p1 !== p);
  }

  removeSN(serie: CtrctCustomerProductSeries) {
    this.selectedProduct.ctrctCustomerProductSeries = this.selectedProduct.ctrctCustomerProductSeries.filter(s => s !== serie);
    this.validationForm();
  }

  validationForm() {
    this.validation = true;
    this.contrat.ctrctCustomerProducts.forEach(p => {
      p.qteDisponible = p.qte;
      if (p.qte < p.ctrctCustomerProductSeries.length)
        this.validation = false;
    });
  }

}
