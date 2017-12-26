import {Vector3} from "./Rage"
import {CarContainer,CarPlaceType} from "./Helper"
//declare var mp: Mp;
export class VehicleInfo{
    public uid:number;
    public container:CarContainer;
    public hash:string;
    public owner:number;
    public carPlacetype:CarPlaceType;
    public carPlaceid:number;
    public carPlacecontainer:number;

    public fuel:number;
    public fuel_sp:number;
    constructor(container:CarContainer,hash:string,fuel_sp:number,owner:number,carPlacetype:CarPlaceType,carPlaceid:number,carPlacecontainer:number){
        this.container = container;
        this.hash = hash;
        this.fuel = 10000000;
        this.fuel_sp = fuel_sp;
        this.owner = owner;
        this.carPlacetype = carPlacetype;
        this.carPlaceid = carPlaceid;
        this.carPlacecontainer = carPlacecontainer;
    }

}