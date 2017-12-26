"use strict";
//DECLARE
declare function require(str): any;
declare var mp: Mp;
declare var fs:any;
declare var __dirname:string;

import {Organization} from "./organization";
import {Business} from "./business";
import {ClothingStore} from "./businesses/clothing_store";
import {Downtown} from "./businesses/downtown";
import {Bus} from "./businesses/bus";
import {PlayerInfo} from "./PlayerInfo";
import {VehicleInfo} from "./VehicleInfo";
import {PlayerMP,VehicleMp,ColshapeMp,Mp,Vector3} from "./Rage";
import {DB} from "./Database";
import {Helper,CarPlaceType,CarContainer,BusinessType} from "./Helper";
import {CLOTHES_DB} from "./clothes_db";
import {HASHES} from "./Hashes";
import {PED_LIST} from "./Peds";
import {clientEvents} from "./clientEvents";

import "./UserCommands";

const secret = 'secretrage';

const crypto = require('crypto');
export var world_instance:World;
export class World {


    private organizationsList: Array<Organization> = new Array<Organization>();
    private businessesList: Array<Business> = new Array<Business>();
    public map:{[name:string]:(player:PlayerMP,...args)=>void} = {};
    public timer:any;
    public c_events:clientEvents;
    constructor() {
        world_instance = this;
        
       this.initBaseEvents();       
       this.c_events = new clientEvents(this);
       this.loadOrganizations();
        
        DB.onConnect(function(){
            world_instance.loadBusinesses();
            world_instance.loadVehicles();
        })

        
       

        this.timer = setInterval(this.worldUpdate,100);
       
    }
    initBaseEvents(){
        mp.events.add("playerJoin",this.onPlayerJoin);
        mp.events.add("playerChat", this.playerChat);
        mp.events.add("playerDeath", this.playerDeath);
        mp.events.add("playerEnteredVehicle", this.playerEnteredVehicle);
        mp.events.add("playerExitVehicle",this.playerExitVehicle);
        mp.events.add("playerLeftVehicle",this.playerLeftVehicle);
        mp.events.add("playerEnterColshape",this.playerEnterColshape);
        mp.events.add("playerExitColshape",this.playerExitColshape);
        mp.events.add("playerEnterCheckpoint",this.playerEnterCheckpoint);
        mp.events.add("playerExitCheckpoint",this.playerExitCheckpoint);
    }

    playerEnterCheckpoint(player:PlayerMP,checkpoint:any){
        Helper.sendMessage("red","white","[СЕРВЕР] ","Enter checkpoint",player,0);
    }
    playerExitCheckpoint(player:PlayerMP,checkpoint:any){
        Helper.sendMessage("red","white","[СЕРВЕР] ","Exit checkpoint",player,0);
    }
    playerEnterColshape(player:PlayerMP,col:ColshapeMp){
        console.log("enter colshape");
         Helper.sendMessage("red","green","[СЕРВЕР] ","Enter colshape",player,0);
         player.call("enterColshape",col.id);
    }
    playerExitColshape(player:PlayerMP,col:ColshapeMp){
        console.log("exit colshape");
         Helper.sendMessage("red","green","[СЕРВЕР] ","Exit colshape",player,0);
         player.call("exitColshape",col.id);
    }
    worldUpdate(){ 
        
        mp.players.forEach(function(player:PlayerMP){
            if(player.vehicle !=null && player.vehicle.info.fuel > 0.0)
            {
                 
            var spd = Number(((Math.abs(player.vehicle.velocity.x)+Math.abs(player.vehicle.velocity.y)+Math.abs(player.vehicle.velocity.z))*2.5).toFixed(0));
            var fuel = Number(player.vehicle.info.fuel.toFixed(2));
             if(spd>0)
             {
                player.vehicle.info.fuel -= Number(spd*3*player.vehicle.info.fuel_sp);
                player.vehicle.info.fuel = Number(player.vehicle.info.fuel.toFixed(3));
             }
             if(player.vehicle.info.fuel<= 0.0){
                  player.invoke(HASHES.SET_VEHICLE_ENGINE_ON[0], player.vehicle, false, false);
                  player.invoke(HASHES.SET_VEHICLE_UNDRIVEABLE[0], player.vehicle, true);
                 player.vehicle.info.fuel = 0.00;
                  Helper.sendMessage("#ff9f9f", "#ff9f9f", "[АВТО] ", "У вас закончилось топливо!", player,0);
             }
               
               // Helper.sendMessageCustom(player,{type:"c_stat",spd:spd,fuel:(player.vehicle.info.fuel/100000).toFixed(2)},false);
            }
        });
    }
    loadOrganizations() {
        
        fs.readdirSync(__dirname + "/organizations/").forEach(file => {
           if(file.substring(file.length-3) == ".js")
           {
            let org = require("./organizations/" + file)[file.charAt(2).toUpperCase()+file.substring(3,file.length-3)];
            this.organizationsList.push(new org());
            console.log("Organization <" + file + "> loaded..");
           }
        });

        for (let i in this.organizationsList) {
            console.log("----------------------------");
            this.organizationsList[i].setId(parseInt(i));
            this.organizationsList[i].awake();      
        }

    }

