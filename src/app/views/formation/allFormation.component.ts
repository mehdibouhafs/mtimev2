import {Component, OnInit, ViewChild} from '@angular/core';
import {FormationService} from "../../services/formation.service";
import {AuthenticationService} from "../../services/authentification.service";
import {Router} from "@angular/router";
import {Formation} from "../../model/model.formation";
import {BsModalRef, BsModalService} from "ngx-bootstrap";


@Component({
  templateUrl: 'allFormation.component.html'
})
export class AllFormationComponent implements OnInit{

  @ViewChild('dangerModal') dangerModal;

  pageFormations: any;
  motCle:string="";
  currentPage : number = 1;
  itemsPerPage : number = 5;
  totalElement:number;
  size : number = 5;
  pages: Array<number>;



  public popoverTitle: string = 'Suppression de la formation';
  public popoverMessage: string = "<b>Est vous sure de vouloir supprimer cette formation </b>";
  public confirmClicked: boolean = false;
  public cancelClicked: boolean = false;

  formation : Formation = new Formation();
  selectedFormation: Formation;

  constructor(private formationService:FormationService,private  autehntificationService:AuthenticationService,private router:Router ) { }

  isCollapsed: boolean = false;
  iconCollapse: string = "icon-arrow-up";

  ngOnInit(){
    console.log("bearer " + this.autehntificationService.getToken());
    this.doSearch();
  }

  chercher(){
    this.doSearch();
  }

  doSearch(){
    console.log("motCle " + this.motCle);

    this.formationService.getFormations(this.motCle,this.currentPage,this.size).subscribe(
      data=>{
        this.pageFormations = data;
        this.pages = new Array(data["totalPages"]);

        this.totalElement = data["totalElements"];

      },err=>{
        this.autehntificationService.logout();
        this.router.navigateByUrl('/pages/login');
      });
  }

  doChargerModal(formation: Formation) {
    this.selectedFormation = formation;
  }

  doDeleteFormation(formation: Formation) {
    this.selectedFormation = formation;
  }

  gotoPage(page:number){
      this.currentPage = page;
      this.doSearch();
  }

  onEditFormation(id:number){
    this.router.navigate(["/formation/edit-formation/",id]);
    //this.router.navigateByUrl('/formation/edit-formation/'+id);
  }

  onDeleteFormation(formation:Formation){

        this.formationService.deleteFormation(formation.id)
          .subscribe(data => {
            this.pageFormations.content.splice(
              this.pageFormations.content.indexOf(formation), 1
            )
          }, err => {
            console.log("err");
          });

  }

  detectModal() {

    return this.dangerModal.show();
  }




}
