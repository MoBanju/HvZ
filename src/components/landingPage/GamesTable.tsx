import GamesTableItem from "./GamesTableItem";
import "../../pages/LandingPage.css";
import { AiFillPlusSquare } from "react-icons/ai";
import React, { useEffect, useState } from "react";
import CreateGameModal from "./CreateGameModal";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchGamesAction } from "../../store/middleware/fetchGamesMiddleware";
import keycloak from "../../keycloak";

function GamesTable() {
    const isAdmin = keycloak.realmAccess?.roles.includes("ADMIN")
    const [show, setShow] = useState(false);
    const [sideTall, setsideTall] = useState(1);
    const { isLoaded, error, games } = useAppSelector(state => state.games);
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(fetchGamesAction);
    }, []);

    let myGames = games.map((game, i) => <GamesTableItem game={game} key={i} />)
    
    const fiveLess = (tall: number) => {
        if(tall > 1)
        setsideTall(tall-1)
    }
    const fiveMore = (tall: number) => {
        if(tall*5 < myGames.length)
        setsideTall(tall+1)
    }

    return (
        <div className="table-responsive">
            <table className="table display-5">
                <thead>
                    <tr>
                        <th scope="col">Title</th>
                        <th scope="col">#Players</th>
                        <th scope="col">Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {myGames.slice((sideTall-1)*5, sideTall*5)}
                </tbody>
            </table>
            <div className="d-flex flex-row-reverse">
                {isAdmin && <button className="btn-create mt-4 float-right"> <AiFillPlusSquare size={50} onClick={() => { setShow(true) }} /> </button>}
            </div>
            <div className="text-center">
                <h1><button onClick={() => fiveLess(sideTall)} className="btn-delete">{'<'}</button>
                    {sideTall}
                    <button onClick={()=>fiveMore(sideTall)} className="btn-delete">{'>'}</button></h1>
            </div>
            <CreateGameModal show={show} setShow={setShow} />
        </div>)
}

export default GamesTable;