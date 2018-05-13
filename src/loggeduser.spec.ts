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
import { downloadFile, readFileAsBinString } from './utils';

declare let Zone: any;

describe("LoggedUser", () => {
    /**
     * Set long time for triggering Firebase Cloud Functions,
     * because they might be in cold state:
     * https://stackoverflow.com/a/42727012/1062491
     */
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
    let app: FBApp;
    let afs: AngularFirestore;
    let auth: AngularFireAuth;
    let srv: AuthService;
    let http: HttpClient;
    let uploadSrv: UploadService;
    let user: LoggedUser = null;

    beforeEach(async (done: DoneFn) => {
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

        srv.createNewFromEmailAndPassword("logged.user.spec@example.com", "123456")
            .subscribe(null, done.fail);
        srv.currentUser.take(1).subscribe((u: LoggedUser) => {
            user = u;
            done()
        }, done.fail);
    });

    afterEach((done: DoneFn) => {
        user.deleteAccount().mergeMap(() => {
            return Observable.fromPromise(app.delete()).take(1);
        })
            .subscribe(() => {
                done()
            }
            , done.fail);
    });

    // Ensure we've got an initialized app
    it("receives an initialized app from firebase", () => expect(app).not.toBe(null));

    it("should change displayName property", (done: DoneFn) => {
        srv.currentUser.elementAt(0).subscribe((lu: LoggedUser) => {
            lu.displayName = "Hanna Barbera";
        });

        srv.currentUser.elementAt(1).map((lu: LoggedUser) => {
            expect(lu.displayName).toEqual("Hanna Barbera");
        }).subscribe(done, done.fail);
    });

    it("should change photo property", (done: DoneFn) => {
        let originalPicture: Blob;

        downloadFile("base/assets/karma.png").map((pic: Blob) => {
            originalPicture = pic
            return user.setAvatar(pic);
        }).mergeMap((task: UploadTask) => {
            return task.downloadUrl;
        })
        .mergeMap((url: string) => {
            return downloadFile(url);
        })
        .mergeMap((pic2: Blob) => {
            return readFileAsBinString(pic2)
        })
        .mergeMap((pic2: string) => {
            return readFileAsBinString(originalPicture);
        }, (pic2: string, pic1: string) => {
            if (pic1 == pic2) return Observable.empty()
            else return Observable.throw("Pictures differ");
        }).subscribe(done, done.fail);

    });
});
