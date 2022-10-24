import L from 'leaflet';
import { Marker, Popup } from 'react-leaflet';
import { ICheckin } from '../../models/ICheckin';

function Checkin({ checkin }: { checkin: ICheckin }) {
    var checkinIcon = L.icon({
        iconUrl: '../../../checkin.png',
        iconSize:     [38, 50], // size of the icon
        iconAnchor:   [22, 30], // point of the icon which will correspond to marker's location
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
    return (
            <Marker key={checkin.id} position={[checkin.latitude, checkin.longitude]} icon={checkinIcon}>
                <Popup>
                    <p>Checkin</p>
                </Popup>
            </Marker>
        )
}

export default Checkin