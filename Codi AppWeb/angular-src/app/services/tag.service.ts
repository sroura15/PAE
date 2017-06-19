import { Injectable }    from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Tag } from '../objects/index';
import { FrontTag } from '../objects/index';

@Injectable()
export class TagService {

  private tagsUrl = 'http://localhost:3000/tags/getAllTags';
  private deleteTagUrl = 'http://localhost:3000/tags/deleteTagbyId';
  private getTagUrl= 'http://localhost:3000/tags/getTagById';
  private createTagUrl = 'http://localhost:3000/tags/registertag';

  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) { 
    this.http=http; 
  }

  getTagById(id:string): Observable<Tag>{
    const url= `${this.getTagUrl}/${id}`;
    return this.http.get(url)
        .map(res=>res.json());
  }
  
  getTags(): Observable<Tag[]>{
    return this.http.get(this.tagsUrl)
        .map(res=>res.json());
  }

  createAndUpdate(tag: Tag): Observable<Tag>{
    let options = new RequestOptions({ headers: this.headers });
    return this.http.post(this.createTagUrl,  tag, options).map(res=>res.json());
  }

  delete(id:string): Observable<Tag>{
    const url= `${this.deleteTagUrl}/${id}`;
    let options = new RequestOptions({ headers: this.headers });
    return this.http.delete(url, options).map(()=>null);
  }

  
}