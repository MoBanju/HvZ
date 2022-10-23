import React from 'react'
import { useAppSelector } from '../../store/hooks'

/*  Squad Details Fragment. This should display the 
names, 
relative ranks and
state of each of the members of your squad. 

Additionally there should be buttons
to leave a check in marker on your current position and to leave the squad. */

function SquadDetail() {

    const { players, squads, currentPlayer } = useAppSelector(state => state.game)

    console.log("MINSQUAD", squads)
    console.log("MINPLAYERS", players)

    let myList = []


    for (let i = 0; i < squads.length; i++) {
        if (squads[i].id === currentPlayer?.squadId) {
            for (let y = 0; y < squads[i].squad_Members.length; y++) {
                for (let z = 0; z < players.length; z++) {
                    if (squads[i].squad_Members[y].playerId === players[z].id) {
                        console.log("NAME: ", players[z].user.firstName, "SQUADNAME: ", squads[i].name, "RANKS: ", squads[i].squad_Members[y].rank)

                        let myStr = "false"
                        if(players[z].isHuman) myStr = "true"

                        let myObj = {
                            Name: players[z].user.firstName + " " + players[z].user.lastName,
                            Rank: squads[i].squad_Members[y].rank,
                            isHuman: myStr,
                            SquadName: squads[i].name,
                        }
                        myList.push(myObj)
                    }
                }
            }
        }
    }

    console.log("Hei", myList)
    return (<>
            <h2>{myList[0].SquadName}</h2>
        <table>
        <thead>
                <tr>
                    <th scope="col">
                        Name:  
                    </th>
                    <th scope="col">
                        Rank:  
                    </th>
                    <th scope="col">
                        Is alive: 
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
            </tbody></table>
    </>)
}

export default SquadDetail