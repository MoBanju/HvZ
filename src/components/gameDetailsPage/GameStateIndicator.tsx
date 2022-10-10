import { IGameState } from '../../models/IGameState'
import {BsCheckLg} from "react-icons/bs"

function GameStateIndicator({gamestate}: {gamestate: keyof IGameState}) {
  if(gamestate === "register"){
    return (
      <div>Joined <BsCheckLg color='green' size={20}/></div>
    )
  }
  else if(gamestate === "complete"){
    return (
      <div>Completed..</div>
    )
  }
  return(
    <div>Game in progress..</div>
  )
}

export default GameStateIndicator