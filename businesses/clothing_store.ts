"use strict";
import {Helper} from "../Helper"
import {Mp,PlayerMP,Vector3} from "../Rage"
import {Business} from "../business"
declare var mp:Mp;
export class ClothingStore extends Business{
    public shopPoint:Vector3;
    public goods:[{id:number,count:number,price:number}];
    constructor(id:number,type:number,name:string,owner:number,buypos:Vector3,point:Vector3,goods:[{id:number,count:number,price:number}]){
        super(id,type,name,owner,buypos);
        this.shopPoint = point;
    }
    
}
