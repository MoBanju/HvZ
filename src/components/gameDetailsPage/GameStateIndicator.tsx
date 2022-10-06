import { IGameState } from '../../models/IGameState'
import {BsCheckLg} from "react-icons/bs"

function GameStateIndicator({gamestate}: {gamestate: keyof IGameState}) {
  if(gamestate === "register"){
    return (
      <div></div>
    )
  }
  else if(gamestate === "complete"){
    return (
      <div>Complete</div>
    )
  }
  return(
    <div>Joined <BsCheckLg color='green' size={20}/></div>
  )
}

export default GameStateIndicator