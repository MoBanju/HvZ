import { kill } from "process";
import { IPlayer } from "../../models/IPlayer";
import { IUser } from "../../models/IUser";
import { useAppSelector } from "../../store/hooks";
import playerSlice from "../../store/slices/playerSlice";

function KillList() {
    const { kills } = useAppSelector(state => state.game)



   return(
    <>
    <h3 className="mt-3">Scoreboard:</h3> 
        <table className="table table-striped table-dark text-white" style={{width: "400px"}}>
            <thead>
                <tr>
                    <th scope="col"> Name </th>
                    <th scope="col"> Kills </th>
                </tr>
            </thead>
            <tbody>

                {
                kills.reduce<{player: IPlayer, kills: number}[]>((killList, kill) => {
                    let existingItem = killList.find(killListItem => killListItem.player.id === kill.killer.id);
                    if(existingItem) {
                        existingItem.kills += 1;
                        return killList;
                    } else {
                        return [... killList, {player: kill.killer, kills: 1}];
                    }

                },[]).map((x,i) => (

                        <tr>
                            <td className=""> <p key={i}>{x.player.user.firstName}</p></td> 
                            <td className=""><p key={i}>{x.kills}</p></td>
                        </tr>
                ))
                }
            </tbody>
            
    </table>
    </>
   )
  }
export default KillList;