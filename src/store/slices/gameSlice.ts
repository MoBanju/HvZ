import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IChatResponse } from "../../components/api/getChatByGameId";
import { IChat } from "../../models/IChat";
import { IGame } from "../../models/IGame";
import { IPlayer } from "../../models/IPlayer";

interface initialeState {
    game: IGame | undefined,
    currentPlayer: IPlayer | undefined,
    players: IPlayer[],
    chat: IChat[],
}

const initialeState: initialeState = {
    game: undefined,
    currentPlayer: undefined,
    players: [],
    chat: [],
}

const gameSlice = createSlice({
    name: 'game',
    initialState: initialeState,
    reducers: {
        setGame: (state, action: PayloadAction<{ game: IGame, players: IPlayer[] }>) => {
            return {
                ...state,
                ...action.payload,
                // TODO: Temp fix, current player is always first player in list.
                currentPlayer: action.payload.players[0],
            };
        },
        setChat: (state, action: PayloadAction<IChatResponse[]>) => {
            let chat = action.payload.map<IChat>(chatResponse => {
                let player = state.players.find(player => player.id === chatResponse.playerId);
                if(!player)
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
    },
});


export const { setGame, setChat, addChatMsg } = gameSlice.actions;

export default gameSlice.reducer;