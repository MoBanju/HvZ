import { ActionCreatorWithPayload, PayloadAction } from "@reduxjs/toolkit";
import { Middleware } from "redux";
import { RequestFailed, RequestFinished, RequestStarted } from "../slices/requestSlice";
import { RootState } from "../store";

export const REQUEST_ACTION_TYPE = "request/iniateRequest";

export enum RequestsEnum {
    GetGames,
    GetGamePlayerAndKillsByGameId,
    DeleteGameById,
    GetChatByGameId,
    PostChatMessage,
    PostGame,
    PostKill,
    postPlayerInGame,
    PutPlayerType,
    DeletePlayerById,
    PutGameById,
    PostSquad,
    postPlayerInSquad,
}

export interface RequestPayload<P, T> {
    requestName: RequestsEnum,
    cbDispatch: ActionCreatorWithPayload<T, string>;
    params: P,
    request: ({}: P) => Promise<T>;
    sideEffect?: () => void;
}

const requestMiddleware: Middleware<{}, RootState> = storeApi => next => (action: PayloadAction<RequestPayload<any, any>>) => {
    if(action.type === REQUEST_ACTION_TYPE)
    {
        const { requestName, params, cbDispatch, request, sideEffect} = action.payload;
        // Set the request as in progress / is-loading
        storeApi.dispatch(RequestStarted(requestName));
        // Iniate the request
        request(params)
        .then(data => {
            // Update the redux store with data retrived from the request
            storeApi.dispatch(cbDispatch(data));
            // Update the request to complete / is-not-loading
            storeApi.dispatch(RequestFinished(requestName));
            if(sideEffect)
                sideEffect();
        })
        .catch((error) => {
            // Update the request to failed
            storeApi.dispatch(RequestFailed({requestName, error}));
        });
    }

    return next(action);
}


export default requestMiddleware;