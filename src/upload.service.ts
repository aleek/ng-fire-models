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