    loadBusinesses(){
        DB.getBusinesses(function(result){
            for(var i in result){
                if(result[i].type == BusinessType.ClothesShop)
                {
                    world_instance.businessesList.push(new ClothingStore(result[i]._id,result[i].type,"Магазин одежды",result[i].owner,
                    new mp.Vector3(result[i].buypos.x,result[i].buypos.y,result[i].buypos.z),new mp.Vector3(result[i].goodspos.x,result[i].goodspos.y,result[i].goodspos.z),[{id:0,count:1,price:500}]));
                }else if(result[i].type == BusinessType.Taxi)
                {
                    world_instance.businessesList.push(new Downtown(result[i]._id,result[i].type,"Такси [Downtown]",result[i].owner,new mp.Vector3(result[i].buypos.x,result[i].buypos.y,result[i].buypos.z)));
                }else if(result[i].type == BusinessType.BusCompany)
                {
                    var ways:Array<{name:string,markers:Array<Vector3>,markerType:Array<number>}> = new Array<{name:string,markers:Array<Vector3>,markerType:Array<number>}>();
                    var cars = result[i].carpos;
                    for(var b in result[i].ways){
                        ways.push({name:b,markers:[],markerType:[]});
                        for(var c in result[i].ways[b]){
                            ways[ways.length-1].markers.push(new mp.Vector3(result[i].ways[b][c].x,result[i].ways[b][c].y,result[i].ways[b][c].z));
                            ways[ways.length-1].markerType.push(result[i].ways[b][c].c);
                        }
                    }
                    var busComp = new Bus(result[i]._id,result[i].type,"Автобусная компания",result[i].owner,new mp.Vector3(result[i].buypos.x,result[i].buypos.y,result[i].buypos.z),ways);

                    for(let i in cars){
                        busComp.carContainer.push(new CarContainer(new mp.Vector3(cars[i].x,cars[i].y,cars[i].z),cars[i].r));
                    }
                    

                    console.log(ways);

                    world_instance.businessesList.push(busComp);
                }
                console.log("-----------------");
                console.log(world_instance.businessesList[world_instance.businessesList.length-1].name+",uid:"+result[i]._id+" loaded..");
            }
        });
        
    }
    getOrgById(id:number):Organization{
        for(var i in world_instance.organizationsList)
        {
            if(world_instance.organizationsList[i].id == id)
            return world_instance.organizationsList[i];
        }
        
    }
    getBusById(id:number):Business{
        for(var i in world_instance.businessesList)
        {
            if(world_instance.businessesList[i].ID == id)
            return (world_instance.businessesList[i]);
        }
    }

