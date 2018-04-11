import {Injectable} from "@angular/core";
import * as stompjs from 'stompjs';
import * as SockJS from "sockjs-client";
import {Client, Frame, Message} from "stompjs";
import {Subject} from "rxjs/Subject";
import {AuthenticationService} from "./authentification.service";
import {NotificationsService} from "angular2-notifications";

@Injectable()
export class SocketService {

  private url : string = "http://localhost:8080/gs-guide-websocket";

  private  message : string;
  private stompClient: Client = null;

  constructor(private autehntificationService:AuthenticationService,private notificationService:NotificationsService){

  }

   connect(){
     const socket = new SockJS(this.url+'?token='+this.autehntificationService.getToken()) as WebSocket;
     this.stompClient = stompjs.over(socket);
     this.stompClient.connect({'Authorization': this.autehntificationService.getToken()}, '', (frame: Frame) => {
       console.log('CONNECT CONNECT');
       this.stompClient.subscribe('/user/topic/greetings', (message: Message) => {
         this.onMessage(message);
       });
       this.stompClient.subscribe('/topic/greetings', (message: Message) => {
         this.onMessage(message);
       });
     });
  }

   onMessage(message: Message) {
    console.log('Received greeting:', message);
    //let json = JSON.parse(message.body);
    //this.messageSource.next(json['content']);
     const toast= this.notificationService.success("Confirmation d'ajout", "Certification ajouté avec succès", {
       timeOut: 7000,
       showProgressBar: false,
       pauseOnHover: true,
       clickToClose: false,
       clickIconToClose: true});
    this.message = message;
    return this.message;

  }

  hello(){
     console.log("hello");
    this.onMessage(null);
  }

   disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
    console.log("Disconnected");
  }

   sendName() {
    this.stompClient.send("/app/hello", {}, JSON.stringify({'message': 'teste notification hello'}));
  }




}



