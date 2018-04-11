import {Injectable} from "@angular/core";
import {AuthenticationService} from "./authentification.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Project} from "../model/model.project";

@Injectable()
export class ProjectService {

  private host:String = "http://localhost:8080";

  constructor(public  http:HttpClient,private autehntificationService:AuthenticationService){

  }

  getProjects(){
    return this.http.get(this.host+"/projects",{headers: new HttpHeaders({'Authorization': this.autehntificationService.getToken()})});
  }

  getProjectsByCustomer(codeCustomer:string){
      return this.http.get(this.host+"/projectsByCustomer?codeCustomer="+codeCustomer,{headers: new HttpHeaders({'Authorization': this.autehntificationService.getToken()})});
  }

  saveProject(project:Project){
    return this.http.post(this.host+'/projects',project,{headers: new HttpHeaders({'Authorization': this.autehntificationService.getToken()})});
  }

  getProject(id:number){
    return this.http.get(this.host+'/Projects/'+id,{headers: new HttpHeaders({'Authorization': this.autehntificationService.getToken()})});
  }

  updateProject(project:Project){
    console.log("Project a updaté "+JSON.stringify(project));
    return this.http.put(this.host+'/projects/'+project.prjId,project,{headers: new HttpHeaders({'Authorization': this.autehntificationService.getToken()})});
  }

  deleteProject(id:number){
    return this.http.delete(this.host+'/projects/'+id,{headers: new HttpHeaders({'Authorization': this.autehntificationService.getToken()})});
  }



}
