import { useState } from "react"


export default function SetNumberOfPeople({ setPeople }) {
    const [noLimitToggle, setNoLimitToggle] = useState(true)
    const [oneToggle, setOneToggle] = useState(false)
    const [twoToggle, setTwoToggle] = useState(false)
    const [threToggle, setThreToggle] = useState(false)
    const [moreToggle, setMoreToggle] = useState(false)

    function handleToggle(key) {
        switch (key) {
            case -1: {
                setNoLimitToggle(true)
                setOneToggle(false)
                setTwoToggle(false)
                setThreToggle(false)
                setMoreToggle(false)
                setPeople(-1)
            } break
            case 1: {
                setNoLimitToggle(false)
                setOneToggle(true)
                setTwoToggle(false)
                setThreToggle(false)
                setMoreToggle(false)
                setPeople(1)
            } break
            case 2: {
                setNoLimitToggle(false)
                setOneToggle(false)
                setTwoToggle(true)
                setThreToggle(false)
                setMoreToggle(false)
                setPeople(2)
            } break
            case 3: {
                setNoLimitToggle(false)
                setOneToggle(false)
                setTwoToggle(false)
                setThreToggle(true)
                setMoreToggle(false)
                setPeople(3)
            } break
            default: {
                setNoLimitToggle(false)
                setOneToggle(false)
                setTwoToggle(false)
                setThreToggle(false)
                setMoreToggle(true)
                setPeople(key)
            } break
        }
    }

    return (
        <>
            <div className="w-full h-fit flex flex-wrap items-center md:justify-start justify-center">
                <button
                    onClick={() => handleToggle(-1)} className={` text-white unbounded w-45 h-6 rounded-lg cursor-pointer  transition-all duration-150 hover:-translate-y-1 m-1
                    ${noLimitToggle ? "bg-amber-600 hover:bg-amber-500" : "bg-gray-600 hover:bg-gray-500"}`}>Неограничени</button>
                <button
                    onClick={() => handleToggle(1)} className={` text-white unbounded w-12 h-6 rounded-lg cursor-pointer  transition-all duration-150 hover:-translate-y-1 m-1
                    ${oneToggle ? "bg-amber-600 hover:bg-amber-500" : "bg-gray-600 hover:bg-gray-500"}`}>1</button>
                <button
                    onClick={() => handleToggle(2)} className={` text-white unbounded w-12 h-6 rounded-lg cursor-pointer  transition-all duration-150 hover:-translate-y-1 m-1
                    ${twoToggle ? "bg-amber-600 hover:bg-amber-500" : "bg-gray-600 hover:bg-gray-500"}`}>2</button>
                <button
                    onClick={() => handleToggle(3)} className={` text-white unbounded w-12 h-6 rounded-lg cursor-pointer  transition-all duration-150 hover:-translate-y-1 m-1
                    ${threToggle ? "bg-amber-600 hover:bg-amber-500" : "bg-gray-600 hover:bg-gray-500"}`}>3</button>
                <input
                    className={`w-40 m-2 outline-none focuse:outline-none text-white text-center px-2 rounded-lg transition-all duration-150
                        ${moreToggle ? "bg-amber-600 hover:bg-amber-500" : "bg-gray-600 hover:bg-gray-500"}`}
                    type="number"
                    placeholder="Повече"
                    onChange={(e) => {
                        if (e.target.value > 0) handleToggle(e.target.value)
                        if (e.target.value < 1) handleToggle(-1)
                    }}
                />
            </div>
        </>
    )
}