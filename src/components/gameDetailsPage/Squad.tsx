import { MutableRefObject, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { RequestsEnum } from "../../store/middleware/requestMiddleware";
import { namedRequestInProgAndError } from "../../store/slices/requestSlice";
import { GetGameAndPlayersByGameIdAction } from "../api/getGameAndPlayersByGameId";
import getSquadsByGameId from "../api/getSquadsByGameId";
import { PostPlayerInSquadAction, PostPlayerInSquadRequest } from "../api/postPlayerInSquad";
import { PostSquadAction, PostSquadInGameRequest } from "../api/PostSquad";
import {BiPlusMedical} from "react-icons/bi"
import { Spinner } from "react-bootstrap";
import { IGameState } from "../../models/IGameState";

function Squad({gameid, gamestate} : {gameid: number, gamestate: keyof IGameState}) {
    const dispatch = useAppDispatch()
    const { squads, currentPlayer} = useAppSelector(state => state.game)
    const nameInputRef = useRef() as MutableRefObject<HTMLInputElement>;
    const [loading, error] = namedRequestInProgAndError(useAppSelector(state => state.requests), RequestsEnum.postPlayerInSquad)
  
    let isInSquad = squads.some(squad => squad.squadMember?.some(member => member.playerId))
    
    squads.some(squad=> console.log(squad.squadMember))
    console.log("currPlayer id: " + currentPlayer?.id)
    console.log("is in squad: " + isInSquad)

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
        isInSquad = squads.some(x => x.squadMember?.some(y=> y.playerId === currentPlayer!.id))
        dispatch(postGameAction)
    };
    
    const joinSquad = (squadId: number) => {
        const squadMember: PostPlayerInSquadRequest = {
            playerId: currentPlayer!.id,
            rank: "Goon"
        }
        const joinGameAction = PostPlayerInSquadAction(gameid, squadId , squadMember)
        isInSquad = squads.some(x => x.squadMember?.some(y=> y.playerId === currentPlayer!.id))
        dispatch(joinGameAction)
    };
    return (
        <>
        <h2>Squads</h2>
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
                    {gamestate !== "Complete" && currentPlayer && !isInSquad && 
                        <th scope="col">
                            Join squad
                        </th>
                    }
                </tr>
            </thead>
            <tbody>
                {
                    squads.map((squad, i) => 
                    <tr key={i}>
                        <td className="pt-3" >{squad.name}</td>
                        <td className="pt-3">12</td>
                        <td className="pt-3" >{squad.deseasedPlayers}</td>
                        {gamestate !== "Complete" && currentPlayer &&
                        <td>{!loading ? (<button className="btn-delete ms-4" onClick={() => joinSquad(squad.id)}><BiPlusMedical color="red"/></button>) : <Spinner animation="border" size={"sm" }></Spinner> }</td>
                        }
                    </tr>)
                }
            </tbody>
        </table>
        {gamestate !== "Complete" && currentPlayer && !isInSquad &&
            <div>
                <input ref={nameInputRef} placeholder="Enter squad name.." type="text" className="m-2"/>
                <button onClick={submitSquad} className="btn btn-danger">Create new squad</button>
            </div>
        }
        </>
    )
}
export default Squad
