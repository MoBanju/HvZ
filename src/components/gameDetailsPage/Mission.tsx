import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { useAppSelector } from "../../store/hooks";

function Mission() {
    var mission = L.icon({
        iconUrl: '../../../BullsEye.png',
        iconSize:     [38, 50], // size of the icon
        iconAnchor:   [22, 30], // point of the icon which will correspond to marker's location
        popupAnchor:  [-3, -6] // point from which the popup should open relative to the iconAnchor
    });
    const { missions } = useAppSelector(state => state.game)

    return  ( <>{
      missions.filter((x,i) => x.latitude && x.longitude).map((x,i) => (
        <Marker key={i} position={[x.latitude!, x.longitude!]} icon={mission}>
      <Popup>
          <p key={i}> {(x.name)} <br /> {(x.description)} <br /> {x.start_time} until {x.end_time}</p>
        </Popup>
        </Marker>))
    }
    </>);
  }
export default Mission;


