import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {AuthenticationService} from "../../services/authentification.service";
import {Router} from "@angular/router";
import {NotificationsService} from "angular2-notifications";
import {SocketService} from "../../services/socket.service";

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html'
})

export class AppHeaderComponent implements OnInit,OnDestroy,AfterViewInit  {

  imgProfil:string;
  link : string = "assets/img/avatars/";


  public options = {
    position: ["top", "right"],
    timeOut: 50000,
    lastOnBottom: false,
    maxStack:7,
  }

  created(event){
    console.log("event " + JSON.stringify(event));
  }

  destroyed(event){
    console.log("destroyed " + event);
  }

  constructor(public authService:AuthenticationService, private router:Router,private  notificationService:NotificationsService,private socketService:SocketService){

  }

  ngOnInit(){
    this.imgProfil = this.link + this.authService.getImgProfil();
    this.socketService.connect();

  }
  ngAfterViewInit(){
      this.sayHello();
  }

  sayHello(){
    const toast= this.notificationService.info("Bienvenue", "Nous sommes heureux de vous revoir sur MRH", {
      timeOut: 7000,
      showProgressBar: false,
      pauseOnHover: true,
      clickToClose: false,
      clickIconToClose: true});
  }


  ngOnDestroy(){
    this.socketService.disconnect();
  }

  onLogout(){
    console.log("logout");
    this.authService.logout();
    this.router.navigateByUrl('/pages/login');
  }



  lunchSuccessFunction(){


  }


}
