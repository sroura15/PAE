import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { HttpModule } from '@angular/http';

// used to create fake backend
import { fakeBackendProvider } from './objects/index';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BaseRequestOptions } from '@angular/http';

import { AppComponent }  from './app.component';
import { routing }        from './app.routing';

import { AlertComponent, HomeComponent, LoginComponent, RegisterComponent, OptionsComponent, NewMapComponent } from './components/index';
import { AuthGuard } from './guards/index';
import { Coordenada } from './objects/coordenada';
import { TagService, AlertService, AuthenticationService, UserService, ConversorService, MapService, RAreaService, ReferenceService} from './services/index';


@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        routing

    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        LoginComponent,
        RegisterComponent,
        OptionsComponent,
        NewMapComponent
        
    ],
    providers: [
        AuthGuard,
        AlertService,
        AuthenticationService,
        UserService,
        TagService,
        ConversorService,
        MapService,
        RAreaService,
        ReferenceService,

        // providers used to create fake backend
        fakeBackendProvider,
        MockBackend,
        BaseRequestOptions,
        Coordenada
        
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }