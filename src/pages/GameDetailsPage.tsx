import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import BiteCode from "../components/gameDetailsPage/BiteCode";
import Chat from "../components/gameDetailsPage/Chat";
import GameDescription from "../components/gameDetailsPage/GameDescription";
import GameStateIndicator from "../components/gameDetailsPage/GameStateIndicator";
import JoinGameBtn from "../components/gameDetailsPage/JoinGameBtn";
import ProgressBar from "../components/gameDetailsPage/ProgressBar";
import { GAMES } from "../constants/GAMES";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchGameAction } from "../store/middleware/fetchGameMiddleware";
import "./GameDetailsPage.css";
import {MdBackspace} from "react-icons/md"


function GameDetailsPage() {
    const routeParam = useParams()["id"]
    const dispatch = useAppDispatch()
    useEffect(()=>{
        dispatch(fetchGameAction(1))
    }, [])
    const {isLoaded, error, game} = useAppSelector(state => state.game)

    if(error){
        return <p>{error.message}</p>
    }

    if(!isLoaded || game === undefined){
        return <p>Loading..</p>
    }
    return (
    <Container className="background-game p-sm-4" fluid>
        <a href="/" className="btn-delete mb-4 btn btn-lg"><MdBackspace/></a>
        <div className="mt-3 mb-5">
           <ProgressBar/>
        </div>
        <div>
            <GameStateIndicator gamestate={game.state}/>
            <GameDescription title={game.title} description={game.description} />
        </div>
        <div>
            <JoinGameBtn gamestate={game.state}/>
        </div>
        <div>
            <BiteCode player={game.players}/>
        </div>
        <div className="d-flex">
            <Chat chatmessages={game.chat}/>
        </div>
    </Container>)
}

export default GameDetailsPage;