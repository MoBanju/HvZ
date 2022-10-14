import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RequestsEnum } from "../middleware/requestMiddleware";


interface Request {
    name: RequestsEnum,
    inProgress: boolean,
    error: Error | undefined,
}

interface InitialState {
    requests: Request[],
}

const initialState: InitialState = {
    requests: [],
};

const requestSlice = createSlice({
    name: "request",
    initialState,
    reducers: {
        RequestStarted: (state, action: PayloadAction<RequestsEnum>) => {
            const existingCall = state.requests.find(request => request.name === action.payload)

            // Check for existing request
            if (existingCall)
                return {
                    ...state,
                    requests: state.requests.map(request =>
                        request.name === action.payload ?
                            { ...request, inProgress: true, error: undefined } :
                            request
                    ),
                }

            // Else add request
            return {
                ...state,
                requests: [...state.requests, { name: action.payload, inProgress: true, error: undefined }],
            };
        },
        // Remove the request from the list.
        RequestFinished: (state, action: PayloadAction<RequestsEnum>) => {
            return {
                ...state,
                requests: state.requests.filter(request => request.name !== action.payload),
            };
        },
        RequestFailed: (state, action: PayloadAction<{ requestName: RequestsEnum, error: Error }>) => {
            return {
                ...state,
                requests: state.requests.map(request =>
                    request.name === action.payload.requestName ?
                        { ...request, error: action.payload.error, inProgress: false } :
                        request
                ),
            };
        },
    },
});

export function namedRequestInProgress(state: InitialState, requestName: RequestsEnum): boolean {
    return state.requests.find(request => request.name === requestName && request.inProgress)?.inProgress || false;
};

export function namedRequestError(state: InitialState, requestName: RequestsEnum): Error | undefined {
    return state.requests.find(request => request.name === requestName && request.error)?.error
};

export function namedRequestInProgAndError(state: InitialState, requestName: RequestsEnum): [boolean, Error | undefined] {
    let request = state.requests.find(request => request.name === requestName)
    let inprogress = request?.inProgress || false;
    let error = request?.error;
    return [inprogress, error];
};

export const { RequestStarted, RequestFinished, RequestFailed } = requestSlice.actions;

export default requestSlice.reducer;