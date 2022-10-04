import { IChat } from "../models/IChat";
import { IGame } from "../models/IGame";
import { IPlayer } from "../models/IPlayer";


const CHAT: IChat[] = [
    {
        chatTime: '0',
        isHumanGlobal: true,
        isZombieGlobal: false,
        message: 'HUMANS SHOULD SEE THIS'
    },
    {
        chatTime: '1',
        isHumanGlobal: false,
        isZombieGlobal: true,
        message: 'Zombies SHOULD SEE THIS'
    }
]

const PLAYERS: IPlayer[] = [
    {
        biteCode: '1234ABCD',
        id: 1,
        isHuman: true,
        isPatientZero: false,
    },
    {
        biteCode: '1234ABCD',
        id: 2,
        isHuman: false,
        isPatientZero: true,
    },
]

export const GAMES: IGame[] = [
    {
        id: 1,
        title: 'Game 1',
        description: 'Game 1 desc',
        state: 'register',
    },
];