/**
 * Copyright (C) Sztajfa Aleksander Dutkowski - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Aleksander Dutkowski <adutkowski@sztajfa.cc>, May 2018
 */
import { User } from "./user"
import { AngularFireStorage } from 'angularfire2/storage';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireObject } from 'angularfire2/database/interfaces';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { DocumentReference } from '@firebase/firestore-types'
import * as firebase from 'firebase/app'
import { Observable } from 'rxjs/Observable';

import { UserSchema } from "./schema"
import { UploadService, UploadTask } from './upload.service';
import * as Rx from 'rxjs/Rx';


/*
 * Due to the bug in TypeScript implementation, we must copy all getters from parent class.
 * @todo Maybe we can do it better?
 * @see https://github.com/Microsoft/TypeScript/issues/338
 */
export class LoggedUser extends User {

  protected model: UserSchema;
  protected auth: AngularFireAuth;
  protected uploadService: UploadService;

  public constructor(model: UserSchema,
    doc: AngularFirestoreDocument<UserSchema>,
    fbuser: firebase.User,
    auth: AngularFireAuth,
    uploadService: UploadService) {
    super(model, doc, fbuser);
    this.auth = auth;
    this.uploadService = uploadService;
  }

  public logout(): Observable<void> {
    return Observable.fromPromise<void>(this.auth.auth.signOut());
  }

  /**
   * @todo remember to support reauthenticate user
   * https://firebase.google.com/docs/auth/web/manage-users#re-authenticate_a_user
   */
  public deleteAccount(): Rx.Observable<any> {
    return Rx.Observable.fromPromise(this.fbuser.delete());
  }

  /* schema fields getters and setters */
  get displayName(): string {
    return this.model.displayname;
  }

  set displayName(n: string) {
    if (n == this.model.displayname) return;

    this.doc.update({ displayname: n });
  }

  get nameId(): string {
    return this.model.nameid;
  }

  set nameId(v: string) {
    this.doc.update({ nameid: v });
  }

  get type(): string {
    return this.model.type;
  }

  set type(v: string) {
    this.doc.update({ type: v });
  }

  get location(): string {
    return this.model.location;
  }

  set location(v: string) {
    this.doc.update({ location: v });
  }

  get birthday(): string {
    return this.model.birthday;
  }

  set birthday(v: string) {
    this.doc.update({ birthday: v });
  }

  get gender(): string {
    return this.model.gender;
  }

  set gender(v: string) {
    this.doc.update({ gender: v });
  }

  get timezone(): string {
    return this.model.timezone;
  }

  set timezone(v: string) {
    this.doc.update({ timezone: v });
  }

  get bio(): string {
    return this.model.bio;
  }

  set bio(v: string) {
    this.doc.update({ bio: v });
  }

  get avatarUrl(): string {
    return this.model.avatar;
  }

  set avatarUrl(v: string) {
    this.doc.update({ avatar: v });
  }

  private _avatarUploadTask:UploadTask = null;
  set avatar(v:Blob) {
    this._avatarUploadTask = this.uploadService.upload(`/users/avatars/abc.png`, v);
    this._avatarUploadTask.downloadUrl.share().subscribe((url: string) => {
      this.avatarUrl = url;
    });
  }

  get avatar(): Blob {
    //return this.model.photo;
    return null;
  }

  get avatarUploadTask():UploadTask {
    return this._avatarUploadTask;
  }

  set _model(v:Partial<UserSchema>) {
    this.doc.update(v);

  }
}
