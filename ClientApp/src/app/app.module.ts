
import { VehicleListFormComponent } from './vechicle-form/vehicle-list-form/vehicle-list-form.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { VehicleService } from './services/vehicle.service';
import { VechicleFormComponent } from './vechicle-form/vechicle-form.component';
import { RouterModule } from '@angular/router';


import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    VechicleFormComponent,
    VehicleListFormComponent
    
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
  
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'vechicles', component: VehicleListFormComponent},
      { path: 'vechicles/new', component: VechicleFormComponent},
      { path: 'vechicles/:id', component: VechicleFormComponent},
      { path: 'counter', component: CounterComponent },
      { path: 'fetch-data', component: FetchDataComponent }
      
    ])
  ],
  providers: [VehicleService],
  bootstrap: [AppComponent]
})
export class AppModule { }
