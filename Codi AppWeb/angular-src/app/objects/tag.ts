import {rArea} from './index';

export class Tag {
	_id: string;
	idTag:string;
    tagname: string;
    coorX: number;
    coorY: number;
    tipoTag: string; 
    restricted: boolean;
    dor: boolean;
    countDor: number;
    tagIn:boolean;
}