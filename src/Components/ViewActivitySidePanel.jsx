import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../Backend/supabase";
import Types from "../Assets/types.json"

export default function ViewActivitySidePanel({ open, close, id }) {
    const [title, setTitle] = useState("")
    const [desc, setDesc] = useState("")
    const [types, setTypes] = useState()
    const [looking, setLooking] = useState()
    const [by, setBy] = useState("")
    const [expDate, setExpDate] = useState("")

    const [remaining, setRemaining] = useState("")
    const [icons, setIcons] = useState()

    const navigate = useNavigate()
    const ref = useRef()

    function handleClickOutsideForm(e) {
        if (open && !ref.current.contains(e.target)) {
            close(false)
            navigate('/map')
        }
    }

    async function GetActivity() {
        try {
            const { data, error } = await supabase.from("activities").select("*").eq("id", id).single()

            if (error) {
                console.error(error.message)
                return
            }

            setTitle(data.title)
            if (data.desc != '') {
                setDesc(`"${data.desc}"`)
            }
            setTypes(data.type)
            setLooking(data.looking)
            setBy(data.by)
            setExpDate(data.exp_date)
            if (data.looking_for === -1) {
                setLooking("Неограничено")
            } else {
                setLooking(data.looking_for)
            }


        } catch (err) {
            console.error(err)
        }
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

    function handleIcons() {

        const imageFirst = (src) => { return (<img className="h-10 absolute top-1" src={src} key={1} />) }
        const imageSecond = (src) => { return (<img className="h-10 absolute left-5 top-4" src={src} key={2} />) }
        const imageThird = (src) => { return (<img className="h-10 top-9 absolute" src={src} key={3} />) }

        setIcons(() => {
            const next = []

            if (types.includes("football")) next.push(imageFirst(Types.football))
            if (types.includes("basketball")) next.push(imageSecond(Types.basketball))
            if (types.includes("misc")) next.push(imageThird(Types.misc))

            return next
        })

    }

    useEffect(() => {
        if (open) {
            GetActivity()
            handleIcons()
        } else {
            setTitle("data.title")
            setDesc("")
            setTypes("")
            setLooking("")
            setBy("")
            setExpDate("")
            setLooking("")
        }
    }, [open])

    useEffect(() => {
        const update = () => {
            setRemaining(getTimeRemaining(expDate))
        }

        update()

        const interval = setInterval(update, 60000)

        return () => clearInterval(interval)
    }, [expDate])

    return (
        <>
            <div onClick={handleClickOutsideForm} className={`w-full h-screen bg-black/55 backdrop-blur-xs fixed top-0 left-0 transition-all duration-300
               ${open ? "z-10 opacity-100" : "-z-50 opacity-0"} `}>
                <div className={`max-w-160 h-screen bg-black border-r-2 p-5 border-amber-600 transition-all duration-300 flex flex-col space-y-2
                    ${open ? "translate-x-0" : "-translate-x-160"}`}>
                    <div ref={ref} onClick={() => { close(false); navigate('/map') }} className="w-full pt-4 pr-4 flex justify-end text-white unbounded text-2xl font-extralight transition-all hover:brightness-75 cursor-pointer ">
                        x
                    </div>
                    <h1 className="text-white unbounded text-2xl border-b border-amber-600">{title}</h1>
                    <h2 className="text-white unbounded text-lg">От: {by}</h2>
                    <p className="text-white unbounded text-lg font-extralight italic">{desc}</p>
                    <p className="text-white unbounded text-lg">Остават: {remaining}</p>
                    <p className="text-white unbounded text-lg">Търсят се: {looking}</p>
                    <div className="relative min-h-18 h-fit w-full">
                        {icons}
                    </div>
                </div>
            </div>
        </>
    )
}