import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

import { AlertService } from '../services/index';

@Component({
    moduleId: module.id,
    selector: 'options',
    templateUrl: '../templates/options.component.html'
})

export class OptionsComponent {

	@Output() onResponse = new EventEmitter<number>();
	@Output() onCancel= new EventEmitter();

	mapScale(entry:number){
		this.onResponse.emit(entry);

    }

    exit(){
    	this.onCancel.emit();
    }
}