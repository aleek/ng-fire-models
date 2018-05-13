import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs';

export function downloadFile(url: string): Observable<Blob> {
    return Observable.create((observer: Observer<Blob>) => {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    //var b = new Blob([xhr.response], { type: "image/png" });
                    observer.next(xhr.response);
                    observer.complete();
                } else {
                    observer.error(xhr.status);
                }
            }
        }
        xhr.open("GET", url, true);
        xhr.responseType = "blob";
        xhr.send(null);
    });
}

export function readFileAsBinString(b: Blob): Observable<string> {
    return Observable.create((observer: Observer<string>) => {
        let reader = new FileReader();
        reader.onloadend = () => {
            observer.next(reader.result);
            observer.complete()
        };
        reader.onerror = () => {
            observer.error(null);
            observer.complete();
        }
        reader.readAsBinaryString(b);
    });
}