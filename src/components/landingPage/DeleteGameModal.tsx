import { ChangeEvent, Dispatch, useState } from "react";
import { Button, Form, FormControl, InputGroup, Modal, Spinner } from "react-bootstrap";
import { IGame } from "../../models/IGame";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { RequestsEnum } from "../../store/middleware/requestMiddleware";
import { setGame } from "../../store/slices/gameSlice";
import { namedRequestInProgAndError } from "../../store/slices/requestSlice";
import { DeleteGameByIdAction } from "../api/deleteGameById";

interface IProps {
    game: IGame,
    show: boolean,
    setShow: Dispatch<React.SetStateAction<boolean>>,
}

function DeleteGameModal({ game, show, setShow }: IProps) {
    const dispatch = useAppDispatch();
    const [ , setInput] = useState("");
    const [ canDelete, setCanDelete ] = useState(false);
    const [loading, error] = namedRequestInProgAndError(useAppSelector(state => state.requests), RequestsEnum.DeleteGameById);

    const hide = () => {setShow(false)};

    const handleSubmit = () => {
        dispatch(DeleteGameByIdAction(game.id));
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInput(e.currentTarget.value);
        setCanDelete(e.currentTarget.value === game.name.trim());
    }

    return (
        <Modal show={show} onEscapeKeyDown={hide} onHide={hide}>
            <Modal.Header closeButton>
                <Modal.Title>Delete game: {game.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Are you sure you want to delete {game.name}</p>
                <p>Fill in the name inorder to delete the game</p>
                <InputGroup>
                    <InputGroup.Text id="title" >Title:</InputGroup.Text>
                    <FormControl
                        placeholder={game.name}
                        aria-label="Title"
                        aria-describedby="title"
                        onChange={handleInputChange}
                    />
                </InputGroup>
            </Modal.Body>
            <Modal.Footer>
                { error && <p>{error.message}</p> }
                <Button
                    variant="danger"
                    onClick={handleSubmit}
                    disabled={!canDelete}
                >
                    {loading ?
                        <Spinner animation="border" as="span" />
                        : <span>delete</span>}
                </Button>
            </Modal.Footer>
        </Modal>);
}

export default DeleteGameModal;