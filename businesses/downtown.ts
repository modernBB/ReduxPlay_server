"use strict";
import {Helper} from "../Helper"
import {Mp,PlayerMP,Vector3} from "../Rage"
import {VehicleInfo} from "../VehicleInfo"
import {Business} from "../business"
declare var mp:Mp;
export class Downtown extends Business{

    constructor(id:number,type:number,name:string,owner:number,buypos:Vector3){
        super(id,type,name,owner,buypos);

    }

    
}
