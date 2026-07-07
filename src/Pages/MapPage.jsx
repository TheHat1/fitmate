import Map from "../Components/Map"
import FilterSelectorType from "../Components/FilterSelectorType"
import FilterSelectorTime from "../Components/FilterSelectorTime"
import AddActivityPanel from "../Components/AddActivityPanel"
import SetNumberOfPeople from "../Components/SetNumberOfPeople"
import { useState, useRef, useEffect } from "react"
import { useParams } from "react-router-dom"
import supabase from "../Backend/supabase"
import ActivityCard from "../Components/ActivitieCard"
import ViewActivitySidePanel from "../Components/ViewActivitySidePanel"

export default function ProfilePage({ isLoggedIn, showForm, userId }) {
    const [filterBy, setFilterBy] = useState([""])
    const [filterByTime, setFilterByTime] = useState(0)
    const [filterPostByMe, setFilterPostsByMe] = useState(true)
    const [showAddActivityPanel, setShowAddActivityPanel] = useState(false)
    const [addActivityHereCords, setAddActivityHereCords] = useState()
    const [numberOfPeopleRemaining, setNumberOfPeopleRemaining] = useState(-1)
    const [activitiesInfo, setActivitiesInfo] = useState()
    const [openSideMenu, setOpenSideMenu] = useState(false)
    const [activities_json, setActivities_json] = useState()

    const mapContainerRef = useRef()
    const panelRef = useRef()
    const { activity_id } = useParams()

    function scrollMap() {
        mapContainerRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    async function getActivities() {
        try {
            const today = new Date()
            today.setHours(0)
            const { data, error } = await supabase.from("activities").select("*").gte("created_at", today.toISOString()).order("exp_date", { ascending: false })

            if (error) {
                console.error(error.message)
                return
            }
            setActivities_json(data)

        } catch (err) {
            console.error(err)
        }
    }

    function filterActivities() {
        let filtered_json = activities_json
        const timeNow = new Date()

        if (filterPostByMe && userId != undefined) {
            filtered_json = filtered_json.filter((e) => e.by_user_id == userId)
        }

        if (filterBy.length > 1) {
            filtered_json = filtered_json.filter((e) => e.type.some(type => filterBy.includes(type)))
        }

        switch (filterByTime) {
            case 1: {
                filtered_json = filtered_json.filter((e) => {
                    const expiry = new Date(e.exp_date)
                    return expiry - timeNow >= 30 * 60 * 1000
                })
            } break
            case 2: {
                filtered_json = filtered_json.filter((e) => {
                    const expiry = new Date(e.exp_date)
                    return expiry - timeNow >= 60 * 60 * 1000
                })
            } break
            case 3: {
                filtered_json = filtered_json.filter((e) => {
                    const expiry = new Date(e.exp_date)
                    return expiry - timeNow >= 120 * 60 * 1000
                })
            } break
        }

        if (numberOfPeopleRemaining > 0) {
            filtered_json = filtered_json.filter((e) => {
                if (e.looking_for < 0) {
                    return true
                }
                return e.looking_for >= numberOfPeopleRemaining
            })
        }

        if (filtered_json != undefined && filtered_json.length === 0) {
            setActivitiesInfo()
            return
        }

        setActivitiesInfo(filtered_json)
    }

    useEffect(() => {
        panelRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [addActivityHereCords])

    useEffect(() => {
        if (!showAddActivityPanel) {
            setAddActivityHereCords(undefined)
        }
    }, [showAddActivityPanel])

    useEffect(() => {
        getActivities()
    }, [])

    useEffect(() => {
        if (activity_id === undefined) {
            setOpenSideMenu(false)
            return
        }

        setOpenSideMenu(true)

    }, [activity_id])

    useEffect(() => {
        if (activities_json !== undefined && activities_json !== null) {
            filterActivities()
            return
        }

        let elapsed = 0

        const interval = setInterval(() => {
            elapsed += 200

            if (activities_json !== undefined && activities_json !== null) {
                clearInterval(interval)
                filterActivities()
            }

            if (elapsed >= 1000) {
                clearInterval(interval)
            }
        }, 100)

        return () => clearInterval(interval)
    }, [filterPostByMe, filterBy, filterByTime, numberOfPeopleRemaining, activities_json])

    useEffect(() => {
        getActivities()
        const channel = supabase.channel("activities-update").
            on("postgres_changes", {
                event: "*",
                schema: "public",
                table: "activities"
            },
                (payload) => {
                    getActivities()
                }
            ).subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    return (
        <>
            <ViewActivitySidePanel open={openSideMenu} close={setOpenSideMenu} id={activity_id} />
            <section className="w-screen h-fit min-h-[calc(100vh-92px)] flex justify-start items-start space-y-2 p-7 sm:p-10 bg-black flex-col">
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
                    <SetNumberOfPeople setPeople={setNumberOfPeopleRemaining} />
                </div>

                <div ref={mapContainerRef} className="w-full h-[50vh] md:h-[70vh] border-b pb-2 border-amber-600">
                    <Map setActivityCords={setAddActivityHereCords} isAddActivity={showAddActivityPanel} activityMarkerCords={activitiesInfo} />
                </div>
            </section>
            <section className="w-screen h-fit flex justify-start items-start space-y-4 p-7 sm:p-10 pt-0 bg-black flex-col">
                <div className="text-white unbounded flex flex-col sm:flex-row sm:space-x-2 space-y-1 w-full items-center">
                    <h1 className="shrink-0 text-xl">Добавяне на активност:</h1>
                    <button onClick={() => { setShowAddActivityPanel(!showAddActivityPanel) }}
                        className={` rounded-lg p-0.5 w-full transition-all duration-150  hover:-translate-y-1 cursor-pointer
                    ${showAddActivityPanel ? "bg-rose-800 hover:bg-rose-600" : "bg-stone-600 hover:bg-emerald-700"}`}>
                        {showAddActivityPanel ? "x" : "+"}
                    </button>
                </div>
                {
                    isLoggedIn ?
                        <AddActivityPanel ref={panelRef} show={showAddActivityPanel} locationCords={addActivityHereCords} scrollMapIntoView={scrollMap} setShow={setShowAddActivityPanel} />
                        :
                        <>
                            <div className={`w-full transition-all overflow-hidden border-b border-white px-5 flex items-center justify-center text-stone-300 text-lg unbounded text-center
                                ${showAddActivityPanel ? "h-80 py-5" : "h-0"}`}>
                                <h1 >Нямаш профил? Регистрирай се <a onClick={() => { showForm([true, true]) }} className="text-amber-600 hover:text-amber-500 cursor-pointer transition-all duration-150">тук.</a></h1>
                            </div>
                        </>
                }

                <h1 className="text-white unbounded text-3xl border-b border-amber-600 w-full mt-5">От днес </h1>
                {activitiesInfo ? activitiesInfo.map((e) => {
                    return (
                        <ActivityCard key={e.id} type={e.type} name={e.title} desc={e.desc} by={e.by} exp_date={e.exp_date} id={e.id} />
                    )
                })
                    :
                    (<div className=" text-gray-400 unbounded w-full text-center">Няма дейности</div>)}
            </section>
        </>
    )
}