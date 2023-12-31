import React from 'react'
import { Spinner } from 'react-bootstrap'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { RequestsEnum } from '../../store/middleware/requestMiddleware'
import { namedRequestInProgAndError } from '../../store/slices/requestSlice'
import DeletePlayerFromSquadAction from '../api/deletePlayerFromSquad'


function SquadDetail() {

    const { game, players, squads, currentPlayer } = useAppSelector(state => state.game)
    const [loading, error] = namedRequestInProgAndError(useAppSelector(state => state.requests), RequestsEnum.DeletePlayerFromSquad)

    const dispatch = useAppDispatch();


    let myList = []

    for (let i = 0; i < squads.length; i++) { //dont mind this triple for-loop
        if (squads[i].id === currentPlayer?.squadId) {
            for (let y = 0; y < squads[i].squad_Members.length; y++) {
                for (let z = 0; z < players.length; z++) {
                    if (squads[i].squad_Members[y].playerId === players[z].id) {
                        //console.log("NAME: ", players[z].user.firstName, "SQUADNAME: ", squads[i].name, "RANKS: ", squads[i].squad_Members[y].rank)
                        let myStr = "false"
                        if (players[z].isHuman) myStr = "true"

                        let myObj = {
                            Name: players[z].user.firstName + " " + players[z].user.lastName,
                            Rank: squads[i].squad_Members[y].rank,
                            isHuman: myStr,
                            SquadName: squads[i].name,
                            SquadId: squads[i].id
                        }
                        myList.push(myObj)
                    }
                }
            }
        }
    }


    const LeaveSquad = () => {
        if (currentPlayer?.squadId && game?.id) {
            dispatch(DeletePlayerFromSquadAction(game.id, currentPlayer.squadId, currentPlayer?.id))
        }
    }


    return (<>
        <h2>{myList[0].SquadName}</h2>
        <table className='table table-striped table-dark text-white '>
            <thead>
                <tr>
                    <th className='pe-4' scope="col">
                        Name
                    </th>
                    <th className='pe-4' scope="col">
                        Rank
                    </th>
                    <th className='pe-4' scope="col">
                        Is alive
                    </th>
                </tr>
            </thead>
            <tbody>
                {
                    myList.map((member, i) =>
                        <tr key={i}>
                            <td className="pt-3" >{member.Name}</td>
                            <td className="pt-3">{member.Rank}</td>
                            <td className="pt-3" >{member.isHuman}</td>
                        </tr>)
                }
            </tbody>
        </table>
        {!loading ? <button className='btn btn-danger mt-3 mb-3 me-2' onClick={LeaveSquad}>Leave Squad</button> : <Spinner animation="border" size={"sm"} />}
        {error && <span>{error.message}</span>}
    </>)


}

export default SquadDetail