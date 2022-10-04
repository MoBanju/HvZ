import { Middleware, Action} from "redux";
import { GAMES } from "../../constants/GAMES";
import { IGameDetailed } from "../../models/IGameDetailed";
import { setGame, setGameError } from "../slices/gameSlice";
import { RootState } from "../store";


const ACTION_TYPE = "game/fetchGame"

const fetchGameMiddelware: Middleware<{}, RootState> = storeApi => next => action => {
    if(action.type === ACTION_TYPE) {
        setTimeout(() => {
            try {
                const GAME = GAMES.find(game => game.id === action.payload) as IGameDetailed
                if(!GAME)
                    throw new Error("No game with that Id");
                storeApi.dispatch(setGame(GAME))
            }
            catch (e) {
                storeApi.dispatch(setGameError((e as Error).message))
            }
        }, 2500);
    }
    return next(action);
}

export const fetchGameAction: (id: number) => Action<string> = (id: number) => { return { type: ACTION_TYPE, payload: id}}

export default fetchGameMiddelware;