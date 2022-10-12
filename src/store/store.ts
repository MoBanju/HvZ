import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import requestMiddleware from "./middleware/requestMiddleware";
import gameSlice from "./slices/gameSlice";
import gamesSlice from "./slices/gamesSlice";
import requestsSlice from "./slices/requestSlice";

const appReducers = combineReducers({
    requests: requestsSlice,
    game: gameSlice,
    games: gamesSlice,
});

const appMiddleware = applyMiddleware(
    requestMiddleware,
)


export const store = legacy_createStore(appReducers, appMiddleware);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof appReducers>;