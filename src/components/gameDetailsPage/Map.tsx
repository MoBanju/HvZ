import { timeStamp } from 'console';
import L, { LatLngTuple, map } from 'leaflet';
import { SetStateAction, useEffect, useRef, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import { MAP_TILER_API_KEY } from '../../constants/enviroment';
import { IGame } from '../../models/IGame';
import { IKill } from '../../models/IKill';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import Gravestone from './Gravestone';


function Map({gameid} : {gameid: number}) {
    const { game } = useAppSelector(state => state.game)
    const center = [(game!.ne_lat + game!.sw_lat) / 2, (game!.ne_lng + game!.sw_lng) / 2] as LatLngTuple
    return (
    <MapContainer center={center} zoom={13} scrollWheelZoom={true} style={{
        height: "500px",
        width: "600px",
      }} maxBounds={[[game!.sw_lat, game!.sw_lng], [game!.ne_lat, game!.ne_lng]]}>

        <TileLayer
            url={"https://api.maptiler.com/maps/basic-v2-dark/{z}/{x}/{y}.png?key=" + MAP_TILER_API_KEY + ""}
            tileSize={512}
            minZoom={1}
            zoomOffset={-1}
            attribution={"\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e"}
            crossOrigin={true}
        />
        { game?.state !== 'Registration' &&
            <Gravestone gameid={game!.id}></Gravestone>
        }
    </MapContainer>
    )
}
export default Map
