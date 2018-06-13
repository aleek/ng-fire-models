/**
 * Copyright (C) Sztajfa Aleksander Dutkowski - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Aleksander Dutkowski <adutkowski@sztajfa.cc>, May 2018
 */

import { AngularFireStorage } from 'angularfire2/storage';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireObject } from 'angularfire2/database/interfaces';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { DocumentReference } from '@firebase/firestore-types'
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app'

import { UserSchema } from "../packages/ng-fire-types/user"
import { UploadService, UploadTask } from './upload.service';

/**
 * Habababa
 */
export class User {
  /*
   * Instance of AngularFire db
   */
  public static afs: AngularFirestore;

  private uid: string;


  /**
   * Returns User with specyfic Hash ID
   * @param id Hash ID of user
   */
  public static getById(id: string): Observable<User> {
    return Observable.empty();
  }

  /**
   * Returns user with specyfic NameID - unique id based on his name
   * @param nameid Unique NameID
   */
  public static getByNameId(nameid: string): Observable<User> {
    return Observable.empty();
  }

  protected constructor(protected model: UserSchema, protected doc: AngularFirestoreDocument<UserSchema>,
    protected fbuser: firebase.User) {
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
    return this.model.avatar || "/assets/default-user-avatar.png";
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
