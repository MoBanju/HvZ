import { IGame } from "../../models/IGame";
import "../../pages/LandingPage.css";
import { CgTrash } from "react-icons/cg"
import keycloak from "../../keycloak";
import { removeGame } from "../../store/slices/gamesSlice"
import { useAppDispatch } from "../../store/hooks";
import { useNavigate } from "react-router-dom";
import React from "react";



function GamesTableItem({ game }: { game: IGame }) {
        const nav = useNavigate();
        const isAdmin = keycloak.realmAccess?.roles.includes("ADMIN")
        const dispatch = useAppDispatch()
        const isLoggedIn = keycloak.authenticated;
        const [ isAlertVisible, setIsAlertVisible ] = React.useState(false);


        const deleteGame = () => {
                // eslint-disable-next-line no-restricted-globals
                if (confirm("Are you sure you want to delete this game?")) {
                        console.log("DELETED")
                        dispatch(removeGame(game.id))
                }

        }

        const handleClick = () => {
                if (isLoggedIn){
                        nav("/game/" + game.id);
                }
                if (!isLoggedIn){
                        setIsAlertVisible(true);
                        setTimeout(() => {
                                setIsAlertVisible(false);
                        }, 3000);
                }
        };

        return (<>
                {isAlertVisible && 
                <tr className='alert-container'>
                        <td className='alert-inner rounded-3 fw-bolder'>Please login to see game details.</td>
                </tr>}
                <tr className="ms-6" >
                        <td onClick={handleClick} role={"button"}> {game.title} </td>
                        <td className="ps-5">22</td>
                        <td>{game.state}</td>
                        <td>{isAdmin && <button onClick={deleteGame} className="btn-delete"><CgTrash className="bosspann" /></button>} </td>
                </tr>
        </>)


}
export default GamesTableItem;