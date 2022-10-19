import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { useAppSelector } from "../../store/hooks";

function Mission({gameid} : {gameid: number}) {
    var mission = L.icon({
        iconUrl: '../../../BullsEye.png',
        iconSize:     [38, 50], // size of the icon
        iconAnchor:   [22, 30], // point of the icon which will correspond to marker's location
        popupAnchor:  [-3, -6] // point from which the popup should open relative to the iconAnchor
    });
    const { kills } = useAppSelector(state => state.game)

    return  ( 
        <Marker position={[58.88,5.64]} icon={mission}>
          <Popup>
            <p> Mission marker </p>
          </Popup>
        </Marker>
    );
  }
export default Mission;