import { Vehicle, KeyValuePair } from './../../models/vehicle';
import { Component, OnInit } from '@angular/core';
import { VehicleService } from 'src/app/services/vehicle.service';

@Component({
  selector: 'app-vehicle-list-form',
  templateUrl: './vehicle-list-form.component.html',
  styleUrls: ['./vehicle-list-form.component.css']
})
export class VehicleListFormComponent implements OnInit {
  vehicles: Vehicle[];
  makes:KeyValuePair[];
  query: any = {
  };
  columns = [
    {title: 'Id'},
    {title: 'Make', key:'make', isSortable: true},
    {title: 'Model', key:'model', isSortable: true},
    {title: 'ContactName', key:'contactName', isSortable: true},
    
  ]
  
  
  constructor(private vehicleService: VehicleService) { }

  ngOnInit() {
    this.populateVehicles();
    this.vehicleService.getMakes().subscribe((v:any) => this.makes = v);
  }

  private populateVehicles(){
    this.vehicleService.getVehicles(this.query)
              .subscribe((v:any) => this.vehicles  =  v);
  }

  onFilterChange(){
   this.populateVehicles();
  }

  onResetFilter(){
    this.query = {};
    this.onFilterChange();
  }

  sortBy(columnName){
    if(this.query.sortBy === columnName){
      this.query.isSortAscending = !this.query.isSortAscending;
    } else {
      this.query.sortBy = columnName;
      this.query.isSortAscending = true;
    }
    this.populateVehicles();
  }
  
}
