/**
 * Copyright (C) Sztajfa Aleksander Dutkowski - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Aleksander Dutkowski <adutkowski@sztajfa.cc>, May 2018
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AngularFireStorageModule, AngularFireStorage, AngularFireUploadTask} from 'angularfire2/storage';

export interface UploadedFile {
    path: string,
    mime: string;
    name: string;
    file: Blob;
}

export interface UploadTask {
    percentageChanges: Observable<number>;
    downloadUrl: Observable<string>;
}

@Injectable()
export class UploadService {

    constructor(private storage: AngularFireStorage) { }

    public upload(filename:string, f:Blob): UploadTask {
        let task = this.storage.upload(`${filename}`, f);

        return {
            percentageChanges: task.percentageChanges(),
            downloadUrl: task.downloadURL(),
        };
    }
}