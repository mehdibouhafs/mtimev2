import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../../services/authentification.service";
import {NotificationsService} from "angular2-notifications";

@Component({
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit{

   mode : number = 0;

   title = "app";

  constructor(private authService:AuthenticationService,private router:Router,private  notificationService:NotificationsService) { }

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
          /*const toast= this.notificationService.info("Bienvenue", "Nous sommes heureux de vous revoir sur MRH", {
            timeOut: 7000,
            showProgressBar: false,
            pauseOnHover: true,
            clickToClose: false,
            clickIconToClose: true});*/
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
