import {Vector3} from "./Rage"
import {VehicleInfo} from "./VehicleInfo"
export class Business{
    

    public ID:number;
    public type:number;
    public name:string;
    public owner:number;
    public buyPos:Vector3;
    
    constructor(id:number,type:number,name:string,owner:number,buyPos:Vector3){
        this.ID = id;
        this.type = type;
        this.name = name;
        this.owner = owner;
        this.buyPos = buyPos;
    }

     initCars(vehs:Array<VehicleInfo>){}
    


}