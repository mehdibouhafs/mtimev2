import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../../services/authentification.service";

@Component({
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit{

   mode : number = 0;

   title = "app";

  constructor(private authService:AuthenticationService,private router:Router) { }

  ngOnInit() {
    this.authService.logout();
    this.router.navigateByUrl('/pages/login');
  }

  onLogin(user){
    this.authService.login(user)
      .subscribe(resp=>{
          this.mode = 2;
          let jwtToken = resp.headers.get("authorization");
          this.authService.saveToken(jwtToken);
          this.router.navigateByUrl('/dashboard');

        },
        err=>{
         this. mode = 1;
          this.authService.logout();
          this.router.navigateByUrl('/pages/login');
        }
      )
  }

}
