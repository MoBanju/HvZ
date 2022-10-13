import { IGameState } from '../../models/IGameState'
import {BsCheckLg} from "react-icons/bs"
import { IPlayer } from '../../models/IPlayer'

function GameStateIndicator({gamestate, player}: {gamestate: keyof IGameState, player: IPlayer | undefined}) {
  
  if(gamestate === "Registration" && player){
    return (
      <div>Joined <BsCheckLg color='green' size={20}/></div>
    )
  }
  if(gamestate === "Complete"){
    return (
      <div>Completed..</div>
    )
  }
  if(gamestate === "Progress"){
    return(
      <div>Game in progress..</div>
    )
  }
  

  return null
}

export default GameStateIndicator