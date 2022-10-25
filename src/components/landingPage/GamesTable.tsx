import GamesTableItem from "./GamesTableItem";
import "../../pages/LandingPage.css";
import { AiFillPlusSquare } from "react-icons/ai";
import { useEffect, useState } from "react";
import CreateGameModal from "./CreateGameModal";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import keycloak from "../../keycloak";
import { namedRequestInProgAndError } from "../../store/slices/requestSlice";
import { RequestsEnum } from "../../store/middleware/requestMiddleware";
import { GetGamesAction } from "../api/getGames";
import { Spinner } from "react-bootstrap";

const GAMES_PER_PAGE = 5;


function GamesTable() {
    const dispatch = useAppDispatch();

    const isAdmin = keycloak.realmAccess?.roles.includes("ADMIN")
    const isLoggedIn = keycloak.authenticated;

    const [ showCreateModal, setShowCreateModal] = useState(false);
    const [sideTall, setsideTall] = useState(1);
    const games  = useAppSelector(state => state.games.games);
    var [gamesRequestLoading, gamesRequestError] = namedRequestInProgAndError(useAppSelector(state => state.requests), RequestsEnum.GetGames);

    useEffect(() => {
        dispatch(GetGamesAction())
    }, []);

    const renderTableItems = () => {
        if(gamesRequestLoading)
            return (
            <tr style={{ textAlign: 'center', lineHeight: GAMES_PER_PAGE}}>
                <td colSpan={5} ><Spinner animation="border"/></td>
            </tr>);
        
        if(gamesRequestError)
            return (
            <tr style={{ textAlign: 'center', lineHeight: GAMES_PER_PAGE}}>
                <td colSpan={5}>{gamesRequestError.message}</td>
            </tr>)
        
        return games
            .slice()
            .sort((a, b) => {
                if(b.state === 'Registration')
                    return 1
                if(b.state === 'Progress' && a.state === 'Complete')
                    return 1
                return -1
            })
            .slice((sideTall - 1) * GAMES_PER_PAGE, sideTall * GAMES_PER_PAGE)
            .map(game => <GamesTableItem game={game} key={game.id} />)
    }

    return (
        <div className="table-responsive">
            <table className="table display-5 table-hover table-resp">
                <thead>
                    <tr>
                        <th scope="col">Title</th>
                        <th scope="col">#Players</th>
                        <th scope="col">Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        renderTableItems()
                    }
                </tbody>
            </table>
            <div className="d-flex flex-row-reverse">
                {isAdmin && <button className="btn-create mt-4 float-right"> <AiFillPlusSquare className="bosspann" size={50} onClick={() => { setShowCreateModal(true) }} /> </button>}
            </div>
            <div className="text-center">
                <h1 className="text-sz sidetall-color">
                    {sideTall > 1 && <button onClick={() => setsideTall(sideTall - 1)} className="btn-delete" style={{color:"white"}}>{'<'}</button>}
                    {sideTall}
                    {sideTall * GAMES_PER_PAGE < games.length && <button onClick={() => setsideTall(sideTall + 1)} className="btn-delete" style={{color: 'white'}}>{'>'}</button>}</h1>
            </div>
            <CreateGameModal show={showCreateModal} setShow={setShowCreateModal}/>
        </div>)
}

export default GamesTable;