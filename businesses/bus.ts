"use strict";
import {Helper,CarContainer} from "../Helper"
import {Mp,PlayerMP,Vector3} from "../Rage"
import {VehicleInfo} from "../VehicleInfo"
import {Business} from "../business"
import {DB} from "../Database"
declare var mp:Mp;

export class Bus extends Business{
    cars:VehicleInfo[];

    //For adm
    public newWay:{name:string,pos:Array<Vector3>,markerType:Array<number>} = {name:"",pos:[],markerType:[]};
    public ways:Array<{name:string,markers:Array<Vector3>,markerType:Array<number>}>;
    public carsIDs:Array<number>;
    public carContainer:CarContainer[];
    constructor(id:number,type:number,name:string,owner:number,buypos:Vector3,ways:Array<{name:string,markers:Array<Vector3>,markerType:Array<number>}>){
        super(id,type,name,owner,buypos);
        this.carContainer = new Array<CarContainer>();
        this.ways = ways.slice();
        this.carsIDs = new Array();
        console.log(this.ways);
       /*this.getInfo(function(arg){
            console.log(arg);
        });*/
    }

    addCar(veh:VehicleInfo){

        var spawnInfo = this.carContainer[veh.carPlacecontainer];
        veh.container = spawnInfo;
        let lveh = mp.vehicles.new(mp.joaat(veh.hash),spawnInfo.pos);
        lveh.info = veh;
        lveh.rotation = new mp.Vector3(0, 0, spawnInfo.rot);
        this.carsIDs.push(lveh.info.uid);
   }

    getInfo(callback){
        var usrName = "";
        var self = this;
        
        DB.getUserById(this.owner,function(result){
            if(result[0]!=null)
            usrName = result[0].nick;
            
            callback({
                      name:self.name+" uid:"+self.ID,
                      owner:{id:self.owner,name:usrName},
                      ways:self.ways
                    });
        });
    }

    addWaysToDB(player:PlayerMP){
        if(player.info.admLvl==4){
            
        }
    }

}
