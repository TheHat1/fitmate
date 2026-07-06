import { useEffect, useState } from "react";
import types from "../Assets/types.json"

export default function ActivitieCard({ type, name, desc, by, exp_date, id }) {
    const [remaining, setRemaining] = useState("")
    const [icons, setIcons] = useState()

    function handleIcons() {

        const imageFirst = (src) => { return (<img className="h-10 absolute top-1" src={src} key={1} />) }
        const imageSecond = (src) => { return (<img className="h-10 absolute left-5 top-4" src={src} key={2}/>) }
        const imageThird = (src) => { return (<img className="h-10 top-9 absolute" src={src} key={3}/>) }

        setIcons(() => {
            const next = []

            if (type.includes("football")) next.push(imageFirst(types.football))
            if (type.includes("basketball")) next.push(imageSecond(types.basketball))
            if (type.includes("misc")) next.push(imageThird(types.misc))

            return next
        })

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

    useEffect(() => {
        handleIcons()
    }, [])

    return (
        <>
            <div className="w-full min-h-18 h-fit p-2.5 cursor-pointer hover:translate-x-1 transition-all duration-150 hover:bg-linear-to-r from-amber-600 to-black border-b border-l-8 rounded-bl-md border-l-amber-600 border-b-white flex flex-col sm:flex-row space-x-2 justify-between items-center pr-5">
                <div className="w-full min-h-18 flex items-center space-x-1 relative">
                    {icons}
                    <div className="flex flex-col text-white unbounded p-2.5 pl-17 text-xl">
                        <h1>{name}</h1>
                        <p className="font-extralight text-sm break-after-all">{desc}</p>
                    </div>
                </div>
                <h1 className="text-white unbounded shrink-0 ">От: {by}</h1>
                <div className="text-white unbounded shrink-0">Остават: {remaining}</div>
            </div>
        </>
    )
}