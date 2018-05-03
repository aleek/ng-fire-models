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
import { HttpClientModule } from '@angular/common/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observer } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app'

import { AuthService } from './auth.service';
import { User } from './user'
import { LoggedUser } from './loggeduser';
import { environment } from './environment'
import { UserSchema } from './schema';
import { UploadService, UploadTask } from './upload.service';

declare let Zone: any;

describe("User", () => {
  let app: FBApp;
  let afs: AngularFirestore;
  let auth: AngularFireAuth;
  let srv: AuthService;
  let http: HttpClient;
  let uploadSrv: UploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule
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
      HttpClient,
      UploadService
    ],
      (
        _app: FBApp,
        _afs: AngularFirestore,
        _auth: AngularFireAuth,
        _srv: AuthService,
        _http: HttpClient,
        _up: UploadService) => {
        app = _app;
        afs = _afs;
        auth = _auth;
        srv = _srv;
        http = _http;
        uploadSrv = _up;
      })();
  });

  afterEach((done: DoneFn) => {
    app.delete().then(done, done.fail);
  });

  // Ensure we've got an initialized app
  it("receives an initialized app from firebase", () => expect(app).not.toBe(null));
});
