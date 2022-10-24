import { timeStamp } from 'console';
import L, { LatLngTuple, map } from 'leaflet';
import { SetStateAction, useEffect, useRef, useState } from 'react';
import { MapContainer, Marker, Popup, Rectangle, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import { MAP_TILER_API_KEY } from '../../constants/enviroment';
import { IGame } from '../../models/IGame';
import { IKill } from '../../models/IKill';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import Gravestone from './Gravestone';
import Mission from './Mission';


function Map({gameid} : {gameid: number}) {
    /*
    useEffect(() => {
        if (!map) return;
        console.log(map.getBounds());
      }, [map]);
    */
    //const m = useMap();
    //console.log(m.getBounds())
    console.log(map)
    const { game } = useAppSelector(state => state.game)
    const center = [(game!.ne_lat + game!.sw_lat) / 2, (game!.ne_lng + game!.sw_lng) / 2] as LatLngTuple
    const areaG = (game!.ne_lng - game!.sw_lng) * (game!.ne_lat - game!.sw_lat)
    const areaGReverse = (game!.ne_lng + game!.sw_lng) * (game!.ne_lat + game!.sw_lat)
    const times = 10
    const zoomN = 0
    
    console.log("Area: " + areaG)
    console.log("Area Reverse: " + areaGReverse)
    console.log("Center: " + center)
    console.log("x: " + game!.ne_lat + " + " + game!.sw_lat)
    console.log("y: " + game!.ne_lng + " + " + game!.sw_lng)
    console.log(areaGReverse - (areaGReverse* 0.99))

    // Beginning Test
    function InsideCart(z:number): number
    {
        if(z >= 13)
        {
            return InsideCart(z -1)
        }
        else
        {
            return z
        }
        
    }


    //const zoomN = (areaGReverse == 1343 || areaGReverse == 1324 || areaGReverse == 1343)
    
    // End Test
    return (
    <MapContainer  center={center} zoom={ InsideCart(20) } scrollWheelZoom={true} /* maxZoom={18} minZoom={9} */ style={{
        height: "30vh",
        width: "35vh",
      }} maxBounds={[[game!.sw_lat - 0.1, game!.sw_lng - 0.1], [game!.ne_lat + 0.1, game!.ne_lng + 0.1]]}>

        <TileLayer
            url={"https://api.maptiler.com/maps/basic-v2-dark/{z}/{x}/{y}.png?key=" + MAP_TILER_API_KEY + ""}
            tileSize={512}
            minZoom={1}
            zoomOffset={-1}
            attribution={"\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e"}
            crossOrigin={true}
        />
        { game?.state !== 'Registration' &&
            <div>
                <Gravestone gameid={game!.id}></Gravestone>
                <Mission></Mission>
            </div>
        }
        <Rectangle 
            bounds={[[game!.sw_lat, game!.sw_lng], [game!.ne_lat, game!.ne_lng]]}
            fill={false}
            stroke={true}
            pathOptions={{color: '#ff000077'}}
            
        />
        
    </MapContainer>
    )
}
export default Map
