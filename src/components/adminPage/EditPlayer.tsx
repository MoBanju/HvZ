import { Button, Container, FormControl, InputGroup, Spinner } from "react-bootstrap"
import { useForm } from "react-hook-form"
import { Form } from 'react-bootstrap'
import { IPlayer } from "../../models/IPlayer"
import { useEffect, useRef, useState } from "react";
import { PutPlayerTypeAction } from "../api/putPlayerType";
import { IGame } from "../../models/IGame";
import { useDispatch } from "react-redux";
import { namedRequestInProgAndError, RequestFinished, RequestStarted } from "../../store/slices/requestSlice";
import { useAppSelector } from "../../store/hooks";
import { RequestsEnum } from "../../store/middleware/requestMiddleware";
import { DeletePlayerByIdAction } from "../api/deletePlayerById";
import CustomConfirmModal from "../shared/CustomConfirmModal";
import { HideEditFormFnc } from "./EditItem";

interface IParams {
    game: IGame,
    player: IPlayer,
    closeForm: HideEditFormFnc,
}

interface IFormValues {
    state: string,
}

function EditPlayer({ game, player, closeForm }: IParams) {
    const { handleSubmit, register} = useForm<IFormValues>();
    const dispatch = useDispatch();
    const [requestPutLoading, requestPutError] = namedRequestInProgAndError(useAppSelector(state => state.requests), RequestsEnum.PutPlayerType);
    const [requestDeleteLoading, requestDeleteError] = namedRequestInProgAndError(useAppSelector(state => state.requests), RequestsEnum.DeletePlayerById);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    
    useEffect(() => {
        setPlayerState(getDefaultPlayerState());
    }, [player])
    
    const handleOnSubmit = handleSubmit((data) => {
        const newPlayer: IPlayer = {
            id: player.id,
            isHuman: false,
            isPatientZero: false,
            biteCode: player.biteCode,
            user: player.user
        }
        
        if (data.state === "human") {
            newPlayer.isHuman = true
            newPlayer.isPatientZero = false
        }
        else if (data.state === "zombie") {
            newPlayer.isHuman = false
            newPlayer.isPatientZero = false
        }
        else if (data.state === "patientzero") {
            newPlayer.isHuman = false
            newPlayer.isPatientZero = true
        }
        else return;
        
        const action = PutPlayerTypeAction(game.id, newPlayer, () => {closeForm(`Successfully edited player ${player.id}`)});
        dispatch(action)
    });
    
    const handleDeletePlayer = () => {
        const action = DeletePlayerByIdAction(game.id, player.id, () => {closeForm(undefined)});
        dispatch(action);
    }

    const handleDeleteBtnClicked = () => {
        dispatch(RequestStarted(RequestsEnum.DeletePlayerById));
        setShowDeleteModal(true);
    }

    const handleDeleteModalClosed = () => {
        dispatch(RequestFinished(RequestsEnum.DeletePlayerById));
    }
    
    const getDefaultPlayerState = () => {
        if (!player.isHuman && !player.isPatientZero)
            return "zombie";
        if (!player.isHuman && player.isPatientZero)
            return "patientzero";
        return "human";
    }
    
    const [playerState, setPlayerState] = useState(getDefaultPlayerState());

    return (
        <>
            <h1>Edit {player.user.firstName}</h1>
            <Form onSubmit={handleOnSubmit}>
                <InputGroup >
                    <InputGroup.Text id="id" >Id</InputGroup.Text>
                    <FormControl
                        aria-label="Id"
                        aria-describedby="id"
                        value={player.id}
                        readOnly
                    />
                </InputGroup>
                <InputGroup >
                    <InputGroup.Text id="firstname" >First Name</InputGroup.Text>
                    <FormControl
                        aria-label="firstname"
                        aria-describedby="firstname"
                        value={player.user.firstName}
                        readOnly
                    />
                </InputGroup>
                <InputGroup >
                    <InputGroup.Text id="lastname" >Last Name</InputGroup.Text>
                    <FormControl
                        aria-label="lastname"
                        aria-describedby="lastname"
                        value={player.user.lastName}
                        readOnly
                    />
                </InputGroup>
                <InputGroup >
                    <InputGroup.Text id="bitecode" >Bitecode</InputGroup.Text>
                    <FormControl
                        aria-label="bitecode"
                        aria-describedby="bitecode"
                        value={player.biteCode}
                        readOnly
                    />
                </InputGroup>
                <Form.Select {...register("state")} value={playerState} onChange={(e) => {setPlayerState(e.target.value)}}>
                    <option value="human">Human</option>
                    <option value="zombie">Zombie</option>
                    <option value="patientzero">Patient Zero</option>
                </Form.Select>
                <Container>
                    <Button variant="danger" onClick={handleDeleteBtnClicked}>
                        {requestDeleteLoading ? <Spinner animation="border" /> : <span>Delete</span>}
                    </Button>
                    {requestDeleteError && <span style={{ fontStyle: 'italic' }}>{requestDeleteError.message}</span>}
                    {requestPutError && <span style={{ fontStyle: 'italic' }}>{requestPutError.message}</span>}
                    <Button className="float-end" type="submit" >
                        {requestPutLoading ? <Spinner animation="border" /> : <span>submit</span>}
                    </Button>
                </Container>
            </Form>
            <CustomConfirmModal
                title="Are you sure?"
                submitBtn="Delete"
                show={showDeleteModal} 
                setShow={setShowDeleteModal} 
                handleCancle={handleDeleteModalClosed}
                handleSumbit={handleDeletePlayer}
            />
        </>
    )
}

export default EditPlayer