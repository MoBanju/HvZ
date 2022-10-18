
import React, { Dispatch } from "react";
import { Button, Modal} from "react-bootstrap";

interface IParams {
    show: boolean,
    setShow: Dispatch<React.SetStateAction<boolean>>,
    handleSumbit: () => void,
    handleCancle: () => void,
}

function InvalidLocationModal({ show, setShow, handleSumbit, handleCancle }: IParams ) {
    const hide = () => {  handleCancle(); setShow(false) };


    return (
        <Modal show={show} onEscapeKeyDown={hide} onHide={hide}>
            <Modal.Header >
                <Modal.Title>Woops</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                It looks like your current location is outside of the designated playing area.
                You can choose to submit your kill without giving it a location, and later contact an admin inorder to fix the issue.
                Or you can try to submit the bitecode again later.
            </Modal.Body>
            <Modal.Footer>
                <Button variant="dark" onClick={handleSumbit}>Submit without coordinated</Button>
                <Button variant="danger" onClick={hide}>Cancel</Button>
            </Modal.Footer>
        </Modal>);
}

export default InvalidLocationModal;