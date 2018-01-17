import { JwtHelper, AuthHttp } from 'angular2-jwt';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Http, Headers, RequestOptions } from '@angular/http';
import { User } from '../_models/user';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class UserService {
  baseUrl = environment.apiUrl;

  constructor(private authHttp: AuthHttp) { }

  getUsers(): Observable<User[]> {
    return this.authHttp.get(this.baseUrl + 'users')
      .map(response => <User[]>response.json())
      .catch(this.handleError);
  }

  getUser(id: number): Observable<User> {
    return this.authHttp.get(this.baseUrl + 'users/' + id)
      .map(response => <User>response.json())
      .catch(this.handleError);
  }

  updateUser(id: number, user: User) {
    return this.authHttp.put(this.baseUrl + 'users/' + id, user)
      .catch(this.handleError);
  }

  setMainPhoto(userId: number, photoId: number) {
    return this.authHttp.post(this.baseUrl + 'users/' + userId + '/photos/' + photoId + '/setMain', {})
      .catch(this.handleError);
  }

  deletePhoto(userId: number, photoId: number) {
    return this.authHttp.delete(this.baseUrl + 'users/'+ userId + '/photos/' + photoId)
      .catch(this.handleError);
  }

  private handleError(error: any) {
    const applicationError = error.headers.get('Application-Error');
    if (applicationError) {
      return Observable.throw(applicationError);
    }

    const serverError = error.json();
    let modelStateErrors = '';
    if (serverError) {
      for (const key in serverError) {
        if (serverError[key]) {
          modelStateErrors += serverError[key] + '\n';
        }
      }
    }
    return Observable.throw(
      modelStateErrors || 'Server error'
    );
  }
}



