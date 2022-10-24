import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { IMission } from "../../models/IMission";
import { useAppSelector } from "../../store/hooks";

function Mission({mission}: {mission: IMission}) {
    var missionIcon = L.icon({
        iconUrl: '../../../BullsEye.png',
        iconSize:     [38, 50], // size of the icon
        iconAnchor:   [22, 30], // point of the icon which will correspond to marker's location
        popupAnchor:  [-3, -6] // point from which the popup should open relative to the iconAnchor
    });

    return  (
        <Marker key={mission.id} position={[mission.latitude, mission.longitude]} icon={missionIcon}>
          <Popup>
            <p> {(mission.name)} <br /> {(mission.description)} <br /> {mission.start_time} until {mission.end_time}</p>
          </Popup>
        </Marker>
    );
  }
export default Mission;


