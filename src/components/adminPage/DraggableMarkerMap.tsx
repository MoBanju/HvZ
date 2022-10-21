import L, { LatLngBoundsExpression, LatLngTuple, Marker as LeafletMarker} from "leaflet"
import { Dispatch, useMemo, useRef } from "react"
import { MapContainer, Marker, Rectangle, TileLayer } from "react-leaflet"
import { MAP_TILER_API_KEY } from "../../constants/enviroment"
import { useAppSelector } from "../../store/hooks"

interface IParams {
    markerPosition: LatLngTuple,
    setMarkerPosition: Dispatch<React.SetStateAction<LatLngTuple>>,
    type: DraggableMarkerType,
}

export enum DraggableMarkerType {
    Kill,
    Mission,
}
const GRAVESTONE_ICON = L.icon({
    iconUrl: '../../../gravestone.png',
    iconSize: [38, 50], // size of the icon
    iconAnchor: [22, 30], // point of the icon which will correspond to marker's location
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
});

const BULLSEYE_ICON = L.icon({
    iconUrl: '../../../BullsEye.png',
    iconSize: [38, 50], // size of the icon
    iconAnchor: [22, 30], // point of the icon which will correspond to marker's location
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
});

function DraggableMarkerMap({ markerPosition, setMarkerPosition, type}: IParams) {
    const { game } = useAppSelector(state => state.game);
    const [center, bounds] = useMemo(() => 
        [
            [(game!.ne_lat + game!.sw_lat) / 2, (game!.ne_lng + game!.sw_lng) / 2] as LatLngTuple,
            [[game!.sw_lat, game!.sw_lng], [game!.ne_lat, game!.ne_lng]] as LatLngBoundsExpression,
        ]
        , [game])
    const markerRef = useRef<LeafletMarker>(null)

    const ICON = useMemo(() => {
        switch(type) {
            case DraggableMarkerType.Kill:
                return GRAVESTONE_ICON;
            case DraggableMarkerType.Mission:
                // Fallthrough
            default:
                return BULLSEYE_ICON;
        }
    },[type])

    return (
        <MapContainer center={center} style={{height: "500px", width: "600px"}} zoom={13}>
            <TileLayer
                url={"https://api.maptiler.com/maps/basic-v2-dark/{z}/{x}/{y}.png?key=" + MAP_TILER_API_KEY + ""}
                tileSize={512}
                minZoom={1}
                zoomOffset={-1}
                attribution={"\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e"}
                crossOrigin={true}
            />

            <Marker
                position={markerPosition}
                icon={ICON}
                draggable
                ref={markerRef}
                eventHandlers={{
                    dragend: () => {
                        let coords = markerRef.current!.getLatLng();
                        setMarkerPosition([coords.lat, coords.lng])
                    }
                }}
            />
            
            <Rectangle 
                bounds={bounds}
                fill={false}
                stroke={true}
                pathOptions={{color: '#ff000077'}}
            
            />


        </MapContainer>
    )
}

export default DraggableMarkerMap