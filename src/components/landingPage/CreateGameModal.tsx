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
import DraggableMap from "./DraggableMap";
import { MAP_TILER_API_KEY } from "../../constants/enviroment";

//import {FullscreenControl} from "leaflet-fullscreen";

const START_POSITION = [58.9843363, 5.6923114] as LatLngTuple;
const DEFAULT_ZOOM = 12;



interface IProps {
    show: boolean,
    setShow: Dispatch<React.SetStateAction<boolean>>,
}

function CreateGameModal({ show, setShow }: IProps) {
    const hide = () => { setShow(false); }
    const [loading, error] = namedRequestInProgAndError(useAppSelector(state => state.requests), RequestsEnum.PostGame)
    const [position, setPosition] = useState<LatLngTuple>(START_POSITION);
    const [boxBounds, setBoxBounds] = useState<LatLngBoundsLiteral>([
        [START_POSITION[0] - 0.01, START_POSITION[1] - 0.01],
        [START_POSITION[0] + 0.01, START_POSITION[1] + 0.01]
    ]);

    /* Test */
    const [maplayer, setMaplayer] = useState<L.FeatureGroup | undefined>(undefined); 

    const onCreated = (e:any) => {

       // console.log(e);

      //  console.log(mapRef);
      //  console.log(mapRef.current);
        
        const {layerType, layer} = e;


        //const {_leaflet_id} = layer;
        
        var soLayer : L.Layer = layer;
        
        var layers = [];
        layers.push(soLayer);
        var FeatureGroup : L.FeatureGroup = L.featureGroup(layers);
        console.log(FeatureGroup);
        //var test = mapRef.current?.hasLayer(layer);


        var lc = document.getElementsByClassName('leaflet-draw-draw-rectangle')  as HTMLCollectionOf<HTMLElement>;
        
        console.log(lc);

        lc[0].style.visibility = 'hidden';
      
        var Bounds = FeatureGroup.getBounds();
        if(Bounds !== undefined){
        var NELng = Bounds.getNorthEast().lng;
        var NELat = Bounds.getNorthEast().lat;
        var SWLng = Bounds.getSouthWest().lng;
        var SWLat = Bounds.getSouthWest().lat;

        let BoxBoundsNew : L.LatLngBoundsLiteral = boxBounds;
        BoxBoundsNew[1][0] = NELat;
        BoxBoundsNew[1][1] = NELng;
        BoxBoundsNew[0][0] = SWLat;
        BoxBoundsNew[0][1] = SWLng;
        
        setBoxBounds(BoxBoundsNew);


        console.log("BOX TO BE SAVED");
        console.log(BoxBoundsNew);


        }
    };

    const onDeleted = (e:any) => {
        var lc = document.getElementsByClassName('leaflet-draw-draw-rectangle')  as HTMLCollectionOf<HTMLElement>;
        lc[0].style.visibility = 'visible';
         

    }



    const onFeatureGroupReady = (reactFGref: any) => {
        // store the ref for future access to content
    };
    /* Test */
    
    const mapRef = useRef<LeafletMap>(null)
    const nameInputRef = useRef() as MutableRefObject<HTMLInputElement>;
    const descriptionInputRef = useRef() as MutableRefObject<HTMLTextAreaElement>;
    const startTimeRef = useRef<HTMLInputElement>(null)
    const endTimeRef = useRef<HTMLInputElement>(null)

    const dispatch = useAppDispatch();

    const submitGame = () => {
        const game: IPostGameRequest = {
            name: nameInputRef.current.value,
            description: descriptionInputRef.current.value,
            ne_lat: boxBounds[1][0],
            ne_lng: boxBounds[1][1],
            sw_lat: boxBounds[0][0],
            sw_lng: boxBounds[0][1],
            startTime: startTimeRef.current!.value,
            endTime: endTimeRef.current!.value,
        }

        console.log("DO YOU EVEN POST ??")
        console.log(game)
        console.log(game.ne_lat)
        console.log(game.ne_lng)
        console.log(game.sw_lat)
        console.log(game.sw_lng)


        const postGameAction = PostGameAction(game, hide)
        dispatch(postGameAction)
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

    const getInitalEndDate = () => {
        let now = new Date();
        now.setDate(now.getDate() + 5);
        return now.toISOString().slice(0,16);
    }

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
                <InputGroup className="mt-4">
                    <InputGroup.Text >Start time</InputGroup.Text>
                    <input
                        type="datetime-local"
                        ref={startTimeRef}
                        defaultValue={new Date().toISOString().slice(0,16)}
                    />
                </InputGroup>
                <InputGroup className="mt-4 mb-4">
                    <InputGroup.Text >End time</InputGroup.Text>
                    <input
                        type="datetime-local"
                        ref={endTimeRef}
                        defaultValue={getInitalEndDate()}
                    />
                </InputGroup>
                <MapContainer center={position} zoom={DEFAULT_ZOOM} scrollWheelZoom={false} style={{ height: "500px", width: "100%" }} ref={mapRef}>
                    <TileLayer
                        url={"https://api.maptiler.com/maps/basic-v2-dark/{z}/{x}/{y}.png?key=" + MAP_TILER_API_KEY + ""}
                        tileSize={512}
                        minZoom={1}
                        zoomOffset={-1}
                        attribution={"\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e"}
                        crossOrigin={true}
                    />
                {/* <DraggableMap
                        boxBounds={boxBounds}
                        setBoxBounds={setBoxBounds}
                        position={position}
                        setPosition={setPosition}

                    /> */}
                    {/**/} <FeatureGroup
                         /**/ref={featureGroupRef => {
                            onFeatureGroupReady(featureGroupRef);
                        }}>
                        <EditControl 
                            
                            draw={{
                                polyline: false,
                                polygon: false,
                                rectangle: {
                                    
                                    icon: new L.DivIcon({
                                        iconSize: new L.Point(8, 8),
                                        iconUrl: "../../../gravestone.png",
                                        className: /* "leaflet-div-icon leaflet-editing-icon" */"leaflet-marker-icon"
                                    }),
                                    shapeOptions: {
                                        guidelineDistance: 10,
                                        color: "green",
                                        weight: 3
                                    }
                                },
                                circlemarker: false,
                                circle: false,
                                marker: false,
                            }}
                            position="bottomright" onCreated={onCreated} onDeleted={onDeleted} />
                    </FeatureGroup>
                    {/* <FullscreenControl /> */} 
                </MapContainer> 
                <Button variant="dark" onClick={moveMapToCurrentLocation}>Move map to your position</Button>
            </Modal.Body>
            <Modal.Footer>
                {error &&
                    <p>{error.message}</p>
                }
                <Button variant="dark" onClick={submitGame}>
                    {loading ?
                        <Spinner animation="border" as="span" />
                        : <span>Submit</span>}
                </Button>
            </Modal.Footer>
        </Modal>);
}

export default CreateGameModal;