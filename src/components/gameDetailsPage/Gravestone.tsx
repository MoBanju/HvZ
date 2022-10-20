import L, { LatLngExpression } from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import GetKillsByGameIdAction from "../api/getKillsByGameId";
import getKillsByGameId from "../api/getKillsByGameId";

function Gravestone({gameid} : {gameid: number}) {
    var gravestone = L.icon({
        iconUrl: '../../../gravestone.png',
        iconSize:     [38, 50], // size of the icon
        iconAnchor:   [22, 30], // point of the icon which will correspond to marker's location
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
    const { kills } = useAppSelector(state => state.game)

    return  ( 
    <>{
      kills.filter((x, i) => x.latitude && x.longitude).map((x,i) => (
        <Marker key={i} position={[x.latitude!, x.longitude!]} icon={gravestone}>
          <Popup>
            <p key={i}> {(x.timeDeath).slice(0,10)} <br /> {(x.timeDeath).slice(11,16)} <br /> {x.victim.user.firstName} was killed by {x.killer.user.firstName}</p>
          </Popup>
        </Marker>
        )
      )
    }

    </>
    );
  }
export default Gravestone;