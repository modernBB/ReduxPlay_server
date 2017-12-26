"use strict";
import {World,world_instance} from "./World"
import {VehicleInfo} from "./VehicleInfo"
import {Helper,skinData,CarPlaceType,addCommand} from "./Helper"
import {Mp,PlayerMP,Vector3} from "./Rage";
import {HASHES} from "./Hashes"
import {PED_LIST} from "./Peds"
import {PlayerInfo} from "./PlayerInfo"
import {DB} from "./Database"
import {Business} from "./business";
import {Bus} from "./businesses/bus";
declare var mp:Mp;



addCommand("checkpoint",(player:PlayerMP,fulltext:string,type,radius,r:number,g:number,b:number,a:number)=>
{
        var ck = mp.checkpoints.new(parseInt(type),player.position,new mp.Vector3(0,0,0),parseFloat(radius),r,g,b,a);
        console.log(ck);
});


mp.events.addCommand("resetcar",(player:PlayerMP,args:string[])=>
{
        let rotation = player.vehicle.rotation
        rotation =new mp.Vector3(0,0,0);
        Helper.sendMessage("#ff9696", "white", "", "respawn auto", player,0);     
})

addCommand("colshape",(player:PlayerMP,fulltext:string,type:number,radius,sizex,sizey)=>
{
    var col;
    if(type == 1){
        console.log("1");
        col = mp.colshapes.newCircle(player.position.x,player.position.y,parseFloat(radius));
    }else if(type == 2){
        console.log("2");
        col =  mp.colshapes.newRectangle(player.position.x,player.position.y,parseFloat(sizex),parseFloat(sizey));
    }

     Helper.sendMessage("#ff9696", "white", "", "Colshape create "+col.id, player,0);     
     player.call("newColshape",type,player.position.x,player.position.y,player.position.z,radius,col.id,sizex,sizey);

})

addCommand("tpbus",(player:PlayerMP,fulltext:string,busid:number)=>
{
       var b = world_instance.getBusById(busid);
       console.log(b);
       player.position = b.buyPos;
});
addCommand("acceptinvite",(player:PlayerMP)=>
{
    if (player.info.invite.orgid != -1) {
        if ( ((new Date().getTime()/1000)-player.info.invite.time) >300 ){
             Helper.sendMessage("#ff9696", "#ff9696", "[СЕРВЕР] ", "Срок действия приглашения истек!", player, 0);
             player.info.clearInvite();
        } else {
                var org = world_instance.getOrgById(player.info.invite.orgid);
                if (!org)
                    return;

                player.info.organization = org.id;
                player.info.orgRank = 1;
                player.spawn(org.spawnPoints[Math.floor(Math.random() * org.spawnPoints.length)]);
                if(org.getMemberById(player.id) == -1)
                org.members.push(player.id);
        }
    } else {
        Helper.sendMessage("#ff9696", "#ff9696", "[СЕРВЕР] ", "Вас никуда не пригласили!", player, 0);
    }
});
addCommand("invite",(player:PlayerMP,fulltext:string,userid:number)=>
{
        if (player.info.organization != 0) {
            var org = world_instance.getOrgById(player.info.organization);
            org.invite(player, userid);
        }
})

addCommand("eval",(player:PlayerMP,fulltext:string)=>
{
    Helper.sendMessage("#50cbff", "white", "EVAL> ",eval(fulltext), player,0);
})

