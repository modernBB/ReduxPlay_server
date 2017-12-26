import {DB} from "./Database"
import {VehicleMp} from "./Rage"
export class PlayerInfo{
    public id:number;
    public organization:number;
    public orgRank:number;
    public login:string;     
    public lvl:number;
    public admLvl:number;
    public homes:Array<number>;
    public work:number;
    public money:number;
    public cars:Array<number>;
    public businesses:Array<number>;
    public bank:number;
    public skin:number[] = [0,0,0,0,0,0,0,0,0,0,0,0];
    public clothes:number[] = [0,0,0,0];
    public curState:number;

    public spawnCar:VehicleMp;


    public invite = {orgtype:-1,orgid:-1,time:-1};

    constructor(){
        this.skin = [0,0,0,0,0,0,0,0,0,0,0,0];
        this.clothes = [0,0,0,0];
    }
    setInfo(id:number,login:string,organization:number,orgRank:number,lvl:number,admLvl:number,homes:Array<number>,
    work:number,money:number,cars:Array<number>,businesses:Array<number>,bank:number,skin:number[],clothes:number[],curState:number)
    {
        this.id = id;
        this.organization = organization;
        this.orgRank = orgRank;
        this.login = login;     
        this.lvl = lvl;
        this.admLvl = admLvl;
        this.homes = homes;
        this.work = work;
        this.money = money;
        this.cars = cars;
        this.businesses = businesses;
        this.bank = bank;
        this.skin = skin;
        this.clothes = clothes;
        this.curState = curState;
    }
    clearInvite(){
        this.invite = {orgtype:-1,orgid:-1,time:-1};
    }
    saveInfo(){
        DB.saveUser(this.id,this);
    }
}