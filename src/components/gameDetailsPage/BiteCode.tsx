import { IoIosArrowDroprightCircle } from "react-icons/io";
import { MutableRefObject, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { IKillRequest, PostKillAction } from "../api/postKill";
import { IGame } from "../../models/IGame";
import { IPlayer } from "../../models/IPlayer";
import { namedRequestInProgAndError, RequestStarted } from "../../store/slices/requestSlice";
import { RequestsEnum } from "../../store/middleware/requestMiddleware";
import { Spinner } from "react-bootstrap";

function BiteCode() {

  const inputBiteCodeRef = useRef() as MutableRefObject<HTMLInputElement>;
  const { game, currentPlayer, players } = useAppSelector(state => state.game) as { game: IGame, currentPlayer: IPlayer | undefined, players: IPlayer[] }
  const [isLoading, error] = namedRequestInProgAndError(useAppSelector(state => state.requests), RequestsEnum.PostKill);
  const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);
  const dispatch = useAppDispatch();


  const handleSubmitBiteCode = () => {
    const biteCode = inputBiteCodeRef.current.value;
    if(biteCode.trim().length === 0)
      return

    dispatch(RequestStarted(RequestsEnum.PostKill));
    navigator.geolocation.getCurrentPosition(
      //success getting current users location
      (location) => {
        let requset: IKillRequest = {
          timeDeath: new Date().toJSON(),
          killerId: currentPlayer!.id,
          biteCode: biteCode,
          description: "  ",
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        const action = PostKillAction(game.id, requset, buildsuccessMessage);
        dispatch(action);
      },
      // error getting current users location
      () => {
        let requset: IKillRequest = {
          timeDeath: new Date().toJSON(),
          killerId: currentPlayer!.id,
          biteCode: biteCode,
          description: "",
        };
        const action = PostKillAction(game.id, requset, buildsuccessMessage);
        dispatch(action);

      },
    )
    // Clear the old success message when attemping a new request.
    setSuccessMessage(undefined);
  }

  // This is a sideeffect to the submit bitecode request.
  // That means that this functions get run after the request completes with no errors.
  const buildsuccessMessage = () => {
    const victim = players.find(player => player.biteCode === inputBiteCodeRef.current.value);
    if(!victim)
      return;
    
    setSuccessMessage(`You just turned ${victim.user.firstName} into a ZOMBIE!`);
  }

  const buildFeedBackMessage = () => {
    if(error)
      return <p style={{fontStyle: "italic"}}>{error.message}</p>
    if(successMessage) {
      return <p style={{fontStyle: "italic"}}>{successMessage}</p>
    }
    return null
  }


  if (!currentPlayer)
    return null;
  if (game.state !== 'Progress')
    return null
  if (!currentPlayer.isHuman && PlayersLeft())
    return (
      <div>
        <label className="me-2 fs-2" htmlFor="bitecode-input">Victims bitecode: </label>
        <input
          className="rounded mt-3 mb-3 p-2 w-25"
          type="text" placeholder="Enter bitecode.."
          name="bitecode-input"
          ref={inputBiteCodeRef} />
        <button className="btn-delete" onClick={handleSubmitBiteCode}>{isLoading ? <Spinner animation="border" /> : <IoIosArrowDroprightCircle size={40} />}</button>
        {buildFeedBackMessage()}
      </div>)
  return (
    <div>
      <p className="fs-2">Your bitecode: {<span className="bg-black bg rounded p-3 m-2 text-white text-center w-25">{currentPlayer.biteCode}</span>}</p>
    </div>)

}

export default BiteCode