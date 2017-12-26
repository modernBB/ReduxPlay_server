"use strict";
declare var mp: Mp;
declare function require(str): any;
import {Mp,Vector3,PlayerMP} from "./Rage";
import {PlayerInfo} from "./PlayerInfo";
import {DB} from "./Database";
import {PED_LIST} from "./Peds";
import {Helper,CarPlaceType,CarContainer,BusinessType} from "./Helper";
import {World} from "./World";
const crypto = require('crypto');


export class clientEvents {


    public world:World;

    constructor(world:World){
        this.world = world;
        console.log("- clientEvents < init");
        mp.events.add("auth_verif",this.auth_verif.bind(this));

    }

    auth_verif(player:PlayerMP,login:string,pass:string){

        console.log(login,pass);

        var self = this;
        if(!login || !pass){
            return;
        }
        //let hash = crypto.createHash('sha256');
       // hash.update(pass);
        //pass = hash.digest('hex');

        DB.verifUser(login, pass, function(success, data) {

            if (!success) {
                console.log("failed");
                player.call("LOGIN_STATUS",null,0);
            } else {
                player.info = new PlayerInfo();
              //  player.invite = { org: 0, timeout: 0 };
                player.info.setInfo(data._id, data.login, data.organization.id, data.organization.rank, data.lvl, data.admLvl,data.homes,
                                    data.works, data.money, data.cars, data.businesses, data.bank, data.skin, data.clothes,data.userstate);
                player.name = data.nick;

                console.log(player.info);
                var outData = {state:player.info.curState,player:{}};
              
                if(player.info.curState == 2)
                {
                
                    player.model = mp.joaat(PED_LIST[player.info.skin[0]]);
                //    player.invoke(HASHES.SET_PED_HEAD_BLEND_DATA[1] ,player,player.info.skin[1], player.info.skin[2], player.info.skin[3], player.info.skin[4], player.info.skin[5],player.info.skin[6], player.info.skin[7], player.info.skin[8],player.info.skin[9], false);
                    player.setClothes(2, player.info.skin[10],0, 0)
                 //   player.invoke(HASHES._SET_PED_HAIR_COLOR[1],player,player.info.skin[11],player.info.skin[12]);

                    player.setClothes(8,  player.info.clothes[0], 0, 0);
                    player.setClothes(3, player.info.clothes[1], 0,0);
                    player.setClothes(11, player.info.clothes[2],  0,0);
                    player.setClothes(4, player.info.clothes[3],  0,0);

                    outData.player['name'] = player.name;
                    outData.player['admLvl'] = player.info.admLvl;
                    outData.player['money'] = player.info.money;
                    outData.player['organization'] = player.info.organization;
                    outData.player['homes'] = player.info.homes;
                    console.log(self);
                    var spawn = self.world.getOrgById(player.info.organization);
                    player.spawn(spawn.spawnPoints[Math.floor(Math.random() * spawn.spawnPoints.length)]);

                    
                    
                    if (player.info.organization != 0) {
                        var org = self.world.getOrgById(player.info.organization);
                        org.members.push(player.id);
                        outData.player['organizationType'] = org.type;
                        outData.player['organizationRank'] = player.info.orgRank;
                        Helper.sendMessage("", "white", "", 'Ваша организация <font color=' + org.orgColor + '>[' + org.name + ']</font>, ранг ' + org.ranks[player.info.orgRank - 1] + ' [' + player.info.orgRank + ']', player,0);
                        //Helper.sendMessage("", "white", "", "Ваша организация <font color=" + org.orgColor + ">[" + org.name + "]</font>, ранг \"" + org.ranks[player.info.orgRank - 1] + " [" + player.info.orgRank + "]\"", player,0);
                      //  Helper.sendMessage("#ff6d6d", "white", "","<pre style='font-size:0.8vw;line-height:0.8vw'>"+JSON.stringify(data,undefined,1)+"</pre>", null, false, player);
                    }
                }
                 // Helper.sendMessageCustom(player, { "type": "LOGIN_STATUS","data":outData, "code":2,"t":t }, false);
                 player.call("LOGIN_STATUS",JSON.stringify(outData),1);

            }
        });
    }

}