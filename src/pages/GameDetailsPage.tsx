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
import {MdBackspace} from "react-icons/md"
import AdminModal from "../components/gameDetailsPage/AdminModal";
import keycloak from "../keycloak"
import { namedRequestInProgAndError } from "../store/slices/requestSlice";
import { RequestsEnum } from "../store/middleware/requestMiddleware";
import { GetGameAndPlayersByGameIdAction } from "../components/api/getGameAndPlayersByGameId";



function GameDetailsPage() {
    const [show, setShow] = useState(false);
    const routeParam = useParams()["id"]
    const dispatch = useAppDispatch()
    useEffect(()=>{
        dispatch(GetGameAndPlayersByGameIdAction(Number(routeParam)))
    }, [])
    const {game, currentPlayer, players} = useAppSelector(state => state.game)
    const [requestInProgress, error] = namedRequestInProgAndError(useAppSelector(state => state.requests), RequestsEnum.GetGameAndPlayerByGameId);
    const isAdmin = keycloak.realmAccess?.roles.includes("ADMIN")

    if(error){
        return <p>{error.message}</p>
    }

    if(requestInProgress || !game){
        return <div className="background-game"><div className="loader"></div></div>
    }

    return (
    <Container className="background-game p-sm-4" fluid>
        <NavLink to="/" className="btn-delete mb-4 btn btn-lg"><MdBackspace/></NavLink>
        <div className="mt-3 mb-5">
           <ProgressBar gamestate={game.state} />
        </div>
        <div>
            <GameStateIndicator gamestate={game.state}/>
            <GameDescription title={game.name} description={game.description} />
        </div>
        <div>
            <JoinGameBtn gamestate={game.state}/>
        </div>
        <div>
            <BiteCode player={currentPlayer} gamestate={game.state}/>
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
        </div>
        }
    </Container>)
}

export default GameDetailsPage;
