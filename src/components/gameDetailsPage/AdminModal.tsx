import React, { Dispatch, useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { IPlayer } from "../../models/IPlayer";
import { useAppDispatch } from "../../store/hooks";


function AdminModal({ show, setShow, player }: { show: boolean, setShow: Dispatch<React.SetStateAction<boolean>>, player: IPlayer[] }) {
    const hide = () => { setShow(false); setLoading(false) };
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState<IPlayer[]>(player);
    const dispatch = useAppDispatch();

    const afterClick = (e: any) => {

        let newArr: IPlayer[] = []
        for (let i = 0; i < roles.length; i++) {
            if (roles[i].id.toString() !== e.target.id) {
                newArr.push(roles[i])
            }
            else {
                const bitC = roles[i].biteCode
                if (e.target.value === "human") {
                    newArr.push({ id: Number(e.target.id), isHuman: true, isPatientZero: false, biteCode: bitC })
                }
                else if (e.target.value === "zombie") {
                    newArr.push({ id: Number(e.target.id), isHuman: false, isPatientZero: false, biteCode: bitC })
                }
                else if (e.target.value === "patientZero") {
                    newArr.push({ id: Number(e.target.id), isHuman: false, isPatientZero: true, biteCode: bitC })
                }
            }
            setRoles(newArr)
        }

    }
    useEffect(() => { console.log(roles) }, [roles]) //ONLY TO CONSOLE LOG NEW STATE IN ROLE
    return (
        <Modal show={show} onEscapeKeyDown={hide} onHide={hide}>
            <Modal.Header closeButton>
                <Modal.Title>Admintable</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <table>
                    <tbody>
                        <tr className="fs-5">
                            <th className="pb-3">Player</th>
                            <th className="ps-3 pb-3">Role</th>
                        </tr>
                        <tr>
                            <td className="fw-bold">{roles.map((check, i) => <p key={i}>{check.id}</p>)}</td>
                            <td>
                                {roles.map((check, i) => <p key={i}>
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
                                    }</p>)}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Modal.Body>
        </Modal>);
}

export default AdminModal;