import { useEffect, useState } from "react"


export default function FilterSelector({ setFilterBy }) {
    const [noFilterToggle, setNoFilterToggle] = useState(true)
    const [halfHourToggle, setHalfHourToggle] = useState(false)
    const [oneHourToggle, setOneHourToggle] = useState(false)
    const [twoHourToggle, setTwoHourToggle] = useState(false)

    function setFilter() {
        if (noFilterToggle) {
            setFilterBy(0)
            return
        }
        if (halfHourToggle) {
            setFilterBy(1)
            return
        }
        if (oneHourToggle) {
            setFilterBy(2)
            return
        }
        if (twoHourToggle) {
            setFilterBy(3)
            return
        }
    }

    function handleFilterToggle(type) {
        switch (type) {
            case 0: {
                setNoFilterToggle(true)
                setHalfHourToggle(false)
                setOneHourToggle(false)
                setTwoHourToggle(false)
            } break
            case 1: {
                setNoFilterToggle(false)
                setHalfHourToggle(true)
                setOneHourToggle(false)
                setTwoHourToggle(false)
            } break
            case 2: {
                setNoFilterToggle(false)
                setHalfHourToggle(false)
                setOneHourToggle(true)
                setTwoHourToggle(false)
            } break
            case 3: {
                setNoFilterToggle(false)
                setHalfHourToggle(false)
                setOneHourToggle(false)
                setTwoHourToggle(true)
            } break
            default: {
                setNoFilterToggle(true)
                setHalfHourToggle(false)
                setOneHourToggle(false)
                setTwoHourToggle(false)
            }
        }
    }

    useEffect(() => {
        setFilter()
    }, [noFilterToggle, halfHourToggle, oneHourToggle, twoHourToggle])

    return (
        <>
            <div className="w-full flex flex-wrap h-fit min-h-10 items-center justify-center">
                <button onClick={() => { handleFilterToggle(1) }} className={` text-white h-7 unbounded w-60 rounded-lg cursor-pointer  transition-all duration-150 hover:-translate-y-1 m-1
                    ${halfHourToggle ? "bg-amber-600 hover:bg-amber-500" : "bg-gray-600 hover:bg-gray-500"}`}>30 мин</button>
                <button onClick={() => { handleFilterToggle(2) }} className={` text-white h-7 unbounded w-60 rounded-lg cursor-pointer  transition-all duration-150 hover:-translate-y-1 m-1
                    ${oneHourToggle ? "bg-amber-600 hover:bg-amber-500" : "bg-gray-600 hover:bg-gray-500"}`}>1 час</button>
                <button onClick={() => { handleFilterToggle(3) }} className={` text-white h-7 unbounded w-60 rounded-lg cursor-pointer  transition-all duration-150 hover:-translate-y-1 m-1
                    ${twoHourToggle ? "bg-amber-600 hover:bg-amber-500" : "bg-gray-600 hover:bg-gray-500"}`}>2 часа</button>
                <button onClick={() => { handleFilterToggle(0) }} className={` text-white h-7 unbounded w-60 rounded-lg cursor-pointer  transition-all duration-150 hover:-translate-y-1 m-1
                    ${noFilterToggle ? "bg-amber-600 hover:bg-amber-500" : "bg-gray-600 hover:bg-gray-500"}`}>Всички</button>
            </div>
        </>
    )
}