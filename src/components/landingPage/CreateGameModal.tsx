import React, { Dispatch, MutableRefObject, Ref, useRef, useState } from "react";
import { Button, Form, FormControl, InputGroup, Modal, Spinner } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { RequestsEnum } from "../../store/middleware/requestMiddleware";
import { namedRequestInProgAndError } from "../../store/slices/requestSlice";
import { PostGameAction, IPostGameRequest } from "../api/postGames";

import { FeatureGroup, MapContainer, TileLayer } from 'react-leaflet'
import L, { LatLngBoundsLiteral, LatLngTuple, Map as LeafletMap } from 'leaflet'
import { EditControl } from 'react-leaflet-draw';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import DraggableMap from "./DraggableMap";
import { MAP_TILER_API_KEY } from "../../constants/enviroment";
import { useForm } from "react-hook-form";

//import {FullscreenControl} from "leaflet-fullscreen";

const START_POSITION = [58.9843363, 5.6923114] as LatLngTuple;
const DEFAULT_ZOOM = 12;



interface IProps {
    show: boolean,
    setShow: Dispatch<React.SetStateAction<boolean>>,
}

interface IFormValues {
  name: string,
  description: string,
  startTime: string,
  endTime: string,
  boxBounds: string,
}

function CreateGameModal({ show, setShow }: IProps) {
    const [loading, error] = namedRequestInProgAndError(useAppSelector(state => state.requests), RequestsEnum.PostGame)
    const [boxBounds, setBoxBounds] = useState<LatLngBoundsLiteral | undefined>(undefined)
    const { handleSubmit, register, setError, formState, clearErrors} = useForm<IFormValues>();
    const dispatch = useAppDispatch();
    
    const mapRef = useRef<LeafletMap>(null)
    
    const hide = () => {
        setShow(false);
        setBoxBounds(undefined);
    }

    const handleOnSubmit = handleSubmit((data) => {
        if(!boxBounds) {
            setError("boxBounds", {message: "Please provide a game area using the interactive map"})
            return;
        }
        const game: IPostGameRequest = {
            name: data.name,
            description: data.description,
            ne_lat: boxBounds[1][0],
            ne_lng: boxBounds[1][1],
            sw_lat: boxBounds[0][0],
            sw_lng: boxBounds[0][1],
            startTime: data.startTime,
            endTime: data.endTime,
        }

        const postGameAction = PostGameAction(game, hide)
        dispatch(postGameAction)
    });

    const handleSubmitBtnClicked = () => {
        clearErrors();
        handleOnSubmit();
    };

    const moveMapToCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition((location) => {
            mapRef.current?.flyTo([location.coords.latitude, location.coords.longitude], DEFAULT_ZOOM);
            setBoxBounds([
                [location.coords.latitude - 0.01, location.coords.longitude - 0.01],
                [location.coords.latitude + 0.01, location.coords.longitude + 0.01],
            ])
        });
    }

    return (
        <Modal show={show} onEscapeKeyDown={hide} onHide={hide} id="myModal">
            <Modal.Header closeButton>
                <Modal.Title>Create a new game</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleOnSubmit}>
                <InputGroup >
                    <InputGroup.Text id="name" >Name:</InputGroup.Text>
                    <FormControl
                        placeholder="HvZ summer camp 2025"
                        aria-label="Name"
                        aria-describedby="name"
                        {...register("name", {
                            required: { value: true, message: "Name is required for a game" },
                            maxLength: { value: 50, message: "Name cant be longer than 50 characters" },

                        })}
                    />
                    <FormControl.Feedback type="invalid" style={{ display: "unset" }}>
                    {formState.errors.name && formState.errors.name.message}
                    </FormControl.Feedback>
                </InputGroup>
                <InputGroup className="mt-4">
                    <InputGroup.Text >Description</InputGroup.Text>
                    <Form.Control
                        as="textarea"
                        aria-label="Description"
                        placeholder="Come join your friends and family as we play a game of human vs zombies during summer camp 2025"
                        {...register("description", {
                            required: { value: true, message: "Description is required for a game"},
                            maxLength: { value: 800, message: "Description cant be longer than 800 characters"},
                        })}
                    />
                    <FormControl.Feedback type="invalid" style={{ display: "unset" }}>
                    {formState.errors.description && formState.errors.description.message}
                    </FormControl.Feedback>
                </InputGroup>
                <InputGroup className="mt-4">
                    <InputGroup.Text >Start time</InputGroup.Text>
                    <Form.Control
                        type="datetime-local"
                        defaultValue={new Date().toISOString().slice(0, -8)}
                        {...register('startTime', {
                            required: true,
                        })}
                    />
                </InputGroup>
                <InputGroup className="mt-4 mb-4">
                    <InputGroup.Text >End time</InputGroup.Text>
                    <Form.Control
                        type="datetime-local"
                        defaultValue={new Date().toISOString().slice(0, -8)}
                        {...register('endTime', {
                            required: true,
                        })}
                    />
                </InputGroup>
                <InputGroup>
                <MapContainer center={START_POSITION} zoom={DEFAULT_ZOOM} scrollWheelZoom={false} style={{ height: "500px", width: "100%" }} ref={mapRef}>
                    <DraggableMap 
                        boxBounds={boxBounds}
                        setBoxBounds={setBoxBounds}
                    />
                </MapContainer> 
                <Button variant="dark" onClick={moveMapToCurrentLocation}>Move map to your position</Button>
                <FormControl.Feedback type="invalid" style={{ display: "unset" }}>
                {formState.errors.boxBounds && formState.errors.boxBounds.message}
                </FormControl.Feedback>
                </InputGroup>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                {error &&
                    <p>{error.message}</p>
                }
                <Button variant="dark" onClick={handleSubmitBtnClicked} type="submit">
                    {loading ?
                        <Spinner animation="border" as="span" />
                        : <span>Submit</span>}
                </Button>
            </Modal.Footer>
        </Modal>);
}

export default CreateGameModal;