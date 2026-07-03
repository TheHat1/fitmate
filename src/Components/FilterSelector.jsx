import { useEffect, useState } from "react"


export default function FilterSelector({ setFilterBy }) {
    const [footbalToggle, setFootballToggle] = useState(false)
    const [basketballToggle, setBasketballToggle] = useState(false)
    const [miscToggle, setMiscToggle] = useState(false)
    const [toggleAll, setToggleAll] = useState(true)

    function setFilter() {
        let filters = [""]
        if (toggleAll) {
            setFilterBy([""])
        }
        if (footbalToggle) {
            filters.push("football")
        }
        if (basketballToggle) {
            filters.push("basketball")
        }
        if (miscToggle) {
            filters.push("misc")
        }
        setFilterBy(filters)
    }

    let active = 0

    function handleFilterToggle(type) {
        switch (type) {
            case "football": {
                if (footbalToggle) {
                    active--
                    setFootballToggle(false)
                } else {
                    active++
                    setFootballToggle(true)
                }
                setToggleAll(false)
            } break
            case "basketball": {
                if (basketballToggle) {
                    active--
                    setBasketballToggle(false)
                } else {
                    active++
                    setBasketballToggle(true)
                }
                setToggleAll(false)
            } break
            case "misc": {
                if (miscToggle) {
                    active--
                    setMiscToggle(false)
                } else {
                    active++
                    setMiscToggle(true)
                }
                setToggleAll(false)
            } break
            default: {
                setToggleAll(true)
                setFootballToggle(false)
                setBasketballToggle(false)
                setMiscToggle(false)
            }
        }
        if (active < 0) {
            setToggleAll(true)
            setFootballToggle(false)
            setBasketballToggle(false)
            setMiscToggle(false)
        }
    }

    useEffect(() => {
        setFilter()
    }, [footbalToggle, basketballToggle, miscToggle, toggleAll])

    return (
        <>
            <div className="w-full flex flex-wrap h-fit min-h-10 items-center justify-center">
                <button onClick={()=>{handleFilterToggle("active")}} className={` text-white h-7 unbounded w-60 rounded-lg cursor-pointer  transition-all duration-150 hover:-translate-y-1 m-1
                    ${toggleAll ? "bg-amber-600 hover:bg-amber-500" : "bg-gray-600 hover:bg-gray-500"}`}>Всичко</button>
                <button onClick={()=>{handleFilterToggle("football")}} className={` text-white h-7 unbounded w-60 rounded-lg cursor-pointer  transition-all duration-150 hover:-translate-y-1 m-1
                    ${footbalToggle ? "bg-amber-600 hover:bg-amber-500" : "bg-gray-600 hover:bg-gray-500"}`}>Футбол</button>
                <button onClick={()=>{handleFilterToggle("basketball")}} className={` text-white h-7 unbounded w-60 rounded-lg cursor-pointer  transition-all duration-150 hover:-translate-y-1 m-1
                    ${basketballToggle ? "bg-amber-600 hover:bg-amber-500" : "bg-gray-600 hover:bg-gray-500"}`}>Баскетбол</button>
                <button onClick={()=>{handleFilterToggle("misc")}} className={` text-white h-7 unbounded w-60 rounded-lg cursor-pointer  transition-all duration-150 hover:-translate-y-1 m-1
                    ${miscToggle ? "bg-amber-600 hover:bg-amber-500" : "bg-gray-600 hover:bg-gray-500"}`}>Други</button>
            </div>
        </>
    )
}