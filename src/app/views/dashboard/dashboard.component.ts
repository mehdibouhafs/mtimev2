import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AuthenticationService} from "../../services/authentification.service";

@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  tasks : any;
  constructor(public authService:AuthenticationService, private router:Router ) { }

  ngOnInit() {
    console.log("teste");
    this.authService.getTasks()
      .subscribe(data=>{
        this.tasks = data;
        console.log("taks " + this.tasks);
      }, err=>{
        this.authService.logout();
        this.router.navigateByUrl('/pages/login');
      })
  }

}
