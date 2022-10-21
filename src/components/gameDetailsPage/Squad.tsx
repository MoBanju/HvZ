import { MutableRefObject, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { RequestsEnum } from "../../store/middleware/requestMiddleware";
import { namedRequestInProgAndError } from "../../store/slices/requestSlice";
import { GetGamePlayersAndKillsByGameIdAction } from "../api/getGameAndPlayersByGameId";
import getSquadsByGameId from "../api/getSquadsByGameId";
import { PostPlayerInSquadAction, PostPlayerInSquadRequest } from "../api/postPlayerInSquad";
import { PostSquadAction, PostSquadInGameRequest } from "../api/PostSquad";
import {BiPlusMedical} from "react-icons/bi"
import { Spinner } from "react-bootstrap";

function Squad({gameid} : {gameid: number}) {
    const dispatch = useAppDispatch()
    const { squads, currentPlayer } = useAppSelector(state => state.game)
    const nameInputRef = useRef() as MutableRefObject<HTMLInputElement>;
    const [loading, error] = namedRequestInProgAndError(useAppSelector(state => state.requests), RequestsEnum.postPlayerInSquad)


    const submitSquad = () => {
        const squad: PostSquadInGameRequest = {
            name: nameInputRef.current.value,
            is_human: currentPlayer!.isHuman,
            squadMember: {
                rank: "",
                playerId: currentPlayer!.id,
            }
        }
        const postGameAction = PostSquadAction(gameid, squad)
        dispatch(postGameAction)
    };
    
    const joinSquad = (squadId: number) => {
        const squadMember: PostPlayerInSquadRequest = {
            playerId: currentPlayer!.id,
            rank: "Goon"
        }
        const joinGameAction = PostPlayerInSquadAction(gameid, squadId , squadMember)
        dispatch(joinGameAction)
    };


    return (
        <>
        <table className="table table-striped table-dark text-white">
            <thead>
                <tr>
                    <th scope="col">
                        Squad name
                    </th>
                    <th scope="col">
                        Total members
                    </th>
                    <th scope="col">
                        Members dead
                    </th>
                    <th scope="col">
                        Join squad
                    </th>
                </tr>
            </thead>
            <tbody>
                {
                    squads.map((squad, i) => 
                    <tr key={i}>
                        <td className="pt-3" >{squad.name}</td>
                        <td className="pt-3" >5</td>
                        <td className="pt-3" >1</td>
                        <td>{!loading ? (<button className="btn-delete ms-4" onClick={() => joinSquad(squad.id)}><BiPlusMedical color="red"/></button>) : <Spinner animation="border" size={"sm" }></Spinner> }</td>
                    </tr>)
                }
            </tbody>
        </table>
        <input ref={nameInputRef} placeholder="Enter squad name.." type="text" className="m-2"/>
        <button onClick={submitSquad} className="btn btn-danger">Create new squad</button>
        </>
    )
}
export default Squad
