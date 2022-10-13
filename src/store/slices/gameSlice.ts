import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IChatResponse } from "../../components/api/getChatByGameId";
import keycloak from "../../keycloak";
import { IChat } from "../../models/IChat";
import { IGame } from "../../models/IGame";
import { IPlayer } from "../../models/IPlayer";

interface initialeState {
    game: IGame | undefined,
    currentPlayer: IPlayer | undefined,
    players: IPlayer[],
    chat: IChat[],
}

const initialState: initialeState = {
    game: undefined,
    currentPlayer: undefined,
    players: [],
    chat: [],
}


const gameSlice = createSlice({
    name: 'game',
    initialState: initialState,
    reducers: {
        setGame: (state, action: PayloadAction<{ game: IGame, players: IPlayer[] }>) => {
            const currPlayer = action.payload.players.find(player => player.user.keyCloakId === keycloak.tokenParsed?.sub)
            return {
                ...state,
                ...action.payload,
                currentPlayer: currPlayer,
            };
        },
        setChat: (state, action: PayloadAction<IChatResponse[]>) => {
            let chat = action.payload.map<IChat>(chatResponse => {
                let player = state.players.find(player => player.id === chatResponse.playerId);
                if (!player)
                    throw new Error("INVALID PLAYER!");
                return {
                    id: chatResponse.playerId,
                    message: chatResponse.message,
                    chatTime: chatResponse.chatTime,
                    isHumanGlobal: chatResponse.isHumanGlobal,
                    isZombieGlobal: chatResponse.isZombieGlobal,
                    player: player as IPlayer,
                };
            });
            return {
                ...state,
                chat,
            }
        },
        addChatMsg: (state, action: PayloadAction<IChat>) => ({
            ...state,
            chat: [...state.chat, action.payload],
        }),
        updatePlayerState: (state, action: PayloadAction<IPlayer>) => {
            let players = state.players.map(player => {
                if(player.id === action.payload.id){
                    return action.payload
                }
                return player
            })

            return {
                ...state,
                players
            }

        },
        addPlayer: (state, action: PayloadAction<IPlayer>) => {
            const currPlayer = action.payload.user.keyCloakId === keycloak.tokenParsed?.sub ? action.payload : undefined;
            return {
                ...state,
                currentPlayer: currPlayer,
                players: [...state.players!, action.payload],
            }
        }
    },
});


export const { setGame, setChat, addChatMsg , updatePlayerState, addPlayer} = gameSlice.actions;

export default gameSlice.reducer;