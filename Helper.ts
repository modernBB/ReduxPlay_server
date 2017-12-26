import {Mp,PlayerMP,Vector3} from "./Rage"
 declare class Buffer{
    constructor(any);
    toString(any):string;
}
declare var mp: Mp;
declare var fs:any;

export class CarContainer{
    public pos:Vector3;
    public rot:number;
    constructor(pos:Vector3,rot:number){
        this.pos = pos;
        this.rot = rot;
    }
}
export enum CarPlaceType{
    empty = -1,
    Home = 0,
    Band = 1,
    Org = 2,
    Bus = 3,
    Adm = 4
}


export enum ITEM_TYPE{
    Home = 0,
    Car = 1,
    Weapon = 2,
    Food = 3,
    Ammo = 4,
    MilitaryResources = 5,
    Clothes = 6
}
export enum ITEM_RARITY{
    Standart = 0,
    Uncommon = 1,
    Rare = 2,
    UltraRare = 3,
    Premium = 4,
    Incred = 5
}

export var skinData = {
    skins:{
        male:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,42,43,44],
        famale:[21,23,25,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,45]
    },
    skinType:{
        0:[0,0,0.0],
        1:[0,2,0.1],
        2:[0,2,0.2],
        3:[0,2,0.3],
        4:[0,2,0.4],
        5:[0,2,0.5],
        6:[0,2,0.6],
        7:[0,2,0.7],
        8:[0,2,0.8],
        9:[0,2,0.9],
        10:[0,4,0.9],
        11:[0,6,0.9],
        12:[0,7,0.9],
        13:[0,8,0.9],
        14:[0,9,0.9],
        15:[0,16,0.9]
    }
}

export enum BusinessType{
    ClothesShop = 1,
    Taxi = 2,
    BusCompany = 3
}

class HELPER {

    private static _instance:HELPER;
    constructor() {
        if(HELPER._instance){
            throw new Error("HELPER instance failed: user getInstance()");
        }
        HELPER._instance = this;

    }

    public getInstance():HELPER{
        return HELPER._instance;
    }

    sendMessage(nickcolor,textcolor,name,str,player,radius,fromid:number = 0){

                var text = "<font color="+nickcolor+">"+name+"</font><font color="+textcolor+">"+str+"</font>";
                if(!player){
                    mp.players.forEach(_player => { _player.outputChatBox(text); });
                }else{
                    player.outputChatBox(text);
                }
                if(radius>0){
                    mp.players.forEach((pl:PlayerMP)=>{
                            pl.call("UPPER_TEXT",str,fromid);
                    });
                }
        }


    getPlayersInRadius(player:PlayerMP,radius:number):Array<PlayerMP>{
        return null;
    }


    escape(str:string):string {
        var tagsToReplace = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;'
        };

    return str.replace(/[&<>]/g, function(tag) {
        return tagsToReplace[tag] || tag;
    });
};



}

export var Helper = new HELPER().getInstance();


export function addCommand(commandName:string,callback:(player:PlayerMP,fulltext:string,...args)=>void){
    mp.events.addCommand(commandName,callback);
}