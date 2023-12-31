import React, { useState, useEffect } from "react";
import Map, { Marker, Layer, Source } from "react-map-gl";
import type {FillLayer} from "react-map-gl";

import GeocoderControl from "./geocoder-control";

import 'mapbox-gl/dist/mapbox-gl.css';

const mapboxApiKey = import.meta.env.VITE_MAPBOX_API_KEY

const MapboxComponent = ({ onComplete, center, mapMarks, setCenter = false }) => {
  const [viewState, setViewState] = useState({
    latitude: center.latitude,
    longitude: center.longitude,
    zoom: 7,
  });

  const [marks, setMarks] = useState(mapMarks || []);
  const [currentMark, setCurrentMark] = useState(1);

  // useEffect because useState is asynchronous and didn't
  // center the viewport of the map correctly
  useEffect(() => {
    if (setCenter) {
    setViewState((prevViewState) => ({
      ...prevViewState,
      latitude: center.latitude,
      longitude: center.longitude,
    }));
    }
  }, [center]);

  // Same reason as above, just to enforce correct updating of marks
  useEffect(() => {
    onComplete(marks);
  }, [marks, onComplete]);

  const handleMapClick = (event) => {
    const newMark = {
      latitude: event.lngLat.lat,
      longitude: event.lngLat.lng,
      markNumber: currentMark,
    };

    setMarks((prevMarks) => [...prevMarks, newMark]);
    setCurrentMark(currentMark + 1);

    onComplete(marks);
  };

  const layerStyle: FillLayer = {
    id: 'point',
    type: 'fill',
    source: "plot-shapes",
    "source-layer": "plots_germany",
    paint: {
      "fill-outline-color": "#007cbf",
      "fill-color": "#007cbf",
      "fill-opacity": 0.5
    }
  };

  return (
    <div>

      <Map
        {...viewState}
        style={{width: 800, height: 600}}
        mapStyle="mapbox://styles/mapbox/outdoors-v12" 
        /* mapStyle="mapbox://styles/toffi/ckyn0rxbi8kj414qpssdlx2zt" */
        mapboxAccessToken={mapboxApiKey}
        onClick={handleMapClick}
        onMove={evt => setViewState(evt.viewState)}
      >
        {marks.map((mark) => (
            <Marker
              key={mark.markNumber}
              latitude={mark.latitude}
              longitude={mark.longitude}
            >
              <div className="marker">{mark.markNumber}</div>
            </Marker>
          ))}
        <GeocoderControl mapboxAccessToken={mapboxApiKey} position="top-right" />
        <Source id="plot-shapes" type="vector" url={"mapbox://gotetteh.plots-germany-tiles"}>
          <Layer {...layerStyle} />
        </Source>
      </Map>
    </div>
  );
};

export default MapboxComponent;
