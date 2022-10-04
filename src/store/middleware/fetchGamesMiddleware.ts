import { AnyAction, Middleware } from "redux";
import { GAMES } from "../../constants/GAMES";
import { setGames } from "../slices/gamesSlice";
import { RootState } from "../store";


const ACTION_TYPE = "games/fetchGames"

const fetchGamesMiddelware: Middleware<{}, RootState> = storeApi => next => action => {
    if(action.type === ACTION_TYPE) {
        setTimeout(() => {
            storeApi.dispatch(setGames(GAMES))
        }, 2500);
    }
    return next(action);
}

export const fetchGamesAction: AnyAction = { type: ACTION_TYPE }

export default fetchGamesMiddelware;