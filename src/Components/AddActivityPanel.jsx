import { useEffect, useState } from "react"
import SetNumberOfPeople from "./SetNumberOfPeople"
import TypeSelector from "./TypeSelector"
import supabase from "../Backend/supabase"

export default function AddActivityPanel({ show, scrollMapIntoView, locationCords, setShow }) {
    const [numberOfPeople, setNumberOfPeople] = useState(-1)
    const [title, setTitle] = useState("")
    const [desc, setDesc] = useState("")
    const [type, setType] = useState([""])
    const [expDate, setExpDate] = useState()
    const [isError, setIsError] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")
    const [inProgress, setInProgress] = useState(false)

    async function Post() {
        try {

            setInProgress(true)
            setIsError(false)
            setErrorMsg("")

            if (title.trim() === "") {
                setIsError(true)
                setErrorMsg("Заглавието е задължително поле")
                setInProgress(false)
                return
            }

            if (type === [""]) {
                setType(["misc"])
            }

            if (locationCords === undefined) {
                setIsError(true)
                setErrorMsg("Не е избрана локация")
                setInProgress(false)
                return
            }

            if (expDate === undefined) {
                setIsError(true)
                setErrorMsg("Времето на продължителност е задължително")
                setInProgress(false)
                return
            }

            const { data: user } = await supabase.auth.getUser()
            const user_id = user.user.id
            const user_name = user.user.user_metadata.full_name

            const expdate = new Date()
            const [h,m] = expDate.split(":").map(Number)
            expdate.setHours(h,m,0,0)


            const { error} = await supabase.from("activities").insert({
                "title": title,
                "type": type,
                "looking_for": numberOfPeople,
                "desc": desc,
                "exp_date": expdate,
                "by": user_name,
                "position": [locationCords.lat.toString(), locationCords.lng.toString()]
            })
             
            if(error){
                console.error(error)
            }

            setInProgress(false)
            setShow(false)

        } catch (err) {
            console.error(err)
        }
    }

    return (
        <>
            <div className={`w-full transition-all overflow-hidden border-b border-white px-5
                ${show ? "h-fit py-5" : "h-0"}`}>
                <div className={`fixed top-0 left-0 w-full h-full backdrop-blur-sm bg-black/70 transition-all duration-300 ${inProgress ? "z-50 opacity-100" : "-z-50 opacity-0"}`}></div>
                <div className="text-white unbounded flex min-h-10 h-fit sm:space-x-2 space-y-1 w-full items-center">
                    <h1 className="text-white mr-1">Заглавие: </h1>
                    <input
                        className="w-full max-w-95 border-b cursor-text pl-1 focus:outline-none"
                        type="text"
                        value={title}
                        placeholder="Играем на..."
                        name="title"
                        onChange={(e) => { setTitle(e.target.value) }}
                    />
                </div>
                <div className="text-white unbounded flex min-h-10 h-fit sm:space-x-2 space-y-1 w-full items-center">
                    <h1 className="text-white mr-1">Тип: </h1>
                    <TypeSelector setType={setType} />
                </div>
                <div className="text-white unbounded flex flex-col min-h-10 h-fit sm:flex-row sm:space-x-2 space-y-1 w-full items-center">
                    <h1 className="text-white">Избери локация:
                        <a className={`font-light pl-3`}>
                            {locationCords != undefined ? "Избрана" : "Незададена"}
                        </a>
                    </h1>
                    <button onClick={scrollMapIntoView} className={`w-full sm:w-7 rounded-lg transition-all hover:-translate-y-1 duration-150 cursor-pointer bg-emerald-900 hover:bg-emerald-700`}>
                        +
                    </button>
                </div>
                <div className="text-white unbounded flex min-h-10 h-fit sm:space-x-2 space-y-1 w-full items-center mt-3">
                    <h1 className="text-white shrink-0">Търсят се: </h1>
                    <SetNumberOfPeople setPeople={setNumberOfPeople} />
                </div>
                <div className="text-white unbounded flex min-h-10 h-fit sm:space-x-2 space-y-1 w-full items-center">
                    <h1 className="text-white mr-1">Описание: </h1>
                    <input
                        className="w-full max-w-95 border-b cursor-text pl-1 focus:outline-none"
                        type="text"
                        value={desc}
                        placeholder="Не задължително"
                        name="description"
                        onChange={(e) => { setDesc(e.target.value) }}
                    />
                </div>
                <div className="text-white unbounded flex min-h-10 h-fit sm:space-x-2 space-y-1 w-full items-center relative">
                    <h1 className="text-white mr-1">Време: </h1>
                    <input
                        className="w-34 border-b cursor-text pl-1 focus:outline-none bg-transparent z-10"
                        type="time"
                        // value={}
                        placeholder="Не задължително"
                        name="time_picker"
                        onChange={(e) => { setExpDate(e.target.value) }}
                        min={new Date().toTimeString().slice(0, 5)}
                    />
                    <div className="absolute bg-white rounded-full w-5 h-5 left-[187.05px] top-2" />
                </div>
                <div className={`w-full unbounded font-medium transition-all duration-300 border-b border-red-800 text-red-800 overflow-hidden
                        ${isError ? " opacity-100 h-5.5" : "opacity-0 h-0"}`}>
                    {errorMsg}
                </div>
                <button onClick={() => { Post() }} className="w-full h-10 bg-amber-600 hover:bg-amber-500 cursor-pointer transition-all duration-150 hover:-translate-y-1 text-white unbounded rounded-lg text-lg mt-3">Публикувай</button>
            </div>
        </>
    )
}