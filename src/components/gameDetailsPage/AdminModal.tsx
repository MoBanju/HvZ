import React, { Dispatch, useState, useEffect } from "react";
import { Modal, Spinner } from "react-bootstrap";
import { IGame } from "../../models/IGame";
import { IPlayer } from "../../models/IPlayer";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { RequestsEnum } from "../../store/middleware/requestMiddleware";
import { namedRequestInProgAndError } from "../../store/slices/requestSlice";
import { PutPlayerTypeAction } from "../api/putPlayerType";


function AdminModal({ show, setShow, players, game }: { show: boolean, setShow: Dispatch<React.SetStateAction<boolean>>, players: IPlayer[], game: IGame }) {
    const hide = () => { setShow(false) };
    const dispatch = useAppDispatch();
    const [loading, error] = namedRequestInProgAndError(useAppSelector(state => state.requests), RequestsEnum.PutPlayerType);

    
    const afterClick = (e: any) => {

        let selectedPlayer = players.find(player => player.id === Number(e.target.id))!

        let newPlayer: IPlayer = {
            id: Number(e.target.id),
            isHuman: selectedPlayer.isHuman,
            isPatientZero: selectedPlayer.isPatientZero,
            biteCode: selectedPlayer.biteCode,
            user: selectedPlayer.user,
        }
        if (e.target.value === "human") {
            newPlayer.isHuman = true
            newPlayer.isPatientZero = false
        }
        else if (e.target.value === "zombie") {
            newPlayer.isHuman = false
            newPlayer.isPatientZero = false
        }
        else if (e.target.value === "patientZero") {
            newPlayer.isHuman = false
            newPlayer.isPatientZero = true
        }
        dispatch(PutPlayerTypeAction(game.id, newPlayer))
        

        return null
    }


    return (
        <Modal show={show} onEscapeKeyDown={hide} onHide={hide}>
            <Modal.Header closeButton>
                <Modal.Title>Admintable</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <p>{error.message}</p>}
                <table>
                    <tbody>
                        <tr className="fs-5">
                            <th className="pb-3">Player</th>
                            <th className="ps-3 pb-3">Role</th>
                        </tr>
                        <tr>
                            <td className="fw-bold">{players.map((check, i) => <p key={i}>{check.id} {check.user.firstName}</p>)}</td>
                            <td>
                                {!loading ? (players.map((check, i) => <p key={i}>
                                    {check.isHuman &&
                                        <select defaultValue={"human"} name="roles" id={check.id.toString()} className="rounded ms-3" onChange={afterClick}>
                                            <option value="patientZero">Patient zero</option>
                                            <option value="zombie">Zombie</option>
                                            <option value="human">Human</option>
                                        </select>
                                    }
                                    {check.isPatientZero &&
                                        <select defaultValue={"patientZero"} name="roles" id={check.id.toString()} className="rounded ms-3" onChange={afterClick}>
                                            <option value="patientZero">Patient zero</option>
                                            <option value="zombie">Zombie</option>
                                            <option value="human">Human</option>
                                        </select>
                                    }
                                    {!check.isHuman && !check.isPatientZero &&
                                        <select defaultValue={"zombie"} name="roles" id={check.id.toString()} className="rounded ms-3" onChange={afterClick}>
                                            <option value="patientZero">Patient zero</option>
                                            <option value="zombie">Zombie</option>
                                            <option value="human">Human</option>
                                        </select>
                                    }</p>)) : <Spinner animation="border" size={"sm"} />}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Modal.Body>
        </Modal>);
}

export default AdminModal;