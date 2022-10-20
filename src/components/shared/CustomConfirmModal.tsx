
import React, { Dispatch } from "react";
import { Button, Modal} from "react-bootstrap";

interface IParams {
    title?: string,
    body?: string,
    submitBtn?: string,
    cancleBtn?: string,
    show: boolean,
    setShow: Dispatch<React.SetStateAction<boolean>>,
    handleSumbit: () => void,
    handleCancle: () => void,
}

function CustomConfirmModal({ title, body, submitBtn, cancleBtn, show, setShow, handleSumbit, handleCancle }: IParams ) {
    const hide = () => {  handleCancle(); setShow(false) };


    return (
        <Modal show={show} onEscapeKeyDown={hide} onHide={hide}>
            <Modal.Header >
                <Modal.Title>{ title || "Are you sure?"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {
                    body || ""
                }
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={hide}>{cancleBtn || 'Cancel'}</Button>
                <Button variant="dark" onClick={handleSumbit}>{submitBtn || 'Submit'}</Button>
            </Modal.Footer>
        </Modal>);
}

export default CustomConfirmModal;