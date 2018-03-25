import { AuthService } from './auth.service';
import { AngularFirestoreModule, AngularFirestore } from 'angularfire2/firestore';
import { FirebaseApp, FirebaseAppConfig, AngularFireModule } from 'angularfire2';
import { FirebaseApp as FBApp } from '@firebase/app-types';
import { TestBed, inject } from '@angular/core/testing';

import * as firebase from 'firebase/app'
import { User, LoggedUser } from './user'
import { environment } from './environment'
import { AngularFireAuth, AngularFireAuthProvider } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';


declare let Zone: any;

describe("User", () => {
  let app: FBApp;
  let afs: AngularFirestore;
  let auth: AngularFireAuth;
  let srv: AuthService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule.enablePersistence()
      ],
      providers: [
        AuthService,
        AngularFireAuthProvider,
      ]
    });
    inject([FirebaseApp, AngularFirestore, AngularFireAuth, AuthService],
      (_app: FBApp, _afs: AngularFirestore, _auth: AngularFireAuth, _srv: AuthService) => {
        app = _app;
        afs = _afs;
        auth = _auth;
        srv = _srv;
      })();
  });
  afterEach(async (done) => {
    await app.delete();
    done();
  });

  it("should be true", () => {
    expect(true).toBe(true);
  });

  it("should not create empty User", () => {
    var u = function () {
      return new User(null, null, null);
    };

    expect(u).toThrowError(Error);
  });

  it("should create user from email and password", (done: DoneFn) => {
    var obs = LoggedUser.createNewFromEmailAndPassword("aledutko@com.pl", "123456");
    obs.subscribe((fbuser: firebase.User) => {
      expect(fbuser).not.toBeNull();
      done();
    },
      (error: any) => {
        done.fail(error);
      });
    });



    /*     it("should should sign in example user", () => {
          LoggedUser.initialize(auth, afs);
          LoggedUser.signInFromEmailAndPassword("aleek@com.pl", "1234");
    
        }) */
  }); 