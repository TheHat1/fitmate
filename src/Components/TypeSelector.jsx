import { useEffect, useState } from "react"


export default function FilterSelector({ setType }) {
    const [footbalToggle, setFootballToggle] = useState(false)
    const [basketballToggle, setBasketballToggle] = useState(false)
    const [miscToggle, setMiscToggle] = useState(false)

    function handleFilterToggle(type) {
        switch (type) {
            case "football": {
                if (footbalToggle) {
                    setFootballToggle(false)
                } else {
                    setFootballToggle(true)
                }
            } break
            case "basketball": {
                if (basketballToggle) {
                    setBasketballToggle(false)
                } else {
                    setBasketballToggle(true)
                }
            } break
            case "misc": {
                if (miscToggle) {
                    setMiscToggle(false)
                } else {
                    setMiscToggle(true)
                }
            } break
            default: {
                setFootballToggle(false)
                setBasketballToggle(false)
                setMiscToggle(false)
            }
        }
    }

    return (
        <>
            <div className="w-full flex flex-wrap h-fit min-h-10 items-center justify-start">
                <button onClick={()=>{handleFilterToggle("football")}} className={` text-white h-6 unbounded w-29 md:w-40 rounded-lg cursor-pointer  transition-all duration-150 hover:-translate-y-1 m-1
                    ${footbalToggle ? "bg-amber-600 hover:bg-amber-500" : "bg-gray-600 hover:bg-gray-500"}`}>Футбол</button>
                <button onClick={()=>{handleFilterToggle("basketball")}} className={` text-white h-6 unbounded w-29 md:w-40 rounded-lg cursor-pointer  transition-all duration-150 hover:-translate-y-1 m-1
                    ${basketballToggle ? "bg-amber-600 hover:bg-amber-500" : "bg-gray-600 hover:bg-gray-500"}`}>Баскетбол</button>
                <button onClick={()=>{handleFilterToggle("misc")}} className={` text-white h-6 unbounded w-29 md:w-40 rounded-lg cursor-pointer  transition-all duration-150 hover:-translate-y-1 m-1
                    ${miscToggle ? "bg-amber-600 hover:bg-amber-500" : "bg-gray-600 hover:bg-gray-500"}`}>Други</button>
            </div>
        </>
    )
}