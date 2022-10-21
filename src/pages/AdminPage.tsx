import { useEffect, useState } from "react"
import { Col, Container, Row, Spinner, Table } from "react-bootstrap"
import { NavLink, useParams } from "react-router-dom"
import { getGameStateAction } from "../components/api/getGameAndPlayersByGameId"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { RequestsEnum } from "../store/middleware/requestMiddleware"
import { namedRequestInProgAndError } from "../store/slices/requestSlice"
import KillTableItem from "../components/adminPage/KillTableItem"
import PlayerTableItem from "../components/adminPage/PlayerTableItem"
import EditItem from "../components/adminPage/EditItem"
import { IGame } from "../models/IGame"
import { IPlayer } from "../models/IPlayer"
import { IKill } from "../models/IKill"
import { GoDiffAdded } from 'react-icons/go'
import { AiOutlineEdit } from "react-icons/ai"
import './AdminPage.css'
import { IMission } from "../models/IMission"
import MissionTableItem from "../components/adminPage/MissionTableItem"
import { MdBackspace } from "react-icons/md"


export enum EditState {
    None,
    UpdateGame,
    UpdatePlayer,
    UpdateKill,
    UpdateMission,
    CreateKill,
    CreateMission,
}

export type Item = IGame | IPlayer | IKill | IMission | undefined;

function AdminPage() {

    const routeParam = useParams()["id"]
    const dispatch = useAppDispatch()

    const { game, players, kills, missions } = useAppSelector(state => state.game)
    const [loading, error] = namedRequestInProgAndError(useAppSelector(state => state.requests), RequestsEnum.GetGameStateInital);
    const [editItem, setEditItem] = useState<{item: Item, itemType: EditState}>({item: undefined, itemType: EditState.None})
    
    useEffect(() => {
        dispatch(getGameStateAction(Number(routeParam), true, undefined))
    }, [])
    const handleCreateKillClicked = () => {setEditItem({item: undefined, itemType: EditState.CreateKill})}

    const handleCreateMissionClicked = () => {setEditItem({item: undefined, itemType: EditState.CreateMission})}
    const handleEditGameClicked = () => {setEditItem({item: game, itemType: EditState.UpdateGame})}


    if(loading || !game)
        return <div className="background">
            <Spinner
                animation="border"
                style={{
                    position: 'fixed',
                    left: '40%',
                    top: '40%',
                    width: '150px',
                    height: '150px',
                }}
            />
        </div>

    return (
    <Container className="background">
    <NavLink to={`/game/${game.id}`} className="btn-delete mb-4 btn btn-lg"><MdBackspace /></NavLink>
    <Row >
        <Col className="card">
            <h5>Game</h5>
            <Table hover className="admin-table table-admin">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Game State</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{game.id}</td>
                        <td>{game.name}</td>
                        <td>{game.description}</td>
                        <td>{game.state}</td>
                        <td>{game.startTime}</td>
                        <td>{game.endTime}</td>
                        <td> <AiOutlineEdit onClick={handleEditGameClicked}/> </td>
                    </tr>
                </tbody>
            </Table>
            <h5>Players</h5>
            <Table hover className="table-admin">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Is Human</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {players.map(player => <PlayerTableItem player={player} setEditItem={setEditItem} key={player.id} />)}
                </tbody>
            </Table>
            <h5>Kills</h5>
            <Table hover className="table-admin">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Killer</th>
                        <th>Victim</th>
                        <th>Has location</th>
                        <th>Description</th>
                        <th onClick={handleCreateKillClicked}><GoDiffAdded /></th>
                    </tr>
                </thead>
                <tbody>
                    {kills.map(kill => <KillTableItem kill={kill} setEditItem={setEditItem} key={kill.id}/>)}
                </tbody>
            </Table>
            <h5>Missions</h5>
            <Table hover className="table-admin">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Is Human Visibile</th>
                        <th>Is Zombie Visible</th>
                        <th onClick={handleCreateMissionClicked}><GoDiffAdded /></th>
                    </tr>
                </thead>
                <tbody>
                    {missions.map(mission => <MissionTableItem mission={mission} setEditItem={setEditItem} key={mission.id}/>)}
                </tbody>
            </Table>
        </Col>
        <Col className="card">
            <EditItem
                game={game}
                item={editItem.item}
                itemType={editItem.itemType}
                setItem={setEditItem}
            />
        </Col>
    </Row></Container>);
}


export default AdminPage;