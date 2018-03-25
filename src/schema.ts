import { Constraints, ConstraintsTypes} from 'validate.js';
import { DocumentReference} from '@firebase/firestore-types'

export interface UserSchema {
  displayname: string;

  /* unique id generated from name */
  nameid: string;

  /* user or organization */
  type: string;
  photo: string;
  location: string;
  birthday: string;
  gender: string;
  timezone: string;
  bio: string;
}

export var UserConstraints:Constraints = {
    displayname: {
        presence: true
    }
}

/*
 * When you are using Firestore, you can store references for objects.
 * For example Group can store list of associated users as a array of idstrings,
 * or array of References to objects. In the latter case, the array would look like this:
 */
export interface UsersRef {
    [userid:string]: DocumentReference
}


export interface MyDB {
    users: {
        [userid:string]: UserSchema;
    }
}