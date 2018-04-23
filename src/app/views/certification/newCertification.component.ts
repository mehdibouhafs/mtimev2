import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthenticationService} from "../../services/authentification.service";
import {NotificationsService} from "angular2-notifications";
import {Certification} from "../../model/model.certification";
import {CertificationService} from "../../services/certification.service";
import {SocketService} from "../../services/socket.service";
import * as stompjs from 'stompjs';
import * as SockJS from "sockjs-client";
import {Client, Frame, Message} from "stompjs";
import {Subject} from "rxjs/Subject";
import {UserService} from "../../services/user.service";
import {User} from "../../model/model.user";

@Component({
  selector: "app-new-certification",
  templateUrl: 'newCertification.component.html',
})
export class NewCertificationComponent implements OnInit, OnDestroy {

  users: any;
  selectedUsers = [];
  link: string = "assets/img/avatars/";

  isCollapsed: boolean = false;
  iconCollapse: string = "icon-arrow-up";
  certification: Certification = new Certification();
  frmName: any;
  mode: number = 1;
  //appHeaderComponent: AppHeaderComponent;
  message: string;
  stompClient: Client;
  private wsConf = {
    host: 'http://localhost:8080/ws'
  }
  private messageSource = new Subject<string>();
  messageReceived$ = this.messageSource.asObservable();
  campuses: Array<object> = new Array(6); // initialise the array with an empty object
  addCampus() {
    console.log("teste");
    // push an empty object onto the array
    console.log(this.campuses.length);
    this.campuses.push({});
  }

  constructor(private certificationService: CertificationService, private userService: UserService, private notificationService: NotificationsService, private socketService: SocketService) {

  }

  ngOnDestroy() {

  }


  onTestSocket() {
    this.certificationService.testeSocket().subscribe((data) => {
      console.log("Data " + data);
    });

    this.socketService.sendName();

  }

  public options = {
    position: ["bottom", "right"],
    timeOut: 30000,
    lastOnBottom: false,
    maxStack: 7,
  }

  created(event) {
    console.log("event " + JSON.stringify(event));
  }

  destroyed(event) {
    console.log("destroyed " + event);
  }

  ngOnInit() {

    this.userService.getAllUsers()
      .subscribe(data => {
        this.users = data;
      }, err => {
        console.log(err);
      });

  }

  toModeOne() {
    this.mode = 1;
    this.certification = new Certification();
    this.selectedUsers = [];
  }

  removeOne(user: User) {
    this.selectedUsers = this.selectedUsers.filter(obj => obj !== user);
  }

  collapsed(event: any): void {
    // console.log(event);
  }

  expanded(event: any): void {
    // console.log(event);
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    this.iconCollapse = this.isCollapsed ? "icon-arrow-down" : "icon-arrow-up";
  }

  onSaveCertification() {

    this.selectedUsers.forEach(val => {
      this.certification.participants.push(val);
    });

    this.certificationService.saveCertification(this.certification)
      .subscribe((data: Certification) => {
        this.certification = data;
        this.mode = 2;
        const toast = this.notificationService.success("Confirmation d'ajout", "Certification ajouté avec succès", {
          timeOut: 7000,
          showProgressBar: false,
          pauseOnHover: true,
          clickToClose: false,
          clickIconToClose: true
        });
        //this.appHeaderComponent = new AppHeaderComponent(null,null,this.notificationService);
        //this.appHeaderComponent.lunchSuccessFunction(this.notificationService);
        /*
        toast.clickIcon.subscribe((event) => {
          console.log("test");
        });*/
      }), err => {
      console.log(JSON.parse(err.body).message);
    }
  }


}
