import React, { Dispatch, useState } from "react";
import { Modal } from "react-bootstrap";
import { IPlayer } from "../../models/IPlayer";
import { useAppDispatch } from "../../store/hooks";


function AdminModal({show, setShow, player}: {show: boolean, setShow: Dispatch<React.SetStateAction<boolean>>, player: IPlayer[]}) {
    const hide = () => {setShow(false); setLoading(false)};
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState<IPlayer>({id: 0, isHuman: true, isPatientZero: false, biteCode: ''});
    const dispatch = useAppDispatch();

    const afterClick = (e: any) =>{
        console.log(e.target.value)
        if(e.target.value==="human"){
            setRole({...role, isHuman: true, isPatientZero: false})
        }
        if(e.target.value==="zombie"){
                setRole({...role, isHuman: true, isPatientZero: false})
            
        }
        if(e.target.value==="patientZero"){
                setRole({...role, isHuman: true, isPatientZero: false})
            
        }console.log(player)
        console.log(role)
    }

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
                        <td className="fw-bold">{player.map((check, i) => <p key={i}>{check.id}</p>)}</td>
                        <td>
                            {player.map((check, i) => <p key={i}>  
                            {check.isHuman && <select defaultValue={"human"} name="roles" id="roles" className="rounded ms-3" onChange={afterClick}>
                                <option value="patientZero">Patient zero</option>
                                <option value="zombie">Zombie</option>
                                <option value="human">Human</option>
                            </select>
                            }
                            {check.isPatientZero && <select defaultValue={"patientZero"} name="roles" id="roles" className="rounded ms-3" onChange={afterClick}>
                                <option value="patientZero">Patient zero</option>
                                <option value="zombie">Zombie</option>
                                <option value="human">Human</option>
                            </select>
                            }
                            {!check.isHuman && !check.isPatientZero && <select defaultValue={"zombie"} name="roles" id="roles" className="rounded ms-3" onChange={afterClick}>
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