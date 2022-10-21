import { PayloadAction } from "@reduxjs/toolkit";
import { API_URL } from "../../constants/enviroment";
import { IGame } from "../../models/IGame";
import { RequestPayload, RequestsEnum, REQUEST_ACTION_TYPE } from "../../store/middleware/requestMiddleware";
import { addGame } from "../../store/slices/gamesSlice";
import getAuthHeaders from "./setAuthHeaders";

export interface IPostGameRequest {
    name: string,
    description: string,
    ne_lat: number,
    ne_lng: number,
    sw_lat: number,
    sw_lng: number,
    startTime: string,
    endTime: string
}

interface IParams {
    postGameRequest: IPostGameRequest,
}

async function postGame({postGameRequest}: IParams): Promise<IGame>{
    const headers = await getAuthHeaders();

    let response = await fetch(`${API_URL}/game`, {
        method: "POST",
        headers,
        body: JSON.stringify(postGameRequest),
    });
    if(!response.ok){
        var jsonError = await response.json();
        console.log(jsonError);
        var stringRequest = "";

        if(jsonError){
            if(jsonError.errors){
                Object.entries(jsonError.errors).forEach((entry) => {
                    const [key, value] = entry;
                    console.log(value);
                    if(value instanceof Array){
                        if(value.length > 0){
                            stringRequest += `${value[0]}\n`
                        }
                    }
                });
            }else{
                stringRequest=jsonError;
            }
        }
        throw new Error(stringRequest || response.statusText);
    }
    let createdGame = await response.json() as IGame;
    return createdGame;
};


export const PostGameAction: (gameInfo: IPostGameRequest, sideEffect: ()=> void) => PayloadAction<RequestPayload<IParams, IGame>> = (gameInfo: IPostGameRequest, sideEffect: ()=> void) => ({
        type: REQUEST_ACTION_TYPE,
        payload: {
            cbDispatch: addGame,
            params: {postGameRequest: gameInfo},
            request: postGame,
            requestName: RequestsEnum.PostGame,
            sideEffect,
        },
    });