import React, { Dispatch, useState } from "react";
import { Button, Form, FormControl, InputGroup, Modal, Spinner} from "react-bootstrap";
import { IGame } from "../../models/IGame";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { RequestsEnum } from "../../store/middleware/requestMiddleware";
import { addGame } from "../../store/slices/gamesSlice";
import { namedRequestInProgAndError } from "../../store/slices/requestSlice";
import { PostGameAction, PostGameRequest} from "../api/postGames";


interface IProps {
    show: boolean,
    setShow: Dispatch<React.SetStateAction<boolean>>,
}

function CreateGameModal({show, setShow}: IProps) {
    const hide = () => {setShow(false); console.log("LALALAL")}
    const [loading, error] = namedRequestInProgAndError(useAppSelector(state => state.requests), RequestsEnum.PostGame)
    
    const [game, setGame] = useState<PostGameRequest>({name: "", description: ""});
    const dispatch = useAppDispatch();

    const submitGame = () => {  
        const postGameAction = PostGameAction(game, () => {hide()})
        dispatch(postGameAction)
      };

    return (
    <Modal show={show} onEscapeKeyDown={hide} onHide={hide} id="myModal">
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setGame({...game, name: e.currentTarget.value})}}
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
            {error &&
                <p>{error.message}</p>
            }
            <Button variant="dark" onClick={submitGame}>
                {loading ?
                <Spinner animation="border" as="span"/>
                : <span>Submit</span>}
            </Button>
        </Modal.Footer>
    </Modal>);
}

export default CreateGameModal;