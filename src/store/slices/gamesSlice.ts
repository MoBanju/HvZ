import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IGame } from "../../models/IGame";

interface initialeState {
    isLoaded: boolean,
    error: Error | undefined,
    games: IGame[] | undefined,
}

const initialeState: initialeState = {
    isLoaded: false,
    error: undefined,
    games: undefined,
}

const gameSlice = createSlice({
    name: 'games',
    initialState: initialeState,
    reducers: {
        setGamesError: (state, action: PayloadAction<string>) => 
            state = {
                ...state,
                error: new Error(action.payload),
            },
        setGames: (state, action: PayloadAction<IGame[]>) => 
            state = {
                isLoaded: true,
                error: undefined,
                games: action.payload,
            }
    },
});


export const { setGamesError, setGames } = gameSlice.actions;

export default gameSlice.reducer;