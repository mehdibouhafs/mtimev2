import {Injectable} from "@angular/core";
import {Resolve, Router, RouterStateSnapshot, ActivatedRouteSnapshot} from "@angular/router"
import {AuthenticationService} from "../../services/authentification.service";

@Injectable()
export class ResolverDashboard implements Resolve<boolean> {

  constructor(private authService:AuthenticationService, private router:Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if(!this.authService.isLogged()) {
      this.router.navigateByUrl('/pages/login');
      return false;
    }
    else return true;
  }

}