addCommand("uninvite",(player:PlayerMP,fulltext:string)=>
{
    //WIP
})
addCommand("veh",(player:PlayerMP, fullText:string, hash:string)=>
{
        if (!hash) {
            Helper.sendMessage("#ff9696", "#ff9696", "[СЕРВЕР] ", "<font color=white>/veh</font> [hash - транспорта]", player,0);
            return;
        }
        var pos = player.position;
        pos.x += 2.0;       

        player.info.spawnCar = mp.vehicles.new(mp.joaat(hash), pos);
        player.info.spawnCar.info = new VehicleInfo(null,hash,50.0,-2,CarPlaceType.Adm,0,0);
        player.dimension = 0;    
})
addCommand("tp",(player:PlayerMP,fulltext:string,userid:number)=>
{
        if (!userid) {
            Helper.sendMessage("#ff9696", "#ff9696", "[СЕРВЕР] ", "<font color=white>/tp</font> [id игрока]", player,0);
            return;
        }
        var pl = mp.players.at(userid);
        if (!pl)
            return;

        player.position = pl.position;
})
addCommand("r",(player:PlayerMP,fulltext:string)=>
{
        console.log(fulltext);
        if (player.info == null || player.info.organization == 0)
            return;


        var org = world_instance.getOrgById(player.info.organization);
        if(org.type != 0)
            return;
        if (fulltext.length <=0) {
            Helper.sendMessage( org.orgColor, org.orgColor, org.name+" ", "/r [сообщение в рацию]", player,0);
            return;
        }
        org.radioChat(player, fulltext);
})
addCommand("f",(player:PlayerMP,fulltext:string)=>
{
        console.log(fulltext);
        if (player.info == null || player.info.organization == 0)
            return;
         

        var org = world_instance.getOrgById(player.info.organization);
        if(org.type != 1)
        return;
        if (fulltext.length <= 0) {
            Helper.sendMessage( org.orgColor, org.orgColor, org.name+" ", "/f [чат банды]", player,0);
            return;
        }
        org.radioChat(player, fulltext);
})
addCommand("d",(player:PlayerMP,fulltext:string)=>
{
        console.log(fulltext);
        if (player.info == null || player.info.organization == 0)
            return;

        var org = world_instance.getOrgById(player.info.organization);
        if(org.type !=0)
            return;
        if (fulltext.length <=0 ) {
            Helper.sendMessage( org.orgColor,  org.orgColor, org.name+" ", "/d [сообщение в чат департамента]", player,0);
            return;
        }
        
        org.depChat(player, fulltext);
})
addCommand("setrank",(player:PlayerMP,fulltext:string,userid:number,newrank:number)=>
{
        if (player.info == null || player.info.organization == 0)
            return;

        var org = world_instance.getOrgById(player.info.organization);

        org.setMemberRank(player, userid, newrank);
})


  /*  setpedblend(player:PlayerMP,args:string[]){
        if (player.info.curState != 1) {         
            return;
        }

        var skinID = parseInt(args[1]);
        if(mp.joaat(PED_LIST[skinID]) !=player.model)
            player.model = mp.joaat(PED_LIST[skinID]);
        var shapefirst = skinData.skins.male[parseInt(args[2])];
        var shapesecond = skinData.skins.famale[parseInt(args[3])];
        var shapethird = 0.0;

        var skinType = skinData.skinType[parseInt(args[4])];
        console.log(skinType);

        player.setHeadBlend(shapefirst, shapesecond, 0, parseInt(skinType[0]), parseInt(skinType[1]), 0, skinmix,parseFloat(skinType[2]),0);


    }*/
