import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IGame } from "../../models/IGame";

interface initialeState {
    isLoaded: boolean,
    error: Error | undefined,
    games: IGame[],
}

const initialeState: initialeState = {
    isLoaded: false,
    error: undefined,
    games: [],
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
            },
        // TODO: This is a temp action to the create game form.
        addGame: (state, action: PayloadAction<IGame>) => 
            state = {
                isLoaded: true,
                error: undefined,
                games: [...state.games!, action.payload],
            },
    },
});


export const { setGamesError, setGames, addGame } = gameSlice.actions;

export default gameSlice.reducer;