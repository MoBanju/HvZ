import { IChat } from "../models/IChat";
import { IGame } from "../models/IGame";
import { IGameDetailed } from "../models/IGameDetailed";
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

export const GAMES: IGameDetailed[] = [
    {
        id: 1,
        title: 'Game 1',
        description: 'Description lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. A scelerisque purus semper eget. Pharetra et ultrices neque ornare aenean euismod. Eu volutpat odio facilisis mauris sit amet massa vitae. Dignissim enim sit amet venenatis urna cursus eget nunc.',
        state: 'register',
        chat: CHAT,
        players: PLAYERS,
    },
    {
        id:2,
        title: 'Game 2',
        description: 'Game 2 desc',
        state: 'complete',
        chat: CHAT,
        players: PLAYERS,
    },
    {
        id: 3,
        title: 'Game 3',
        description: 'Game 3 desc',
        state: 'complete',
        chat: CHAT,
        players: PLAYERS,
    },
    {
        id: 4,
        title: 'Game 4',
        description: 'Game 4 desc',
        state: 'inprogress',
        chat: CHAT,
        players: PLAYERS,
    },
];