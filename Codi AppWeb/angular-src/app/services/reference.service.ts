import { Injectable }    from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Reference } from '../objects/index';

@Injectable()
export class ReferenceService {

 private createRefUrl = 'http://localhost:3000/references/registerReference';
 private deleteRefUrl = 'http://localhost:3000/references/deleteReferencebyId';
 private getRefUrl= 'http://localhost:3000/references/getReferenceById';
 private refsUrl= 'http://localhost:3000/references/getAllReferences';

 private headers = new Headers({'Content-Type': 'application/json'});
  constructor(private http: Http) { 
    this.http=http; 
  }

  getRefById(id:string): Observable<Reference>{
    const url= `${this.getRefUrl}/${id}`;
    return this.http.get(url)
        .map(res=>res.json());
  }

  getReferences(): Observable<Reference[]>{
    return this.http.get(this.refsUrl)
        .map(res=>res.json());
  }
  createAndUpdate(ref: Reference): Observable<Reference>{
    let options = new RequestOptions({ headers: this.headers });
    return this.http.post(this.createRefUrl,  ref, options).map(res=>res.json());
  }
  delete(id:string): Observable<Reference>{
    const url= `${this.deleteRefUrl}/${id}`;
    let options = new RequestOptions({ headers: this.headers });
    return this.http.delete(url, options).map(()=>null);
  }

}