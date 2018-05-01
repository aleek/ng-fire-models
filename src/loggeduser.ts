/**
 * Copyright (C) Sztajfa Aleksander Dutkowski - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Aleksander Dutkowski <adutkowski@sztajfa.cc>, May 2018
 */

/*
 * Due to the bug in TypeScript implementation, we must copy all getters from parent class.
 * @todo Maybe we can do it better?
 * @see https://github.com/Microsoft/TypeScript/issues/338
 */
export class LoggedUser extends User {

  protected model: UserSchema;
  protected auth: AngularFireAuth;
  protected uploadService:UploadService;

  /*   private static auth: AngularFireAuth = null;
    private static firestore: AngularFirestore; */

  public constructor(model: UserSchema,
    doc: AngularFirestoreDocument<UserSchema>,
    fbuser: firebase.User,
    auth: AngularFireAuth,
    uploadService:UploadService) {
    super(model, doc, fbuser);
    this.auth = auth;
    this.uploadService = uploadService;
    console.debug("Created new LoggedUser object");
  }

  public logout():Observable<void> {
    return Observable.fromPromise<void>(this.auth.auth.signOut());
  }

  /**
   * @todo remomber to support reauthenticate user
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

  get avatar():Blob {
    //return this.model.photo;
    return null;
  }

  private userAvatarDir:string = "/users/avatars";
  public  setAvatar(p:Blob) {
    let task:UploadTask = this.uploadService.upload(`/users/avatars/abc.png`, p);
    task.downloadUrl.subscribe((url:string)=> {
      this.avatarUrl = url;
    });
    return task;
  }

  get avatarUrl():string {
    return this.model.photo;
  }

  set avatarUrl(url:string) {
    if (url == this.model.photo) return;

    this.doc.update({ photo: url });
  }

}