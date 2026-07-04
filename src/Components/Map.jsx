import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import BoundsJSON from "../Assets/mapBoundCords.json"

export default function Map() {
    const bounds = L.geoJSON(BoundsJSON).getBounds()

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
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[43.2101919675957, 23.55252260142366]}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
        </MapContainer>
    )
}