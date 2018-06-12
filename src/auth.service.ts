/**
 * Copyright (C) Sztajfa Aleksander Dutkowski - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Aleksander Dutkowski <adutkowski@sztajfa.cc>, May 2018
 */

import { Injectable } from "@angular/core";
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFirestore, Action } from "angularfire2/firestore";
import { AngularFireStorage } from "angularfire2/storage";
import * as firebase from "firebase/app";
import { Observable } from "rxjs/Observable";
import * as Rx from "rxjs/Rx";

import { UserSchema } from "./schema";
import { UploadService } from "./upload.service";
import { LoggedUser } from "./loggeduser";
import { DocumentSnapshot } from "@firebase/firestore-types";

interface Error {
  code: string;
  message: string;
}

@Injectable()
export class AuthService {
  private _currentUser: LoggedUser;

  private currentUserObservable: Rx.Observable<LoggedUser>;

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private uploadServie: UploadService
  ) {
    this.currentUserObservable = this.auth.authState
      .filter((fbuser: firebase.User) => {
        return fbuser != null;
      })
      .mergeMap(
        this.fromFirebaseUser.bind(this),
        (fbuser: firebase.User, user: LoggedUser, fi: number, ui: number) => {
          return user;
        }
      );

    this.currentUserObservable.share().subscribe(
      (user: LoggedUser) => {
        this._currentUser = user;
      },
      (error: any) => {
        console.log("Error obtaining User object");
      }
    );
  }

  get currentUser(): Rx.Observable<LoggedUser> {
    return this.currentUserObservable.share();
  }

  /**
   *
   * @param email valid email address
   * @param password password
   */
  public createNewFromEmailAndPassword(
    name: string,
    email: string,
    password: string
  ): Observable<any> {
    return Observable.fromPromise(
      this.auth.auth.createUserWithEmailAndPassword(email, password)
    )
      .filter((fbuser: firebase.User) => {
        console.log("Filter 1:", fbuser != null);
        return fbuser != null;
      })
      .mergeMap((fbuser: firebase.User) => {
        console.log("2");
        return this.firestore
          .doc<UserSchema>("users/" + fbuser.uid)
          .snapshotChanges();
      })
      .filter((a: Action<DocumentSnapshot>) => {
        console.log("Filter 2:", a.payload.exists);
          return a.payload.exists;
      })
      .map((a: Action<DocumentSnapshot>) => {
        console.log("ACTION!");
          return Observable.fromPromise(a.payload.ref.update({ displayname: name }));
      })
      .map(() => { return true; });

    /* 
          .update({ displayname: name });
             .catch((error: firebase.auth.Error) => {
                let err: Error;
                if (this.authErrorMsgs.hasOwnProperty(error.code)) {
                    err = this.authErrorMsgs[error.code];
                }
                else {
                    err = this.authErrorMsgs['auth/unknown'];
                }
                return Observable.throw(err);
            });  */
  }

  /**
   * Signs with an email and password
   * @param email e-mail
   * @param password very strong password
   */
  public signInWithEmailAndPassword(
    email: string,
    password: string
  ): Rx.Observable<boolean> {
    return <Rx.Observable<boolean>>Rx.Observable.fromPromise(
        <Promise<firebase.User>>this.auth.auth.signInWithEmailAndPassword(email, password))
      .map((fbuser: firebase.User) => {
        if (fbuser) {
          return true;
        }
        // most likely it'll never return false, but throw an error
        return false;
      })
      .catch((error: firebase.auth.Error) => {
        let err: Error;
        if (this.authErrorMsgs.hasOwnProperty(error.code)) {
          err = this.authErrorMsgs[error.code];
        } else {
          err = this.authErrorMsgs["auth/unknown"];
        }
        return Observable.throw(err);
      });
  }

  public fromFirebaseUser(fbuser: firebase.User): Rx.Observable<LoggedUser> {
      let doc = this.firestore.doc<UserSchema>("users/" + fbuser.uid);
      return doc
        .valueChanges()
        .filter((model: UserSchema) => {
          return model != null;
        })
        .map((model: UserSchema) => {
          return new LoggedUser(
            model,
            doc,
            fbuser,
            this.auth,
            this.uploadServie
          );
        });
  }
  /**
   * Firebase to our error mapping
   */
  public readonly authErrorMsgs: {
    [code: string]: Error;
  } = {
    "auth/email-already-in-use": {
      code: "auth/email-already-in-use",
      message: "Unfortunately, this email is already in use."
    },
    "auth/invalid-email": {
      code: "auth/invalid-email",
      message:
        "It seems like this email address is not properly written. If you are certain that it is OK, please contact our support."
    },
    "auth/user-disabled": {
      code: "auth/user-disabled",
      message:
        "This account is currently disabled. Please contact support center."
    },
    "auth/user-not-found": {
      code: "auth/user-not-found",
      message: "Username of password is incorrect."
    },
    "auth/operation-not-allowed": {
      code: "auth/operation-not-allowed",
      message:
        "We are very sorry, but you are not allowed to perform this operation."
    },
    "auth/weak-password": {
      code: "auth/weak-password",
      message: "The password you entered is too weak."
    },
    "auth/wrong-password": {
      code: "auth/wrong-password",
      message: "Entered username or password is incorect."
    },
    "auth/unknown": {
      code: "auth/unknown",
      message:
        "We don't exacly know what's happend, but we are working on it!. Please try again in couple of minutes."
    }
  };
}
