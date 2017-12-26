declare function require(name:string);
var dbt;
export class DATABASE {
    private MongoClient:any;
    private DB:any;
    private url:string;
    private static _instance:DATABASE;
     
    constructor() {
        if(DATABASE._instance){
            throw new Error("DATABASE instance failed: user getInstance()");
        }
        DATABASE._instance = this;
        this.MongoClient = require('mongodb').MongoClient;
        this.DB = null;
        this.url = "mongodb://localhost:27017/ragemp";
        dbt = this;
        this.connectDB();
    }

    public getInstance():DATABASE{
        return DATABASE._instance;
    }

    onConnect(callback){    
        if(this.DB!=null)
        callback();
        else
        {
            var self = this;
            setTimeout(function() {
                if(self.DB==null)
                    self.onConnect(callback);
                else
                callback();
            }, 500);
        }
    }
   getTest(){
        
            dbt.DB.collection('vehs').find().limit(100000).toArray(function(err, docs) {
                console.log(docs);
                if(!err)
                {
                    for(var i in docs){
                        console.log("veh "+i);
                    }
                }
            })

    }
    public ids:number = 0;
    insertTest(){
        
         //dbt.getlastid("test", function(lastid) {
            dbt.DB.collection("test").insertOne({ _id: (dbt.ids + 1), organization: { id: 0, rank: 0 }, homes: [], cars: [], works: [], ban: { time: 0, desc: '' }, skin: [0,0,0,0,0,0,0,0,0,0,0,0], clothes: [0,0,0,0], lvl: 0,userstate:1, admLvl: 0, admPass: '', money: 0, bank: [], businesses: []  }, function(err, result) {
                if(!err)
                {
                    console.log("ok "+(dbt.ids + 1));
                    dbt.ids ++;
                    dbt.insertTest();
                    
                }
            })
        // })
    }
    connectDB() {
        var self = this;
        this.MongoClient.connect(this.url, function(err, db) {
            if (err) {
                console.log("Reconnect 5 sec");
                setTimeout(function() {

                    self.connectDB();
                }, 5000);
                return;
            }
            DATABASE._instance.DB = db;
            console.log("- connect to MONGODB");
            
            

        });
    }

    verifLoginEx(login, callback) {
        this.DB.collection('users').find({ login: login }).limit(1).toArray(function(err, docs) {
            if (err || !docs[0]) {
                callback(false);
                return;
            }
            console.log(docs[0]);
            if (docs != null) {
                callback(true);
            }

        })
    }

    countUsers() {
        this.DB.collection('users').find({}).toArray(function(err, docs) {
            console.log(docs);

        });
    }
    getUserById(id,callback){
        this.DB.collection('users').find({_id:id}).toArray(function(err, docs) {
            callback(docs);
        });
    }

    verifNickEx(nick, callback) {
        this.DB.collection('users').find({ nick: nick }).limit(1).toArray(function(err, docs) {
            if (err || !docs[0]) {
                callback(false);
                return;
            }
            if (docs[0] != null) {
                callback(true);
            }

        })
    }

    verifUser(login, pass, callback) {
        this.DB.collection('users').find({ login: login, password: pass }).limit(1).toArray(function(err, docs) {
            if (err || !docs[0]) {
                callback(false, null);
                return;
            }
            if (docs[0] != null) {
                callback(true, docs[0]);
            }

        })
    }
    //userstate: 1)2 этап регистрации 2) рабочий аккаунт 3) заморожен аккаунт 4) бан
    insertNewUser(login, nick, pass, callback) {
        var self = this;
        self.getlastid("users", function(lastid) {
            self.DB.collection("users").insertOne({ _id: (lastid + 1), login: login, password: pass, nick: nick, organization: { id: 0, rank: 0 }, homes: [], cars: [], works: [], ban: { time: 0, desc: '' }, skin: [0,0,0,0,0,0,0,0,0,0,0,0], clothes: [0,0,0,0], lvl: 0,userstate:1, admLvl: 0, admPass: '', money: 0, bank: [], businesses: [] }, function(err, result) {
                if (err) {
                    callback(false);
                    return;
                }
                callback(true, lastid + 1);
            })
        });
    }

    getBusinesses(callback){
        var self = this;
        self.DB.collection("bus").find().toArray(function(err, result) {
            if(err)
            callback(err)
            else
            callback(result);
        });
    }
    getVehicles(callback){
        var self = this;
        self.DB.collection("vehs").find().toArray(function(err, result) {
            if(err)
            callback(err)
            else
            callback(result);
        });
    }

    saveUser(id, info) {
        var self = this;
        self.DB.collection("users").updateOne({ _id: id }, { $set: { organization: { id: info.organization, rank: info.orgRank }, homes: info.homes, cars: info.cars, works: info.works, skin: info.skin, clothes: info.clothes, lvl: info.lvl, admLvl: info.admLvl, money: info.money, bank: info.bank, businesses: info.businesses,userstate:info.curState } }, function(err, result) {

            console.log(result);
        });
    }

    insertHome(enterHomePos, carSpawnPos, interiorId, price, callback) {
        var self = this;
        self.getlastid("homes", function(lastid) {
            self.DB.collection("homes").insertOne({ _id: (lastid + 1), enterPos: { x: enterHomePos.x, y: enterHomePos.y, z: enterHomePos.z }, carSpawn: { x: carSpawnPos.x, y: carSpawnPos.y, z: carSpawnPos.z }, interior: interiorId, price: price, owner: 0, }, function(err, result) {
                if (err) {
                    callback(false);
                    return;
                }
                callback(true);
            })
        });
    }
    getlastid(table, callback) {
        this.DB.collection(table).find().sort({ _id: -1 }).limit(1).toArray(function(err, res) {
            if (err)
                callback(null);

            if (res[0] == null)
                callback(0)
            else
                callback(res[0]._id);
        });
    }

}

export var DB = new DATABASE().getInstance();