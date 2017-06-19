import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

import { AlertService } from '../services/index';

import { Map } from '../objects/index';

@Component({
    moduleId: module.id,
    selector: 'newmap',
    templateUrl: '../templates/newmap.component.html'
})

export class NewMapComponent {

	@Output() onSave = new EventEmitter<Map>();
	@Output() onCancel = new EventEmitter();

	createMap(entry:number){
		this.onSave.emit();

    }

    exit(){
    	this.onCancel.emit();
    }

    ////// ON WORK ////// 
}