
"use strict";
import { World } from "./World"
import { Mp } from "./Rage"
import {DB} from "./Database"

declare var mp;

//mp.players = mp._players
//mp.vehicles = mp._vehicles
//mp.colshapes = mp._colshapes
//mp.checkpoints = mp._checkpoints
//mp.markers = mp._markers
//mp.objects = mp._objects


 mp.colshapes.newCircleA = function(x,y,z,r){
     var col = mp.colshapes.newCircle(x,y,r);
    if(col.shapeType == 'circle')
    {
        mp.players.forEach((pl)=>{
            pl.call('newColshape',1,x,y,z,r,col.id,1.0,1.0);
        });
    }
 }
const world = new World();

mp.events.add("playerJoin", world.map["playerJoin"]);
mp.events.add("playerChat", world.map["playerChat"]);
mp.events.add("playerDeath", world.map["playerDeath"]);
mp.events.add("playerEnteredVehicle", world.map["playerEnteredVehicle"]);
mp.events.add("playerExitVehicle",world.map["playerExitVehicle"]);
mp.events.add("playerLeftVehicle",world.map["playerLeftVehicle"]);
mp.events.add("playerEnterColshape",world.map["playerEnterColshape"]);
mp.events.add("playerExitColshape",world.map["playerExitColshape"]);
mp.events.add("playerEnterCheckpoint",world.map["playerEnterCheckpoint"]);
mp.events.add("playerExitCheckpoint",world.map["playerExitCheckpoint"]);
mp.events.add("auth_verif",world.map["auth_verif"]);
