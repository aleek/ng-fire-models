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
import { UserSchema } from './schema';

declare let Zone: any;

describe("User", () => {
  let app: FBApp;
  let afs: AngularFirestore;
  let auth: AngularFireAuth;
  let srv: AuthService;

  beforeAll(() => {
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

  afterAll(async (done) => {
    await app.delete();
    done();
  });

  // Ensure we've got an initialized app
  it("receives an initialized app from firebase", () => expect(app).not.toBe(null));

  it("should be true", () => {
    expect(true).toBe(true);
  });

  let user: LoggedUser;
  it("should create user from email and password", (done: DoneFn) => {
    var signup = LoggedUser.createNewFromEmailAndPassword("user1@example.com", "123456");
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
    })

    /*       .subscribe((fbuser: boolean) => {
            expect(fbuser).toBeTruthy();
            done();
          },
          (error: string) => {
            done.fail(error);
          }); */
    // @TODO merge those observables;
    /*     srv.currentUser.subscribe((u: LoggedUser) => {
          expect(u).not.toBeNull();
          user = u;
          done();
        },
          (error: any) => {
            done.fail(error);
          }); */
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
  it("should not create user with invalid email", (done: DoneFn) => {
    LoggedUser.createNewFromEmailAndPassword("user1example.com", "123456")
      .subscribe((fbuser: boolean) => {
        expect(fbuser).not.toBeTruthy();
        done();
      },
      (error: string) => {
        done();
      });
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

});

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
