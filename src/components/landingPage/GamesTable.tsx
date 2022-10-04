import { GAMES } from "../../constants/GAMES";
import GamesTableItem from "./GamesTableItem";
import "../../pages/LandingPage.css";
import {AiFillPlusSquare} from "react-icons/ai" ;

function GamesTable() {
    return (
    <div className="table-responsive">
    <table className="table display-5">
        <thead>
            <tr>
                <th scope="col">Title</th>
                <th scope="col">#Players</th>
                <th scope="col">Status</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
                {GAMES.map(game => <GamesTableItem  game={game} />)}     
        </tbody>
    </table>
    <div className="d-flex flex-row-reverse">
        <button className="btn-create mt-4 float-right"> <AiFillPlusSquare size={50}/> </button>
    </div>
    <div className="text-center">
        <h1><button className="btn-delete">{'<'}</button> 2 <button className="btn-delete">{'>'}</button></h1>
    </div>
    </div>)
}

export default GamesTable;