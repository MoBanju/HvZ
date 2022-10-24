import { MutableRefObject, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { RequestsEnum } from "../../store/middleware/requestMiddleware";
import { namedRequestInProgAndError } from "../../store/slices/requestSlice";
import getSquadsByGameId from "../api/getSquadsByGameId";
import { PostPlayerInSquadAction, PostPlayerInSquadRequest } from "../api/postPlayerInSquad";
import { PostSquadAction, PostSquadInGameRequest } from "../api/PostSquad";
import {BiPlusMedical} from "react-icons/bi"
import { Spinner } from "react-bootstrap";
import { IGameState } from "../../models/IGameState";
import {TiTick} from "react-icons/ti";

function Squad({gameid, gamestate} : {gameid: number, gamestate: keyof IGameState}) {
    const dispatch = useAppDispatch()
    const { squads, currentPlayer, squadMembers} = useAppSelector(state => state.game)
    const nameInputRef = useRef() as MutableRefObject<HTMLInputElement>;
    const [loading, error] = namedRequestInProgAndError(useAppSelector(state => state.requests), RequestsEnum.postPlayerInSquad)
  
    let isInSquad = squads.some(squad => squad.squad_Members?.some(member => member.playerId === currentPlayer?.id))

    const submitSquad = () => {
        const squad: PostSquadInGameRequest = {
            name: nameInputRef.current.value,
            is_human: currentPlayer!.isHuman,
            squadMember: {
                rank: "Captain",
                playerId: currentPlayer!.id,
            }
        }
        const postGameAction = PostSquadAction(gameid, squad)
        isInSquad = squads.some(x => x.squad_Members?.some(y=> y.playerId === currentPlayer!.id))
        dispatch(postGameAction)
    };

    
    const joinSquad = (squadId: number) => {
        const squadMember: PostPlayerInSquadRequest = {
            playerId: currentPlayer!.id,
            rank: "Goon"
        }
        const joinGameAction = PostPlayerInSquadAction(gameid, squadId , squadMember)
        isInSquad = squads.some(x => x.squad_Members?.some(y=> y.playerId === currentPlayer!.id))
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
                    {gamestate !== "Complete" && currentPlayer && !isInSquad && squads.length > 0 &&
                        <th scope="col">
                            Join squad
                        </th>
                    }
                    {currentPlayer && isInSquad &&
                        <th scope="col">
                            Joined
                        </th>
                    }
                </tr>
            </thead>
            <tbody>
                {
                    squads.map((squad, i) => 
                    <tr key={i}>
                        <td className="pt-3" >{squad.name}</td>
                        <td className="pt-3">{squad.squad_Members.length}</td>
                        <td className="pt-3" >{squad.deseasedPlayers}</td>
                        {gamestate !== "Complete" && currentPlayer && !isInSquad && (squad.is_human === currentPlayer.isHuman) &&
                        <td>{!loading ? (<button className="btn-delete ms-4" onClick={() => joinSquad(squad.id)}><BiPlusMedical color="red"/></button>) : <Spinner animation="border" size={"sm" }></Spinner> }</td>
                        }
                        {gamestate !== "Complete" && currentPlayer && !isInSquad && (squad.is_human !== currentPlayer.isHuman) && 
                        <td></td>}
                        {currentPlayer && isInSquad && squad.id === currentPlayer.squadId &&
                        <td>
                            <TiTick color="green" size={35}></TiTick>     
                        </td>
                        }
                        { currentPlayer && isInSquad && squad.id !== currentPlayer.squadId &&
                            <td> </td>
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
