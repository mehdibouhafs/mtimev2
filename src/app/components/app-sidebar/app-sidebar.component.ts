import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../services/authentification.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './app-sidebar.component.html'
})
export class AppSidebarComponent implements OnInit {

  roles:Array<string> = [];

  constructor(private authenticationService:AuthenticationService) {

  }

  ngOnInit() {
    this.roles = this.authenticationService.getRoles();
  }

}
