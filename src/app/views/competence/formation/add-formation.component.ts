import {
  AfterContentChecked, AfterContentInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit,
  Output
} from "@angular/core";
import {debounceTime, distinctUntilChanged, switchMap} from "rxjs/operators";
import {UserService} from "../../../services/user.service";
import {Formation} from "../../../model/model.formation";
import {User} from "../../../model/model.user";
import {FormationService} from "../../../services/formation.service";
import {TechnologieService} from "../../../services/technologie.service";
import {EditeurService} from "../../../services/editeur.service";
import {EmpFormation} from "../../../model/model.empFormation";
import {DateFormation} from "../../../model/model.dateFormation";

@Component({
  selector: 'add-formation',
  templateUrl: 'add-formation.component.html'
})

export class AddFormationComponent implements OnInit {

  public popoverTitle: string = "Suppression d'un participant";
  public popoverMessage: string = "<b>Êtes-vous sûre de vouloir supprimer ce participant </b>";

  @Input() modal: any;
  @Input() formation: Formation = new Formation();
  @Input() selectedUsers = [];
  mode: number = 1;

  @Output() refresh = new EventEmitter<string>();

  technologies: any;
  technologiesTypeahead = new EventEmitter<string>();

  users: any;
  usersTypeahead = new EventEmitter<string>();

  @Input() editeurs: any;

  @Input() dates: Date[];

  constructor(private formationService: FormationService, private userService: UserService, private technologieService: TechnologieService, private editeurService: EditeurService, private ref: ChangeDetectorRef) {

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

  refreshFormations() {
    this.refresh.emit("Refresh");
  }

  chargerEditeurs() {
    if (this.formation.technologie != null) {
      this.editeurService.getEditeursByTechnologie(this.formation.technologie)
        .subscribe(data => {
          this.formation.editeur = null;
          this.editeurs = data["_embedded"]["editeurs"];
        }, err => {
          console.log(err);
        });
    } else {
      this.editeurs = null;
      this.formation.editeur = null;
    }
  }


  onSaveFormation() {
    this.formation.candidats = this.chargerCandidats();
    this.formation.dates = this.chargerDates();
    this.formationService.saveFormation(this.formation)
      .subscribe((data: Formation) => {
        console.log("SUCCESS" + data);
        this.mode = 2;
        this.refreshFormations();
        this.ref.detectChanges();
        this.addToOutlook(data);
      }, err => {
        console.log(err);
      });

  }

  addToOutlook(f:Formation) {
    this.formationService.addFormationToOutlook(f).subscribe(
      data=>{
        console.log("SUCCESS OUTLOOK");
      }, err=>{
        console.log(err);
      }
    )
  }

  remove(p: User) {
    this.selectedUsers = this.selectedUsers.filter(user => user !== p);
    console.log(this.dates[0]);
  }

  toModeOne() {
    this.modal.hide();
    this.formation = new Formation();
    this.selectedUsers = [];
    this.mode = 1;
  }

  chargerDates() {
    let liste: Array<DateFormation> = new Array();
    if (this.dates.length > 0) {
      this.dates.forEach(date => {
        let dateFormation: DateFormation = new DateFormation();
        dateFormation.date = date;
        liste.push(dateFormation);
      });
    }
    return liste;
  }

  chargerCandidats() {
    let liste: Array<EmpFormation> = new Array();
    if (this.selectedUsers.length > 0) {
      this.selectedUsers.forEach(user => {
        let empFormation: EmpFormation = new EmpFormation();
        empFormation.employe = user;
        liste.push(empFormation);
      });
    }
    if (this.formation.candidats.length > 0) {
      this.formation.candidats.forEach(c1 => {
        liste.forEach(c2 => {
          if (c1.employe.username == c2.employe.username) {
            c2.visa = c1.visa;
          }
        });
      });
    }
    return liste;
  }


}
