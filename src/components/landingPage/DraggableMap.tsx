import { LatLngBoundsExpression, LatLngExpression, SVGOverlay as LeafletSVGOverlay, Rectangle as LeafletRectangle, LatLngBoundsLiteral, LatLngTuple } from 'leaflet'
import { Dispatch, ForwardRefExoticComponent, Ref, RefAttributes, useEffect, useRef } from 'react';
import { Rectangle, useMapEvents } from 'react-leaflet';
import { SVGOverlay, SVGOverlayProps, TileLayer, useMapEvent  } from 'react-leaflet';
import { MAP_TILER_API_KEY } from '../../constants/enviroment';

let drag = false;
let resize = false;
let initalMouseDown: LatLngTuple | undefined;

interface IParams {
    boxBounds: LatLngBoundsLiteral,
    setBoxBounds: Dispatch<React.SetStateAction<LatLngBoundsLiteral>>,
}


function DraggableMap({ boxBounds, setBoxBounds }: IParams) {
    const strokeOverlayRef = useRef<LeafletRectangle>(null)
    const fillOverlayRef = useRef<LeafletRectangle>(null)

    const dropDragAndResize = () => {console.log("UP!"); drag = false; resize = false; initalMouseDown = undefined; map.dragging.enable()};

    const map = useMapEvents({
        mouseout: dropDragAndResize,
        mouseup: dropDragAndResize,
        mousemove: (e) => {
            if(drag && initalMouseDown) {
                setBoxBounds(prevBoxBounds => {
                    let diff = [ e.latlng.lat - initalMouseDown![0], e.latlng.lng - initalMouseDown![1]];
                    console.log(e.latlng, initalMouseDown,  diff)
                    initalMouseDown = [e.latlng.lat, e.latlng.lng]
                    return [
                        [prevBoxBounds[0][0] + diff[0], prevBoxBounds[0][1] + diff[1]],
                        [prevBoxBounds[1][0] + diff[0], prevBoxBounds[1][1] + diff[1]],
                    ]
                });
                return;
            }
        },
    });

    useEffect(() => {
        strokeOverlayRef.current?.addEventListener('mousedown', (e) => {resize = true; initalMouseDown = [e.latlng.lat, e.latlng.lng]; map.dragging.disable()})
        fillOverlayRef.current?.addEventListener('mousedown', (e) => {drag = true; initalMouseDown = [e.latlng.lat, e.latlng.lng]; map.dragging.disable()})

        return () => {
            strokeOverlayRef.current?.removeEventListener('mousedown');
            fillOverlayRef.current?.removeEventListener('mousedown');
            map.clearAllEventListeners();

            drag = false;
            resize = false;
            initalMouseDown = undefined;
        }
    }, []);


    return ( <>
        <TileLayer
            url={"https://api.maptiler.com/maps/basic-v2-dark/{z}/{x}/{y}.png?key=" + MAP_TILER_API_KEY + ""}
            tileSize={512}
            zoomOffset={-1}
            minZoom={1}
            attribution={"\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e"}
            crossOrigin={true}
        />

        <Rectangle 
            bounds={boxBounds}
            ref={strokeOverlayRef}
            fill={false}
        />

        <Rectangle
            bounds={boxBounds}
            stroke={false}
            ref={fillOverlayRef}
        />
        </>);
}

export default DraggableMap;