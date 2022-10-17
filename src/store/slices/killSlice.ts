
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IKill } from "../../models/IKill";

interface initialeState {
    kills: IKill[],
}

const initialeState: initialeState = {
    kills: [],
}

const killSlice = createSlice({
    name: 'kills',
    initialState: initialeState,
    reducers: {
        setKills: (state, action: PayloadAction<IKill[]>) =>
            state = {kills: action.payload,}
    },
});


export const { setKills } = killSlice.actions;

export default killSlice.reducer;