import { Message } from './../_models/message';
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
import { AuthService } from '../_services/auth.service';

@Injectable()
export class MessageResolver implements Resolve<Message[]> {

  pageSize = 5;
  pageNumber = 1;
messageContainer = 'unread';

  constructor(
    private userService: UserService,
    private router: Router,
    private alertify: AlertifyService,
    private authService: AuthService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Message[]> {
      return this.userService.getMessages(this.authService.decodedToken.nameid, this.pageNumber,
        this.pageSize, this.messageContainer).catch(error => {
      this.alertify.error('Problem retrieving data');
      this.router.navigate(['/home']);
      return Observable.of(null);
    });
  }
}
