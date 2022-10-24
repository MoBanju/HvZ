import { ISquad } from "./ISquad";
import { ISquadMember } from "./ISquadMember";

export interface ISquadCheckin{
    Id: number,
    StartTime: string,
    EndTime: string,
    Latitude: number,
    Longitude: number,
    SquadMember: ISquadMember,
    Squad: ISquad
}