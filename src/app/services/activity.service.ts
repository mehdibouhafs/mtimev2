import {Injectable} from "@angular/core";
import {AuthenticationService} from "./authentification.service";
import {Activity} from "../model/model.activity";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import * as moment from "moment-timezone";

@Injectable()
export class ActivityService{

  private host:string = "http://localhost:8080";

  constructor(private authenticationService:AuthenticationService,private  http:HttpClient){}

  getMyActivitiesByMc(mc:string,page:number,size:number){
    return this.http.get(this.host+"/findMyActivitiesByMc?username="+this.authenticationService.getUserName()+"&motCle="+mc+"&size="+size+"&page="+page,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

  getAllActivitiesByMc(mc:string,page:number,size:number){
    return this.http.get(this.host+"/findMyActivitiesByMc?motCle="+mc+"&size="+size+"&page="+page,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

  saveActivity(activity:Activity){
    return this.http.post(this.host+'/activities',activity,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

  getActivity(id:number){
    return this.http.get(this.host+'/activities/'+id,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

  updateActivity(activity:Activity){
    console.log("activity a updaté "+JSON.stringify(activity));
    return this.http.put(this.host+'/activities/'+activity.id,activity,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

  deleteActivity(id:number){
    return this.http.delete(this.host+'/activities/'+id,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

  getAllMyActivitiesByDates(dteStrt:string,dteEnd:string){
    return this.http.get(this.host+'/findAllMyActivitiesByDates?username='+this.authenticationService.getUserName()+"&dteStrt="+dteStrt+"&dteEnd="+dteEnd,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

  formatDate(date:any){
    return moment(date).tz("Africa/Casablanca").format('DD/MM/YYYY HH:mm:ss');
  }

  diffBetwenTwoDateInMinutes(dteStrt:Date,dteEnd:Date){
    var dateDeb = this.formatDate(dteStrt);
     var dateFin = this.formatDate(dteEnd);
     var ms = moment(dateFin,"DD/MM/YYYY HH:mm").diff(moment(dateDeb,"DD/MM/YYYY HH:mm"));
     var d = moment.duration(ms);
    console.log("duration as Hours " + d.asHours());
    console.log("duration as Minutes " + d.asMinutes());
    console.log("duration as seconde " + d.asSeconds());
     var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
    return d.asMinutes();

  }

  diffBetwenTwoDateFormated(dteStrt:Date,dteEnd:Date){
    var dateDeb = this.formatDate(dteStrt);
    var dateFin = this.formatDate(dteEnd);
    var ms = moment(dateFin,"DD/MM/YYYY HH:mm").diff(moment(dateDeb,"DD/MM/YYYY HH:mm"));
    var d = moment.duration(ms);
    var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
    return s;

  }

  testDateBeforeNow(dteStrt:Date,dteEnd:Date){
      var now = new Date();
      if((dteStrt <= now) && (dteEnd <= now)){
        return true;
      }else{
        return false;
      }
  }


}
