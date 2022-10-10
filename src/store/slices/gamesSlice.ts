import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IGame } from "../../models/IGame";

interface initialeState {
    games: IGame[],
}

const initialeState: initialeState = {
    games: [],
}

const gameSlice = createSlice({
    name: 'games',
    initialState: initialeState,
    reducers: {
        setGames: (state, action: PayloadAction<IGame[]>) =>
            state = {
                games: action.payload,
            },
        removeGame: (state, action: PayloadAction<number>) =>
            state = {
                ...state,
                games: state.games?.filter((game) => game.id !== action.payload)
                
            },
        // TODO: This is a temp action to the create game form.
        addGame: (state, action: PayloadAction<IGame>) => 
            state = {
                games: [...state.games!, action.payload],
            },
    },
});


export const { setGames, removeGame, addGame } = gameSlice.actions;

export default gameSlice.reducer;