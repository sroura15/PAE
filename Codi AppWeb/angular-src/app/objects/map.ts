import {Tag, Reference} from './index';

export class Map {
	_id: string;
	mapname: string;
    image: string;
    height: number;
    width: number;
    references: Reference[];
    scale: number;
}