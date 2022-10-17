import L, { LatLngExpression } from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet'

function Gravestone() {
    var gravestone = L.icon({
        iconUrl: '../../../gravestone.png',
        iconSize:     [38, 50], // size of the icon
        iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    return  (
      <Marker position={[59, 5]} icon={gravestone}>
        <Popup>
          17.10.2022 <br /> X was killed by Y
        </Popup>
      </Marker>
    );
  }
export default Gravestone;