import { Middleware, Action} from "redux";
import { IChat } from "../../models/IChat";
import { setGame, setSendingMessage } from "../slices/gameSlice";
import { RootState } from "../store";


const ACTION_TYPE = "game/submitChatMessage"

const submitChatMessageMiddleware: Middleware<{}, RootState> = storeApi => next => action => {
    if(action.type === ACTION_TYPE) {
        storeApi.dispatch(setSendingMessage(true));
        setTimeout(() => {
            const game = storeApi.getState().game.game!;
            storeApi.dispatch(setGame({
                ...game,
                chat: [... game.chat, action.payload.chat],
            }));
        }, 2500);
    }
    return next(action);
}

export const submitChatMessageAction: (playerId: number, chat: IChat) => Action<string> = (playerId: number, chat: IChat) => {return {type: ACTION_TYPE, payload: {playerId, chat}}}

export default submitChatMessageMiddleware;