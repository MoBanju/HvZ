import { IPlayer } from "../../models/IPlayer"
import {IoIosArrowDroprightCircle} from "react-icons/io";

function BiteCode({player}:{player: IPlayer}) {
  return (
    <>
      <div>
        <label className="me-2 fs-2" htmlFor="bitecode-input">Victims bitecode: </label>
          <input className="rounded mt-3 mb-3 p-2 w-25" type="text" placeholder="Enter bitecode.." name="bitecode-input"/>
          <button className="btn-delete"><IoIosArrowDroprightCircle size={40}/></button>
      </div>

      <div>
        <p className="fs-2">Your bitecode: { <span className="bg-black bg rounded p-3 m-2 text-white text-center w-25">{player.biteCode}</span>}</p>
      </div>
    </>
  )
}

export default BiteCode