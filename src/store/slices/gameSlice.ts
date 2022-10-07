import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IGameDetailed } from "../../models/IGameDetailed";

interface initialeState {
    isLoaded: boolean,
    sendingMessage: boolean,
    error: Error | undefined,
    game: IGameDetailed | undefined,
}

const initialeState: initialeState = {
    isLoaded: false,
    sendingMessage: true,
    error: undefined,
    game: undefined,
}

const gameSlice = createSlice({
    name: 'game',
    initialState: initialeState,
    reducers: {
        setGameError: (state, action: PayloadAction<string>) => {
            return {
                ...state,
                isLoaded: false,
                error: new Error(action.payload),
                game: undefined,
            };
        },
        setSendingMessage: ( state, action: PayloadAction<boolean> ) => {
            return {
                ...state,
                sendingMessage: action.payload,
            }
        },
        setGame: (state, action: PayloadAction<IGameDetailed>) => {
            return {
                isLoaded: true,
                sendingMessage: false,
                error: undefined,
                game: action.payload,
            };
        }
    },
});


export const { setGameError, setGame, setSendingMessage } = gameSlice.actions;

export default gameSlice.reducer;