import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { NavLink, useParams } from "react-router-dom";
import BiteCode from "../components/gameDetailsPage/BiteCode";
import Chat from "../components/gameDetailsPage/Chat";
import GameDescription from "../components/gameDetailsPage/GameDescription";
import GameStateIndicator from "../components/gameDetailsPage/GameStateIndicator";
import JoinGameBtn from "../components/gameDetailsPage/JoinGameBtn";
import ProgressBar from "../components/gameDetailsPage/ProgressBar";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import "./GameDetailsPage.css";
import { MdAdminPanelSettings, MdBackspace, MdOutlineAdminPanelSettings } from "react-icons/md"
import AdminModal from "../components/gameDetailsPage/AdminModal";
import keycloak from "../keycloak"
import { namedRequestInProgAndError } from "../store/slices/requestSlice";
import { RequestsEnum } from "../store/middleware/requestMiddleware";
import { GetGameAndPlayersByGameIdAction } from "../components/api/getGameAndPlayersByGameId";
import StartGameBtn from "../components/gameDetailsPage/StartGameBtn";
import Map from "../components/gameDetailsPage/Map";
import EndGameBtn from "../components/gameDetailsPage/EndGameBtn";
import GetMissionBtn from "../components/gameDetailsPage/GetMissionsBtn";
import KillList from "../components/gameDetailsPage/KillList";



function GameDetailsPage() {
    const [show, setShow] = useState(false);
    const routeParam = useParams()["id"]
    const dispatch = useAppDispatch()
    useEffect(() => {
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
        <div className="position-absolute top-0 end-0 m-3 log-header">
            {keycloak.authenticated && <span>Logged in as: {keycloak.tokenParsed?.preferred_username}</span>}
            {isAdmin && <span> <MdAdminPanelSettings size={30}/> Admin</span>}
        </div>
        <AdminModal show={show} setShow={setShow} players={players} game={game}/>

        <GameStateIndicator gamestate={game.state} currentPlayer={currentPlayer} players = {players}/>
        <div className="mt-3 mb-5">
           <ProgressBar gamestate={game.state} />
        </div>
        <Container className="justify-content-center align-items-center d-flex">
        <Row className="card-deck"> 
            <Col className="m-auto"> 
                <div className="card m-5 mx-auto card-detail">
                    <div className="card-text"> 
                        <GameDescription title={game.name} description={game.description} />
                        { isAdmin && 
                            <div>
                                <div className="btn-group me-3 ms-3">
                                    { game.state !== "Complete" &&
                                        <button className="btn btn-danger mt-3 mb-3 me-2" onClick={() => {setShow(true)}}>Admin-table</button>
                                    }
                                    <JoinGameBtn gameId={game.id}/>
                                    <StartGameBtn/>
                                    <EndGameBtn/>
                                    <GetMissionBtn/>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </Col>
            <Col>
            <div className="card m-5 mx-auto card-detail">
                    <div className="card-text">
                        <div style={{marginBottom: "20px", marginTop: "20px"}} className="map-z">
                            <Map gameid={game.id}/>
                        </div>

                        <div>
                            <BiteCode/>
                        </div>


                    </div>
            </div>
            </Col>
        </Row>
        </Container>
        <div className="d-flex">
            <Chat currentPlayer={currentPlayer} gameId={game.id}/>
        </div>
    </Container>)
}

export default GameDetailsPage;
