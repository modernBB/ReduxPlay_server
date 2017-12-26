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
export class Groove extends Organization {

    constructor(id) {
        super();
        this.carColors = 53; //green
        this.type = 1;
        this.name = "GROOVE STREET";
        this.orgColor = "#46dd4e";
        this.carContainer = new Array();
        this.spawnPoints = [new mp.Vector3(129.51, -1940.66, 20.75)];
        this.ranks = ["Playa", "Hustla", "Killa", "Young G", "Gangsta", "O.G", "Mobsta", "De King", "Legend", "Madd Dogg"];
        
        mp.markers.new(1,new mp.Vector3(117.60,-1950.06,19.65),new mp.Vector3(0,0,0),new mp.Vector3(0,0,0),1.5,255,70,70,200);

        mp.colshapes.newCircleA(117.60,-1950.06,20.55, 0.75);
        
    }

   addCar(veh:VehicleInfo){

        var spawnInfo = this.carContainer[veh.carPlacecontainer];
        veh.container = spawnInfo;
        let lveh = mp.vehicles.new(mp.joaat(veh.hash),spawnInfo.pos);
        lveh.setColour(this.carColors,this.carColors);
        lveh.info = veh;
        lveh.rotation = new mp.Vector3(0, 0, spawnInfo.rot);
        this.carsIDs.push(lveh.info.uid);
   }

    awake() {

        this.carContainer.push(new CarContainer(new mp.Vector3(95.60, -1947.08, 20.21),35));
        this.carContainer.push(new CarContainer(new mp.Vector3(103.0960, -1955.39, 20.20),-4.6));
        this.carContainer.push(new CarContainer(new mp.Vector3(86.19, -1970.97, 20.59),-39.9));
        this.carContainer.push(new CarContainer(new mp.Vector3(91.69, -1964.65, 20.56),-39.9));
        this.carContainer.push(new CarContainer(new mp.Vector3(113.9069, -1933.51, 20.13),32.5));
        this.carContainer.push(new CarContainer(new mp.Vector3(114.95, -1947.82, 20.28),-37.79));
        this.carContainer.push(new CarContainer(new mp.Vector3(103.37, -1927.86, 20.06),76.3));
      /*  for (var i in this.carSpawnPoints) {
            let veh = mp.vehicles.new(mp.joaat(this.carnames[i]), this.carSpawnPoints[i]);
            var veh_info = new VehicleInfo(this.carSpawnPoints[i],this.carRots[i],this.carnames[i],this.id,VehicleType.Band,100.0);
            veh.info = veh_info;
            veh.rotation = new mp.Vector3(0, 0, this.carRots[i]);
            
        }
        console.log(this.name + " -spawn "+this.carSpawnPoints.length+" cars");

        var b = mp.blips.new(new mp.Vector3(441.79, -986.82, 30.68));
        b.model = 60;
        console.log(this.name + " -blips load");*/

    }


    setMemberRank(player, member, rank) {
        if (player.info.orgRank < 7) {
            Helper.sendMessage(this.orgColor, "#ff9696", "[GROOVE] ", "У вас не достаточно полномочий!", player,0);
            return;
        }

        var maxRankUp = (player.info.orgRank - 1);
        if (player.info.orgRank == 7)
            maxRankUp = 3;

        if (member == null || rank == null) {
            Helper.sendMessage(this.orgColor, "white", "[GROOVE] ", "Подсказка: /setrank [id игрока] [1-" + maxRankUp + " ранг]", player,0);
            return;
        }


        if (rank > maxRankUp) {
            Helper.sendMessage(this.orgColor, "#ff9696", "[GROOVE] ", "Вы не можете повысить игрока до звания выше чем <font color='white'>\"" + this.ranks[maxRankUp - 1] + " [" + maxRankUp + "]\"</font>", player,0);
            return;
        }

        /*  if (player.id == member) {
              Helper.sendMessage("#ff9696", "#ff9696", "[LSPD] ", "Вы не можете изменять свое звание", null, false, player);
              return;
          }*/

        var upMember = mp.players.at(member);
        if (upMember.info.organization != this.id) {
            Helper.sendMessage(this.orgColor, "#ff9696", "[GROOVE] ", "Данный игрок не находится в вашей организации!", player,0);
            return;
        }


        var updown = "повысили";
        if (upMember.info.orgRank > rank)
            updown = "понизили";

        upMember.info.orgRank = rank;
        Helper.sendMessage(this.orgColor, "#ff9696", "[GROOVE] ", "Вас " + updown + " в звании, теперь вы <font color='white'>\"" + this.ranks[rank - 1] + " [" + rank + "]" + "\"</font>",player,0);

    }

    help(player, args) {
        Helper.sendMessage(this.orgColor, "white", "[GROOVE] ", "Команды:<br>/invite [id]<br>/uninvite [id]<br>/setrank [id] [ранг]<br>/r [текст]<br>/d [text]<br>/su [id] [прична]",player,0);
    }

    invite(player:PlayerMP, id:number) {
        if (player.info.orgRank < 9) {
            Helper.sendMessage(this.orgColor, "#ff9696", "[GROOVE] ", "Приглашать в организацию могут игроки начиная с ранга " + this.ranks[9], player,0);
            return;
        } else {
            
            if (!id) {
                Helper.sendMessage(this.orgColor, "white", "[GROOVE] ", "Подсказка: /invite [id игрока]",  player,0);
                return;
            }
            var pl = mp.players.at(id);
            if (pl == null) {
                Helper.sendMessage(this.orgColor, "#ff9696", "[GROOVE] ", "Игрок с данным id не найден!", player,0);
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
        if (player.info.orgRank == this.ranks.length)
            rname = "*" + rname + "*";
        var text = "<font color=" + this.orgColor + ">[F] " + rname + " " + player.name + " ["+player.id+"]: " + str + "</font>";

        mp.players.forEach(_player => { if (_player.info.organization == this.id) _player.outputChatBox(text); });

    }

    update() {

    }
}