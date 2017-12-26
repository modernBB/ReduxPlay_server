"use strict";
import {Organization} from "../organization"
import {Mp} from "../Rage"
declare var mp:Mp;
export class Default extends Organization {

    constructor(){
       super();

      this.spawnPoints = [new mp.Vector3(171.18, -979.02, 30.07),new mp.Vector3(171.18, -964.62, 30.07),new mp.Vector3(181.04, -981.00, 30.03)];
    }

    awake(){
        console.log("default awake");
    }

    update(){

    }
}