mp.events.addCommand("members",(player:PlayerMP,args:string[])=>
{
        if (player.info == null || player.info.organization == 0)
            return;

        var org = world_instance.getOrgById(player.info.organization);

        var membersStr = '';

        for (var i in org.members) {
            var usr = mp.players.at(org.members[i]);
            membersStr += '<div>- ' + usr.name + ' &lt; ' + org.ranks[usr.info.orgRank - 1] + ' [' + usr.info.orgRank + '] &gt;</div>';
        }
        //<font color=white>------------------------------</font>
        Helper.sendMessage(org.orgColor, "white", "<div style='background:rgba(0,0,0,0.3);border-top:1px solid rgba(255,255,255,0.5);border-bottom:1px solid rgba(255,255,255,0.5);padding:5px'>[" + org.name + "] ", "Члены организации Онлайн:<br> <font color=white>" + membersStr + "</font><font color=#6ee689>- В сети [" + org.members.length + " чел.]</font></div>",player,0);

})
mp.events.addCommand("save",(player:PlayerMP,args:string[])=>
{
        player.info.saveInfo();
})
mp.events.addCommand("setskin",(player:PlayerMP,args:string[])=>
{
        if (player.info.admLvl == 0) {
            Helper.sendMessage("#ff9696", "#ff9696", "[СЕРВЕР] ", "У вас не достаточно прав что бы использовать эту команду!", player,0);
            return;
        }
        player.model = mp.joaat(PED_LIST[args[1]]);
})
mp.events.addCommand("help",(player:PlayerMP,args:string[])=>
{
        var org = world_instance.getOrgById(player.info.organization);
        org.help(player, args);
})

    /*reg_req(player:PlayerMP, args:string[]) {
        var login = args[1];
        var nick = args[2];
        var pass = args[3];

        DB.verifLoginEx(login, function(loginEx) {
            if (loginEx) {
                Helper.sendMessageCustom(player, { "type": "reg_f", "text": "Данный логин уже занят!" }, false);
                return;
            }
            DB.verifNickEx(nick, function(nickEx) {
                if (nickEx) {
                    Helper.sendMessageCustom(player, { "type": "reg_f", "text": "Данный никнейм уже занят!" }, false);
                    return;
                }
                DB.insertNewUser(login, nick, pass, function(result, id) {
                    if (result != null) {
                        console.log(nick + " REGISTER ID:" + id);
                        player.info = new PlayerInfo();
                        player.info.setInfo(id,login,0,0,0,0,[],0,0,[],[],0,player.info.skin, player.info.clothes,1);

                        player.name = nick;

                        Helper.sendMessageCustom(player, { "type": "usr_state", "state": 1 }, false);
                    }
                });
            });
        });
    }*/
mp.events.addCommand("setleader",(player:PlayerMP,full:string,userid:number,orgId:number)=>
{
            if (player.info.admLvl > 0) {

                if (!userid || !orgId) {
                    Helper.sendMessage("#ff6d6d", "#ff6d6d", "[ADM] ", "/setleader [id-игрока,id-фракции]", player,0);
                    return;
                }
                var org = world_instance.getOrgById(orgId);
                if (!org)
                    return;
                var pl = mp.players.at(userid);
                pl.info.organization = orgId;
                var maxRank = org.ranks.length;
                pl.info.orgRank = maxRank;
                pl.spawn(org.spawnPoints[Math.floor(Math.random() * org.spawnPoints.length)]);
                org.members.push(pl.id);
                Helper.sendMessage("#ff6d6d", "#ff6d6d", "[СЕРВЕР] ", "Вас назначили лидером фракции " + org.name, pl,0);
            }
})
        //*adminhome

    var newHome:{enterPos:Vector3,carPos:Vector3,carRot:number,price:number,interior:number,complete:boolean} 
        = {enterPos:new mp.Vector3(0,0,0),carPos:new mp.Vector3(0,0,0),carRot:0,price:0,interior:0,complete:false};



    /*adm_b(player:PlayerMP,args:string[]){
 
        switch(args[1]){
            case 'addway':
                var b = this.worldClass.getBusById<Bus>(parseInt(args[2]));
                b.getInfo(function(arg){
                    Helper.sendMessage("#ff6d6d", "white", "","<pre style='font-size:0.8vw;line-height:0.8vw'>"+JSON.stringify(arg,undefined,1)+"</pre>", player,0);
                });
                
            break;
            case 'addname':

            break;
            case 'addwaypos':

            break;
            case 'rmway':

            break;
            case 'rmsave':

            break;
        }
    }*/

mp.events.addCommand("me",(player:PlayerMP,args:string[],full:string)=>
{
        if (args.length < 2) {
            Helper.sendMessage("#ff6d6d", "white", "", "/me [действие] ", player,0);
            return;
        }
        Helper.sendMessage("#e2baff", "#e2baff", "", player.name + " " + full, null,10.0);
})

