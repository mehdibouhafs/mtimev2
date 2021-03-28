import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../services/authentification.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-sidebar',
  templateUrl: './app-sidebar.component.html'
})
export class AppSidebarComponent implements OnInit {

  roles: Array<string> = [];

  constructor(private authenticationService: AuthenticationService, private router: Router) {

  }

  ngOnInit() {
    if (this.authenticationService.getRoles() == null || this.authenticationService.getRoles().length==0)
      this.router.navigateByUrl('/pages/login');
    else
      this.roles = this.authenticationService.getRoles();
  }

}
