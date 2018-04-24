import {Component, OnInit} from "@angular/core";
import {UserService} from "../../services/user.service";
import {AuthenticationService} from "../../services/authentification.service";
import {Router} from "@angular/router";
import {Certification} from "../../model/model.certification";

@Component({
  templateUrl: 'mycertification.component.html'
})

export class MycertificationComponent implements OnInit {

  pageCertifications: any;
  motCle: string = "";
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalElement: number;
  size: number = 5;
  pages: Array<number>;

  selectedCertification: Certification;

  constructor(private userService: UserService, private  autehntificationService: AuthenticationService, private router: Router) {
  }

  ngOnInit() {
    this.doSearch();
  }

  chercher(){
    this.doSearch();
  }

  doSearch() {
    this.userService.findMyCertifications(this.motCle, this.currentPage, this.size).subscribe(
      data => {
        this.pageCertifications = data;
        this.pages = new Array(data["totalPages"]);
        this.totalElement = data["totalElements"];

      }, err => {
        this.autehntificationService.logout();
        this.router.navigateByUrl('/pages/login');
      });
  }

  gotoPage(page:number){
    this.currentPage = page;
    this.doSearch();
  }

  doChargerModal(certification: Certification) {
    this.selectedCertification = certification;
  }

}
