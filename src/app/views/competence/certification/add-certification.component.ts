import {
  AfterContentChecked, AfterContentInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit,
  Output
} from "@angular/core";
import {debounceTime, distinctUntilChanged, switchMap} from "rxjs/operators";
import {UserService} from "../../../services/user.service";
import {Formation} from "../../../model/model.formation";
import {User} from "../../../model/model.user";
import {FormationService} from "../../../services/formation.service";
import {Certification} from "../../../model/model.certification";
import {CertificationService} from "../../../services/certification.service";
import {EmpCertification} from "../../../model/model.empCertification";
import {TechnologieService} from "../../../services/technologie.service";
import {EditeurService} from "../../../services/editeur.service";

@Component({
  selector: 'add-certification',
  templateUrl: 'add-certification.component.html'
})

export class AddCertificationComponent implements OnInit {

  public popoverTitle: string = "Suppression d'un participant";
  public popoverMessage: string = "<b>Êtes-vous sûre de vouloir supprimer ce participant </b>";

  @Input() modal: any;
  @Input() certification: Certification = new Certification();
  @Input() selectedUsers = [];
  mode: number = 1;

  @Output() refresh = new EventEmitter<string>();

  technologies: any;
  technologiesTypeahead = new EventEmitter<string>();

  users: any;
  usersTypeahead = new EventEmitter<string>();

  @Input() editeurs: any;

  constructor(private certificationService: CertificationService, private userService: UserService, private technologieService: TechnologieService, private editeurService: EditeurService, private ref: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.serverSideSearch();
  }

  private serverSideSearch() {
    this.usersTypeahead.pipe(
      distinctUntilChanged(),
      debounceTime(200),
      switchMap(term => this.userService.searchUsers(term))
    ).subscribe(x => {
      this.ref.markForCheck();
      this.users = x["content"];
    }, (err) => {
      console.log(err);
      this.users = [];
    });

    this.technologiesTypeahead.pipe(
      distinctUntilChanged(),
      debounceTime(200),
      switchMap(term => this.technologieService.searchTechnologie(term))
    ).subscribe(x => {
      this.ref.markForCheck();
      this.technologies = x["_embedded"]["technologies"];
    }, (err) => {
      console.log(err);
      this.technologies = [];
    });

  }

  refreshCertifications() {
    this.refresh.emit("Refresh");
  }

  chargerEditeurs() {
    if (this.certification.technologie != null) {
      this.editeurService.getEditeursByTechnologie(this.certification.technologie)
        .subscribe(data => {
          this.certification.editeur = null;
          this.editeurs = data["_embedded"]["editeurs"];
        }, err => {
          console.log(err);
        });
    } else {
      this.editeurs = null;
      this.certification.editeur = null;
    }
  }


  onSaveCertification() {
    this.certification.candidats = this.chargerCandidats();
    this.certificationService.saveCertification(this.certification)
      .subscribe((data : Certification) => {
        console.log("SUCCESS" + data);
        this.mode = 2;
        this.refreshCertifications();
        this.ref.detectChanges();
        this.addToOutlook(data);
      }, err => {
        console.log(err);
      });
  }

  addToOutlook(f:Certification) {
    this.certificationService.addCertificationToOutlook(f).subscribe(
      data => {
        console.log("SUCCESS OUTLOOK");
      }, err => {
        console.log(err);
      }
    )
  }

  remove(p: User) {
    this.selectedUsers = this.selectedUsers.filter(user => user !== p);
  }

  toModeOne() {
    this.modal.hide();
    this.certification = new Certification();
    this.selectedUsers = [];
    this.mode = 1;
  }

  chargerCandidats() {
    let liste:Array<EmpCertification> = new Array();
    if (this.selectedUsers.length>0) {
      this.selectedUsers.forEach(user=>{
        let empCertification:EmpCertification = new EmpCertification();
        empCertification.employe = user;
        liste.push(empCertification);
      });
    }
    if(this.certification.candidats.length>0) {
      this.certification.candidats.forEach(c1=>{
        liste.forEach(c2=>{
          if (c1.employe.username == c2.employe.username) {
            c2.visa = c1.visa;
            c2.niveau = c1.niveau;
            c2.url_image_certif = c1.url_image_certif;
          }
        });
      });
    }
    return liste;
  }


}
