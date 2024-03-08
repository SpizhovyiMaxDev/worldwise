import styles from './Map.module.css';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'; 
import { useEffect, useState } from 'react';
import { useCities } from "../contexts/CitiesContext";
import { useGeolocation } from '../hooks/useGeolocation';
import Button from './Button';
import { useUrlPosition } from '../hooks/useUrlPosition';

function Map() {
    const [mapLat, mapLng] = useUrlPosition();
    const { cities } = useCities();
    const { isLoading:isLoadingPosition, position:geolocationPosition, getPosition } = useGeolocation();
    const [mapPosition, setMapPosition] = useState([40, 0]);

    useEffect(function(){
        if(geolocationPosition)
             setMapPosition(geolocationPosition);
    }, [geolocationPosition]); 

    useEffect(function (){
        if(mapLat && mapLat) setMapPosition([mapLat, mapLng])
    }, [mapLat, mapLng]);

    return (
        <div className={styles.mapContainer}>
            {!geolocationPosition && <Button type = "position" onClick={getPosition}>{isLoadingPosition ? "Loading..." : "Use your position"}</Button>}
            <MapContainer 
                center={mapPosition} 
                zoom={6} 
                scrollWheelZoom={true} 
                className = {styles.map}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                />
      
                {
                    cities.map(city => {
                        const {id, position:{lat, lng}, emoji, cityName, country} = city;

                        return (
                            <Marker position={[lat, lng]} key = {id}>
                            <Popup>
                                {emoji + " " + country}, {cityName}
                            </Popup>
                            </Marker>
                        )
                    })
                }
                <GoToCity position = {mapPosition} /> 
                <DetectClick />
        </MapContainer>
        </div>
    )
}

function GoToCity({position}){
    const map = useMap();
    map.setView(position);
    return null;
}

function DetectClick(){
    const navigate = useNavigate();
    useMapEvents({
        click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
    })
}

export default Map
