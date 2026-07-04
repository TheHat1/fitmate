import { useEffect, useRef, useState } from "react"
import supabase from "../Backend/supabase"
import { useNavigate } from "react-router-dom"
import ActivitieCard from "../Components/ActivitieCard"
import FilterSelector from "../Components/FilterSelector"
import fetchUserPFP from "../Backend/fetchUserPFP"
import uploadUserPFP from "../Backend/uploadUserPFP"

export default function ProfilePage() {
    const [pfp, setPfp] = useState('/Icons/user.png')
    const [username, setUsername] = useState('user')
    const [email, setEmail] = useState("abc@abc.abc")
    const [userid, setUserid] = useState()
    const [file, setFile] = useState(null)
    const inputRef = useRef()
    const navigate = useNavigate()
    const [activities, setActivities] = useState()
    const [activities_json, setActivities_json] = useState([])
    const [filterBy, setFilterBy] = useState([""])
    const [loading, setLoading] = useState(false)

    function handlePFPupload() {
        inputRef.current.click()
    }

    async function getUserData() {
        try {
            const { data, error } = await supabase.auth.getUser()
            setUsername(data?.user?.user_metadata.full_name)
            setEmail(data?.user?.user_metadata.email)
            setUserid(data?.user?.id)
            let url = await fetchUserPFP()
            setPfp(url)
        } catch (err) {
            console.error(err)
        }
    }

    async function logOut() {
        const { } = await supabase.auth.signOut()
        navigate('/')
    }

    async function GetActivities() {
        try {

            const { data: user1 } = await supabase.auth.getUser()
            const { data, error } = await supabase.from('activities').select('*').eq("by_user_id", user1.user.id).order("exp_date", { ascending: false })

            if (error) {
                alert(error.message)
                return
            }

            if (data.length > 0) {

                setActivities_json(data)
                displayActivitieCards()
            } else {
                setActivities(
                    <div className=" text-gray-400 unbounded w-full text-center">Няма дейности</div>
                )
            }
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        if (loading) return
        if (file == null) return
        uploadUserPFP(file, setLoading)
    }, [file])

    function displayActivitieCards() {

        let filtered_json = activities_json

        if (filterBy.length > 1) {
            filtered_json = filtered_json.filter((e) => filterBy.includes(e.type))
        }

        if (filtered_json.length === 0) {
            setActivities(
                <div className=" text-gray-400 unbounded w-full text-center">Няма дейности</div>
            )
            return
        }

        setActivities(filtered_json.map(
            (e) => {
                return <ActivitieCard key={e.id} type={e.type} name={e.name} desc={e.desc} by={e.by} exp_date={e.exp_date} />
            }
        ))
    }

    useEffect(() => {
        getUserData()
        GetActivities()
    }, [])

useEffect(() => {
    if (activities_json !== undefined && activities_json !== null) {
        displayActivitieCards()
        return
    }

    let elapsed = 0

    const interval = setInterval(() => {
        elapsed += 100

        if (activities_json !== undefined && activities_json !== null) {
            clearInterval(interval)
            displayActivitieCards()
        }

        if (elapsed >= 1000) {
            clearInterval(interval)
        }
    }, 100)

    return () => clearInterval(interval)
}, [activities_json, filterBy])

    return (
        <>
            <section className="w-screen h-[calc(100vh-92px)] bg-black">
                <div className={`fixed top-0 w-full h-full backdrop-blur-sm bg-black/70 transition-all duration-300 ${loading ? "z-50 opacity-100":"-z-50 opacity-0"}`}></div>
                <div className="w-full h-fit p-10 flex flex-col space-y-5">
                    <div className="w-full h-fit flex flex-col sm:flex-row md:space-x-10 p-5 justify-center items-center md:justify-start md:items-center pb-15">
                        <div onClick={() => { inputRef.current.click() }} onChange={(e) => { setFile(e.target.files[0]) }} className="relative shrink-0 w-64 h-64 group cursor-pointer">
                            <img className="w-64 h-64 bg-stone-300 p-1 rounded-full border-3 border-amber-600" src={pfp} />
                            <img className="w-11 z-10 absolute left-27.5 top-27.5 invert opacity-0 group-hover:opacity-100 transition-all duration-150" src="/Icons/edit.png" />
                            <div className="w-64 h-64 rounded-full opacity-0 group-hover:opacity-100 backdrop-blur-xs absolute top-0 left-0 transition-all duration-150">
                                <input ref={inputRef} type="file" className="absolute hidden" />
                            </div>
                        </div>
                        <div className="flex flex-col unbounded text-white md:h-full justify-start shrink-0">
                            <h1 className="text-4xl overflow-hidden">{username}</h1>
                            <h1 className="text-2xl font-light break-all">{email}</h1>
                            <button onClick={logOut} className="max-w-90 mt-15 bg-amber-600 rounded-lg p-1 px-3 transition-all duration-200 hover:bg-amber-500 hover:-translate-y-0.75 cursor-pointer">Излез</button>
                        </div>
                    </div>
                    <div className="w-full h-fit flex flex-col sm:flex-row p-2 justify-center md:justify-start md:items-center border-b border-stone-600 unbounded text-white space-x-5 text-2xl">
                        Мойте постове
                    </div>
                    <div className="w-full h-fit min-h-15 p-2 text-white unbounded flex flex-col lg:flex-row space-x-5 space-y-3 items-center">
                        <h1 className="shrink-0">Филтрирай по: </h1>
                        <FilterSelector setFilterBy={setFilterBy} />
                    </div>
                    <div className="w-full h-full flex flex-col">
                        {activities}
                    </div>
                </div>
            </section>
        </>
    )
}