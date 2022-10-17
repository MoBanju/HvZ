import { timeStamp } from 'console';
import L, { map } from 'leaflet';
import { SetStateAction, useEffect, useRef, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import { MAP_TILER_API_KEY } from '../../constants/enviroment';
import { IGame } from '../../models/IGame';
import { IKill } from '../../models/IKill';
import { useAppDispatch } from '../../store/hooks';
import Gravestone from './Gravestone';


function Map({gameid} : {gameid: number}) {

    return (
    <MapContainer center={[59,5]} zoom={13} scrollWheelZoom={true} style={{
        height: "500px",
        width: "700px",
      }}>

        <TileLayer
            url={"https://api.maptiler.com/maps/basic-v2-dark/{z}/{x}/{y}.png?key=" + MAP_TILER_API_KEY + ""}
            tileSize={512}
            minZoom={1}
            zoomOffset={-1}
            attribution={"\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e"}
            crossOrigin={true}
        />  
       <Gravestone></Gravestone>
    </MapContainer>
    )
}
export default Map
