import {Component, OnInit} from '@angular/core';
import {FormationService} from "../../services/formation.service";
import {AuthenticationService} from "../../services/authentification.service";
import {Router} from "@angular/router";
import {Formation} from "../../model/model.formation";
import {UserService} from "../../services/user.service";

@Component({
  templateUrl: 'myformation.component.html'
})
export class MyFormationComponent implements OnInit {
  pageFormations: any;
  motCle: string = "";
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalElement: number;
  size: number = 5;
  pages: Array<number>;

  public popoverTitle: string = 'Suppression de la formation';
  public popoverMessage: string = "<b>Est vous sure de vouloir supprimer cette formation </b>";
  public confirmClicked: boolean = false;
  public cancelClicked: boolean = false;

  formation: Formation = new Formation();
  selectedFormation: Formation;

  constructor(private userService: UserService, private  autehntificationService: AuthenticationService, private router: Router) {
  }

  isCollapsed: boolean = false;
  iconCollapse: string = "icon-arrow-up";

  ngOnInit() {
    console.log("bearer " + this.autehntificationService.getToken());
    this.doSearch();
  }

  chercher() {
    this.doSearch();
  }

  doSearch() {
    console.log("motCle " + this.motCle);

    this.userService.findMyFormations(this.motCle, this.currentPage, this.size).subscribe(
      data => {
        this.pageFormations = data;
        this.pages = new Array(data["totalPages"]);

        this.totalElement = data["totalElements"];

      }, err => {
        this.autehntificationService.logout();
        this.router.navigateByUrl('/pages/login');
      });
  }

  gotoPage(page: number) {
    this.currentPage = page;
    this.doSearch();
  }

  doChargerModal(formation: Formation) {
    this.selectedFormation = formation;
  }

}
