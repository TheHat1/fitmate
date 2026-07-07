import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../Backend/supabase";


export default function ViewActivitySidePanel({ open, close, id }) {
    const [title, setTitle] = useState("")
    const [desc, setDesc] = useState("")
    const [types, setTypes] = useState()
    const [looking, setLooking] = useState()
    const [by, setBy] = useState("")
    const [expDate, setExpDate] = useState("")

    const [remaining, setRemaining] = useState("")

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

    useEffect(() => {
        if (open) {
            GetActivity()
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
                <div className={`max-w-160 h-screen bg-black border-r-2 p-3 border-amber-600 transition-all duration-300 flex flex-col space-y-2
                    ${open ? "translate-x-0" : "-translate-x-160"}`}>
                    <div ref={ref} onClick={() => { close(false); navigate('/map') }} className="w-full pt-4 pr-4 flex justify-end text-white unbounded text-2xl font-extralight transition-all hover:brightness-75 cursor-pointer ">
                        x
                    </div>
                    <h1 className="text-white unbounded text-2xl border-b border-amber-600">{title}</h1>
                    <h2 className="text-white unbounded text-lg">От: {by}</h2>
                    <p className="text-white unbounded text-lg font-extralight italic">{desc}</p>
                    <p className="text-white unbounded text-lg">Остават: {remaining}</p>
                    <p className="text-white unbounded text-lg">Търсят се: {looking}</p>
                </div>
            </div>
        </>
    )
}