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
      <div className='d-flex align-items-center justify-content-center text-styling'>No registered players yet</div>
    )
  }
  else if (gamestate === "Registration" && currentPlayer) {
    return (<>
      <div className='d-flex align-items-center justify-content-center text-styling'>Joined <BsCheckLg color='green' size={40} /></div>
      <div className='d-flex align-items-center justify-content-center text-styling text-size'>{players.length + PlayersJoined()}</div>
    </>)
  }
  else if (gamestate === "Progress") {
    return (
    <div className='row'>
      <div className='h-100 d-flex align-items-center justify-content-center text-styling'>Game in progress..</div>
      <div className='h-100 d-flex align-items-center justify-content-center text-styling text-size'>{PlayersLeft()}</div>
    </div>)
  }
  else if (gamestate === "Complete") {
    return (
      <div className='d-flex align-items-center justify-content-center text-styling'>Game completed..</div>
    )
  }
  return null
}

export default GameStateIndicator