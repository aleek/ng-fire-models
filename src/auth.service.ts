import { LoggedUser } from './user';
import { Injectable } from '@angular/core';
import * as Rx from 'rxjs/Rx';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase/app'
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {
    private _currentUser: LoggedUser;

    private currentUserObservable: Rx.Observable<LoggedUser>;

    private auth: AngularFireAuth;
    private firestore: AngularFirestore;

    constructor(auth: AngularFireAuth, firestore: AngularFirestore) {
        this.auth = auth;
        this.firestore = firestore;

        LoggedUser.initialize(auth, firestore);

        this.currentUserObservable = this.auth.authState.mergeMap(LoggedUser.fromFirebaseUser,
            (fbuser: firebase.User, user: LoggedUser, fi: number, ui: number) => {
                return user;
            }).share();

        this.currentUserObservable.subscribe((user:LoggedUser) => {
            this._currentUser = user;
        });

    }

    get currentUser():Rx.Observable<LoggedUser> {
        return this.currentUserObservable;
    }
}