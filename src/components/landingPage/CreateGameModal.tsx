import React, { Dispatch, MutableRefObject, useRef, useState } from "react";
import { Button, Form, FormControl, InputGroup, Modal, Spinner} from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { RequestsEnum } from "../../store/middleware/requestMiddleware";
import { namedRequestInProgAndError } from "../../store/slices/requestSlice";
import { PostGameAction, PostGameRequest } from "../api/postGames";


interface IProps {
    show: boolean,
    setShow: Dispatch<React.SetStateAction<boolean>>,
}

function CreateGameModal({show, setShow}: IProps) {
    const hide = () => {setShow(false);}
    const [loading, error] = namedRequestInProgAndError(useAppSelector(state => state.requests), RequestsEnum.PostGame)

    const nameInputRef = useRef() as MutableRefObject<HTMLInputElement>;
    const descriptionInputRef = useRef() as MutableRefObject<HTMLTextAreaElement>;
    
    const dispatch = useAppDispatch();

    const submitGame = () => {  
        const game: PostGameRequest = {
            name: nameInputRef.current.value,
            description: descriptionInputRef.current.value,
        }
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
                ref={nameInputRef}
                />
            </InputGroup>
            <InputGroup className="mt-4">
                <InputGroup.Text >Description</InputGroup.Text>
                <Form.Control 
                as="textarea" 
                aria-label="Description" 
                placeholder="Come join your friends and family as we play a game of human vs zombies during summer camp 2025"
                ref={descriptionInputRef}
            />
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