import { Injectable }    from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { rArea, Tag, Coordenada } from '../objects/index';

@Injectable()
export class RAreaService {

 private createAreaUrl = 'http://localhost:3000/restrictedareas/registerRestrictedArea';
 private deleteAreaUrl = 'http://localhost:3000/restrictedareas/deletebyId';
 private getAreaUrl= 'http://localhost:3000/restrictedareas/getById';
 private areasUrl= 'http://localhost:3000/restrictedareas/getAllRestrictedAreas';

 isIn: boolean;
 changeView: boolean;

 private headers = new Headers({'Content-Type': 'application/json'});
  constructor(private http: Http) { 
    this.http=http; 
  }

  getRAreaById(id:string): Observable<rArea>{
    const url= `${this.getAreaUrl}/${id}`;
    return this.http.get(url)
        .map(res=>res.json());
  }

  getRAreas(): Observable<rArea[]>{
    return this.http.get(this.areasUrl)
        .map(res=>res.json());
  }
  createAndUpdate(map: rArea): Observable<rArea>{
    let options = new RequestOptions({ headers: this.headers });
    return this.http.post(this.createAreaUrl,  map, options).map(res=>res.json());
  }
  delete(id:string): Observable<rArea>{
    const url= `${this.deleteAreaUrl}/${id}`;
    let options = new RequestOptions({ headers: this.headers });
    return this.http.delete(url, options).map(()=>null);
  }

  checkArea(tag:Tag, rArea: rArea): boolean{
    this.isIn=false;
    this.changeView=false;
    if(rArea.coorX2>rArea.coorX&& rArea.coorY2>rArea.coorY){
      if(rArea.coorX<(tag.coorX) && (tag.coorX)<rArea.coorX2 && rArea.coorY<(tag.coorY) && (tag.coorY) <rArea.coorY2 ){this.isIn=true;}
    }else if(rArea.coorX2>rArea.coorX&& rArea.coorY2<rArea.coorY){
      if(rArea.coorX<(tag.coorX)  && (tag.coorX) <rArea.coorX2 && rArea.coorY2<(tag.coorY)  && (tag.coorY) <rArea.coorY ){this.isIn=true;}
    }else if(rArea.coorX2<rArea.coorX&& rArea.coorY2<rArea.coorY){
      if(rArea.coorX2<(tag.coorX)  && (tag.coorX) <rArea.coorX && rArea.coorY2<(tag.coorY)  && (tag.coorY) <rArea.coorY ){this.isIn=true;}
    }else if(rArea.coorX2<rArea.coorX&& rArea.coorY2>rArea.coorY){
      if(rArea.coorX2<(tag.coorX)  && (tag.coorX) <rArea.coorX && rArea.coorY<(tag.coorY)  && (tag.coorY) <rArea.coorY2 ){this.isIn=true;}
    }else{}

    if(this.isIn&&!tag.restricted){
      //console.log(tag.tagname+" shouldn't be in area "+ rArea.areaname+" !!!");
      this.changeView=true;
    }
    return this.changeView;
  }

}