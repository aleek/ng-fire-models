import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireObject } from 'angularfire2/database/interfaces';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { DocumentReference } from '@firebase/firestore-types'

import * as firebase from 'firebase/app'

import { UserSchema } from "./schema"
//import { Observable } from 'rxjs/Observable';
import * as Rx from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';

/**
 * Habababa
 */
export class User {
  /*
   * Instance of AngularFire db
   */
  public static afs: AngularFirestore; // = null;

  private uid: string;


  public static getById(id: string): Rx.Observable<User> {
    return Rx.Observable.empty();
  }

  public static getByNameId(nameid: string): Rx.Observable<User> {
    return null;
  }

  public constructor(protected model: UserSchema, private doc: AngularFirestoreDocument<UserSchema>, protected fbuser: firebase.User) {
    if (model == null) {
      throw new Error("Cannot create User object with empty model parameter");
    }
    else if (doc == null) {
      throw new Error("Cannot create User object with empty doc parameter");
    }
    else if (fbuser == null) {
      throw new Error("Cannot create User object with empty fbuser parameter");
    }
    this.uid = fbuser.uid;
  }


  protected onPropertyChangeError(property: string, error: any) {
    console.log(error);
  }

  /*
   * Unique push id, generated by firebase
   * 
   * @readonly
   */
  get id(): string {
    return this.uid;
  }

  /*
   * Unique id generated from displayname
   */
  get nameid() {
    return this.model.nameid;
  }

  /*
   * Pretty name
   */
  public get displayName(): string {
    return this.model.displayname;
  }

  /*
   * Absolute path to avatar file
   */
  get photoUrl(): string {
    return this.model.photo || "/assets/default-user-avatar.png";
  }

  get birthday(): string {
    return this.model.birthday;
  }

  get location(): string {
    return this.model.location;
  }

  get gender(): string {
    return this.model.gender;
  }

  /*   get ref(): DocumentReference {
      return this.afo.ref;
    } */
}

/*
 * Due to the bug in TypeScript implementation, we must copy all getters from parent class.
 * @todo Maybe we can do it better?
 * @see https://github.com/Microsoft/TypeScript/issues/338
 */
export class LoggedUser extends User {

  protected model: UserSchema;

  private static auth: AngularFireAuth = null;
  private static firestore: AngularFirestore;


  //private afo:AngularFirestoreDocument<UserSchema>;

  public static initialize(auth: AngularFireAuth, firestore: AngularFirestore) {
    LoggedUser.auth = auth;
    LoggedUser.firestore = firestore;

    // LoggedUser.auth.authState.map(LoggedUser.processAuthStateChange); //.mergeMap(LoggedUser.processAuthStateChange1, LoggedUser.processAuthStateChange2);
  }

  public static createNewFromEmailAndPassword(email: string, password: string): Rx.Observable<firebase.User> {
    if (!LoggedUser.initialized()) {
      throw "LoggedUser.auth property is missing";
    }
    return <Observable<firebase.User>>Observable.fromPromise(this.auth.auth.createUserWithEmailAndPassword(email, password));
  }

  public static signInFromEmailAndPassword(email: string, password: string): Rx.Observable<LoggedUser> {
    if (!LoggedUser.initialized()) {
      throw "LoggedUser.auth property is missing";
    }
    var a = Rx.Observable.fromPromise(LoggedUser.auth.auth.signInWithEmailAndPassword(email, password));
    return null;
  }

  public static fromFirebaseUser(fbuser: firebase.User): Rx.Observable<LoggedUser> {
    if (fbuser) {
      let doc = LoggedUser.firestore.doc<UserSchema>("users/" + fbuser.uid);
      return doc.valueChanges().take(1).map((model: UserSchema) => {
        console.log("MODELLLL");
        console.log(model);
        return new LoggedUser(model, doc, fbuser);
      });
    }
    return Rx.Observable.empty();
  }

  /**
   * @todo remomber to support reauthenticate user
   * https://firebase.google.com/docs/auth/web/manage-users#re-authenticate_a_user
   */
  public deleteAccount(): Rx.Observable<any> {
    return Rx.Observable.fromPromise(this.fbuser.delete());
  }

  /**
   * processAuthStateChange 
   * @param fbuser 
   */
  private static processAuthStateChange(fbuser: firebase.User, index: number): Rx.Observable<LoggedUser> {
    if (fbuser) {
      let doc = LoggedUser.firestore.doc<UserSchema>("users/" + fbuser.uid);
      return doc.valueChanges().take(1).map((model: UserSchema) => {
        console.log("MODEL" + model);
        return new LoggedUser(model, doc, fbuser);
      });
    }
    return Rx.Observable.empty();
  }

  /*   private static processAuthStateChange1(fbuser: firebase.User, i: number): Rx.Observable<UserSchema> {
      if (fbuser) {
        let doc = LoggedUser.firestore.doc<UserSchema>("users/" + fbuser.uid);
      }
    }
  
    private static processAuthStateChange2(fbuser: firebase.User, um: UserSchema, fbindex: number, umindex: number) {
      return new LoggedUser(um, ref, fbuser);
    } */

  public constructor(model: UserSchema, doc: AngularFirestoreDocument<UserSchema>, fbuser: firebase.User) {
    super(model, doc, fbuser);

  }

  private static initialized(): boolean {
    return (LoggedUser.auth != null) && (LoggedUser.firestore != null);
  }
}