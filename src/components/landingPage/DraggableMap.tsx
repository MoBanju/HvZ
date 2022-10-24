import L, { LatLngBoundsLiteral, LatLngTuple } from 'leaflet'
import { Dispatch, SetStateAction, useMemo, useRef } from 'react';
import { FeatureGroup, MapContainer, Rectangle } from 'react-leaflet';
import { TileLayer } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import { MAP_TILER_API_KEY } from '../../constants/enviroment';

interface IParams {
    boxBounds: LatLngBoundsLiteral | undefined,
    setBoxBounds: Dispatch<SetStateAction<LatLngBoundsLiteral | undefined>>,
    canDelete?: boolean,
}


function DraggableMap({ boxBounds, setBoxBounds, canDelete = true }: IParams) {

    const canDrawRectangle = useMemo(() => {
        if(boxBounds)
            return false;
        return {
            shapeOptions: {
                guidelineDistance: 10,
                color: "green",
                weight: 3
            } ,
        }
    }, [boxBounds])

    const onEditComplete = (e: any) => {
        const { layers } = e;
        layers.eachLayer((a: any) => {
            var soLayer: L.Layer = a;
            var oneLayerArray = [];
            oneLayerArray.push(soLayer);
            var FeatureGroup: L.FeatureGroup = L.featureGroup(oneLayerArray);

            var Bounds = FeatureGroup.getBounds();
            if (Bounds) {
                updateBoxBounds(Bounds);
            }
        });
    }

    const updateBoxBounds  = (bounds: L.LatLngBounds) => {
        var NELng = bounds.getNorthEast().lng;
        var NELat = bounds.getNorthEast().lat;
        var SWLng = bounds.getSouthWest().lng;
        var SWLat = bounds.getSouthWest().lat;

        let BoxBoundsNew: LatLngBoundsLiteral = [
            [SWLat, SWLng],
            [NELat, NELng]
        ];

        setBoxBounds(BoxBoundsNew);
    }


    const onCreated = (e: any) => {
        const { layerType, layer } = e;
        var soLayer: L.Layer = layer;

        var layers = [];
        layers.push(soLayer);
        var FeatureGroup: L.FeatureGroup = L.featureGroup(layers);

        var Bounds = FeatureGroup.getBounds();
        if (Bounds !== undefined) {
            updateBoxBounds(Bounds);
        }
    };
    
    const onDeleted = (e: any) => {
        setBoxBounds(undefined)
    }

    return (
        <>
        <TileLayer
            url={"https://api.maptiler.com/maps/basic-v2-dark/{z}/{x}/{y}.png?key=" + MAP_TILER_API_KEY + ""}
            tileSize={512}
            minZoom={1}
            zoomOffset={-1}
            attribution={"\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e"}
            crossOrigin={true}
        />
        <FeatureGroup  >
            <EditControl
                draw={{
                    polyline: false,
                    polygon: false,
                    rectangle: canDrawRectangle,
                    circlemarker: false,
                    circle: false,
                    marker: false,
                }}
                edit={{
                    remove: canDelete,
                }}
                position="topright"
                onCreated={onCreated}
                onDeleted={onDeleted}
                onEdited={onEditComplete}
            />
            {boxBounds && !canDelete &&
                <Rectangle
                    bounds={boxBounds}
                    pathOptions={{
                        color: 'green',
                        fillColor: '#00ff0077'
                    }}
                />}
        </FeatureGroup>
        </>);
}

export default DraggableMap;