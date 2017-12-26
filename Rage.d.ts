import {PlayerInfo} from "./PlayerInfo"
import {VehicleInfo} from "./VehicleInfo"
type EntityType = "player" | "vehicle" | "object" | "pickup" | "blip";
 
interface Mp {
    players: PlayerMpPool;
    vehicles: VehicleMpPool;
    objects: ObjectMpPool;
    pickups: PickupMpPool;
    blips: BlipMpPool;
    events: EventMpPool;
    enviroment: EnviromentMp;
    checkpoints: CheckpointMpPool;
    markers:MarkersMpPool;
    colshapes:ColshapesMpPool;
    Vector3: Vector3;
 
    joaat(str: string): number;
    joaat(strs: string[]): number[];
}
 
interface EntityMp {
    id: number;
    dimension: number;
    type: EntityType;
    model: number;
    position: Vector3;
    handle: number;
}
 
interface PlayerMP extends EntityMp {
    name: string;
    heading: number;
    health: number;
    armour: number;
    info:PlayerInfo;

    readonly action: string;
    readonly isJumping: boolean;
    readonly isInCover: boolean;
    readonly isClimbing: boolean;
    readonly isEnteringVehicle: boolean;
    readonly isLeavingVehicle: boolean;
    readonly vehicle: VehicleMp;
    readonly seat: VehicleSeatMp;
    readonly isAiming: boolean;
    readonly aimTarget: PlayerMP;
    readonly ping: number;
    readonly ip: string;
    
    kick(reason: string): void;
    setHeadBlend(shapeFirstID:number, shapeSecondID:number,shapeThirdID:number, skinFirstID:number, skinSecondID:number, skinThirdID:number,
        shapeMix:number, skinMix:number, thirdMix:number): void;
    setFaceFeature(index:number,value:number): void;
    ban(reason: string): void;
    spawn(position: Vector3): void;
    giveWeapon(weaponHash: number, ammo: number): void;
    giveWeapon(weaponHashes: number[], ammo: number): void;
    outputChatBox(message: string): void;
    getClothes(component: ClothesComponentMp): {
        readonly drawable: number,
        readonly texture: number,
        readonly palette: number };
    setClothes(component: ClothesComponentMp, drawable, texture, palette: number): void;
    getProp(prop: PlayerPropMp): { readonly drawable: number, readonly texture: number };
    setProp(prop: PlayerPropMp, drawable: number, texture: number): void;
    putIntoVehicle(vehicle: VehicleMp, seat: VehicleSeatMp): void;
    removeFromVehicle(): void;
    invoke(...any): any;
    call(name:string,...args): void;
    notify(message: string): void;
}
 
interface VehicleMp extends EntityMp {
    info: VehicleInfo;
    rotation: Vector3;
    readonly velocity: Vector3;
    readonly siren: boolean;
    readonly horn: boolean;
    readonly engine: boolean;
    readonly highbeams: boolean;
    readonly engineHealth: number;
    readonly bodyHealth: number;
    readonly steerAngle: number;
    readonly rocketBoost: boolean;
    readonly brake: boolean;
 

    setColour(color1:number,color2:number): void;
    repair(): void;
    destroy(): void;
}
 
interface EventMp extends EntityMpPool<null> {
   
}
 
interface ObjectMp extends EntityMp {
    rotation: Vector3;
}
 
interface PickupMp extends EntityMp {
 
}
 
interface BlipMp extends EntityMp {
    radius: number;
}

interface CheckpointMp extends EntityMp {
    
}
interface MarkerMp extends EntityMp {
    
}
interface ColshapeMp extends EntityMp {
    
}

interface ColshapesMpPool extends EntityMpPool<ColshapeMp>
{
    "newCircle"(x:number,y:number,radius:number): ColshapeMp;
    "newCircleA"(x:number,y:number,z:number,radius:number): ColshapeMp;
    "newRectangle"(x:number, y:number, width:number, height:number): ColshapeMp;
}

interface CheckpointMpPool extends EntityMpPool<CheckpointMp>
{
    "new"(type:number,position:Vector3,direction:Vector3,radius:number,r:number,g:number,b:number,a:number): CheckpointMp;
}

interface MarkersMpPool extends EntityMpPool<MarkerMp>
{
    "new"(type:number,position:Vector3,direction:Vector3,to:Vector3,radius:number,r:number,g:number,b:number,a:number): MarkerMp;
}
 
interface EntityMpPool<T> {
    readonly length: number;
    readonly size: number;
 
    at(id: number): T;
    forEach(callback: (arg: T) => void): void;
    toArray(): T[];
}
 
interface PlayerMpPool extends EntityMpPool<PlayerMP> {
   
}
 
interface VehicleMpPool extends EntityMpPool<VehicleMp> {
    "new"(vehicleHash: number, position: Vector3): VehicleMp;
}
 
interface ObjectMpPool extends EntityMpPool<ObjectMp> {
    "new"(objectHash: number, position: Vector3, rotation: Vector3): ObjectMp;
}
 
interface PickupMpPool extends EntityMpPool<PickupMp> {
   
}
 
interface BlipMpPool extends EntityMpPool<BlipMp> {
    "new"(position: Vector3);
    "new"(position: Vector3, radius: number);
    "new"(entityToAttachTo: EntityMp);
}
 
interface EventMpPool extends EntityMpPool<EventMp> {
    add(eventName: string, callback: (...args: any[]) => void);
    addCommand(commandName:string, callback: (player:PlayerMP,...args) => void);
    call(eventName: string, ...args: any[]);
}
 
interface EnviromentMp {
    weather: string;
    time: TimeMp;
}
 
interface Vector3 {
    new(x: number, y: number, z: number): Vector3;
 
    x: number;
    y: number;
    z: number;
}
 
interface TimeMp {
    hour: number;
    minute: number;
    second: number;
}
 
declare enum ClothesComponentMp {
    Head = 0,
    Beard = 1,
    Hair = 2,
    Torso = 3,
    Legs = 4,
    Hands = 5,
    Foot = 6,
    None = 7,
    Accessories1 = 8,
    Accessories2 = 9,
    Mask = 10,
    Decals = 11,
    Auxiliary = 12
}
 
declare enum PlayerPropMp {
    Helmet = 0,
    Glasses = 1,
    EarAccessory = 2
}
 
declare enum VehicleSeatMp {
    Driver = 0,
    Passenger1 = 1,
    Passenger2 = 2,
    Passenger3 = 3
}
