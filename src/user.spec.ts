/*
import 'core-js/es6';
import 'core-js/es7/reflect';
import 'reflect-metadata';

import 'zone.js/dist/zone';
import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/proxy';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/jasmine-patch';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';

import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

import * as schema from "./schema" 

TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
 */
import { AngularFirestoreModule, AngularFirestore } from 'angularfire2/firestore';
import { FirebaseApp, FirebaseAppConfig, AngularFireModule } from 'angularfire2';
import { FirebaseApp as FBApp } from '@firebase/app-types';
import { TestBed, inject } from '@angular/core/testing';

import { User } from './user'
import { environment } from './environment'


declare let Zone: any;
  
describe("User", () => {
     let app: FBApp;
    let afs: AngularFirestore;
    beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [
            AngularFireModule.initializeApp(environment.firebase),
            AngularFirestoreModule.enablePersistence()
          ]
        });
        inject([FirebaseApp, AngularFirestore], (_app: FBApp, _afs: AngularFirestore) => {
          app = _app;
          afs = _afs;
        })();
      });
 
    it("should be true", () => {
      expect(true).toBe(true);
    });

/*     it("Should create empty object", () => {
        let u:User = new User(null, null, null);
    }); */
  }); 