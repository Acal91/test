import { SaveVehicle } from './../models/vehicle';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private readonly vehiclesEndpoint = '/api/vehicles';

  constructor(private http: HttpClient) { }

  getMakes(){
    var vehicle =  this.http.get('/api/makes').pipe(map(result => result));
    console.log(vehicle);
    return vehicle;
  }

  getFeatures(){
    return this.http.get('/api/features').pipe(map( features => features));
  }

  getVehicles(filter){
    return this.http.get(this.vehiclesEndpoint + '?' + this.toQueryString(filter))
                .pipe(map(veh => veh));
  }

  toQueryString(obj){
    var parts = [];
    for(var property in obj){ //za svaki keyvalue pair iz queryString-a  npr MakeId(obj) = 2(property)
      var value = obj[property]; //pristup polju objekta moze i sa obj.property

      if(value != null && value != undefined)
        parts.push(encodeURIComponent(property) + '=' + encodeURIComponent(value)); //dodajemo npr MakeID + = + 2
    }

    return parts.join('&'); //dodaje se umpersend zbog mogucnosti vise filtera odjednom
  }


  getVehicle(id){
    return this.http.get('/api/vehicles/' + id).pipe(map(res => res))
  }

  create(vehicle){
    return this.http.post('/api/vehicles', vehicle).pipe(map((result: Response) => result.json()));
      
  }

  update(vehicle: SaveVehicle){
    return this.http.put('/api/vehicles/' + vehicle.id, vehicle).pipe(map((result: Response) => result.json()));
  }

  remove(id){
    return this.http.delete('/api/vehicles/' + id).pipe(map(res => res));
  }
}
