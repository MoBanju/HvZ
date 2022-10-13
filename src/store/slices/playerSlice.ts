import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IGame } from "../../models/IGame";
import { IPlayer } from "../../models/IPlayer";

interface initialeState {
    players: IPlayer[],
}

const initialeState: initialeState = {
    players: [],
}

const gameSlicePlayer = createSlice({
    name: 'player',
    initialState: initialeState,
    reducers: {
        addPlayer: (state, action: PayloadAction<IPlayer>) => 
            state = {
                players: [...state.players!, action.payload],
            },
    },
});


export const { } = gameSlicePlayer.actions;

export default gameSlicePlayer.reducer;