import {Injectable} from "@angular/core"
import {HttpClient, HttpHandler, HttpHeaders} from "@angular/common/http";
import {headersToString} from "selenium-webdriver/http";
import {JwtHelper} from "angular2-jwt";
import {Router} from "@angular/router";

@Injectable()
export class AuthenticationService{

  private host:string = "http://localhost:8080";
  private jwtToken = null;
  private roles : Array<any>;
  private imgProfil:string;
  private name : string;

  constructor (private  http:HttpClient){

  }

  login(user){
    return this.http.post(this.host+"/login",user,{observe:'response'});
  }

  saveToken(jwt:string){
    this.jwtToken = jwt;
    localStorage.setItem('token',jwt);
    let jwtHelper  = new JwtHelper();
    this.roles = jwtHelper.decodeToken(this.jwtToken).roles;
    this.imgProfil = jwtHelper.decodeToken(this.jwtToken).sub;
    localStorage.setItem('imgProfil',this.imgProfil+".jpg");
    localStorage.setItem('name',this.imgProfil);
    localStorage.setItem('roles', this.roles.toString());
  }

  loadToken(){
    this.jwtToken = localStorage.getItem('token');
  }

  loadImgProfil(){
    this.imgProfil = localStorage.getItem('imgProfil');
  }

  loadName(){
    this.name = localStorage.getItem('name');
  }

  getTasks() {
    if (this.jwtToken == null) this.loadToken();
    return this.http.get(this.host + "/tasks",
      {headers: new HttpHeaders({'Authorization': this.jwtToken})});
  }

  getToken(){
    if (this.jwtToken == null) this.loadToken();
    return this.jwtToken;
  }

  getImgProfil(){
    if (this.imgProfil == null) this.loadImgProfil();
    return this.imgProfil;
  }

  getUserName(){
    if (this.name == null) this.loadName();
    return this.name;
  }

  getImgProfile(){
    if (this.jwtToken == null) this.loadToken();
    return this.jwtToken;
  }


  logout(){
    this.jwtToken = null;
    this.name = null;
    this.imgProfil = null;
    localStorage.removeItem('token');
    localStorage.removeItem('imgProfil');
    localStorage.removeItem('name');

  }

  isAdmin(){
    for(let r of this.roles){
      if(r.authority == 'ADMIN') return true;
    }
    return false;
  }

  getRoles() {
    if(this.roles == null)
      return [];
    return this.roles;
  }

  saveTask(task){
    console.log(task);
    return this.http.post(this.host+'/tasks',task,{headers: new HttpHeaders({'Authorization': this.jwtToken})});
  }
}
