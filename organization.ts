"use strict";
import {Vector3,PlayerMP} from "./Rage"
import {CarContainer} from "./Helper"
import {VehicleInfo} from "./VehicleInfo"
export class Organization {

    public interval:number;
    public id:number;
    public ranks:string[];
    public name:string;
    public leaderId:number;
    public members:number[];
    public carColors:number;
    public carContainer:CarContainer[];
    public carsIDs:Array<number>;
    public spawnPoints:Vector3[];
    public orgColor:string;
    public type:number;
    constructor() {
        this.type = 0; //0 - гос,1- банды
        this.interval = 1000; //ms
        this.ranks = [];
        this.name = "default";
        this.leaderId = 0;
        this.members = new Array();
        this.spawnPoints = [];
        this.carsIDs = new Array();
    }

    setMemberRank(player, member, rank){}
    getMemberById(id:number):number{
        for(var i in this.members){
            if(this.members[i] == id){
                return this.members[i];
            }
        }
        return -1;
    }
    invite(player, id){}
    uninvite(player, id) {}
    addCar(veh:VehicleInfo){}

    kickMember(id) {}
    radioChat(player:PlayerMP,str:string){}

    depChat(player:PlayerMP,str:string){}
    awake() {}
    setId(id:number){this.id = id; console.log(this.name+" ID:"+id);}
    help(player:PlayerMP,args:string[]) {}

    update() {}
}