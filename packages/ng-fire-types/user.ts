/**
 * Copyright (c) 2018, Aleksander Dutkowski
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * 
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import { Constraints, ConstraintsTypes} from 'validate.js';
import { DocumentReference} from '@firebase/firestore-types'

/**
 * Represents User, using our service.
 */
export interface UserSchema {
  displayname: string;

  /* unique id generated from name */
  nameid: string;

  /* user or organization */
  type: string;
  avatar: string;
  location: string;
  birthday: string;
  gender: string;
  timezone: string;
  bio: string;
  teams: string[];
  routes: string[];
  races: string[];
}

/**
 * Validation constraints for UserSchema
 */
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

export function getEmptyUserObject():UserSchema {
    return {
        displayname: '',
        nameid: '',
        type: '',
        avatar: '',
        location: '',
        birthday: '',
        gender: '',
        timezone: '',
        bio: '',

        teams: [],
        routes: [],
        races: []
    };
}

/**
 * `generateProposedNameIdFromName` converts human readable name of a user
 * to a proposed unique name id, by trimming all white spaces (also inside),
 * lowercasing the string etc. Function caller, must check, if the string
 * produced by this function is unique across the system.
 * 
 * @param name Username
 */
export function generateProposedNameIdFromName(name:string):string {
    return name.trim().toLowerCase().replace(/\s/g, "");
}