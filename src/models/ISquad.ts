import { IChat } from "./IChat";
import { ISquadMember } from "./ISquadMember";

export interface ISquad{
    id: number,
    name: string,
    is_human: boolean,
    deseasedPlayers: number,
    squadMember: ISquadMember[],
}