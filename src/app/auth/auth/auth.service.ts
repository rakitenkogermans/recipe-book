import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {BehaviorSubject, Subject, throwError} from 'rxjs';
import {User} from './user.model';
import {Router} from '@angular/router';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable()
export class AuthService {
  user = new BehaviorSubject<User>(null);
  // token: string = null;

  constructor(private http: HttpClient, private router: Router) {
  }

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDVp7lpN_k3QGSfo6LF_QYPbCG6D94MGHE',
      {
        email: email,
        password: password,
        returnSecureToken: true
      }).pipe(catchError(errorResponse => {
        let errorMsg = 'An unknown error occurred!';
        if (!errorResponse.error || !errorResponse.error.error) {
          return throwError(errorMsg);
        }
        switch (errorResponse.error.error.message) {
          case 'EMAIL_EXISTS':
            errorMsg = 'This email already exists!';
            break
          case 'OPERATION_NOT_ALLOWED':
            errorMsg = 'This operation is not allowed!';
            break;
        }
        return throwError(errorMsg);
    }), tap(responseData => {
      this.handleAuthentication(responseData.email, responseData.localId, responseData.idToken, +responseData.expiresIn);
    }));
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDVp7lpN_k3QGSfo6LF_QYPbCG6D94MGHE',
      {
        email: email,
        password: password,
        returnSecureToken: true
      }).pipe(catchError(this.handleError), tap(responseData => {
        this.handleAuthentication(responseData.email, responseData.localId, responseData.idToken, +responseData.expiresIn);
      }));
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['./auth']);
  }

  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
    const user = new User(
      email,
      userId,
      token,
      expirationDate
    );
    this.user.next(user);
  }

  private handleError(errorResponse: HttpErrorResponse) {
    let errorMsg = 'An unknown error occurred!';
    if (!errorResponse.error || !errorResponse.error.error) {
      return throwError(errorMsg);
    }
    switch (errorResponse.error.error.message) {
      case 'EMAIL_NOT_FOUND':
        errorMsg = 'There is no user with this email address!';
        break
      case 'INVALID_PASSWORD':
        errorMsg = 'Invalid password!';
        break;
      case 'USER_DISABLED':
        errorMsg = 'The user account has been disabled by an administrator.';
        break;
    }
    return throwError(errorMsg);
  }
}
