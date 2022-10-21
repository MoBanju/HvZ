import { LatLngTuple } from "leaflet";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
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
import { HideEditFormFnc } from "./EditItem";

interface IParams {
    game: IGame,
    kill: IKill,
    closeForm: HideEditFormFnc,
}

interface IFormValues {
    description: string,
    timeDeath: string,
    latitude: number,
    longtitude: number,
}

function EditKill({ game, kill, closeForm }: IParams) {

    const hasLocation = useMemo<boolean>(() => Boolean(kill.latitude), [kill]);
    const center = useMemo(() => [(game!.ne_lat + game!.sw_lat) / 2, (game!.ne_lng + game!.sw_lng) / 2], [game]) as LatLngTuple
    
    const { handleSubmit, register, setValue, formState } = useForm<IFormValues>();
    const [markerPosition, setMarkerPosition] = useState<LatLngTuple>(hasLocation ? [kill.latitude!, kill.longitude!] : [center[0], center[1]]);
    const [showMap, setShowMap] = useState<boolean>(hasLocation)
    const [requestPutLoading, requestPutError] = namedRequestInProgAndError(useAppSelector(state => state.requests), RequestsEnum.PutKillById);
    const [requestDeleteLoading, requestDeleteError] = namedRequestInProgAndError(useAppSelector(state => state.requests), RequestsEnum.DeleteKillById);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const dispatch = useAppDispatch();
    
    useEffect(() => {
        setValue("latitude", markerPosition ? markerPosition[0] : center[0]);
        setValue("longtitude", markerPosition ? markerPosition[1] : center[1]);
    }, [markerPosition]);
    
    useEffect(() => {
        setMarkerPosition(hasLocation ? [kill.latitude!, kill.longitude!] : [center[0], center[1]]);
        setShowMap(hasLocation);
    }, [kill])
    
    const toggleHasLocation = () => {
        setShowMap((prevShowMap) => !prevShowMap);
    }
    console.log(kill.latitude, hasLocation, showMap)

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
        const action = PutKillAction(game.id, updatedKill, () => {closeForm(`Successfully edited kills ${kill.id}`)});
        dispatch(action);
    });

    const handleDeleteKill = () => {
        const action = DeleteKillByIdAction(game.id, kill.id, () => {closeForm(undefined)});
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
                        type="datetime-local"
                        defaultValue={new Date(kill.timeDeath).toISOString().slice(0, -8)}
                        {...register('timeDeath', {
                            required: {value: true, message: "Please provide a description"},
                            maxLength: {value: 200, message: "Description cant be longer than 200 chars"}
                        })}
                    />
                    <FormControl.Feedback type="invalid" style={{display: "unset"}}>
                        {formState.errors.timeDeath && formState.errors.timeDeath.message}
                    </FormControl.Feedback> 
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
                    checked={showMap}
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