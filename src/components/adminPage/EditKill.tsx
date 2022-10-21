import { LatLngTuple } from "leaflet";
import { ChangeEvent, useEffect, useState } from "react";
import { Button, Container, Form, FormControl, InputGroup, Spinner } from "react-bootstrap"
import { useForm } from "react-hook-form";
import { IGame } from "../../models/IGame";
import { IKill } from "../../models/IKill"
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { RequestsEnum } from "../../store/middleware/requestMiddleware";
import { namedRequestInProgAndError, RequestFinished, RequestStarted } from "../../store/slices/requestSlice";
import { DeleteKillByIdAction } from "../api/deleteKillById";
import { PutKillAction } from "../api/putKillById";
import CustomConfirmModal from "../shared/CustomConfirmModal";
import DraggableMarkerMap, { DraggableMarkerType } from "./DraggableMarkerMap";

interface IParams {
    game: IGame,
    kill: IKill,
    closeForm: () => void,
}

interface IFormValues {
    description: string,
    timeDeath: string,
    latitude: number,
    longtitude: number,
}

function EditKill({ game, kill, closeForm }: IParams) {
    const { handleSubmit, register, setValue, formState } = useForm<IFormValues>();
    const [markerPosition, setMarkerPosition] = useState<LatLngTuple>([kill.latitude || 0, kill.longitude || 0]);
    const [showMap, setShowMap] = useState<boolean>((typeof kill.latitude != "undefined"))
    const [requestPutLoading, requestPutError] = namedRequestInProgAndError(useAppSelector(state => state.requests), RequestsEnum.PutKillById);
    const [requestDeleteLoading, requestDeleteError] = namedRequestInProgAndError(useAppSelector(state => state.requests), RequestsEnum.DeleteKillById);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const dispatch = useAppDispatch();

    useEffect(() => {
        setValue("latitude", markerPosition[0]);
        setValue("longtitude", markerPosition[1]);
    }, [markerPosition]);

    useEffect(() => {
        setMarkerPosition([kill.latitude || 0, kill.longitude || 0]);
    }, [kill])

    const toggleHasLocation = () => {
        setShowMap((prevShowMap) => !prevShowMap);
    }

    const handleOnSubmit = handleSubmit((data) => {
        const updatedKill: IKill = {
            id: kill.id,
            timeDeath: data.timeDeath,
            description: data.description,
            latitude: showMap ? data.latitude : undefined,
            longitude: showMap ? data.longtitude : undefined,
            killer: kill.killer,
            victim: kill.victim,
        }
        const action = PutKillAction(game.id, updatedKill);
        dispatch(action);
    });

    const handleDeleteKill = () => {
        const action = DeleteKillByIdAction(game.id, kill.id, closeForm);
        dispatch(action);
    }

    const handleDeleteBtnClicked = () => {
        dispatch(RequestStarted(RequestsEnum.DeleteKillById))
        setShowDeleteModal(true)
    }

    const handleDeleteModalClosed = () => { dispatch(RequestFinished(RequestsEnum.DeleteKillById)) }


    return (
        <>
            <h1>Update kill #{kill.id}</h1>
            <Form onSubmit={handleOnSubmit}>
                <InputGroup >
                    <InputGroup.Text id="id" >Id</InputGroup.Text>
                    <FormControl
                        aria-label="Id"
                        aria-describedby="id"
                        value={kill.id}
                        readOnly
                    />
                </InputGroup>
                <InputGroup >
                    <InputGroup.Text id="killer" >Killer</InputGroup.Text>
                    <FormControl
                        aria-label="killer"
                        aria-describedby="killer"
                        value={kill.killer.user.firstName}
                        readOnly
                    />
                </InputGroup>
                <InputGroup >
                    <InputGroup.Text id="victim">Victim</InputGroup.Text>
                    <FormControl
                        aria-label="victim"
                        aria-describedby="victim"
                        value={kill.victim.user.firstName}
                        readOnly
                    />
                </InputGroup>
                <InputGroup >
                    <InputGroup.Text id="timedeath">Time of death</InputGroup.Text>
                    <FormControl
                        aria-label="timedeath"
                        aria-describedby="timedeath"
                        defaultValue={kill.timeDeath}
                        {...register('timeDeath')}
                    />
                </InputGroup>
                <InputGroup >
                    <InputGroup.Text id="description">Description</InputGroup.Text>
                    <FormControl
                        as="textarea"
                        aria-label="description"
                        aria-describedby="description"
                        defaultValue={kill.description}
                        {...register('description', {
                            maxLength: { value: 200, message: "Description cant be more than 200 characters." }
                        })}
                    />
                    <FormControl.Feedback type="invalid" style={{ display: "unset" }}>
                        {formState.errors.description && formState.errors.description.message}
                    </FormControl.Feedback>
                </InputGroup>
                <Form.Check
                    type="switch"
                    id="has-location"
                    label="Has location"
                    onChange={toggleHasLocation}
                    defaultChecked={showMap}
                />
                {
                    showMap &&
                    <>
                        <InputGroup >
                            <InputGroup.Text id="latitude">Latitude</InputGroup.Text>
                            <FormControl
                                aria-label="latitude"
                                aria-describedby="latitude"
                                defaultValue={markerPosition[0]}
                                readOnly
                                {...register('latitude')}
                            />
                        </InputGroup>
                        <InputGroup >
                            <InputGroup.Text id="longtitude">Longtitude</InputGroup.Text>
                            <FormControl
                                aria-label="longtitude"
                                aria-describedby="longtitude"
                                defaultValue={markerPosition[1]}
                                readOnly
                                {...register('longtitude')}
                            />
                        </InputGroup>
                        <DraggableMarkerMap
                            markerPosition={markerPosition}
                            setMarkerPosition={setMarkerPosition}
                            type={DraggableMarkerType.Kill}
                        />
                    </>
                }
                <Container>
                    <Button variant="danger" onClick={handleDeleteBtnClicked}>
                        {requestDeleteLoading ? <Spinner animation="border" /> : <span>Delete</span>}
                    </Button>
                    {requestDeleteError && <span style={{ fontStyle: 'italic' }}>{requestDeleteError.message}</span>}
                    {requestPutError && <span style={{ fontStyle: 'italic' }}>{requestPutError.message}</span>}
                    <Button className="float-end" type="submit">{requestPutLoading ? <Spinner animation="border" /> : <span>Submit</span>}</Button>
                </Container>
            </Form>
            <CustomConfirmModal
                title="Are you sure?"
                submitBtn="Delete"
                show={showDeleteModal}
                setShow={setShowDeleteModal}
                handleCancle={handleDeleteModalClosed}
                handleSumbit={handleDeleteKill}
            />
        </>
    )
}

export default EditKill