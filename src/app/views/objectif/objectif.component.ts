import {Component, OnInit, EventEmitter, ChangeDetectorRef} from '@angular/core';
import {Objectif} from "../../model/model.objectif";
import {AuthenticationService} from "../../services/authentification.service";
import {UserService} from "../../services/user.service";
import {debounceTime, distinctUntilChanged, switchMap} from "rxjs/operators";
import {Router} from "@angular/router";
import {ObjectifUser} from "../../model/model.objectifUser";
import {ObjectifService} from "../../services/objectif.service";

@Component({
  templateUrl: 'objectif.component.html'
})
export class ObjectifComponent implements OnInit {

  objectifs: any;

  motCle: string = "";
  currentPage: number = 1;
  itemsPerPage: number = 10;
  size: number = 10;
  pages: Array<number>;

  selectedObjectif: Objectif = new Objectif();
  objectifToAdd: Objectif = new Objectif();
  users:any;
  usersTypeahead = new EventEmitter<string>();
  selectedUsers = [];
  added:boolean = false;

  constructor(
    private authenticationService:AuthenticationService,
    private userService: UserService,
    private objectifService: ObjectifService,
    private router: Router,
    private ref:ChangeDetectorRef
  ) {}

  ngOnInit() {

    if (!this.authenticationService.isLogged())
      this.router.navigate(['/pages/login']);
    else {
      this.doSearch();
      this.serverSideSearch();
    }

  }

  private serverSideSearch() {
    this.usersTypeahead.pipe(
      distinctUntilChanged(),
      debounceTime(200),
      switchMap(term => this.userService.searchUsersByService(term))
    ).subscribe(x => {
      this.ref.markForCheck();
      this.users = x["content"];
    }, (err) => {
      console.log(err);
      this.users = [];
    });
  }

  doSearch() {
    this.objectifService.getAllObjectifs(this.motCle, this.currentPage, this.size).subscribe(
      data=>{
        this.objectifs = data;
      }, err=>{
        console.log(err);
      }
    )
  }

  gotoPage(page: number) {
    this.currentPage = page;
    this.doSearch();
  }

  onSaveObjectif() {
    this.objectifToAdd.users = this.chargerUsers();
    this.objectifService.saveObjectif(this.objectifToAdd).subscribe(
      data=>{
        console.log('SUCCESS');
        this.added = true;
        this.objectifToAdd = new Objectif();
        this.selectedUsers = [];
        this.ngOnInit();
        this.ref.detectChanges();
      }, err =>{
        console.log(err);
      }
    );
  }

  chargerUsers() {
    let liste:Array<ObjectifUser> = new Array();
    if (this.selectedUsers.length>0) {
      this.selectedUsers.forEach(user=>{
        let objectifUser:ObjectifUser = new ObjectifUser();
        objectifUser.user = user;
        liste.push(objectifUser);
      });
    }
    if(this.objectifToAdd.users.length>0) {
      this.objectifToAdd.users.forEach(c1=>{
        liste.forEach(c2=>{
          if (c1.user.username == c2.user.username) {
            c2.taux = c1.taux;
          }
        });
      });
    }
    return liste;
  }

  selectObjectif(objectif:Objectif) {
    this.selectedObjectif = JSON.parse(JSON.stringify(objectif));
  }

}
