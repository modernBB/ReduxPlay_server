"use strict";
import {Helper,CarContainer} from "../Helper"
import {Mp,PlayerMP} from "../Rage"
import {Organization} from "../organization"
import {VehicleInfo} from "../VehicleInfo"
declare var mp:Mp;
 declare class Buffer{
    constructor(any);
    toString(any):string;
}
export class Police extends Organization {

    constructor(id) {
        super();
        this.name = "LSPD";
        this.orgColor = "#b4a5ff";
        this.carContainer = new Array();
      //  this.carSpawnPoints = [new mp.Vector3(407.95, -979.94, 28.88), new mp.Vector3(407.81, -984.36, 28.87), new mp.Vector3(407.88, -988.83, 28.87), new mp.Vector3(407.91, -993.14, 28.87)];
     //   this.carRots = [50, 50, 50, 50];
        this.spawnPoints = [new mp.Vector3(445.73, -986.43, 30.68), new mp.Vector3(451.56, -980.41, 30.68), new mp.Vector3(443.21, -985.52, 30.68)];
        this.ranks = ["Кадет", "Младший Сержант", "Сержант", "Старший Сержант", "Прапорщик", "Старший Прапорщик", "Младший Лейтенант", "Лейтенант", "Старший Лейтенант", "Капитан", "Майор", "Подполковник", "Полковник", "Шериф"];
    }

    
   addCar(veh:VehicleInfo){

        var spawnInfo = this.carContainer[veh.carPlacecontainer];
        veh.container = spawnInfo;
        let lveh = mp.vehicles.new(mp.joaat(veh.hash),spawnInfo.pos);
        lveh.info = veh;
        lveh.rotation = new mp.Vector3(0, 0, spawnInfo.rot);
        this.carsIDs.push(lveh.info.uid);
   }

    awake() {
        
        this.carContainer.push(new CarContainer(new mp.Vector3(407.95, -979.94, 28.88),50));
        this.carContainer.push(new CarContainer(new mp.Vector3(407.81, -984.36, 28.87),50));
        this.carContainer.push(new CarContainer(new mp.Vector3(407.88, -988.83, 28.87),50));
        this.carContainer.push(new CarContainer(new mp.Vector3(407.91, -993.14, 28.87),50));

       /* for (var i in this.carSpawnPoints) {
            let veh = mp.vehicles.new(mp.joaat("police3"), this.carSpawnPoints[i]);
            veh.rotation = new mp.Vector3(0, 0, this.carRots[i]);
            var veh_info = new VehicleInfo(this.carSpawnPoints[i],this.carRots[i],"Police",this.id,VehicleType.Organization,1.0);
            veh.info = veh_info;
        }
        console.log(this.name + " -spawn "+this.carSpawnPoints.length+" cars");

        var b = mp.blips.new(new mp.Vector3(441.79, -986.82, 30.68));
        b.model = 60;
        console.log(this.name + " -blips load");*/

    }


    setMemberRank(player, member, rank) {
        if (player.info.orgRank < (this.ranks.length - 3)) {
            Helper.sendMessage(this.orgColor, "#ff9696", "[LSPD] ", "У вас не достаточно полномочий!",player,0);
            return;
        }

        var maxRankUp = (player.info.orgRank - 1);
        if (player.info.orgRank == 12)
            maxRankUp = 2;

        if (member == null || rank == null) {
            Helper.sendMessage(this.orgColor, "white", "[LSPD] ", "Подсказка: /setrank [id игрока] [1-" + maxRankUp + " ранг]",player,0);
            return;
        }


        if (rank > maxRankUp) {
            Helper.sendMessage(this.orgColor, "#ff9696", "[LSPD] ", "Вы не можете повысить игрока до звания выше чем <font color='white'>\"" + this.ranks[maxRankUp - 1] + " [" + maxRankUp + "]\"</font>", player,0);
            return;
        }

        /*  if (player.id == member) {
              Helper.sendMessage("#ff9696", "#ff9696", "[LSPD] ", "Вы не можете изменять свое звание", null, false, player);
              return;
          }*/

        var upMember = mp.players.at(member);
        if (upMember.info.organization != 1) {
            Helper.sendMessage(this.orgColor, "#ff9696", "[LSPD] ", "Данный игрок не находится в вашей организации!", player,0);
            return;
        }


        var updown = "повысили";
        if (upMember.info.orgRank > rank)
            updown = "понизили";

        upMember.info.orgRank = rank;
        Helper.sendMessage(this.orgColor, "#ff9696", "[LSPD] ", "Вас " + updown + " в звании, теперь вы <font color='white'>\"" + this.ranks[rank - 1] + " [" + rank + "]" + "\"</font>",player,0);

    }

    help(player, args) {
        Helper.sendMessage(this.orgColor, "white", "[LSPD] ", "Команды:<br>/invite [id]<br>/uninvite [id]<br>/setrank [id] [ранг]<br>/r [текст]<br>/d [text]<br>/su [id] [прична]", player,0);
    }

    invite(player:PlayerMP, id:number) {
        console.log(id);
        if (player.info.orgRank < 9) {
            Helper.sendMessage(this.orgColor, "#ff9696", "[LSPD] ", "Приглашать в организацию могут игроки начиная с ранга " + this.ranks[9],player,0);
            return;
        } else {
            
            if (!id) {
                Helper.sendMessage(this.orgColor, "white", "[LSPD] ", "Подсказка: /invite [id игрока]", player,0);
                return;
            }
            var pl = mp.players.at(id);
            if (pl == null) {
                Helper.sendMessage(this.orgColor, "#ff9696", "[LSPD] ", "Игрок с данным id не найден!", player,0);
                return;
            }
            pl.info.invite.orgtype = this.type;
            pl.info.invite.orgid = this.id;
            pl.info.invite.time = (new Date().getTime()/1000);

            Helper.sendMessage("", "#2ee06e", "", this.ranks[player.info.orgRank - 1] + " " + player.name + " пригласил вас вступить в организацию <font color=" + this.orgColor + ">[" + this.name + "]</font>, что бы принять приглашение напишите <font color=white>/acceptinvite</font>", player,0);
        }
    }

    uninvite(player, id) {

    }

    radioChat(player:PlayerMP, str:string) {
        var rname = this.ranks[player.info.orgRank - 1];
        if (player.info.orgRank == 15)
            rname = "*" + rname + "*";
        var text = "<font color=" + this.orgColor + ">[РАЦИЯ] " + rname + " " + player.name + ": " + str + "</font>";
        var b64 = new Buffer(JSON.stringify({ "type": "chat", "text": text })).toString("base64");

        mp.players.forEach(_player => { if (_player.info.organization == 1) _player.outputChatBox(b64); });

    }
    depChat(player:PlayerMP, str:string) {
        
        if (player.info.orgRank >= 13)
        {
            var rname = this.ranks[player.info.orgRank - 1];
            var text = "<font color=#ff9398>[D] " + rname + " " + player.name + ": " + str + "</font>";
            var b64 = new Buffer(JSON.stringify({ "type": "chat", "text": text })).toString("base64");

            mp.players.forEach(_player => { if (_player.info.organization == 1) _player.outputChatBox(b64); });
        }else
        {
            Helper.sendMessage(this.orgColor, "#ff9696", "[LSPD] ", "У вас не достаточно полномочий!", player,0);
            return;
        }

    }

    update() {

    }
}