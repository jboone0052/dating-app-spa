import { AlertifyService } from './../_services/alertify.service';
import { Injectable } from '@angular/core';
import { User } from './../_models/user';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { UserService } from '../_services/user.service';
import 'rxjs/add/operator/catch';

@Injectable()
export class ListResolver implements Resolve<User[]> {

  pageSize = 5;
  pageNumber = 1;
  likesParam = 'likers';

  constructor(
    private userService: UserService,
    private router: Router,
    private alertify: AlertifyService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<User[]> {
    return this.userService.getUsers(this.pageNumber, this.pageSize, null, this.likesParam).catch(error => {
      this.alertify.error('Problem retrieving data');
      this.router.navigate(['/home']);
      return Observable.of(null);
    });
  }
}
