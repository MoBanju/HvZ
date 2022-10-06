import { IGame } from "../../models/IGame";
import "../../pages/LandingPage.css";
import { CgTrash } from "react-icons/cg"
import keycloak from "../../keycloak";
import {removeGame} from "../../store/slices/gamesSlice"
import { useAppDispatch } from "../../store/hooks";
import { useNavigate } from "react-router-dom";



function GamesTableItem({ game }: { game: IGame }) {
        const nav = useNavigate();
        const isAdmin = keycloak.realmAccess?.roles.includes("ADMIN")
        const dispatch = useAppDispatch()

        const deleteGame = () => {
                dispatch(removeGame(game.id))
        }

        const handleClick = () => {
                nav("/game/" + game.id);
        };

        return (<>
                <tr className="ms-6" onClick={handleClick}>
                        <td> {game.title} </td>
                        <td>22</td>
                        <td>{game.state}</td>
                        <td>{isAdmin && <button onClick={deleteGame} className="btn-delete"><CgTrash /></button>} </td>
                </tr>
        </>)


}
export default GamesTableItem;