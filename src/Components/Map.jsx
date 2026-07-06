import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet"
import BoundsJSON from "../Assets/mapBoundCords.json"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { DivIcon } from "leaflet"

export default function Map({setActivityCords, isAddActivity}) {
    const [addActivityHereMarkerCords, setAddActivityHereMarkerCords] = useState()
    const bounds = L.geoJSON(BoundsJSON).getBounds()
    const navigate = useNavigate()

    const addActivityHereMarkerIcon = new DivIcon({
        iconSize: [35, 35],
        className: "group",
        html: `
        <div class="relative">
          <img src="/Icons/add_activity_map_icon.png" 
            class="w-9 h-9" />
        </div>
      `,
    })

    useEffect(()=>{
        if(!isAddActivity){
            setAddActivityHereMarkerCords(undefined)
        }
    },[isAddActivity])

    function MapEvents() {
        useMapEvents({
            click(e) {
                if(isAddActivity){
                    setAddActivityHereMarkerCords(e.latlng)
                    setActivityCords(e.latlng)
                }
            }
        })
    }

    return (
        <MapContainer
            center={[43.2101919675957, 23.55252260142366]}
            zoom={13}
            scrollWheelZoom={false}
            className="w-full h-full rounded-lg"
            maxBounds={bounds}

            minZoom={13}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.maptiler.com/">MapTiler</a>'
                url={`https://api.maptiler.com/maps/outdoor-v4-dark/{z}/{x}/{y}.png?key=${import.meta.env.VITE_MAPTILER_API_KEY}`}
            />
            {addActivityHereMarkerCords === undefined ? null :
                <Marker position={addActivityHereMarkerCords} icon={addActivityHereMarkerIcon}>

                </Marker>
            }

            <MapEvents />
        </MapContainer>
    )
}