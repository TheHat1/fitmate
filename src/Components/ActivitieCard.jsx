import { useEffect, useState } from "react";
import types from "../Assets/types.json"

export default function ActivitieCard({ type, name, desc, by, exp_date }) {
    const [remaining, setRemaining] = useState("");
    let image_path

    switch (type) {
        case "football": image_path = types.football; break
        case "basketball": image_path = types.basketball; break
        case "misc": image_path = types.misc; break
        default: image_path = types.misc
    }

    function getTimeRemaining(expiryTimestamp) {
        const now = new Date()
        const expiry = new Date(expiryTimestamp)

        const diff = expiry - now

        if (diff <= 0) {
            return "Изтекъл"
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
        const minutes = Math.floor((diff / (1000 * 60)) % 60)

        if (days > 0) {
            return `${days}д ${hours}ч ${minutes}м`
        }

        if (hours > 0) {
            return `${hours}ч ${minutes}м`
        }

        return `${minutes}м`
    }

    useEffect(() => {
        const update = () => {
            setRemaining(getTimeRemaining(exp_date))
        }

        update()

        const interval = setInterval(update, 60000)

        return () => clearInterval(interval)
    }, [exp_date])

    return (
        <>
            <div className="w-full min-h-25 h-fit p-2.5 bg-stone-700 rounded-lg flex flex-col sm:flex-row space-x-2 justify-between items-center pr-5">
                <div className="w-full flex items-center space-x-1">
                    <img className="h-20" src={image_path} />
                    <h1 className="text-white unbounded">От: {by}</h1>
                    <div className="flex flex-col text-white unbounded p-2.5 text-xl">
                        <h1>{name}</h1>
                        <p className="font-extralight text-sm break-after-all">{desc}</p>
                    </div>
                </div>
                <div className="text-white unbounded shrink-0">Остават: {remaining}</div>
            </div>
        </>
    )
}