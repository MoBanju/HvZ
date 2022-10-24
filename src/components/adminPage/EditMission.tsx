import { LatLngTuple } from "leaflet";
import { useEffect, useMemo, useState } from "react";
import { InputGroup, FormControl, Container, Button, Spinner, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { IGame } from "../../models/IGame"
import { IMission } from "../../models/IMission"
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { RequestsEnum } from "../../store/middleware/requestMiddleware";
import { namedRequestInProgAndError, RequestFinished, RequestStarted } from "../../store/slices/requestSlice";
import { DeleteMissionByIdAction } from "../api/deleteMissionById";
import { PutMissionAction } from '../api/putMission'
import CustomConfirmModal from "../shared/CustomConfirmModal";
import DraggableMarkerMap, { DraggableMarkerType } from "./DraggableMarkerMap";
import { HideEditFormFnc } from "./EditItem";

interface IParams {
    game: IGame,
    mission: IMission,
    closeForm: HideEditFormFnc,
}

interface IFormValues {
    name: string,
    description: string,
    isHumanVisible: boolean,
    isZombieVisible: boolean,
    startTime: string,
    endTime: string,
    longtitude: number,
    latitude: number,
}

function EditMission({ game, mission, closeForm }: IParams) {
    const { handleSubmit, register, setValue, formState } = useForm<IFormValues>();
    const [markerPosition, setMarkerPosition] = useState<LatLngTuple>([mission.latitude, mission.longitude]);
    const [requestPutLoading, requestPutError] = namedRequestInProgAndError(useAppSelector(state => state.requests), RequestsEnum.PutMission);
    const [requestDeleteLoading, requestDeleteError] = namedRequestInProgAndError(useAppSelector(state => state.requests), RequestsEnum.DeleteMissionById);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const dispatch = useAppDispatch();

    useEffect(() => {
        setValue("latitude", markerPosition[0]);
        setValue("longtitude", markerPosition[1]);
    }, [markerPosition]);

    useEffect(() => {
        setMarkerPosition([mission.latitude, mission.longitude]);
    }, [mission]);


    const handleOnSubmit = handleSubmit((data) => {
        const updatedMission: IMission = {
            id: mission.id,
            name: data.name,
            description: data.description,
            start_time: new Date(data.startTime).toISOString(),
            end_time: new Date(data.endTime).toISOString(),
            is_human_visible: data.isHumanVisible,
            is_zombie_visible: data.isZombieVisible,
            latitude: data.latitude,
            longitude: data.longtitude,
        }
        const action = PutMissionAction(game.id, mission.id, updatedMission, () => {closeForm(`Successfully edited mission ${mission.id}`)});
        dispatch(action)
    });

    const handleDeleteMission = () => {
        const action = DeleteMissionByIdAction(game.id, mission.id, () => {closeForm(undefined)});
        dispatch(action);
    }

    const handleDeleteBtnClicked = () => {
        dispatch(RequestStarted(RequestsEnum.DeleteMissionById))
        setShowDeleteModal(true);
    }

    const handleDeleteModalClosed = () => {dispatch(RequestFinished(RequestsEnum.DeleteMissionById))}

    return (<>
        <h1>Edit mission: {mission.name}</h1>
        <Form onSubmit={handleOnSubmit}>
            <InputGroup >
                <InputGroup.Text id="gameId">Game ID</InputGroup.Text>
                <FormControl
                    aria-label="gameId"
                    aria-describedby="gameId"
                    value={game.id}
                    readOnly
                />
            </InputGroup>
            <InputGroup >
                <InputGroup.Text id="missionId">Mission ID</InputGroup.Text>
                <FormControl
                    aria-label="missionId"
                    aria-describedby="missionId"
                    value={game.id}
                    readOnly
                />
            </InputGroup>
            <InputGroup >
                <InputGroup.Text id="name">Name</InputGroup.Text>
                <FormControl
                    aria-label="name"
                    aria-describedby="name"
                    defaultValue={mission.name}
                    {...register('name', {
                        required: {value: true, message: "Please proivde a name"},
                        maxLength: {value: 100, message: "A name cant be longer than 100 characters."}
                    })}
                />
                <FormControl.Feedback type="invalid" style={{ display: "unset" }}>
                {formState.errors.name && formState.errors.name.message}
                </FormControl.Feedback>
            </InputGroup>
            <InputGroup >
                <InputGroup.Text id="description">Description</InputGroup.Text>
                <FormControl
                    as="textarea"
                    aria-label="description"
                    aria-describedby="description"
                    defaultValue={mission.description}
                    {...register('description', {
                        required: {value: true, message: "Please proivde a description"},
                        maxLength: {value: 2000, message: "A description cant be longer than 2000 characters."}
                    })}
                />
                <FormControl.Feedback type="invalid" style={{ display: "unset" }}>
                {formState.errors.description && formState.errors.description.message}
                </FormControl.Feedback>
            </InputGroup>
            <Container className="btn-group">
                <Form.Check
                    className="me-2"
                    type='checkbox'
                    id='isHumanVisible'
                    label='Is Human Visible'
                    {...register('isHumanVisible')}
                />
                <Form.Check
                    type='checkbox'
                    id='isZombieVisible'
                    label='Is Zombie Visible'
                    {...register('isZombieVisible')}
                />
            </Container>
            <InputGroup >
                <InputGroup.Text id="startTime">Start Time</InputGroup.Text>
                <FormControl
                    aria-label="startTime"
                    aria-describedby="startTime"
                    type="datetime-local"
                    defaultValue={mission.start_time ? new Date(mission.start_time).toISOString().slice(0, -8) : new Date().toISOString().slice(0, -8)}
                    {...register('startTime', {
                        required: true,
                    })}
                />
            </InputGroup>
            <InputGroup >
                <InputGroup.Text id="endTime">End Time</InputGroup.Text>
                <FormControl
                    aria-label="endTime"
                    aria-describedby="endTime"
                    type="datetime-local"
                    defaultValue={mission.start_time ? new Date(mission.start_time).toISOString().slice(0, -8) : new Date().toISOString().slice(0, -8)}
                    {...register('endTime')}
                />
            </InputGroup>
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
                type={DraggableMarkerType.Mission}
            />
            <Container>
                <Button variant="danger" onClick={handleDeleteBtnClicked}>
                    {requestDeleteLoading ? <Spinner animation="border" /> : <span>Delete</span>}
                </Button>
                {requestDeleteError && <span style={{ fontStyle: 'italic' }}>{requestDeleteError.message}</span>}
                {requestPutError && <span style={{ fontStyle: 'italic' }}>{requestPutError.message}</span>}
                <Button className="float-end" type="submit">
                    {requestPutLoading ? <Spinner animation="border" /> : <span>Submit</span>}
                </Button>
            </Container>
        </Form>
        <CustomConfirmModal
            title="Are you sure?"
            submitBtn="Delete"
            show={showDeleteModal}
            setShow={setShowDeleteModal}
            handleCancle={handleDeleteModalClosed}
            handleSumbit={handleDeleteMission}
        />
    </>)
}

export default EditMission