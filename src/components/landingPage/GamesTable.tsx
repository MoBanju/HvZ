import GamesTableItem from "./GamesTableItem";
import "../../pages/LandingPage.css";
import { AiFillPlusSquare } from "react-icons/ai";
import { useEffect, useMemo, useState } from "react";
import CreateGameModal from "./CreateGameModal";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import keycloak from "../../keycloak";
import { namedRequestInProgAndError } from "../../store/slices/requestSlice";
import { RequestsEnum } from "../../store/middleware/requestMiddleware";
import { GetGamesAction } from "../api/getGames";
import { Form, Spinner } from "react-bootstrap";

const GAMES_PER_PAGE = 5;


function GamesTable() {
    const dispatch = useAppDispatch();

    const isAdmin = keycloak.realmAccess?.roles.includes("ADMIN")
    const isLoggedIn = keycloak.authenticated;

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [sideTall, setsideTall] = useState(1);
    const [gameFilter, setGameFilter] = useState([true, true, true])
    const games = useAppSelector(state => state.games.games);
    var [gamesRequestLoading, gamesRequestError] = namedRequestInProgAndError(useAppSelector(state => state.requests), RequestsEnum.GetGames);
    const numberOfGames = useMemo(() => {
        return games.reduce((prev, game) => {
            if (game.state === "Registration" && gameFilter[0]) return prev + 1
            if (game.state === "Progress" && gameFilter[1]) return prev + 1
            if (game.state === "Complete" && gameFilter[2]) return prev + 1
        return prev
        },
            0)
    }, [gameFilter])

    useEffect(() => {
        dispatch(GetGamesAction())
    }, []);

    const renderTableItems = () => {
        if (gamesRequestLoading)
            return (
                <tr style={{ textAlign: 'center', lineHeight: GAMES_PER_PAGE }}>
                    <td colSpan={5} ><Spinner animation="border" /></td>
                </tr>);

        if (gamesRequestError)
            return (
                <tr style={{ textAlign: 'center', lineHeight: GAMES_PER_PAGE }}>
                    <td colSpan={5}>{gamesRequestError.message}</td>
                </tr>)
        return games
            .slice()
            .filter(game => {
                if (game.state === "Registration" && !gameFilter[0]) return false
                if (game.state === "Progress" && !gameFilter[1]) return false
                if (game.state === "Complete" && !gameFilter[2]) return false
                return true
            })
            .sort((a, b) => {
                if (b.state === 'Registration')
                    return 1
                if (b.state === 'Progress' && a.state === 'Complete')
                    return 1
                return -1
            })
            .slice((sideTall - 1) * GAMES_PER_PAGE, sideTall * GAMES_PER_PAGE)
            .map(game => <GamesTableItem game={game} key={game.id} />)
    }

    return (
        <div className="table-responsive">
            <div className="btn-group float-end"> 
            <Form.Check
                    className="me-2"
                    type='checkbox'
                    id='isRegister'
                    label='Registration'
                    checked = {gameFilter[0]}
                    onChange = {()=>setGameFilter(prev => [!prev[0], prev[1], prev[2]])}
                />
            <Form.Check
                    className="me-2"
                    type='checkbox'
                    id='isProgress'
                    label='In Progress'
                    checked = {gameFilter[1]}
                    onChange = {()=>setGameFilter(prev => [prev[0], !prev[1], prev[2]])}
                />
            <Form.Check
                    className="me-2"
                    type='checkbox'
                    id='isComplete'
                    label='Completed'
                    checked = {gameFilter[2]}
                    onChange = {()=>setGameFilter(prev => [prev[0], prev[1], !prev[2]])}
                /></div>
            <table className="table display-5 table-hover table-resp">
                <thead>
                    <tr>
                        <th scope="col">Title</th>
                        <th scope="col">#Players</th>
                        <th scope="col">Status </th>
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
                    {sideTall > 1 && <button onClick={() => setsideTall(sideTall - 1)} className="btn-delete" style={{ color: "white" }}>{'<'}</button>}
                    {sideTall}
                    {sideTall * GAMES_PER_PAGE < numberOfGames && <button onClick={() => setsideTall(sideTall + 1)} className="btn-delete" style={{ color: 'white' }}>{'>'}</button>}</h1>
            </div>
            <CreateGameModal show={showCreateModal} setShow={setShowCreateModal} />
        </div>)
}

export default GamesTable;