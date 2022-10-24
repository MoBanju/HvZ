import L from "leaflet";
import { Marker, Popup } from 'react-leaflet'
import { IKill } from "../../models/IKill";

function Gravestone({ kill }: {kill: IKill}) {
    var gravestone = L.icon({
        iconUrl: '../../../gravestone.png',
        iconSize:     [38, 50], // size of the icon
        iconAnchor:   [22, 30], // point of the icon which will correspond to marker's location
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
    if(!kill.latitude || !kill.longitude)
      return null;

    return  ( 
        <Marker key={kill.id} position={[kill.latitude, kill.longitude]} icon={gravestone}>
          <Popup>
            <p> {(kill.timeDeath).slice(0,10)} <br /> {(kill.timeDeath).slice(11,16)} <br /> {kill.victim.user.firstName} was killed by {kill.killer.user.firstName}</p>
          </Popup>
        </Marker>
    );
  }
export default Gravestone;