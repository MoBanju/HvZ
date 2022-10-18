
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IKillResponse } from "../../components/api/getKillsByGameId";
import { IKill } from "../../models/IKill";

interface initialeState {
    kills: IKillResponse[],
}

const initialeState: initialeState = {
    kills: [],
}

const killSlice = createSlice({
    name: 'kills',
    initialState: initialeState,
    reducers: {
        setKills: (state, action: PayloadAction<IKillResponse[]>) =>
            state = {kills: action.payload,}
    },
});


export const { setKills } = killSlice.actions;

export default killSlice.reducer;