import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet"
import BoundsJSON from "../Assets/mapBoundCords.json"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { DivIcon } from "leaflet"
import supabase from "../Backend/supabase"

export default function Map({ setActivityCords, isAddActivity }) {
    const [addActivityHereMarkerCords, setAddActivityHereMarkerCords] = useState()
    const [activityMarkerCords, setActivityMarkerCords] = useState()
    const bounds = L.geoJSON(BoundsJSON).getBounds()
    const navigate = useNavigate()

    const addActivityHereMarkerIcon = new DivIcon({
        iconSize: [35, 35],
        className: "group",
        html: `
        <div class="relative">
          <img src="/Icons/map_pin.png" 
            class="w-9 h-9" />
        </div>
      `,
    })

    async function getActivities(){
        try{
            const {data, error} = await supabase.from("activities").select("*")//.gte("created_at", new Date().setHours(0, 0, 0, 0))

            if(error){
                console.error(error.message)
                return
            }
            setActivityCords(data)

        }catch(err){
            console.error(err)
        }
    }

    useEffect(() => {
        if (!isAddActivity) {
            setAddActivityHereMarkerCords(undefined)
        }
    }, [isAddActivity])

    useEffect(() => {
        getActivities()
        const channel = supabase.channel("activities-update").
        on("postgres_changes",{
            event: "*",
            schema: "public",
            table: "activities"
        },
        (payload)=>{
            console.log("Table changed")
            console.log(payload)
        }
    )
    }, [])

    function MapEvents() {
        useMapEvents({
            click(e) {
                if (isAddActivity) {
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
            {
                !isAddActivity && activityMarkerCords != undefined ? 
                activityMarkerCords.map((e)=>{
                    console.log(e);
                    <Marker position={e.position} icon={addActivityHereMarkerIcon}>

                    </Marker>
                })
                :
                null
            }

            <MapEvents />
        </MapContainer>
    )
}