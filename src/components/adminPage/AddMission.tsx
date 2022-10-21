import { LatLngTuple } from "leaflet";
import { useEffect, useMemo, useState } from "react";
import { Button, Container, Form, FormControl, InputGroup, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { IGame } from "../../models/IGame"
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { RequestsEnum } from "../../store/middleware/requestMiddleware";
import { namedRequestInProgAndError } from "../../store/slices/requestSlice";
import { PostGameAction } from "../api/postGames";
import { IPostMissionRequest, PostMissionInGameAction } from "../api/postMission";
import DraggableMarkerMap, { DraggableMarkerType } from "./DraggableMarkerMap";

interface IParams {
    game: IGame,
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


function AddMission({ game }: IParams) {
    const center = useMemo(() => [(game!.ne_lat + game!.sw_lat) / 2, (game!.ne_lng + game!.sw_lng) / 2], [game]) as LatLngTuple

    const { handleSubmit, register, setValue } = useForm<IFormValues>();
    const [markerPosition, setMarkerPosition] = useState<LatLngTuple>(center);
    const [requestLoading, requestError] = namedRequestInProgAndError(useAppSelector(state => state.requests), RequestsEnum.PostMission);
    const dispatch = useAppDispatch();

    useEffect(() => {
        setValue("latitude", markerPosition[0]);
        setValue("longtitude", markerPosition[1]);
    }, [markerPosition]);

    const handleOnSubmit = handleSubmit((data) => {
        const request: IPostMissionRequest = {
            name: data.name,
            description: data.description,
            start_time: data.startTime,
            end_time: data.endTime,
            is_human_visible: data.isHumanVisible,
            is_zombie_visible: data.isZombieVisible,
            latitude: data.latitude,
            longitude: data.longtitude,
        }
        const action = PostMissionInGameAction(game.id, request);
        dispatch(action);
    });

    return (<>
        <h1>Add a new mission to game #{game.id}</h1>
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
                <InputGroup.Text id="name">Name</InputGroup.Text>
                <FormControl
                    aria-label="name"
                    aria-describedby="name"
                    {...register('name')}
                />
            </InputGroup>
            <InputGroup >
                <InputGroup.Text id="description">Description</InputGroup.Text>
                <FormControl
                    as="textarea"
                    aria-label="description"
                    aria-describedby="description"
                    {...register('description')}
                />
            </InputGroup>
            <Container>
                <Form.Check
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
                {requestError && <span style={{ fontStyle: 'italic' }}>{requestError.message}</span>}
                <Button className="float-end" type="submit">{requestLoading ? <Spinner animation="border" /> : <span>Submit</span>}</Button>
            </Container>
        </Form></>)
}

export default AddMission