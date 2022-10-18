import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { NavLink, useParams } from "react-router-dom";
import BiteCode from "../components/gameDetailsPage/BiteCode";
import Chat from "../components/gameDetailsPage/Chat";
import GameDescription from "../components/gameDetailsPage/GameDescription";
import GameStateIndicator from "../components/gameDetailsPage/GameStateIndicator";
import JoinGameBtn from "../components/gameDetailsPage/JoinGameBtn";
import ProgressBar from "../components/gameDetailsPage/ProgressBar";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import "./GameDetailsPage.css";
import {MdAdminPanelSettings, MdBackspace, MdOutlineAdminPanelSettings} from "react-icons/md"
import AdminModal from "../components/gameDetailsPage/AdminModal";
import keycloak from "../keycloak"
import { namedRequestInProgAndError } from "../store/slices/requestSlice";
import { RequestsEnum } from "../store/middleware/requestMiddleware";
import { GetGameAndPlayersByGameIdAction } from "../components/api/getGameAndPlayersByGameId";
import StartGameBtn from "../components/gameDetailsPage/StartGameBtn";
import EndGameBtn from "../components/gameDetailsPage/EndGameBtn";



function GameDetailsPage() {
    const [show, setShow] = useState(false);
    const routeParam = useParams()["id"]
    const dispatch = useAppDispatch()
    useEffect(()=>{
        dispatch(GetGameAndPlayersByGameIdAction(Number(routeParam)))
    }, [])
    const {game, currentPlayer, players, kills} = useAppSelector(state => state.game)
    const [requestInProgress, error] = namedRequestInProgAndError(useAppSelector(state => state.requests), RequestsEnum.GetGamePlayerAndKillsByGameId);
    const isAdmin = keycloak.realmAccess?.roles.includes("ADMIN")
    
    if(error){
        return <p>{error.message}</p>
    }
    
    if(requestInProgress || !game){
        return <div className="background-game"><div className="loader"></div></div>
    }
    

    return (
    <Container className="background-game p-sm-4" fluid>
        <NavLink to={"/"} className="btn-delete mb-4 btn btn-lg"><MdBackspace/></NavLink>
        <div className="position-absolute top-0 end-0 m-3 log-header logged-in">
            {keycloak.authenticated && <span>Logged in as: {keycloak.tokenParsed?.preferred_username}</span>}
            {isAdmin && <span> <MdAdminPanelSettings size={30}/> Admin</span>}
        </div>
        <div className="mt-3 mb-5">
           <ProgressBar gamestate={game.state} />
        </div>
        <div className="mt-3 mb-5">
        <GameStateIndicator gamestate={game.state} currentPlayer={currentPlayer} players = {players}/>
        </div>
        <div>
            <GameDescription title={game.name} description={game.description} />
        </div>
        <div>
            <JoinGameBtn gameId={game.id}/>
        </div>
        <div>
            <BiteCode />
        </div>
        <div className="d-flex">
            <Chat currentPlayer={currentPlayer} gameId={game.id}/>
        </div>
        { isAdmin && 
        <div>
            <button className="btn btn-dark mt-3 mb-3" onClick={() => {setShow(true)}}>Admin-table</button>
            <div>
                <AdminModal show={show} setShow={setShow} players={players} game={game}/>
            </div>
            <div>
                <StartGameBtn/>
            </div>
            <div>
                <EndGameBtn/>
            </div>
        </div>
        }
    </Container>)
}

export default GameDetailsPage;
