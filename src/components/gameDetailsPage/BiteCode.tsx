import { IPlayer } from "../../models/IPlayer"
import {IoIosArrowDroprightCircle} from "react-icons/io";
import { IGameState } from "../../models/IGameState";

function BiteCode({player, gamestate}:{player: IPlayer, gamestate: keyof IGameState}) {
  if (gamestate === 'inprogress'){
    return (
      <>
      {!player.isHuman && <div>
          <label className="me-2 fs-2" htmlFor="bitecode-input">Victims bitecode: </label>
            <input className="rounded mt-3 mb-3 p-2 w-25" type="text" placeholder="Enter bitecode.." name="bitecode-input"/>
            <button className="btn-delete"><IoIosArrowDroprightCircle size={40}/></button>
        </div>}
  
        <div>
          { player.isHuman && <p className="fs-2">Your bitecode: { <span className="bg-black bg rounded p-3 m-2 text-white text-center w-25">{player.biteCode}</span>}</p>}
        </div>
      </>
    )
  }
  
  return(
    <div></div>
  )
}

export default BiteCode