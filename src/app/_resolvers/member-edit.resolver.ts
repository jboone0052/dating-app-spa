import { AuthService } from './../_services/auth.service';
import { AlertifyService } from './../_services/alertify.service';
import { Injectable } from '@angular/core';
import { User } from './../_models/user';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { UserService } from '../_services/user.service';
import 'rxjs/add/operator/catch';

@Injectable()
export class MemberEditResolver implements Resolve<User> {

  constructor(private userService: UserService, private router: Router,
    private alertify: AlertifyService, private authService: AuthService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> {
    return this.userService.getUser(this.authService.decodedToken.nameid).catch(error => {
      this.alertify.error('Problem retrieving data');
      this.router.navigate(['/members']);
      return Observable.of(null);
    });
  }

}
