import { IGame } from "../../models/IGame";
import "../../pages/LandingPage.css";
import { CgTrash } from "react-icons/cg"
import keycloak from "../../keycloak";
import { removeGame } from "../../store/slices/gamesSlice"
import { useAppDispatch } from "../../store/hooks";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import DeleteGameModal from "./DeleteGameModal";



function GamesTableItem({ game }: { game: IGame }) {
        const nav = useNavigate();
        const isAdmin = keycloak.realmAccess?.roles.includes("ADMIN")
        const isLoggedIn = keycloak.authenticated;
        const [ isAlertVisible, setIsAlertVisible ] = React.useState(false);
        const [ showDeleteModal, setShowDeleteModal ] = useState(false);


        const deleteGame = () => {
                setShowDeleteModal(true);
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
                        <td onClick={handleClick} role={"button"}> {game.name} </td>
                        <td className="ps-5">22</td>
                        <td>{game.state}</td>
                        <td>{isAdmin && <button onClick={deleteGame} className="btn-delete"><CgTrash className="bosspann" /></button>} </td>
                </tr>
                <DeleteGameModal show={showDeleteModal} setShow={setShowDeleteModal} game={game} />
        </>)


}
export default GamesTableItem;