import { Injectable }    from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Map } from '../objects/index';

@Injectable()
export class MapService {

 private createMapUrl = 'http://localhost:3000/maps/registerMap';
 private deleteMapUrl = 'http://localhost:3000/maps/deleteMapbyId';
 private getMapUrl= 'http://localhost:3000/maps/getMapById';
 private mapsUrl= 'http://localhost:3000/maps/getAllMaps';

 private headers = new Headers({'Content-Type': 'application/json'});
  constructor(private http: Http) { 
    this.http=http; 
  }

  getMapById(id:string): Observable<Map>{
    const url= `${this.getMapUrl}/${id}`;
    return this.http.get(url)
        .map(res=>res.json());
  }

  getMaps(): Observable<Map[]>{
    return this.http.get(this.mapsUrl)
        .map(res=>res.json());
  }
  createAndUpdate(map: Map): Observable<Map>{
    let options = new RequestOptions({ headers: this.headers });
    return this.http.post(this.createMapUrl,  map, options).map(res=>res.json());
  }
  delete(id:string): Observable<Map>{
    const url= `${this.deleteMapUrl}/${id}`;
    let options = new RequestOptions({ headers: this.headers });
    return this.http.delete(url, options).map(()=>null);
  }

}