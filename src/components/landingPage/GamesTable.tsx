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

function GamesTable() {
    const dispatch = useAppDispatch();

    const isAdmin = keycloak.realmAccess?.roles.includes("ADMIN")
    const isLoggedIn = keycloak.authenticated;

    const [show, setShow] = useState(false);
    const [sideTall, setsideTall] = useState(1);
    const games  = useAppSelector(state => state.games.games);
    const [gamesRequestLoading, gamesRequestError] = namedRequestInProgAndError(useAppSelector(state => state.requests), RequestsEnum.GetGames);

    useEffect(() => {
        dispatch(GetGamesAction())
    }, []);

    if(gamesRequestLoading)
        return (<p>loading ...</p>);
    
    if(gamesRequestError)
        alert(gamesRequestError.message);

    let myGames = games.map((game, i) => <GamesTableItem game={game} key={i} />)

    return (
        <div className="table-responsive">
            { isLoggedIn &&
                <p className=" fw-bold justify-content-center d-flex">To access the game details, click on a game title!</p>
            }
            <table className="table display-5 table-hover" >
                <thead>
                    <tr>
                        <th scope="col">Title</th>
                        <th scope="col">#Players</th>
                        <th scope="col">Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {myGames.slice((sideTall - 1) * 5, sideTall * 5)}
                </tbody>
            </table>
            <div className="d-flex flex-row-reverse">
                {isAdmin && <button className="btn-create mt-4 float-right"> <AiFillPlusSquare className="bosspann" size={50} onClick={() => { setShow(true) }} /> </button>}
            </div>
            <div className="text-center">
                <h1>{sideTall > 1 && <button onClick={() => setsideTall(sideTall - 1)} className="btn-delete">{'<'}</button>}
                    {sideTall}
                    {sideTall * 5 < myGames.length && <button onClick={() => setsideTall(sideTall + 1)} className="btn-delete">{'>'}</button>}</h1>
            </div>
            <CreateGameModal show={show} setShow={setShow} />
        </div>)
}

export default GamesTable;