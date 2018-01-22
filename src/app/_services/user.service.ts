import { Message } from './../_models/message';
import { PaginatedResult } from './../_models/pagination';
import { JwtHelper, AuthHttp } from 'angular2-jwt';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { User } from '../_models/user';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class UserService {
  baseUrl = environment.apiUrl;

  constructor(private authHttp: AuthHttp) { }

  getUsers(page?: number, itemsPerPage?: number, userParams?: any, likesParam?: string) {
    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();
    let queryString = '?';

    if (page != null && itemsPerPage != null) {
      queryString += 'pageNumber=' + page + '&pageSize=' + itemsPerPage + '&';
    }

    if (likesParam === 'likers') {
      queryString += 'likers=true&';
    }

    if (likesParam === 'likees') {
      queryString += 'likees=true&';
    }

    if (userParams != null) {
      queryString += 'minAge=' + userParams.minAge + '&maxAge=' + userParams.maxAge +
      '&gender=' + userParams.gender + '&orderBy=' + userParams.orderBy;
    }



    return this.authHttp.get(this.baseUrl + 'users' + queryString)
      .map((response: Response) => {
        paginatedResult.result = response.json();
        if (response.headers.get('pagination') != null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('pagination'));
        }
        return paginatedResult;
      })
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
    return this.authHttp.delete(this.baseUrl + 'users/ ' + userId + '/photos/' + photoId)
      .catch(this.handleError);
  }

  sendLike(id: number, recipientId: number) {
    return this.authHttp.post(this.baseUrl + 'users/' + id + '/like/' + recipientId, {})
      .catch(this.handleError);
  }

  getMessages(userId: number, page?: number, itemsPerPage?: number, messageContainer?: string) {
    const paginatedResult: PaginatedResult<Message[]> = new PaginatedResult<Message[]>();
    let queryString = '?messageContainer=' + messageContainer + '&';

    if (page != null && itemsPerPage != null) {
      queryString += 'pageNumber=' + page + '&pageSize=' + itemsPerPage + '&';
    }

    return this.authHttp.get(this.baseUrl + 'users/' + userId + '/messages' + queryString).map((response: Response) => {
      paginatedResult.result = response.json();
        if (response.headers.get('pagination') != null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('pagination'));
        }
        return paginatedResult;
    }).catch(this.handleError);
  }

  getMessageThread(userId: number, recipientId: number) {
    return this.authHttp.get(this.baseUrl + 'users/' + userId + '/messages/thread/' + recipientId).map((response: Response) => {
      return response.json();
    }).catch(this.handleError);
  }

  sendMessage(id: number, message: Message) {
    return this.authHttp.post(this.baseUrl + 'users/' + id + '/messages', message).map((response: Response) => {
      return response.json();
    }).catch(this.handleError);
  }
  private handleError(error: any) {
    if (error.status === 400) {
      return Observable.throw(error._body);
    }
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



