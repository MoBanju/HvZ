import { SVGOverlay as LeafletSVGOverlay, Rectangle as LeafletRectangle, LatLngBoundsLiteral, LatLngTuple, rectangle, LeafletMouseEvent, Path } from 'leaflet'
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Rectangle, SVGOverlay, useMapEvents } from 'react-leaflet';
import { TileLayer } from 'react-leaflet';
import { MAP_TILER_API_KEY } from '../../constants/enviroment';

let drag = false;
let resize = false;
let resizeTop = false;
let resizeBottom = false;
let resizeRight = false;
let resizeLeft = false;
let initalMouseDown: LatLngTuple | undefined;
let initalBoxBounds: LatLngBoundsLiteral | undefined;

const MIN_DISTANCE = 100; // In meters

interface IParams {
    boxBounds: LatLngBoundsLiteral,
    setBoxBounds: Dispatch<SetStateAction<LatLngBoundsLiteral>>,
    position: LatLngTuple,
    setPosition: Dispatch<SetStateAction<LatLngTuple>>,
}

function floatingEquals(a: number, b: number): boolean {
    return Math.abs(a - b) < 0.005;
}


function DraggableMap({ boxBounds, setBoxBounds, setPosition }: IParams) {
    const rectangleRef = useRef<LeafletRectangle>(null)

    const dropDragAndResize = (e: LeafletMouseEvent) => {
        if(drag) {
            map.flyTo(e.latlng);
        }
        drag = false;
        resize = false;
        resizeTop = false;
        resizeBottom = false;
        resizeRight = false;
        resizeLeft = false;
        initalMouseDown = undefined;
        initalBoxBounds = undefined;
        
    };



    const map = useMapEvents({
        mouseout: dropDragAndResize,
        mouseup: dropDragAndResize,
        mousemove: (e) => {
            if (drag) {
                let diff = [e.latlng.lat - initalMouseDown![0], e.latlng.lng - initalMouseDown![1]];
                setBoxBounds([
                    [initalBoxBounds![0][0] + diff[0], initalBoxBounds![0][1] + diff[1]],
                    [initalBoxBounds![1][0] + diff[0], initalBoxBounds![1][1] + diff[1]],
                ]);
                return;
            }
            if (resize) {
                let diff = [e.latlng.lat - initalMouseDown![0], e.latlng.lng - initalMouseDown![1]];
                if (resizeLeft) {
                    setBoxBounds([
                            [initalBoxBounds![0][0], initalBoxBounds![0][1] + diff[1]],
                            [initalBoxBounds![1][0], initalBoxBounds![1][1]],
                        ]
                    );
                }
                if (resizeBottom) {
                    setBoxBounds([
                            [initalBoxBounds![0][0] + diff[0], initalBoxBounds![0][1]],
                            [initalBoxBounds![1][0], initalBoxBounds![1][1]],
                        ]
                    );
                }
                if (resizeRight) {
                    setBoxBounds([
                            [initalBoxBounds![0][0], initalBoxBounds![0][1]],
                            [initalBoxBounds![1][0], initalBoxBounds![1][1] + diff[1]],
                        ]
                    );

                }
                if (resizeTop) {
                    setBoxBounds([
                            [initalBoxBounds![0][0], initalBoxBounds![0][1]],
                            [initalBoxBounds![1][0] + diff[0], initalBoxBounds![1][1]],
                        ]
                    );
                }
            }
        },
        zoomend: () => {
            rectangleRef.current?.redraw();
        },
    });


    useEffect(() => {
        return () => {
            map.clearAllEventListeners();

            drag = false;
            resizeTop = false;
            initalMouseDown = undefined;
            initalBoxBounds = undefined;
        }
    }, []);

    map.dragging.disable();

    return (<>
        <TileLayer
            url={"https://api.maptiler.com/maps/basic-v2-dark/{z}/{x}/{y}.png?key=" + MAP_TILER_API_KEY + ""}
            tileSize={512}
            minZoom={1}
            zoomOffset={-1}
            attribution={"\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e"}
            crossOrigin={true}
        />

        <Rectangle
            bounds={boxBounds}
            ref={rectangleRef}
            eventHandlers={{
                mousedown: (e) => {
                    let borderBottomHit = floatingEquals(boxBounds[0][0], e.latlng.lat);
                    let borderLeftHit = floatingEquals(boxBounds[0][1], e.latlng.lng);
                    let borderTopHit = floatingEquals(boxBounds[1][0], e.latlng.lat);
                    let borderRightHit = floatingEquals(boxBounds[1][1], e.latlng.lng);
                    if (borderBottomHit) {
                        resizeBottom = true;
                        resize = true;
                    }
                    if (borderTopHit) {
                        resizeTop = true;
                        resize = true;
                    }
                    if (borderLeftHit) {
                        resizeLeft = true;
                        resize = true;
                    }
                    if (borderRightHit) {
                        resizeRight = true;
                        resize = true;
                    }
                    if (!resizeTop && !resizeBottom && !resizeLeft && !resizeRight) {
                        drag = true;
                    }
                    initalMouseDown = [e.latlng.lat, e.latlng.lng];
                    initalBoxBounds = boxBounds;
                },
            }}
            
            />

    </>);
}

export default DraggableMap;