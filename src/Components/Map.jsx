import { MapContainer, Marker, Popup, TileLayer, Tooltip, useMap, useMapEvents } from "react-leaflet"
import BoundsJSON from "../Assets/mapBoundCords.json"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { DivIcon } from "leaflet"
import supabase from "../Backend/supabase"

export default function Map({ setActivityCords, isAddActivity }) {
    const [addActivityHereMarkerCords, setAddActivityHereMarkerCords] = useState()
    const [activityMarkerCords, setActivityMarkerCords] = useState([])
    const [showSugestion, setShowSugestion] = useState(false)
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

    async function getActivities() {
        try {
            const today = new Date()
            today.setHours(0)
            const { data, error } = await supabase.from("activities").select("position, id, title").gte("created_at", today.toISOString())

            if (error) {
                console.error(error.message)
                return
            }
            setActivityMarkerCords(data)

        } catch (err) {
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
            on("postgres_changes", {
                event: "*",
                schema: "public",
                table: "activities"
            },
                (payload) => {
                    getActivities()
                }
            ).subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    function MapEvents() {
        const map = useMapEvents({
            click(e) {
                if (isAddActivity) {
                    setAddActivityHereMarkerCords(e.latlng)
                    setActivityCords(e.latlng)
                }
            }
        })

        useEffect(() => {
            const container = map.getContainer()

            const handleWheel = (e) => {

                if (!e.shiftKey) return

                e.preventDefault()

                if (e.deltaY < 0) {
                    map.zoomIn()
                } else {
                    map.zoomOut()
                }

            }

            container.addEventListener("wheel", handleWheel, { passive: false })

            return () => {
                container.removeEventListener("wheel", handleWheel)
            }

        }, [map])

        return null
    }

    return (
        <>
            <MapContainer
                center={[43.2101919675957, 23.55252260142366]}
                zoom={13}
                scrollWheelZoom={false}
                className="w-full h-full rounded-lg z-0"
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
                    !isAddActivity ?
                        activityMarkerCords?.map((e) => {
                            return (
                                <Marker eventHandlers={{ click: () => { navigate("/map/" + e.id) } }} key={e.id} position={e.position.map(Number)} icon={addActivityHereMarkerIcon}>
                                    <Tooltip direction="top">{e.title}</Tooltip>
                                </Marker>
                            )
                        })
                        :
                        null
                }

                <MapEvents />
            </MapContainer>
        </>

    )
}