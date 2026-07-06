import Map from "../Components/Map"
import FilterSelectorType from "../Components/FilterSelectorType"
import FilterSelectorTime from "../Components/FilterSelectorTime"
import AddActivityPanel from "../Components/AddActivityPanel"
import SetNumberOfPeople from "../Components/SetNumberOfPeople"
import { useState, useRef, useEffect } from "react"
import { useParams } from "react-router-dom"
import supabase from "../Backend/supabase"

export default function ProfilePage() {
    const [filterBy, setFilterBy] = useState([""])
    const [filterByTime, setFilterByTime] = useState(0)
    const [filterPostByMe, setFilterPostsByMe] = useState(true)
    const [showAddActivityPanel, setShowAddActivityPanel] = useState(false)
    const [addActivityHereCords, setAddActivityHereCords] = useState()
    const [numberOfPeopleRemaining ,setNumberOfPeopleRemaining] = useState(-1)
    const [activitiesInfo, setActivitiesInfo] = useState()

    const mapContainerRef = useRef()
    const panelRef = useRef()
    const {activity_id} = useParams()

    function scrollMap() {
        mapContainerRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

        async function getActivities() {
        try {
            const { data, error } = await supabase.from("activities").select("*")//.gte("created_at", new Date().setHours(0, 0, 0, 0))

            if (error) {
                console.error(error.message)
                return
            }
            setActivitiesInfo(data)

        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        panelRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [addActivityHereCords])

    useEffect(()=>{
        if(!showAddActivityPanel){
            setAddActivityHereCords(undefined)
        }
    },[showAddActivityPanel])

    return (
        <>
            <section className="w-screen h-fit min-h-[calc(100vh-92px)] flex justify-start items-start space-y-2 p-10 bg-black flex-col">
                <h1 className="text-white unbounded text-3xl border-b border-amber-600 w-full">Активности</h1>
                <div className="w-full h-fit min-h-15 p-2 text-white unbounded flex flex-col lg:flex-row lg:space-x-5 space-y-3 items-center">
                    <button onClick={() => { setFilterPostsByMe(!filterPostByMe) }} className={`max-w-70 w-full rounded-lg p-1 px-3 transition-all duration-200 hover:-translate-y-0.75 cursor-pointer
                            ${filterPostByMe ? "hover:bg-emerald-500 bg-emerald-600 " : "hover:bg-sky-600 bg-sky-700 "}`}>
                        {filterPostByMe ? "От мен" : "От други"}
                    </button>
                    <h1 className="shrink-0 w-40">Филтрирай по: </h1>
                    <FilterSelectorType setFilterBy={setFilterBy} />
                </div>
                <div className="w-full h-fit min-h-15 p-2 lg:pl-77 text-white unbounded flex flex-col lg:flex-row space-x-5 space-y-3 items-center">
                    <h1 className="shrink-0 w-40">Остават:</h1>
                    <FilterSelectorTime setFilterBy={setFilterByTime} />
                </div>
                <div className="w-full h-fit min-h-15 p-2 lg:pl-77 text-white unbounded flex flex-col lg:flex-row space-x-5 space-y-3 items-center">
                    <h1 className="shrink-0 w-45">Свободни места:</h1>
                    <SetNumberOfPeople setPeople={setNumberOfPeopleRemaining}/>
                </div>

                <div ref={mapContainerRef} className="w-full h-[50vh] md:h-[70vh] border-b pb-2 border-amber-600">
                    <Map setActivityCords={setAddActivityHereCords} isAddActivity={showAddActivityPanel} />
                </div>
            </section>
            <section className="w-screen h-fit flex justify-start items-start space-y-2 p-10 pt-0 bg-black flex-col">
                <div className="text-white unbounded flex flex-col sm:flex-row sm:space-x-2 space-y-1 w-full items-center">
                    <h1 className="shrink-0 text-xl">Добавяне на активност:</h1>
                    <button onClick={() => { setShowAddActivityPanel(!showAddActivityPanel) }}
                        className={` rounded-lg p-0.5 w-full transition-all duration-150  hover:-translate-y-1 cursor-pointer
                    ${showAddActivityPanel ? "bg-rose-800 hover:bg-rose-600" : "bg-stone-600 hover:bg-emerald-700"}`}>
                        {showAddActivityPanel ? "x" : "+"}
                    </button>
                </div>
                <AddActivityPanel ref={panelRef} show={showAddActivityPanel} locationCords={addActivityHereCords} scrollMapIntoView={scrollMap} setShow={setShowAddActivityPanel}/>
            </section>
            <section className="w-full h-fit flex flex-col space-y-2">
                {}
            </section>
        </>
    )
}