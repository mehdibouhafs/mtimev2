import {Component, OnInit} from "@angular/core";
import {UserService} from "../../services/user.service";

@Component({
  templateUrl: 'projects-intervenants.component.html'
})

export class ProjectsIntervenantsComponent implements OnInit {

  users:any;
  motCle:string="";
  currentPage : number = 0;
  totalElement:number;
  size : number = 5;
  pages: Array<number>;

  constructor(private userService:UserService) {}

  ngOnInit() {
    this.doSearch();
  }

  doSearch() {
    this.userService.getUsersByService(this.motCle, this.currentPage, this.size).subscribe(
      data=>{
        this.users = data;
      }, err=>{
        console.log(err);
      }
    );
  }

  chercher() {

  }

}
