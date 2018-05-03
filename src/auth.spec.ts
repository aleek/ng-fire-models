/**
 * Copyright (C) Sztajfa Aleksander Dutkowski - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Aleksander Dutkowski <adutkowski@sztajfa.cc>, May 2018
 */

import { AngularFirestoreModule, AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage, AngularFireStorageProvider } from 'angularfire2/storage';
import { AngularFireAuth, AngularFireAuthProvider } from 'angularfire2/auth';
import { FirebaseApp, FirebaseAppConfig, AngularFireModule } from 'angularfire2';
import { FirebaseApp as FBApp } from '@firebase/app-types';
import { TestBed, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app'

import { AuthService } from './auth.service';
import { UploadService } from './upload.service';
import { LoggedUser } from './loggeduser';
import { environment } from './environment'

declare let Zone: any;

describe("Auth", () => {
  let app: FBApp;
  let afstore: AngularFirestore;
  let afauth: AngularFireAuth;
  let auth: AuthService;

  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule.enablePersistence()
      ],
      providers: [
        AuthService,
        UploadService,
        AngularFireAuthProvider,
        AngularFireStorageProvider
      ]
    });
    inject([
      FirebaseApp,
      AngularFirestore,
      AngularFireAuth,
      AuthService,
    ],
      (
        _app: FBApp,
        _afstore: AngularFirestore,
        _afauth: AngularFireAuth,
        _auth: AuthService) => {
        app = _app;
        afstore = _afstore;
        afauth = _afauth;
        auth = _auth;
      })();
  });

  afterAll(async (done) => {
    app.delete().then(done, done.fail);
  });

  // Ensure we've got an initialized app
  it("receives an initialized app from firebase", () => expect(app).not.toBe(null));

  let user: LoggedUser = null;
  it("should create user from email and password", (done: DoneFn) => {
    var signup = auth.createNewFromEmailAndPassword("user1@example.com", "123456");

    var luser = auth.currentUser
      .map((u: LoggedUser, index: number) => {
        if (u) {
          user = u;
          return true;
        }
        else {
          user = null;
          return false;
        }
      });

    var success = signup.combineLatest(luser, (signUpSuccess: boolean, userSuccess: boolean) => {
      return signUpSuccess && userSuccess;
    }).subscribe((result: boolean) => {
      if (result) {
        done();
      }
    },
      done.fail
      );
  }, 10000);

  it("should log out", (done: DoneFn) => {
    if (user !== null) {
      user.logout().subscribe(() => done());
    }
    else {
      done();
    }
  });

  it("should not create user with invalid email", (done: DoneFn) => {
    auth.createNewFromEmailAndPassword("user1example.com", "123456")
      .subscribe((success: boolean) => {
        expect(success).not.toBeTruthy();
        done();
      },
      done
      );
  });

  it("should log in", (done: DoneFn) => {
    auth.signInWithEmailAndPassword("user1@example.com", "123456")
      .subscribe((success: boolean) => {
        if (success) {
          done();
        }
      },
      done.fail
      );
  });

  it("should delete user", (done: DoneFn) => {
    if (user == null) {
      done();
    }
    else {
      user.deleteAccount().subscribe(() => {
        done();
      },
        (error: any) => {
          done.fail(error);
        });
    }
  });
});