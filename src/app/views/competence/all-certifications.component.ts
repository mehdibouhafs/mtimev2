import {Component, ViewChild} from "@angular/core";
import {CertificationService} from "../../services/certification.service";
import {Certification} from "../../model/model.certification";
import {StorageService} from "../../services/storage.service";
import {AddCertificationComponent} from "./certification/add-certification.component";
import {EditeurService} from "../../services/editeur.service";
import {AuthenticationService} from "../../services/authentification.service";
import {Router} from "@angular/router";

@Component({
  templateUrl: 'all-certifications.component.html'
})

export class AllCertificationsComponent {

  certifications: any;

  motCle: string = "";
  currentPage: number = 1;
  itemsPerPage: number = 10;
  size: number = 10;
  pages: Array<number>;

  selectedCertification: Certification = new Certification();
  selectedUsers = [];

  editeurs: any;

  @ViewChild('addCertification') addCertification;

  constructor(private authenticationService:AuthenticationService, private router: Router, private certificationService: CertificationService, private editeurService: EditeurService) {

  }

  ngOnInit() {
    if (!this.authenticationService.isLogged())
      this.router.navigate(['/pages/login']);
    else
      this.doSearch();
  }


  doSearch() {
    this.certificationService.getCertifications(this.motCle, this.currentPage, this.size).subscribe(
      data => {
        this.certifications = data;
      }, err => {
        console.log(err);
      }
    );
  }

  chercher() {
    this.currentPage = 1;
    this.doSearch();
  }

  gotoPage(page: number) {
    this.currentPage = page;
    this.doSearch();
  }

  selectCertification(c: Certification) {
    this.selectedCertification = JSON.parse(JSON.stringify(c));
    this.selectedUsers = [];
    if (c.candidats.length > 0) {
      c.candidats.forEach(candidat => {
        this.selectedUsers.push(candidat.employe);
      });
    }
    this.chargerEditeurs();
  }

  chargerEditeurs() {
    this.editeurService.getEditeursByTechnologie(this.selectedCertification.technologie)
      .subscribe(data => {
        this.editeurs = data["_embedded"]["editeurs"];
      }, err => {
        console.log(err);
      });
  }

  addcertification() {
    this.selectedCertification = new Certification();
    this.selectedUsers = [];
    this.addCertification.show();
  }

  onDeleteCertification(c: Certification) {
    this.certificationService.deleteCertification(c.id).subscribe(
      data => {
        this.ngOnInit();
        console.log('Deleting Success');
      }, err => {
        console.log('Deleting Error');
      }
    );
  }

  getDetailsCertification(certification: Certification) {
    let nbreAccepted: number = 0;
    let nbreRefused: number = 0;
    certification.candidats.forEach(candidat => {
      if (candidat.visa == 'Accepted')
        nbreAccepted++;
      if (candidat.visa == 'Refused')
        nbreRefused++;

    });
    return {
      nbreAccepted: nbreAccepted,
      nbreRefused: nbreRefused
    };
  }

}
