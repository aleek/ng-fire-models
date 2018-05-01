/**
 * Copyright (C) Sztajfa Aleksander Dutkowski - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Aleksander Dutkowski <adutkowski@sztajfa.cc>, May 2018
 */

import { AuthService } from './auth.service';
import { AngularFirestoreModule, AngularFirestore } from 'angularfire2/firestore';
import { FirebaseApp, FirebaseAppConfig, AngularFireModule } from 'angularfire2';
import { FirebaseApp as FBApp } from '@firebase/app-types';
import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import * as firebase from 'firebase/app'
import { User, LoggedUser } from './user'
import { environment } from './environment'
import { AngularFireAuth, AngularFireAuthProvider } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { UserSchema } from './schema';
import { UploadService, UploadTask } from './upload.service';
import { Observer } from 'rxjs';
import { AngularFireStorage, AngularFireStorageProvider } from 'angularfire2/storage';

declare let Zone: any;

describe("User", () => {
  let app: FBApp;
  let afs: AngularFirestore;
  let auth: AngularFireAuth;
  let srv: AuthService;
  let http: HttpClient;
  let uploadSrv: UploadService;

  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
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

  afterAll(async (done) => {
    await app.delete();
    done();
  });

  // Ensure we've got an initialized app
  it("receives an initialized app from firebase", () => expect(app).not.toBe(null));

  it("should be true", () => {
    expect(true).toBe(true);
  });

  let user: LoggedUser = null;

  xit("should create user from email and password", (done: DoneFn) => {
    var signup = srv.createNewFromEmailAndPassword("user1@example.com", "123456");

    var luser = srv.currentUser
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

  xit("should log out", (done: DoneFn) => {
    if (user !== null) {
      user.logout().subscribe(() => done());
    }
    else {
      done.fail("Omitting this test");
    }
  });

  xit("should not create user with invalid email", (done: DoneFn) => {
    srv.createNewFromEmailAndPassword("user1example.com", "123456")
      .subscribe((success: boolean) => {
        expect(success).not.toBeTruthy();
        done();
      },
      done
      );
  });

  xit("should log in", (done: DoneFn) => {
    srv.signInWithEmailAndPassword("user1@example.com", "123456")
      .subscribe((success: boolean) => {
        if (success) {
          done();
        }
      },
      done.fail
      );
  });

  xit("should delete user", (done: DoneFn) => {
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

  xit("should change displayName property", (done: DoneFn) => {
    var signup = srv.createNewFromEmailAndPassword("displayname@example.com", "123456")
      .subscribe(null, (error: any) => done.fail(error));

    srv.currentUser.elementAt(0).subscribe((lu: LoggedUser) => {
      lu.displayName = "Hanna Barbera";
    });

    srv.currentUser.elementAt(1).map((lu: LoggedUser) => {
      expect(lu.displayName).toEqual("Hanna Barbera");
      return lu.deleteAccount();
    }).subscribe(() => done());
  });

  it("should change photo property", (done: DoneFn) => {

    srv.createNewFromEmailAndPassword("photo@example.com", "123456")
      .subscribe(null, (error: any) => done.fail(error));

    var downloadPicture: () => Observable<Blob> = () => {
      return Observable.create((observer: Observer<Blob>) => {
        var url = "base/assets/karma.png";
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              //var b = new Blob([xhr.response], { type: "image/png" });
              observer.next(xhr.response);
              observer.complete();
            } else {
              observer.error(xhr.status);
            }
          }
        }
        xhr.open("GET", url, true);
        xhr.responseType = "blob";
        xhr.send(null);
      });
    }
    Observable.zip(srv.currentUser, downloadPicture(),
      (currentUser: LoggedUser, pic: Blob) => {
        console.debug("picture received");
        return currentUser.setAvatar(pic);
      }).mergeMap((task:UploadTask) => {
        return task.downloadUrl;
      }, (_:any, url:string) => {
        console.debug(url);
      }).subscribe(done, done.fail);
    /*     try {
        bla.mergeMap((task:UploadTask) => {
          console.debug("picture uploaded");
          return task.downloadUrl;
        }, (task:UploadTask, url:string) => {
          console.log(url);
          done();
        })
        }
        catch(err) {
          console.error(err);
        } */
    /*     srv.currentUser.elementAt(0).subscribe((lu: LoggedUser) => {
          lu.avatarUrl = "/assets/photo.png";
        });
    
        srv.currentUser.elementAt(1).map((lu: LoggedUser) => {
          expect(lu.photo).toEqual("/assets/photo.png");
          return lu.deleteAccount();
        }).subscribe(() => done()); */
  }, 20000);


});

  /*   it("shoudl obtain user info", (done: DoneFn) => {
    }); */

  /*   it("should delete add users", (done: DoneFn) => {
      let nextPageToken;
      adminApp.auth().listUsers(10, nextPageToken).then((listUserResults: admin.auth.ListUsersResult) => {
        listUserResults.users.forEach(function (userRecord) {
          console.debug(userRecord.toJSON());
        });
  
        done();
      }).catch(function (error) {
        console.log("Error listing users:", error);
        done();
      });
  
    });
  
  
    it("should not create empty User", () => {
      var u = function () {
        return new User(null, null, null);
      };
  
      expect(u).toThrowError(Error);
    }); */


/* it("should create corresponding Firestore entry, after creating a user", (done: DoneFn) => {
  var obs = LoggedUser.createNewFromEmailAndPassword("aledutk2o@com.pl", "123456");
  let user;
  let doc = obs.mergeMap((fbuser: firebase.User) => {
    expect(fbuser).not.toBeNull();
    let doc = afs.doc<UserSchema>("users/" + fbuser.uid);
    return doc.valueChanges().take(1);

    //fbuser.delete(); // this is async
    //done();
  }, (fbuser: firebase.User, model: UserSchema, fi: number, ui: number) => {
    user = fbuser;
    return model;
  });

  doc.subscribe((model: UserSchema) => {
    console.log(model);
  },
    (error: any) => {
      done.fail(error)
    });
  /*     ,
        (error: any) => {
          done.fail(error);
        }); 
}); */


//});



    /*     it("should should sign in example user", () => {
          LoggedUser.initialize(auth, afs);
          LoggedUser.signInFromEmailAndPassword("aleek@com.pl", "1234");
    
        }) */
