import { PayloadAction } from "@reduxjs/toolkit";
import { RequestPayload, RequestsEnum, REQUEST_ACTION_TYPE } from "../../store/middleware/requestMiddleware";
import { removeGame } from "../../store/slices/gamesSlice";

interface IParams {
    id: number
}

async function deleteGameById({ id }: IParams) {
    const response = await fetch("http://localhost:5072/game/" + id, {
        method: "DELETE",
    });
    if(!response.ok)
        throw new Error(response.statusText);
    return id;
}

export function DeleteGameByIdAction(id: number): PayloadAction<RequestPayload<IParams, number>> {
    return {
        type: REQUEST_ACTION_TYPE,
        payload: {
            cbDispatch: removeGame,
            params: { id },
            request: deleteGameById,
            requestName: RequestsEnum.DeleteGameById,
        },
    }
};