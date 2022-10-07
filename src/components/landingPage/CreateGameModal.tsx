import React, { Dispatch, useRef, useState } from "react";
import { Button, Form, FormControl, InputGroup, Modal, Spinner} from "react-bootstrap";
import { IGame } from "../../models/IGame";
import { useAppDispatch } from "../../store/hooks";
import gameSlice from "../../store/slices/gameSlice";
import { addGame } from "../../store/slices/gamesSlice";

interface IProps {
    show: boolean,
    setShow: Dispatch<React.SetStateAction<boolean>>,
}

function CreateGameModal({show, setShow}: IProps) {
    const hide = () => {setShow(false); setLoading(false)};
    const [loading, setLoading] = useState(false);
    const [game, setGame] = useState<IGame>({id: 0, title: '', state: 'register' ,description: ''});
    const dispatch = useAppDispatch();

    const handleSubmit = () => {
        setLoading(true);
        setTimeout(() => {
            dispatch(addGame(game))
            hide();
        }, 2500)
    }
    return (
    <Modal show={show} onEscapeKeyDown={hide} onHide={hide}>
        <Modal.Header closeButton>
            <Modal.Title>Create a new game</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <InputGroup >
                <InputGroup.Text id="title" >Title:</InputGroup.Text>
                <FormControl
                placeholder="HvZ summer camp 2025"
                aria-label="Title"
                aria-describedby="title"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setGame({...game, title: e.currentTarget.value})}}
                />
            </InputGroup>
            <InputGroup className="mt-4">
                <InputGroup.Text onChange={(e: React.FormEvent<HTMLInputElement>) => {setGame({...game, description: e.currentTarget.value})}}>Description</InputGroup.Text>
                <Form.Control 
                as="textarea" 
                aria-label="Description" 
                placeholder="Come join your friends and family as we play a game of human vs zombies during summer camp 2025"/>
            </InputGroup>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="dark" onClick={handleSubmit}>
                {loading ?
                <Spinner animation="border" as="span"/>
                : <span>Submit</span>}
            </Button>
        </Modal.Footer>
    </Modal>);
}

export default CreateGameModal;