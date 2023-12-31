import { LatLngTuple } from "leaflet";
import { useEffect, useMemo, useState } from "react";
import { Button, Container, Form, FormControl, InputGroup, Spinner } from "react-bootstrap"
import { useForm } from "react-hook-form";
import { IGame } from "../../models/IGame"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { RequestsEnum } from "../../store/middleware/requestMiddleware";
import { namedRequestInProgAndError } from "../../store/slices/requestSlice";
import { IKillRequest, PostKillAction } from "../api/postKill";
import DraggableMarkerMap, { DraggableMarkerType } from "./DraggableMarkerMap"
import { HideEditFormFnc } from "./EditItem";

interface IParams {
    game: IGame,
    closeForm: HideEditFormFnc,
}

interface IFormValues {
    killer: number,
    victim: number,
    description: string,
    timeDeath: string,
    latitude: number,
    longtitude: number,
}

function AddKill({ game, closeForm }: IParams) {
    const center = useMemo(() => [(game!.ne_lat + game!.sw_lat) / 2, (game!.ne_lng + game!.sw_lng) / 2], [game]) as LatLngTuple

    const { players } = useAppSelector(state => state.game);
    const { handleSubmit, register, setValue, formState, setError } = useForm<IFormValues>();
    const [markerPosition, setMarkerPosition] = useState<LatLngTuple>(center);
    const [showMap, setShowMap] = useState<boolean>(false)
    const [requestLoading, requestError] = namedRequestInProgAndError(useAppSelector(state => state.requests), RequestsEnum.PostKill);
    const dispatch = useAppDispatch();

    useEffect(() => {
        setValue("latitude", markerPosition[0]);
        setValue("longtitude", markerPosition[1]);
    }, [markerPosition]);

    const toggleHasLocation = () => {
        setShowMap((prevShowMap) => !prevShowMap);
    }
    const handleOnSubmit = handleSubmit((data) => {
        let victim = players.find(player => player.id === Number(data.victim));
        let killer = players.find(player => player.id === Number(data.killer));
        if(!victim) {
            setError("victim", {message: "Please select a victim"})
        }
        if(!killer) {
            setError("killer", {message: "Please select a killer"})
        }
        if (!victim || !killer) {
            return
        };
        const request: IKillRequest = {
            timeDeath: data.timeDeath,
            killerId: killer.id,
            biteCode: victim.biteCode,
            description: data.description,
            latitude: showMap ? data.latitude : undefined,
            longitude: showMap ? data.longtitude : undefined,
        }
        const action = PostKillAction(game.id, request, () => { closeForm(`Successfully added a new kill to game ${game.id}`)});
        dispatch(action);
    });

    return (<>
        <h1>Add a new kill to game #{game.id}</h1>
        <Form onSubmit={handleOnSubmit}>
            <InputGroup>
                <Form.Select defaultValue={0} {...register("killer")}>
                    <option value={0}>Killer</option>
                    {players
                        .filter(killer => !killer.isHuman)
                        .map(player =>
                            <option value={player.id} key={player.id}>
                                {player.user.firstName}
                            </option>
                        )}
                </Form.Select>
                <FormControl.Feedback type="invalid" style={{ display: "unset" }}>
                    {formState.errors.killer && formState.errors.killer.message}
                </FormControl.Feedback>
            </InputGroup>
            <InputGroup>
                <Form.Select defaultValue={0} {...register("victim")}>
                    <option value={0}>Victim</option>
                    {players
                        .filter(player => player.isHuman)
                        .map(victim =>
                            <option value={victim.id} key={victim.id}>
                                {victim.user.firstName}
                            </option>
                        )}
                </Form.Select>
                <FormControl.Feedback type="invalid" style={{ display: "unset" }}>
                    {formState.errors.victim && formState.errors.victim.message}
                </FormControl.Feedback>
            </InputGroup>
            <InputGroup >
                <InputGroup.Text id="timedeath">Time of death</InputGroup.Text>
                <FormControl
                    aria-label="timedeath"
                    type="datetime-local"
                    aria-describedby="timedeath"
                    defaultValue={new Date().toISOString().slice(0, -8)}
                    {...register('timeDeath')}
                />
            </InputGroup>
            <InputGroup >
                <InputGroup.Text id="description">Description</InputGroup.Text>
                <FormControl
                    as="textarea"
                    aria-label="description"
                    aria-describedby="description"
                    {...register('description', {
                        maxLength: {value: 200, message: "Description cant be more than 200 characters"},
                        required: {value: true, message: "Please provide a description"}
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
                {requestError && <span style={{ fontStyle: 'italic' }}>{requestError.message}</span>}
                <Button className="float-end" type="submit">{requestLoading ? <Spinner animation="border" /> : <span>Submit</span>}</Button>
            </Container>
        </Form></>)
}

export default AddKill