import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin';

export interface TeamModel {
    /* User readable ID, generated from team name, that is used in URI, i.e. www.sztajfa.cc/teams/Sky.
    id:string;
  
    /* Display name */
    name: string;
    location: string;
    sport: string;
    type: string;
    color: string;
    descr: string;
    confirmed: boolean;
    owner: string;
    stats: any;
    //[members:number]: string;
  };


export const teamOnCreate = functions.firestore.document('teams/{teamId}').onCreate((event:functions.Event<functions.firestore.DeltaDocumentSnapshot>) => {
    var team:TeamModel = event.data.data();

    console.log(event);
});