import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { AuthService } from './services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { SearchService } from './services/search.service';
import { ContextService } from './services/context.service';
import { AuthPage } from './tools/auth.page';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    AuthPage,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular({}),
    { provide: 'AUTH_SERVICE', useClass: AuthService },
    { provide: 'SEARCH_SERVICE', useClass: SearchService },
    { provide: 'CONTEXT_SERVICE', useClass: ContextService }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
