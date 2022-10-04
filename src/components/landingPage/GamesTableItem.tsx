import { IGame } from "../../models/IGame";
import "../../pages/LandingPage.css";
import {CgTrash} from "react-icons/cg" 



function GamesTableItem({game}: {game: IGame}) {
    return (<>
            <tr className="ms-6">
                    <td> {game.title} </td>
                    <td>22</td>
                    <td>{game.state}</td>
                    <td><button className="btn-delete"><CgTrash/></button> </td>
            </tr>
    </>)
}
export default GamesTableItem;