    loadVehicles(){
         DB.getVehicles(function(result){

            for(var i in result){
                
                console.log(result[i].spawn.CarPlaceID);
                var obj = null;

                switch(result[i].spawn.CarPlaceType){
                    case CarPlaceType.Home:

                    break;
                    case CarPlaceType.Band:

                        obj = world_instance.getOrgById(result[i].spawn.CarPlaceID);
                    break;
                    case CarPlaceType.Org:

                        obj = world_instance.getOrgById(result[i].spawn.CarPlaceID);
                    break;
                    case CarPlaceType.Bus:

                         obj = world_instance.getBusById(result[i].spawn.CarPlaceID);
                    break;
                    case CarPlaceType.Adm:

                    break;
                }

                var vehinfo = new VehicleInfo(null,result[i].hash,result[i].fuel_sp,result[i].spawn.owner,result[i].spawn.CarPlaceType,result[i].spawn.CarPlaceID,result[i].spawn.CarPlaceContainer);
                obj.addCar(vehinfo);
            }
         });
    }

    getVehByUid(uid:number):VehicleMp{
        mp.vehicles.forEach(function(veh){
            if(veh.info.uid == uid)
                return veh;
        });
        return null;
    }


    onPlayerJoin(player:PlayerMP):void{

        player.call("guiStarted");
        player.dimension = 0;
       // player.spawn(new mp.Vector3(402.8018798828125, -996.60986328125, -99.000244140625));
        
       // player.outputChatBox("<script>window.location = 'http://rage-multiplayer.local/';</script>");
       
    }
    playerDeath(player:PlayerMP,reason:string,killer:PlayerMP){
        var org = this.getOrgById(player.info.organization);
        setTimeout(function() {
            player.spawn(org.spawnPoints[Math.floor(Math.random() * org.spawnPoints.length)]);
        }, 3000);
    }
    playerEnteredVehicle(player:PlayerMP,car:VehicleMp){

     /*  if(car.info.carPlacetype == CarPlaceType.Org || car.info.carPlacetype == CarPlaceType.Band)
       var orgName = this.getOrgById(car.info.carPlaceid).name;
       
       else if(car.info.carPlacetype == CarPlaceType.Bus)
       var orgName = this.getBusById(car.info.carPlaceid).name;
      Helper.sendMessage("white", "white", "", "Что бы завести двигатель нажмите <font color='#63c67f'>'2'</font> либо откройте меню на <font color='#e9e9e9'>'3'</font>", player,0.0);*/

      player.call("VEH_ENTER",1);
     // player.invoke(HASHES.SET_ENTITY_ALPHA,car,150,false);
    }

    playerExitVehicle(player:PlayerMP) {
        player.call("VEH_ENTER",0);
        //Helper.sendMessageCustom(player,{type:"c_ext"},false);
    }
    playerLeftVehicle(player:PlayerMP){
        world_instance.playerExitVehicle(player);
    }
    playerChat(player:PlayerMP,text:string):void{
        if(player.info == null){
            Helper.sendMessage("white", "#f0ff00", ">>", "ОШИБКА, ВОЙДИТЕ НА СЕРВЕР!",player,0);
            return;
        }
        text = Helper.escape(text);
        console.log(text);
        var nickcolor = "#95c3b3";
        if (player.info.admLvl > 0)
            nickcolor = "#ffe458";

        if(text == ")"){
           Helper.sendMessage("#e2baff", "#e2baff", "", player.name + " улыбается", null,10.0);
        }else if(text == ":D")
        {
           Helper.sendMessage("#e2baff", "#e2baff", "", player.name + " смеется", null,10.0);
        }else if(text == "(")
        {
           Helper.sendMessage("#e2baff", "#e2baff", "", player.name + " грустит", null, 10.0);
        }else
        Helper.sendMessage(nickcolor, "white", player.name + " [<span style='color:#dddddd'>"+player.id+"</span>]: ", text, null,10.0,player.id);
        
    }

}