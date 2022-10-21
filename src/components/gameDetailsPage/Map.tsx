import { LatLng, LatLngBoundsLiteral, LatLngTuple, LeafletMouseEvent } from 'leaflet';
import { useMemo, useState } from 'react';
import { MapContainer, Rectangle, TileLayer } from 'react-leaflet'
import { MAP_TILER_API_KEY } from '../../constants/enviroment';
import { useAppSelector } from '../../store/hooks';
import Checkin from './Checkin';
import Gravestone from './Gravestone';
import Mission from './Mission';
import PostCheckinModal from './PostCheckinModal';


function Map({ gameid }: { gameid: number }) {
    const { game, currentPlayer, kills, checkins, missions} = useAppSelector(state => state.game)
    const [center, bounds] = useMemo(() =>
        [
            [(game!.ne_lat + game!.sw_lat) / 2, (game!.ne_lng + game!.sw_lng) / 2] as LatLngTuple,
            [[game!.sw_lat, game!.sw_lng], [game!.ne_lat, game!.ne_lng]] as LatLngBoundsLiteral,
        ], [game]);
    const [showCheckinModal, setShowCheckinModal] = useState<{show: boolean, coords: LatLng | undefined}>({show: false, coords: undefined});

    const handleMapAreaClicked = (e: LeafletMouseEvent) => {
        if(game?.state === "Progress" && currentPlayer && currentPlayer.squadId && currentPlayer.squadMemberId ) {
            setShowCheckinModal({show: true, coords: e.latlng})
        }
    };

    return (
        <>
        <MapContainer
            center={center}
            zoom={13}
            scrollWheelZoom={true}
            maxZoom={18}
            minZoom={9}
            style={{
                height: "30vh",
                width: "35vh",
            }}
            maxBounds={[
                [bounds[0][0] - 0.1, bounds[0][1] - 0.1],
                [bounds[1][0] + 0.1, bounds[1][1] + 0.1]
            ]}>

            <TileLayer
                url={"https://api.maptiler.com/maps/basic-v2-dark/{z}/{x}/{y}.png?key=" + MAP_TILER_API_KEY + ""}
                tileSize={512}
                minZoom={1}
                zoomOffset={-1}
                attribution={"\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e"}
                crossOrigin={true}
            />
            {game!.state !== "Registration" &&  missions.map(mission => <Mission key={mission.id} mission={mission} />)}
            {game!.state !== "Registration" && kills.map(kill => <Gravestone key={kill.id} kill={kill} />)}
            {game!.state !== "Registration"  && checkins.map(checkin => <Checkin key={checkin.id} checkin={checkin} />)}
            <Rectangle
                bounds={bounds}
                fillColor='#000000ff'
                stroke={true}
                pathOptions={{ color: '#ff000077' }}
                eventHandlers={{
                    click: handleMapAreaClicked,
            }}
            />

        </MapContainer>
        <PostCheckinModal
            show={showCheckinModal.show}
            setShow={setShowCheckinModal}
            coords={showCheckinModal.coords!}
        />
        </>
    )
}
export default Map
