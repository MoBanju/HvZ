import { IGameState } from '../../models/IGameState'
import { BsCheckLg } from "react-icons/bs"
import { IPlayer } from '../../models/IPlayer'

function GameStateIndicator({ gamestate, currentPlayer, players }: { gamestate: keyof IGameState, currentPlayer: IPlayer | undefined, players: IPlayer[] }) {


  const PlayersLeft: any = () => {
      const countHumans = players.filter(player => player.isHuman === true).length
      if (countHumans === 0) {
        return "No humans left"
      }
      else if (countHumans === 1) {
        return "1 human left"
      }
      let myString = countHumans.toString() + " / " + players.length.toString()
      return myString + " humans left"
    }
  const PlayersJoined: any = () => {
      if (players.length > 1) return " players joined"
      else return " player joined"
    }


  if (gamestate === "Registration" && !currentPlayer) {
    return (
      <div>No registered players yet</div>
    )
  }
  else if (gamestate === "Registration" && currentPlayer) {
    return (<>
      <div>Joined <BsCheckLg color='green' size={20} /></div>
      <div>{players.length + PlayersJoined()}</div>
    </>)
  }
  else if (gamestate === "Progress") {
    return (<>
      <div>Game in progress..</div>
      <div>{PlayersLeft()}</div>
    </>)
  }
  else if (gamestate === "Complete") {
    return (
      <div>Game completed..</div>
    )
  }
  return null
}

export default GameStateIndicator