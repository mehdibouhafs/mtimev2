import {Component, ViewChild} from "@angular/core";
import {CertificationService} from "../../services/certification.service";
import {Certification} from "../../model/model.certification";
import {StorageService} from "../../services/storage.service";
import {AddCertificationComponent} from "./certification/add-certification.component";
import {EditeurService} from "../../services/editeur.service";
import {Formation} from "../../model/model.formation";
import {FormationService} from "../../services/formation.service";
import {AuthenticationService} from "../../services/authentification.service";
import {Router} from "@angular/router";

@Component({
  templateUrl: 'all-formations.component.html'
})

export class AllFormationsComponent {

  formations: any;

  motCle: string = "";
  currentPage: number = 1;
  itemsPerPage: number = 10;
  size: number = 10;
  pages: Array<number>;

  selectedFormation: Formation = new Formation();
  selectedUsers = [];
  dates = [];

  editeurs: any;

  @ViewChild('addFormation') addFormation;

  constructor(private authenticationService:AuthenticationService, private router: Router, private formationService: FormationService, private editeurService: EditeurService) {

  }

  ngOnInit() {
    if (!this.authenticationService.isLogged())
      this.router.navigate(['/pages/login']);
    else
      this.doSearch();
  }


  doSearch() {
    this.formationService.getFormations(this.motCle, this.currentPage, this.size).subscribe(
      data => {
        this.formations = data;
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

  selectFormation(c: Formation) {
    this.selectedFormation = JSON.parse(JSON.stringify(c));
    this.selectedUsers = [];
    if (c.candidats.length > 0) {
      c.candidats.forEach(candidat => {
        this.selectedUsers.push(candidat.employe);
      });
    }

    if (c.dates.length > 0) {
      c.dates.forEach(d => {
          this.dates.push(new Date(d.date));
        }
      )
    }

    this.chargerEditeurs();
  }

  chargerEditeurs() {
    this.editeurService.getEditeursByTechnologie(this.selectedFormation.technologie)
      .subscribe(data => {
        this.editeurs = data["_embedded"]["editeurs"];
      }, err => {
        console.log(err);
      });
  }

  addformation() {
    this.selectedFormation = new Formation();
    this.selectedUsers = [];
    this.addFormation.show();
  }

  onDeleteFormation(f: Formation) {
    this.formationService.deleteFormation(f.id).subscribe(
      data => {
        this.ngOnInit();
        console.log('Deleting Success');
      }, err => {
        console.log('Deleting Error');
      }
    );
  }

  getDetailsFormation(formation: Formation) {
    let nbreAccepted: number = 0;
    let nbreRefused: number = 0;
    formation.candidats.forEach(candidat => {
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
