import * as _ from 'underscore';
import { SaveVehicle, Vehicle } from './../models/vehicle';
import { VehicleService } from '../services/vehicle.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import 'rxjs/add/observable/forkJoin';


@Component({
  selector: 'app-vechicle-form',
  templateUrl: './vechicle-form.component.html',
  styleUrls: ['./vechicle-form.component.css']
})
export class VechicleFormComponent implements OnInit {
  makes: any[]; 
  models: any[];
  features: any[];
  vehicle: SaveVehicle = {
    id:0,
    makeId: 0,
    modelId:0,
    isRegistered: false,
    features: [],
    contact: {
      name:'',
      phone:'',
      email:''
    }
  };

  constructor(private vehicleService: VehicleService,
              private route: ActivatedRoute,
              private router: Router) {

                route.params.subscribe(p =>{
                  this.vehicle.id = +p['id'];
                });
               }

  ngOnInit() {
    var sources = [
      this.vehicleService.getMakes(),
      this.vehicleService.getFeatures(),
    ];

    if(this.vehicle.id)
      sources.push(this.vehicleService.getVehicle(this.vehicle.id));

    forkJoin(sources).subscribe((data: any) => {
      this.makes = data[0];
      this.features = data[1];

      if(this.vehicle.id)
        this.setVehicle(data[2]);
        this.populateModels();
    },
    err => {
      if (err.status == 404)
        this.router.navigate(['']);
    });
  
    /*this.vehicleService.getVehicle(this.vehicle.id).subscribe((v: any) => {
      this.vehicle = v},
      
    this.vehicleService.getMakes().subscribe((makes: any[]) => 
      this.makes = makes);
      
    this.vehicleService.getFeatures().subscribe((features: any[]) => 
      this.features = features);*/      
  }

  private setVehicle(v: Vehicle){
    this.vehicle.id = v.id;
    this.vehicle.makeId = v.make.id;
    this.vehicle.modelId = v.model.id;
    this.vehicle.isRegistered = v.isRegistered;
    this.vehicle.contact = v.contact;
    this.vehicle.features = _.pluck(v.features, 'id');
  }

  onMakeChange() {
    this.populateModels();
    delete this.vehicle.modelId;
  }

  private populateModels(){
    var selectedMake = this.makes.find(m => m.id == this.vehicle.makeId);
    this.models = selectedMake ? selectedMake.models : [];
  }

  onFeatureToggle(id, $event){
    if($event.target.checked)
      this.vehicle.features.push(id);
    else{
      var index = this.vehicle.features.indexOf(id);
      this.vehicle.features.splice(index,1);
    }
  }

  submit(){
    if(this.vehicle.id)
        this.vehicleService.update(this.vehicle)
             .subscribe(
              x => { console.log(this.vehicle)});
    else {
            this.vehicleService.create(this.vehicle)
             .subscribe(
              x => console.log(this.vehicle));
          }
  }

  delete(){
    this.vehicleService.remove(this.vehicle.id)
    .subscribe(
      x => console.log(this.vehicle.id));
  }
}



