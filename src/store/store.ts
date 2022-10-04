import { AnyAction, applyMiddleware, combineReducers, legacy_createStore } from "redux";
import fetchGameMiddelware from "./middleware/fetchGameMiddleware";
import fetchGamesMiddelware from "./middleware/fetchGamesMiddleware";
import gameSlice from "./slices/gameSlice";
import gamesSlice from "./slices/gamesSlice";

const appReducers = combineReducers({
    game: gameSlice,
    games: gamesSlice,
});


export const store = legacy_createStore(appReducers, applyMiddleware(fetchGamesMiddelware, fetchGameMiddelware));

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof appReducers>;