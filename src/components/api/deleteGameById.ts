import { PayloadAction } from "@reduxjs/toolkit";
import { API_URL } from "../../constants/enviroment";
import { RequestPayload, RequestsEnum, REQUEST_ACTION_TYPE } from "../../store/middleware/requestMiddleware";
import { removeGame } from "../../store/slices/gamesSlice";
import getAuthHeaders from "./setAuthHeaders";

interface IParams {
    id: number
}


async function deleteGameById({ id }: IParams) {
    const headers = await getAuthHeaders();
    const response = await fetch(API_URL + "/game/" + id, {
        headers,
        method: "DELETE",
    });
    if(!response.ok)
        throw new Error(response.statusText);
    return id;
}

export function DeleteGameByIdAction(id: number, sideEffect: () => void): PayloadAction<RequestPayload<IParams, number>> {
    return {
        type: REQUEST_ACTION_TYPE,
        payload: {
            cbDispatch: removeGame,
            params: { id },
            request: deleteGameById,
            requestName: RequestsEnum.DeleteGameById,
            sideEffect,
        },
    }
};