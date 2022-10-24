import { useAppSelector } from "../../store/hooks"
import KillList from "./KillList"

function GameDescription({title, description}: {title: string, description: string}) {
  const { game } = useAppSelector(state => state.game)

  

  return (
    <>
    <div className="clearfix">
    <div className="me-5 ">
        <h1>{title}</h1>
        <h5>Starttime: {(game!.startTime).slice(0,10)}, {(game!.startTime).slice(11,16)}</h5>
        <h5>Endtime: {(game!.endTime).slice(0,10)}, {(game!.endTime).slice(11,16)}</h5>
        <h4 className="">{description}</h4>
    </div>

    <div className="float-end me-5 resp">
      { game!.state !== "Complete" &&
      <div>
        <h3>Rules</h3>
        <h5>
          <ul>
            <li className="m-2">People who are not registered players are not allowed to interfere with gameplay. 
              Under the original rules, this includes spying on the other team, 
              or helping players stay in a safe area by bringing them food or doing something 
              for a player which would otherwise require them to leave a safe-zone.</li>
            <li className="m-2">Almost all players begin the game as humans, and must keep their bite code with them at all times in case a zombie attacks them. 
              If they are tagged, they must surrender their code, and become a zombie after one hour has elapsed.</li>
            <li className="m-2">Zombies must gather and input the the bite code of all humans that they "turn" 
              into the database to keep track of which humans have been converted.</li>
          </ul>
        </h5>
      </div>
      }

      { game!.state === "Complete" &&
      <div className="float-start resp">
          <KillList></KillList>
      </div>
      }
    </div>
    </div>
    </>
  )
}
export default GameDescription