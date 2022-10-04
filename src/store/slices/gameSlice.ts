import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IGameDetailed } from "../../models/IGameDetailed";

interface initialeState {
    isLoaded: boolean,
    error: Error | undefined,
    game: IGameDetailed | undefined,
}

const initialeState: initialeState = {
    isLoaded: false,
    error: undefined,
    game: undefined,
}

const gameSlice = createSlice({
    name: 'game',
    initialState: initialeState,
    reducers: {
        setGameError: (state, action: PayloadAction<string>) => {
            return {
                isLoaded: false,
                error: new Error(action.payload),
                game: undefined,
            };
        },
        setGame: (state, action: PayloadAction<IGameDetailed>) => {
            return {
                isLoaded: true,
                error: undefined,
                game: action.payload,
            };
        }
    },
});


export const { setGameError, setGame  } = gameSlice.actions;

export default gameSlice.reducer;